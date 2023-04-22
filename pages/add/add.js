var app = getApp()
Page({
  data: {
    // animationData: {},
    // animationDatas: {},
    animation: false,
    isshow: false
  },

  onLoad: function () {
    this.isshow();
  },
  isshow() {
    var that = this
    that.setData({
      isshow: wx.getStorageSync('isshow')
    })
  },
  goAdd(e) {
    var url
    e.currentTarget.dataset.index == 1 ? url = '/pages/wupin_add/index' :
      (e.currentTarget.dataset.index == 2 ? url = '/pages/jineng_add/index' : url = '/pages/xvqiu_add/index')
    // console.log(e);
    wx.navigateTo({
      url: url
    })
  },
  onShow() {
    this.setData({
      animation: true
    })
    // console.log('true');
    var userInfo = wx.getStorageSync('userInfo');
    // console.log("issue");
    if (userInfo.avatarUrl == "" || userInfo.nickName == "" || userInfo.wxOpenId == "") {
      setTimeout(function () {
        wx.showToast({
          title: '请完善个人信息',
          icon:"none"
        })
      }, 1000);
      wx.redirectTo({
        url: "/pages/niu_my_edit_information/index"
      })
    }
  },
  onHide() {
    this.setData({
      animation: false
    })
    // console.log('false');
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})