// pages/shoucang/index.js
const app = getApp()
var util = require('../../libs/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: '',
    pageIndex: 1,
    pageSize: 10,
    show:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  wupin_detail(e) {
    var that = this
    console.log(e);
    if (e.currentTarget.dataset.reside === 1) {
      var info = that.data.list[e.currentTarget.dataset.index]
      console.log("info==>", info);
      info = JSON.stringify(info)
      wx.navigateTo({
        url: '/pages/wupin_detail/index?info=' + info
      })
    } else if (e.currentTarget.dataset.reside === 2) {
      var info = that.data.list[e.currentTarget.dataset.index]
      console.log("info==>", info);
      info = JSON.stringify(info)
      wx.navigateTo({
        url: '/pages/jineng_detail/index?info=' + info
      })
    } else {
      var info = that.data.list[e.currentTarget.dataset.index]
      console.log("info==>", info);
      info = JSON.stringify(info)
      wx.navigateTo({
        url: '/pages/xvqiu_detail/index?info=' + info
      })
    }
  },
  show(){
    this.setData({
      show:!this.data.show
    })
  },
  delete(e) {
    var that = this
    console.log(e);
    var userInfo = wx.getStorageSync('userInfo')
    var wxOpenId = userInfo.wxOpenId
    console.log("wxOpenId", wxOpenId);
    wx.request({
      url: app.globalData.serverApi + '/deleteMarket',
      method: 'POST',
      data: {
        id: e.currentTarget.dataset.id,
        wxOpenId: wxOpenId
      },
      success(res) {
        wx.showToast({
          title: '删除成功',
        })
        that.jiazai()
      }
    })
  },
  jiazai() {
    var that = this
    var wxOpenId = wx.getStorageSync('userInfo').wxOpenId
    console.log("wxOpenId",wxOpenId);
    wx.request({
      url: app.globalData.serverApi + '/selectMarketOpenId',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        wxOpenId: wxOpenId,
        pageIndex: that.data.pageIndex,
        pageSize: that.data.pageSize,
        // categoryType:4
        // id:that.data.id,
      },
      success(res) {
        // console.log(res);
        res.data.response.content.forEach(item => {
          // let aaa = "";
          // var uuu = item.target.latitude;
          // // console.log(uuu + "0000000000")
          // if (uuu !== "") {
          //  aaa = app.GetDistance(wx.getStorageSync("latitude"), wx.getStorageSync("longitude"), item.target.latitude, item.target.longitude);
          //  aaa = (aaa >= 1 ? (aaa.toFixed(1) + "km") : ((aaa * 1000).toFixed(0) + "m"));
          //  // console.log(aaa + "```````````")
          // }

          let d = new Date(item.target.create_time).getTime();
          item.target.create_time = util.commentTimeHandle(d);
          // item.target.distance = aaa;
          // if (item.target.choose_location !== "") {
          //  item.target.choose_location = JSON.parse(item.target.choose_location);
          // }
          if (item.target.images != "" && item.target.images != null) {
            item.target.images = item.target.images.split(",");
          }
        })
        that.setData({
          list: res.data.response.content
        })
      },
      fail() {
        console.log('请求失败');
      }
    })
  },
  onLoad(options) {
    var infos = JSON.parse(options.info)
    console.log(infos);
    this.setData({
      list: infos
    })

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