const app = getApp()
var util = require('../../libs/util.js')
var COS = require('../../libs/cos-wx-sdk-v5.js')
Page({
  data: {
    nickName: "编辑个人信息",
    avatarUrl: "/images/0.png",
    bgImg: 'https://img.vinua.cn/images/VR7R.jpeg ',
    // bgImg:'https://uiverse.io/build/_assets/sad-astronaut-2GA54L3F.png',
    item: 0,
    index: 0,
    id: '',
    wxOpenId: '',
    list: [],
    navHeight: 100,
    isShow: false,
    page_index: 1,
    animation: false
  },
  // getUserProfile(e) {
  //   wx.getUserProfile({
  //     desc: '用于完善个人资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
  //     success: (res) => {
  //       console.log(res.userInfo);
  //       var userInfo = wx.getStorageSync('userInfo');
  //       userInfo.avatarUrl =res.userInfo.avatarUrl
  //       userInfo.nickName = res.userInfo.nickName
  //       app.globalData.userInfo = userInfo
  //       userInfo.gender = res.userInfo.gender==0?1:0
  //       wx.setStorageSync('userInfo', userInfo)
  //       this.saveupdataniuuser(userInfo);
  //       this.onShow();
  //     }
  //   })
  // },
  
    // 把userinfo信息保存到数据库
    saveupdataniuuser: function (userInfo) {
      // 保存到数据库
      var userInfo = wx.getStorageSync('userInfo');
      // console.log(userInfo.wxOpenId);
      wx.request({
        url: app.globalData.serverApi + '/updataniuuser',
        method: 'POST',
        data: {
          wxOpenId: userInfo.wxOpenId,
          nickName: userInfo.nickName,
          gender: userInfo.gender,
          avatarUrl: userInfo.avatarUrl,
          phone: userInfo.phone==null?"":userInfo.phone,
          contact_qq: userInfo.contact_qq==null?"":userInfo.contact_qq,
          contact_wx: userInfo.contact_wx==null?"":userInfo.contact_wx
  
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: (res) => {
          wx.showToast({
            title: '提交成功！',
          })
          // console.log("saveupdataniuuser===>res");
          // console.log(res);
        }
      })
    },

  onShow(options) {
    // console.log('显示');
    this.setData({
      animation: true
    })
    var that = this
    var user = wx.getStorageSync('userInfo')
    // console.log("my/index.js获取本地userInfo:", wx.getStorageSync('userInfo'));
    if (user != "") {
      that.setData({
        nickName: user.nickName !== null ? user.nickName : this.data.nickName,
        avatarUrl: user.avatarUrl !== null ? user.avatarUrl : this.data.avatarUrl,
        // id:user.id,
        wxOpenId: user.wxOpenId,
      })
      // console.log("显示用户信息")
    }

    this.setData({ //动态高度
      navHeight: app.globalData.navHeight,
    })

  },
  wupin_detail(e) {
    var that = this
    // console.log(e);
    if (e.currentTarget.dataset.reside === 1) {
      var info = that.data.list[e.currentTarget.dataset.index]
      // console.log("info==>", info);
      info = JSON.stringify(info)
      wx.navigateTo({
        url: '/pages/wupin_detail/index?info=' + info
      })
    } else if (e.currentTarget.dataset.reside === 2) {
      var info = that.data.list[e.currentTarget.dataset.index]
      // console.log("info==>", info);
      info = JSON.stringify(info)
      wx.navigateTo({
        url: '/pages/jineng_detail/index?info=' + info
      })
    } else {
      var info = that.data.list[e.currentTarget.dataset.index]
      // console.log("info==>", info);
      info = JSON.stringify(info)
      wx.navigateTo({
        url: '/pages/xvqiu_detail/index?info=' + info
      })
    }
  },
  showDetail(e) {
    var that = this
    // console.log(that.data);
    that.setData({
      isShow: true
    })
    if (e.currentTarget.dataset.index == 1) {
      that.setData({
        page_index: 1
      })
      wx.request({
        url: app.globalData.serverApi + '/findAllByOpenIdFormLikes',
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        data: {
          // status: 1,
          pageIndex: 1,
          pageSize: 10,
          likesPostWxOpenId: that.data.wxOpenId,
          //  status:1
        },
        success(res) {
          // console.log(res);
          res.data.response.content.forEach(item => {
            let aaa = "";
            var uuu = item.target.latitude;
            // console.log(uuu + "0000000000")
            if (uuu !== "") {
              aaa = app.GetDistance(wx.getStorageSync("latitude"), wx.getStorageSync("longitude"), item.target.latitude, item.target.longitude);
              aaa = (aaa >= 1 ? (aaa.toFixed(1) + "km") : ((aaa * 1000).toFixed(0) + "m"));
              // console.log(aaa + "```````````")
            }

            let d = new Date(item.target.create_time).getTime();
            item.target.create_time = util.commentTimeHandle(d);
            item.target.distance = aaa;
            if (item.target.choose_location) {
              item.target.choose_location = JSON.parse(item.target.choose_location);
            }
            if (item.target.images != "" && item.target.images != null) {
              item.target.images = item.target.images.split(",");
            }
          })
          that.setData({
            list: res.data.response.content
          })
          // console.log(e);
          var info = res.data.response.content
          // console.log("info==>", info);
          info = JSON.stringify(info)
          wx.navigateTo({
            url: '/pages/shoucang/index?info=' + info
          })
        }
      })
    }
    if (e.currentTarget.dataset.index == 2) {
      that.setData({
        page_index: 2
      })
      wx.request({
        url: app.globalData.serverApi + '/selectOpenidComment',
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        data: {
          // status: 1,
          pageIndex: 1,
          pageSize: 13,
          commentUserWxOpenId: that.data.wxOpenId,
          status: 1
        },
        success(res) {
          // console.log(res);
          res.data.response.content.forEach(item => {
            let d = new Date(item.target.create_time).getTime();
            item.target.create_time = util.commentTimeHandle(d);
          })
          that.setData({
            list: res.data.response.content
          })
          var info = res.data.response.content
          // console.log("info==>", info);
          info = JSON.stringify(info)
          wx.navigateTo({
            url: '/pages/pinglun/index?info=' + info
          })
        }
      })
    }
    if (e.currentTarget.dataset.index == 3) {
      that.setData({
        page_index: 3
      })
      wx.request({
        url: app.globalData.serverApi + '/selectMarketOpenId',
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        data: {
          wxOpenId: that.data.wxOpenId,
          pageIndex: 1,
          pageSize: 10,
          // categoryType:4
          // id:that.data.id,
        },
        success(res) {
          // console.log(res);
          res.data.response.content.forEach(item => {
            let aaa = "";
            var uuu = item.target.latitude;
            // console.log(uuu + "0000000000")
            if (uuu !== "") {
              aaa = app.GetDistance(wx.getStorageSync("latitude"), wx.getStorageSync("longitude"), item.target.latitude, item.target.longitude);
              aaa = (aaa >= 1 ? (aaa.toFixed(1) + "km") : ((aaa * 1000).toFixed(0) + "m"));
              // console.log(aaa + "```````````")
            }

            let d = new Date(item.target.create_time).getTime();
            item.target.create_time = util.commentTimeHandle(d);
            item.target.distance = aaa;
            if (item.target.choose_location !== "") {
              item.target.choose_location = JSON.parse(item.target.choose_location);
            }
            if (item.target.images != "" && item.target.images != null) {
              item.target.images = item.target.images.split(",");
            }
          })
          that.setData({
            list: res.data.response.content
          })
          var info = res.data.response.content
          // console.log("info==>", info);
          info = JSON.stringify(info)
          wx.navigateTo({
            url: '/pages/my_fabu/index?info=' + info
          })
        },
        fail() {
          console.log('请求失败');
        }
      })
    }
    // if (e.currentTarget.dataset.index == 4) {

    // }
    if (e.currentTarget.dataset.index == 5) {
      wx.navigateTo({
        url: "/pages/niu_my_fuwuyinshi/index"
      })
    }

  },
  handleContact(e) {
    // console.log(e.detail.path)
    // console.log(e.detail.query)
  },
  onHide() {
    this.setData({
      isShow: false,
      animation: false
    })

    // console.log('false');
  },
  // 跳转到个人信息页面
  to_niu_my_edit_information: function () {
    wx.navigateTo({
      url: "/pages/my_edit_information/index"
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})