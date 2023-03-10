// pages/wupin_add/index.js
const app = getApp()
const chooseLocation = requirePlugin('chooseLocation');
var util = require('../../libs/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid: '',
    searchKey: '',
    categoryType: 1,
    reside: 1, //大分类
    location: "定位",
    chooseLocation: "", //位置
    list:'',
    loading:'',
    pageIndex:1,
    pageSize:10,
  },
  search(e) { //搜索
    var openid = wx.getStorageSync('openid')
    wx.showToast({
      title: '搜索' + e.detail.value,
    })
    this.setData({
      searchKey: e.detail.value,
      openid: openid
    })
    // console.log('openid', openid);
    var that = this
    wx.request({
      url: app.globalData.serverApi + '/selectMarket',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        wxOpenId: openid,
        pageIndex: 1,
        pageSize: 10,
        title: that.data.searchKey,
        loading: false,
        categoryType: that.data.categoryType
      },
      success(res) {
        console.log("shuju==>", res.data);
        if (res.data.response) {
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
            if (item.target.images[0] !== "") {
              item.target.images = item.target.images.split(",");
            }
          })
          that.setData({
            list: res.data.response.content
          })
          // console.log("list====>", that.data.list);
        } else {
          console.log('没有数据');
        }
      },
      complete() {
        that.setData({
          searchKey: ''
        })
      }
    })
  },
  banner() { //轮播图
    var that = this
    wx.request({
      url: app.globalData.serverApi + '/selectAllBanner',
      method: 'POST',
      success(res) {
        // console.log('lunbo:', res.data.response);
        that.setData({
          banner: res.data.response
        })
      }
    })
  },
  wupin_detail(e) { // 跳转物品详情页
    if (e) {
      // console.log(e);
      var info = this.data.list[e.currentTarget.dataset.id]
      // console.log("info==>", info);
      info = JSON.stringify(info)
      wx.navigateTo({
        url: '/pages/wupin_detail/index?info=' + info
      })
    }
  },
  jineng_detail(e) { //跳转技能详情页
    // console.log(e);
    var info = this.data.list[e.currentTarget.dataset.id]
    // console.log(info);
    info = JSON.stringify(info)
    wx.navigateTo({
      url: '/pages/jineng_detail/index?info=' + info
    })
  },
  xvqiu_detail(e) {
    // console.log(e);
    var info = this.data.list[e.currentTarget.dataset.id]
    console.log(info);
    info = JSON.stringify(info)
    wx.navigateTo({
      url: '/pages/xvqiu_detail/index?info=' + info
    })
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
        // console.log("selectcategory===>res");
        // console.log(res);
        // wx.setStorageSync('categories', res.data.response.content)
        that.setData({
          categories: res.data.response.content
        })
        if (that.data.categories[0]) {
          that.setData({
            categoryType: that.data.categories[0].categoryType
          })
        } else {
          that.setData({
            categoryType: '3'
          })
        }
        this.getShuju()

      }
    })
  },

  getShuju: function (e) { //获取数据
    var openid = wx.getStorageSync('openid')
    this.setData({
      openid: openid
    })
    var that = this
    this.loading = true
    if (e) {
      var page = e
    } else {
      page = that.data.pageIndex
    }
    // console.log('openid', openid);
    var that = this
    // wx.showLoading({

    //   title: '数据加载中...',

    // });
    wx.showNavigationBarLoading()

    wx.request({
      url: app.globalData.serverApi + '/selectMarket',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        wxOpenId: openid,
        pageIndex: page,
        pageSize: 10,
        title: '',
        categoryType: that.data.categoryType,
        // 2023年3月10日
        status:1 
      },
      success(res) {
        that.loading = false
        console.log("shuju==>", res.data);
        if (res.data.response) {
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
            if (item.target.images[0] !== "") {
              item.target.images = item.target.images.split(",");
            }
          })
          that.setData({
            list: res.data.response.content
          })
          // console.log("list====>", that.data.list);
        } else {
          console.log('没有数据');
        }

      },
      complete() {
        setTimeout(() => {
          // wx.hideLoading();
          wx.hideNavigationBarLoading()
        }, 100)
      }

    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

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

    this.setData({ //动态高度
      navHeight: app.globalData.navHeight,
    })
    // if (this.data.categories.length == 0) {
    //   that.getCategory()
    // }
    var city = app.globalData.city
    var location = app.globalData.location
    this.setData({
      chooseLocation: location,
      location: city
    })
    // console.log(this.data.location,this.data.chooseLocation);
    this.banner()
    // 2023年3月10日
    var city = wx.getStorageSync('city'); 
    if(!wx.getStorageSync('city')){ 
      app.getUserLocation(); 
    } 
    this.setData({ 
      chooseLocation: location, 
      location: city 
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