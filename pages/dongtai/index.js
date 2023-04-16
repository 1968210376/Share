// pages/about/index.js
const app = getApp()
// const chooseLocation = requirePlugin('chooseLocation');
var util = require('../../libs/util.js')
var COS = require('../../libs/cos-wx-sdk-v5.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    add: false,
    is_like: false,
    form: false,
    ping: false,
    img_src: '',
    is_img_click: false,
    list: '',
    imgbox: [], //选择图片
    fileIDs: [], //上传云存储后的返回值
    product_img: [], //上传完成后的图片路径需要保存到数据库
    like: ['my', 'he'],
    pinglun: [],
    issuePicSum: 9,
    location: '',
    ping_info: '',
    value: '',
    pageIndex: 1,
    pageSize: 10,
    end: false,
    ping_end: false,
    delete: false,
    ping_pageIndex: 1,
    ping_pageSize: 10,
    height: 0,
    isshow: false
  },
  isshow() {
    var that = this
    that.setData({
      isshow: wx.getStorageSync('isshow')
    })
    console.log(that.data.isshow);
  },
  is_like(e) {
    var info = wx.getStorageSync('userInfo')
    // console.log(e, wx.getStorageSync('openid'),info);
    var that = this
    this.setData({
      is_like: e.currentTarget.dataset.like.flag > 0 ? false : true,
      pageSize: that.data.list.length,
      pageIndex: 1
    })
    // console.log(this.data.is_like);
    this.data.is_like ? (wx.request({
      url: app.globalData.serverApi + '/friendsLikes',
      method: 'POST',
      data: {
        likesPostWxOpenId: wx.getStorageSync('openid'),
        likesUserWxOpenId: e.currentTarget.dataset.like.wx_open_id,
        likedFriendId: e.currentTarget.dataset.like.id,
        status: that.data.is_like ? 1 : 0,
        name: info.nickName
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        // console.log("赞", res.data);
        res.data.code == 1 ? that.load() : ''
      }
    })) : (
      wx.request({
        url: app.globalData.serverApi + '/deletefriendsLikes',
        method: 'POST',
        data: {
          likesPostWxOpenId: wx.getStorageSync('openid'),
          likedFriendId: e.currentTarget.dataset.like.id,
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success(res) {
          // console.log("取消赞", res.data);
          res.data.code == 1 ? that.load() : ''
        }
      })
    )

  },
  img_click(e) {
    var that = this
    var img = that.data.img_src
    // console.log(img);
    var imgs = e.currentTarget.dataset.imgs
    wx.previewImage({
      current: img, // 当前显示图片的http链接 String
      urls: imgs // 需要预览的图片http链接列表 Array
    })
  },
  img_click_url(e) {
    // console.log(e);
    this.setData({
      img_src: e.currentTarget.dataset.url ? e.currentTarget.dataset.url : ''
    })
  },
  pinglun(e) {
    this.setData({
      ping_info: e.currentTarget.dataset.ping ? e.currentTarget.dataset.ping : this.data.ping_info,
      form: false,
      add: true
    })
    this.select_pinglun()
  },
  content(e) {
    this.setData({
      value: e.detail.value.replace(/\s*/g, "")
    })
  },
  send_pinglun(e) {
    // console.log("评论",e);
    // console.log(this.data.ping_info);
    var that = this
    var info = this.data.ping_info
    let content = this.data.value
    content ? (
        wx.request({
          url: app.globalData.serverApi + '/commentOn',
          method: 'POST',
          data: {
            friendId: info.id,
            content: content,
            commentUserWxOpenId: info.wx_open_id, //物品发布人openid
            commentPostWxOpenId: wx.getStorageSync('openid'), //评论人openid
            city: info.address,
            status: 1
          },
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          success(res) {
            // console.log(res);
            res.data.code == 1 ? (wx.showToast({
              title: '评论成功',
            })) : (wx.showToast({
              title: res.data.response,
            }))
            that.setData({
              ping: false,
              ping_pageIndex: 1,
              value: '',
              height: 0
            })

            that.select_pinglun()
          },
          fail() {
            that.setData({
              value: ''
            })
          }
        })) :
      (wx.showToast({
        title: '内容不允许为空',
        icon: "none"
      }))
  },
  select_pinglun() {
    var that = this
    var info = this.data.ping_info
    // console.log(info);
    // var info = e.currentTarget.dataset.ping
    wx.request({
      url: app.globalData.serverApi + '/selectComment',
      method: 'POST',
      data: {
        friendId: info.id,
        status: 1,
        pageIndex: that.data.ping_pageIndex,
        pageSize: 12
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        // //console.log(res.data);
        // console.log(res.data);
        if (res.data.response) {
          // if (res.data.response.content) {
          res.data.response.content.forEach(item => {
            let d = new Date(item.target.create_time).getTime();
            item.target.create_time = util.commentTimeHandle(d);
          })
          that.setData({
            ping_end: res.data.response.content.length == 12 ? false : true,
            pinglun: that.data.ping_pageIndex == 1 ? res.data.response.content : that.data.pinglun.concat(res.data.response.content),
          })
          //console.log("pl--->", that.data.content);
        }

      },
      fail: res => {
        wx.showToast({
          title: "加载留言失败",
        })
      }
    })
  },
  load_ping() {
    // console.log('上拉加载');
    var that = this
    // if(!this.loading && this.data.pageIndex<this.data.pages ){
    // console.log('当前页', that.data.pageIndex);
    if (!this.data.ping_end) {
      that.setData({
        ping_pageIndex: that.data.ping_pageIndex + 1
      })
      // console.log('当前页', that.data.pageIndex);
      this.select_pinglun()
    } else {
      // wx.showToast({
      //   title: '已到底！',
      // })
    }
  },
  delete(e) {
    // console.log("e===>", e);
    e.currentTarget.dataset.id.comment_post_wx_open_id == wx.getStorageSync('openid') ? this.detele_(e) : wx.showToast({
      icon: "none",
      title: '不是本人的留言',
    })
  },
  detele_(e) {
    var that = this
    wx.showModal({
      title: '是否删除该留言？',
      success(res) {
        if (res.confirm) {
          // console.log('用户点击确定')
          wx.request({
            url: app.globalData.serverApi + '/deleteComment',
            method: 'POST',
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            data: {
              id: e.currentTarget.dataset.id.id
            },
            success(res) {
              that.setData({
                // pageIndex: 1,
                ping_pageIndex: 1,
                delete: true,
              })
              that.select_pinglun()
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  load() {
    var that = this
    wx.request({
      url: app.globalData.serverApi + '/findAllFriends',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        wxOpenId: wx.getStorageSync('openid'),
        pageIndex: 1,
        pageSize: that.data.pageSize,
        publictiy: 1
      },
      success(res) {
        console.log("shuju==>", res.data);
        if (res.data.response) {
          res.data.response.content.forEach(item => {
            let d = new Date(item.target.create_time).getTime();
            item.target.create_time = util.commentTimeHandle(d);
            if (item.target.images) {
              item.target.images = item.target.images.split(",");
            }
          })
          that.setData({
            end: res.data.response.content.length == 10 ? false : true,
            list: that.data.pageIndex == 1 ? res.data.response.content : that.data.list.concat(res.data.response.content),
          })
          // console.log("list====>", that.data.list);
        } else {
          console.log('没有数据');
        }
      }
    })
  },
  add(e) {
    // console.log(e);
    this.setData({
      add: true,
      form: true
    })
  },
  exit(e) {
    this.setData({
      ping_end: false,
      ping_pageIndex: 1,
      add: false
    })
  },
  // 置顶 获取滚动条当前位置
  onPageScroll: function (e) {
    // console.log(e)
    if (e.scrollTop > 100) {
      this.setData({
        floorstatus: true
      });
    } else {
      this.setData({
        floorstatus: false
      });
    }
  },
  goTop(e) {
    var that = this
    if (wx.pageScrollTo) {
      wx.pageScrollTo({
        scrollTop: 0
      })
      // console.log('top');
      // that.setData({
      //   pageIndex:1
      // })
    } else {
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新版微信后重试',
      })
    }
  },
  //////////////////提交数据保存到数据库 文件保存到存储//////////////////////
  formSubmit: function (e) {
    var that = this
    // console.log('form发生了submit事件，携带数据为：', e.detail.value)
    if (!e.detail.value.content) {
      wx.showToast({
        icon: 'none',
        title: '请输入内容'
      });
    } else {
      this.add_COSfileImages(e);
    }
  },
  // 文件图片上传腾讯对象存储COS
  add_COSfileImages: function (e) {
    var that = this
    if (that.data.imgbox.length) { //上传图片到云存储
      // wx.showLoading({
      //   title: '上传中',
      // })
      let promiseArr = [];
      var cos = new COS({
        SecretId: 'AKIDrb9SYPbMn1zmOno25EGcpnW8VgnpdFsN',
        SecretKey: 'TrCsPO7artiKo37wWrwmOuAE8rLchWCm',
      });
      for (let i = 0; i < that.data.imgbox.length; i++) {
        promiseArr.push(new Promise((reslove, reject) => {
          let item = that.data.imgbox[i];
          let suffix = /\.\w+$/.exec(item)[0]; //正则表达式返回文件的扩展名
          var filePath = item;
          var time = util.dateFormat(new Date(), "YMD");
          var filename = Number(Math.random().toString().substr(3, 6) + new Date().getTime()).toString(36) + suffix;
          cos.postObject({
            Bucket: 'niuyabo-1257122371',
            Region: 'ap-chengdu',
            Key: 'xiaochengxu/' + time + '/' + filename,
            FilePath: filePath,
            onProgress: function (info) {}
          }, function (err, data) {
            var res = data;
            res = res.Location;
            var fileID = "http://" + res;
            that.setData({
              fileIDs: that.data.fileIDs.concat(fileID)
            })
            that.data.product_img.push(fileID);
            reslove();
            // wx.hideLoading();
          });
        }));
      }
      Promise.all(promiseArr).then(res => { //等数组都做完后做then方法
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
    // let category_type = e.detail.value.fenlei
    //console.log('上传分类====', category_type)
    var userInfo = wx.getStorageSync('userInfo');
    // //console.log(userInfo.wxOpenId);
    var city = wx.getStorageSync('city');
    if (city == null || city == "") {
      app.getUserLocation();
      app.getLocal(app.globalData.latitude, app.globalData.longitude)
      city = wx.getStorageSync('city');
    }
    this.setData({
      // chooseLocation: location,
      location: city
    })
    let that = this;
    wx.request({
      url: app.globalData.serverApi + '/saveAndupdateFriends',
      method: 'POST',
      data: {
        wxOpenId: wx.getStorageSync('openid'),
        content: e.detail.value.content,
        images: that.data.product_img,
        address: city,
        publictiy: 1,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        // //console.log("addOrUpdateMarket===>res");
        console.log(res);

        if (res.data.code == 1) {
          // console.log("进来了");
          wx.showToast({
            title: "发布成功",
          })
          that.load()
          that.goTop()
          that.setData({
            add: false,
            form: false,
            pageIndex: 1
          })
        } else {
          wx.showToast({
            title: res.data.message,
            icon: "error"
          })
          that.load()
          that.goTop()
          that.setData({
            add: false,
            form: false,
            pageIndex: 1
          })
        }
      },
      fail: res => {
        wx.showToast({
          title: "失败",
        })
        that.setData({
          add: false,
        })
      }
    })
  },
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
    // //console.log(imgbox)
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
  to_niu_my_fuwuyinshi: function () {
    wx.navigateTo({
      url: "/pages/niu_my_fuwuyinshi/index"
    })
  },
  delete_dongtai(e) {
    var that = this;
    (e.currentTarget.dataset.id.wx_open_id == wx.getStorageSync('openid')) ? (
      wx.showModal({
        title: '是否删除该动态？',
        success(res) {
          if (res.confirm) {
            wx.request({
              url: app.globalData.serverApi + '/deleteFriends/' + e.currentTarget.dataset.id.id,
              method: 'POST',
              data: {},
              header: {
                'content-type': 'application/x-www-form-urlencoded'
              },
              success(res) {
                that.setData({
                  pageIndex: 1
                })
                that.load()
                that.goTop()
              }
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })

    ) : wx.showToast({
      icon: "none",
      title: '不是本人的动态',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.isshow()
    var userInfo = wx.getStorageSync('userInfo');
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
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.setData({
      pageIndex: 1
    })
    this.load()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
    console.log("下拉刷新");
    wx.stopPullDownRefresh()
    this.setData({
      pageIndex: 1,
      pageSize: 10
    })
    this.load()
    this.goTop()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    console.log('上拉加载');
    var that = this
    if (!this.data.end) {
      that.setData({
        // pageIndex: that.data.pageIndex + 1
        pageSize: that.data.pageSize + 10
      })
      this.load()
    } else {
      // wx.showToast({
      //   title: '已到底！',
      // })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})