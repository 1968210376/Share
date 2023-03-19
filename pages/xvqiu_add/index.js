const app = getApp()
const chooseLocation = requirePlugin('chooseLocation');
var COS = require('../../libs/cos-wx-sdk-v5.js')
var util = require('../../libs/util.js')
Page({
  data: {
    openid: '',
    location: "定位",
    chooseLocation: "", //位置
    categories: [], //子分类
    categoryType: 3,
    reside: 1, //大分类
    value: '',
    imgbox: [], //选择图片
    fileIDs: [], //上传云存储后的返回值
    product_img: [], //上传完成后的图片路径需要保存到数据库
    categories: [], //分类
    issuePicSum: 9,
    price: '',
    show: false,
    isshow:false
  },
  getCategory(e) { // 获取分类
    var that = this
    if (e) {
      var reside = e
    } else {
      var reside = that.data.categoryType
    }

    wx.request({
      url: app.globalData.serverApi + '/selectCategory',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        categoryType: reside
      },
      success: (res) => {
        that.setData({
          categories: res.data.response.content,
          reside: res.data.response.content[0].reside

        })
        if (that.data.categories[0]) {
          that.setData({
            categoryType: that.data.categories[0].categoryType,
            value: that.data.categories[0].categoryName
          })
        }
      }
    })
  },

  changeValue(e) {
    // console.log(this.data.categories[e.detail.value]);
    var value = this.data.categories[e.detail.value]
    // var category_type = 
    this.setData({
      value: value.categoryName,
      categoryType: value.categoryType
    })
    console.log(value);
  },
  showfenleiModel(e) {
    this.setData({
      show: true
    })
    // console.log("进来了");
  },
  exit(e) {
    this.setData({
      show: false
    })
  },
  //////////////////提交数据保存到数据库 文件保存到存储//////////////////////
  formSubmit: function (e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    // let category_type =  JSON.parse(e.detail.value.category_type);
    if (!e.detail.value.fenlei) {
      wx.showToast({
        icon: 'none',
        title: '请选择一个类别'
      });
    } else if (!e.detail.value.title) {
      wx.showToast({
        icon: 'none',
        title: '请输入标题'
      });
    }
    // else if (!this.data.imgbox.length) {
    //     // !this.data.imgbox.length && !e.detail.value.information
    //     wx.showToast({
    //         icon: 'none',
    //         title: '选择至少一张图片'
    //     });
    // }
    else {
      // 文件图片的上传
      // this.add_fileImages(e);
      this.add_COSfileImages(e);
      try {
        wx.requestSubscribeMessage({
          tmplIds: ['DF36jxuDTuayF5f_JnIF0GQj7CwvSb9p0wx6Iy2yQus'],
          success(res) {
            console.log(res);
            console.log("success")
            wx.reLaunch({
              //页面跳转携带参数
              url: '/pages/fenlei/index',
              success: function () {
                // console.log("跳转页面成功")
              },
            })
          },
          fail(res) {
            console.log(res)
          }
        })
      } catch (e) {
        console.log('错误代码', e.code, '错误信息', e.message);
      }
    }
  },
  // 文件图片上传腾讯对象存储COS
  add_COSfileImages: function (e) {
    var that = this
    if (that.data.imgbox.length) { //上传图片到云存储
      wx.showLoading({
        title: '上传中',
      })
      let promiseArr = [];
      var cos = new COS({
        SecretId: 'AKIDrb9SYPbMn1zmOno25EGcpnW8VgnpdFsN',
        SecretKey: 'TrCsPO7artiKo37wWrwmOuAE8rLchWCm',
      });
      for (let i = 0; i < that.data.imgbox.length; i++) {
        // var thats = this
        promiseArr.push(new Promise((reslove, reject) => {
          let item = that.data.imgbox[i];
          let suffix = /\.\w+$/.exec(item)[0]; //正则表达式返回文件的扩展名
          console.log("item:", item);
          console.log("suffix:", suffix);
          var filePath = item;
          // var filename = filePath.substr(filePath.lastIndexOf('/') + 1);
          // 获取时间作为文件夹名
          var time = util.dateFormat(new Date(), "YMD");
          console.log("时间：", time);
          console.log("随机：", Math.random().toString())
          var filename = Number(Math.random().toString().substr(3, 6) + new Date().getTime()).toString(36) + suffix;
          console.log("filename:", filename)
          cos.postObject({
            Bucket: 'niuyabo-1257122371',
            Region: 'ap-chengdu',
            Key: 'xiaochengxu/' + time + '/' + filename,
            FilePath: filePath,
            onProgress: function (info) {
              console.log(JSON.stringify(info));
            }
          }, function (err, data) {
            console.log(err || data);
            console.log("data:", data);
            console.log("err:", err);
            // json = JSON.parse(info)
            var res = data;
            // console.log(JSON.stringify(info).Location)
            res = res.Location;
            var fileID = "http://" + res;
            console.log("fileID:", fileID);
            that.setData({
              fileIDs: that.data.fileIDs.concat(fileID)
            })
            console.log("fileIDs:", that.data.fileIDs) //输出上传后图片的返回地址
            that.data.product_img.push(fileID);
            reslove();
            wx.hideLoading();
            wx.showToast({
              title: "上传成功",
            })
          });
        }));
      }
      Promise.all(promiseArr).then(res => { //等数组都做完后做then方法
        console.log("图片上传完成后再执行")
        console.log(this.data.product_img);
        this.add_sell_scrap(e);
        this.setData({
          imgbox: [],
          product_img: []
        })
      })
    } else {
      this.add_sell_scrap(e);
    }

  },

  // 上传数据到数据库中
  add_sell_scrap: function (e) {
    let category_type = e.detail.value.fenlei
    console.log('上传分类====', category_type)
    var userInfo = wx.getStorageSync('userInfo');
    // console.log(userInfo.wxOpenId);
    let that = this;
    wx.request({
      url: app.globalData.serverApi + '/addOrUpdateMarket',
      method: 'POST',
      data: {
        wxOpenId: userInfo.wxOpenId,
        // phone: e.detail.value.scrap_phone,
        title: e.detail.value.title,
        pirce: (Number(e.detail.value.pirce)),
        phone: userInfo.phone == null ? '' : userInfo.phone,
        contact_qq: userInfo.scrap_qq== null ? '' : userInfo.scrap_qq,
        contact_wx: userInfo.scrap_wx==null ? '': userInfo.scrap_wx,
        status: 0,
        // content: e.detail.value.details == null ? '': e.detail.value.details,
        Images: that.data.product_img == null ? '' : that.data.product_img,
        LikesNumber: 0,
        CommentsNumber: 0,
        // publictiy:e.detail.value.publictiy,
        publictiy: 1,
        categoryType: e.detail.value.fenlei,
        categoryParentType: that.data.reside,
        Address: e.detail.value.scrap_address == null ? '' : e.detail.value.scrap_address,
        chooseLocation: that.data.chooseLocation == null ? "" : JSON.stringify(that.data.chooseLocation),
        latitude: that.data.chooseLocation == null ? "" : JSON.stringify(that.data.chooseLocation.latitude),
        longitude: that.data.chooseLocation == null ? "" : JSON.stringify(that.data.chooseLocation.longitude),
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        // console.log("addOrUpdateMarket===>res");
        console.log("res---",res);
        wx.showToast({
          title: "上传成功",
        })
        // if (res.data.code == 1) {
        //   // if (res.data.response.list == 0) {
        //   //     return
        //   // }
        //   // this.setData({
        //   //     categories: res.data.response.list,
        //   // });
        //   //         console.log("跳转页面")
        //   wx.reLaunch({
        //     //页面跳转携带参数
        //     url: '/pages/fenlei/index',
        //     success: function () {
        //       // console.log("跳转页面成功")
        //     },
        //   })
        // }
      },
      fail: res => {
        wx.showToast({
          title: "失败",
        })
      }
    })
  },

  // 微信获取地理位置 选择位置  授权位置信息
  getUserLocation: function () {
    let vm = this;
    wx.getSetting({
      success: (res) => {
        if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) {
          wx.showModal({
            title: '请求授权当前位置',
            content: '需要获取您的地理位置，请确认授权',
            success: function (res) {
              if (res.cancel) {
                wx.showToast({
                  title: '拒绝授权',
                  icon: 'none',
                  duration: 1000
                })
              } else if (res.confirm) {
                wx.openSetting({
                  success: function (dataAu) {
                    if (dataAu.authSetting["scope.userLocation"] == true) {
                      wx.showToast({
                        title: '授权成功',
                        icon: 'success',
                        duration: 1000
                      })
                      //再次授权，调用wx.getLocation的API
                      vm.getLocation();
                    } else {
                      wx.showToast({
                        title: '授权失败',
                        icon: 'none',
                        duration: 1000
                      })
                    }
                  }
                })
              }
            }
          })
        } else if (res.authSetting['scope.userLocation'] == undefined) {
          //调用wx.getLocation的API
          vm.getLocation();
        } else {
          //调用wx.getLocation的API
          vm.getLocation();
        }
      }
    })
  },
  // 微信选择位置 调用API 定位当前位置 获取坐标
  getLocation: function () {
    // const key = 'YPJBZ-3VICP-OYWDV-VQDUT-FCI7J-MPFYK'; //使用在腾讯位置服务申请的key
    // const referer = 'wx789e5aabeb07bfef'; //调用插件的app的名称
    const key = 'PMWBZ-KDRLX-H3C4C-ZAH36-WB2YT-GYBN5'; //使用在腾讯位置服务申请的key
    const referer = 'wx6d3c8ce12b2a4f0c'; //调用插件的app的名称
    wx.navigateTo({
      url: 'plugin://chooseLocation/index?key=' + key + '&referer=' + referer
    });
  },

  //////////////////选择多张图片//////////////////////
  // 删除照片 &&
  imgDelete1: function (e) {
    let that = this;
    let index = e.currentTarget.dataset.deindex;
    let imgbox = this.data.imgbox;
    imgbox.splice(index, 1)
    that.setData({
      imgbox: imgbox
    });
  },
  // 选择图片 &&&
  addPic1: function (e) {
    var imgbox = this.data.imgbox;
    // console.log(imgbox)
    var that = this;
    var n = that.data.issuePicSum;
    if (that.data.issuePicSum > imgbox.length > 0) {
      n = that.data.issuePicSum - imgbox.length;
    } else if (imgbox.length == that.data.issuePicSum) {
      n = that.data.issuePicSum;
    }
    wx.chooseImage({
      count: n, // 默认that.data.issuePicSum，设置图片张数
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        if (imgbox.length == 0) {
          imgbox = tempFilePaths
        } else if (that.data.issuePicSum > imgbox.length) {
          imgbox = imgbox.concat(tempFilePaths);
        }
        that.setData({
          imgbox: imgbox
        })
      }
    })
  },
  //图片
  imgbox: function (e) {
    this.setData({
      imgbox: e.detail.value
    })
  },

  checkValue(e) {
    console.log(e);
    this.setData({
      price: e.detail.value
    })
    if (parseFloat(e.detail.value) > 10000) {
      wx.showToast({
        title: '超过价格上限,最大值为10000',
      })
      this.setData({
        price: 10000
      })
    }
  },
  to_niu_my_fuwuyinshi: function () {
    wx.navigateTo({
      url: "/pages/niu_my_fuwuyinshi/index"
    })
  },
  onLoad() {
    var that = this
    if (this.data.categories.length == 0) {
      that.getCategory()
    }
    var city = wx.getStorageSync('city');
    this.setData({
      chooseLocation: location,
      location: city,
    })
  },
  onShow() {
    var userInfo = wx.getStorageSync('userInfo');
    // console.log("issue");
    if (userInfo.avatarUrl == "" || userInfo.nickName == "" || userInfo.wxOpenId == "" || userInfo.phone == "") {
      setTimeout(function () {
        wx.showToast({
          title: '请完善个人信息',
        })
      }, 1000);
      wx.redirectTo({
        url: "/pages/my_edit_information/index"
      })
    }
    var isshow = wx.getStorageSync('isshow')

    // 从地图选点插件返回后，在页面的onShow生命周期函数中能够调用插件接口，取得选点结果对象
    let location = chooseLocation.getLocation(); // 如果点击确认选点按钮，则返回选点结果对象，否则返回null
    // console.log("location133:", location)
    // console.log("location144:", location.name)
    // let that = this;
    // JSON.stringify(location)
    // JSON.parse(location)
    this.setData({
      chooseLocation: location,
      isshow:isshow
    })
  }
})