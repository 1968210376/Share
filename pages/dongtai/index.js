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
    form:false,
    ping:false,
    img_src: '',
    is_img_click: false,
    list: '',
    imgbox: [], //选择图片
    fileIDs: [], //上传云存储后的返回值
    product_img: [], //上传完成后的图片路径需要保存到数据库
    like: ['my', 'he'],
    pinglun: [{
      nickName: '红中',
      content: '测试'
    }],
    issuePicSum: 9,
    location: ''
  },
  is_like(e) {
    console.log(e, wx.getStorageSync('openid'));
    var that = this
    this.setData({
      is_like: e.currentTarget.dataset.like.flag > 0 ? false : true
    })
    console.log(this.data.is_like);
    this.data.is_like ? (wx.request({
      url: app.globalData.serverApi + '/friendsLikes',
      method: 'POST',
      data: {
        likesPostWxOpenId: wx.getStorageSync('openid'),
        likesUserWxOpenId: e.currentTarget.dataset.like.wx_open_id,
        likedFriendId: e.currentTarget.dataset.like.id,
        status: that.data.is_like ? 1 : 0
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        console.log("赞", res.data);
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
          console.log("取消赞", res.data);
          res.data.code == 1 ? that.load() : ''
        }
      })
    )

  },
  img_click(e) {
    // console.log(e.target.dataset.img);
    var that = this
    this.setData({
      is_img_click: !that.data.is_img_click,
      img_src: e.target.dataset.img ? e.target.dataset.img : ''
    })
  },
  pinglun(e){
    console.log(e);
   this.setData({
     ping:true
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
        pageSize: 10,
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
          // res.data.response.content.length < 10 ? that.setData({
          //   end: true
          // }) : ''
          that.setData({
            list: res.data.response.content
          })
          // console.log("list====>", that.data.list);
        } else {
          console.log('没有数据');
        }
      }
    })
  },
  load_like(e) {
    console.log(e);
    let that = this;
    wx.request({
      url: app.globalData.serverApi + '/friendsLikes',
      method: 'POST',
      data: {
        likesPostWxOpenId: wx.getStorageSync('openid'),
        likesUserWxOpenId: e.currentTarget.dataset.wx_open_id,
        likedFriendId: e.currentTarget.dataset.id,
        status: 1
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
    })
  },
  add(e) {
    console.log(e);
    this.setData({
      add: true
    })
  },
  showfenleiModel(e) {
    this.setData({
      show: true
    })
    console.log(e);
  },
  exit(e) {
    this.setData({
      show: false
    })
  },
  //////////////////提交数据保存到数据库 文件保存到存储//////////////////////
  formSubmit: function (e) {
    var that = this
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
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
        // //console.log(res);
        wx.showToast({
          title: "上传成功",
        })
        if (res.data.code == 1) {
          console.log("进来了");
          that.load()
          that.setData({
            add: false
          })
        }
      },
      fail: res => {
        wx.showToast({
          title: "失败",
        })
        that.setData({
          add: false
        })
      }
    })
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})