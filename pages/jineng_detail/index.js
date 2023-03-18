// pages/jineng_detail/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info: '',
    count: 0,
    copy: false,
    pingfen: 3,
    show: false,
    pingjia: '',
    pageIndex:1,
    pageSize:10,
  },
  count() {
    var that = this
    wx.request({
      url: app.globalData.serverApi + '/addPageViews',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        marketId: that.data.info.target.id,
        likesPostWxOpenId: that.data.info.target.wx_open_id,
        likesUserWxOpenId: wx.getStorageSync('openid')
      },
      success(res) {
        console.log("count---", res);
        that.setData({
          count: res.data.response.count
        })
      }
    })
  },
  toggleDialog() {
    this.setData({
      showDialog: !this.data.showDialog,
    });
  },

  // 实现点击复制功能
  copy(e) {
    var that = this
    console.log(e.currentTarget.dataset.text);
    wx.setClipboardData({ //复制文本
      data: e.currentTarget.dataset.text,
      success: function (res) {
        wx.getClipboardData({ //获取复制文本
          success: function (res) {
            wx.showToast({
              title: '复制成功',
              icon: "none", //是否需要icon
              mask: "ture" //是否设置点击蒙版，防止点击穿透
            })
            that.setData({
              copy: true,
              show: true
            })
            that.toggleDialog()
          }
        })
      }
    })
  },
  exit(e) {
    this.setData({
      show: false,
      copy: false,
    })
    var that = this
    console.log("data:", {
      content: that.data.pingjia,
      marketId: that.data.info.target.id,
      commentUserWxOpenId: that.data.info.target.wx_open_id,
      commentPostWxOpenId: wx.getStorageSync('openid'),
      avgsort: that.data.pingfen
    });
    wx.request({
      url: app.globalData.serverApi + '/commentScoreOn',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        content: that.data.pingjia,
        marketId: that.data.info.target.id,
        commentUserWxOpenId: that.data.info.target.wx_open_id,
        commentPostWxOpenId: wx.getStorageSync('openid'),
        avgsort: that.data.pingfen
      }
    })
  },
  selectCommentscore(e){
    var that = this
    wx.request({
      url: app.globalData.serverApi + '/selectCommentscore',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data:{
        marketId: that.data.info.target.id,
        pageIndex:that.data.pageIndex,
        pageSize:that.data.pageSize,
        status:0
      },
      success(res){
        console.log("ping",res.data);
      }
    })
  },
  getStarValue(e) {
    console.log(e);
    e.detail.params ? this.setData({
      pingfen: e.detail.params
    }) : this.setData({
      pingfen: 5
    })
  },
  pingjia(e) {
    console.log(e);
    e.detail.value ? this.setData({
      pingjia: e.detail.value
    }) : ''
  },
  call_phone: function (e) {
    var that = this
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.text, //这里是电话号码
      success: function () {
        console.log("拨打电话成功！")
        that.setData({
          copy: true,
          show: true
        })
        that.toggleDialog()
      },
      fail: function () {
        console.log("拨打电话失败！")
        that.setData({
          copy: true,
          show: true
        })
        that.toggleDialog()
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var info = JSON.parse(options.info)
    console.log('info', info);
    this.setData({
      info: info
    })
    this.count()
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
    var that = this
    // this.setData({
    //   count:that.data.count+1
    // })
    this.selectCommentscore()
    this.data.ping ? '' : this.setData({
      pingfen: 3
    })
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