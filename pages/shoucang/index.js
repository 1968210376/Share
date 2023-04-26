// pages/shoucang/index.js
const util = require("../../libs/util")
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: '',
    floorstatus: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  // wupin_detail(e) {
  //   var that = this
  //   // console.log(e);
  //   if (e.currentTarget.dataset.reside === 1) {
  //     var info = that.data.list[e.currentTarget.dataset.index]
  //     // console.log("info==>", info);
  //     info = JSON.stringify(info)
  //     wx.navigateTo({
  //       url: '/pages/wupin_detail/index?info=' + info
  //     })
  //   } else if (e.currentTarget.dataset.reside === 2) {
  //     var info = that.data.list[e.currentTarget.dataset.index]
  //     // console.log("info==>", info);
  //     info = JSON.stringify(info)
  //     wx.navigateTo({
  //       url: '/pages/jineng_detail/index?info=' + info
  //     })
  //   } else {
  //     var info = that.data.list[e.currentTarget.dataset.index]
  //     // console.log("info==>", info);
  //     info = JSON.stringify(info)
  //     wx.navigateTo({
  //       url: '/pages/xvqiu_detail/index?info=' + info
  //     })
  //   }
  // },
  async wupin_detail(e) {
    // console.log(e.currentTarget.dataset.id.market_id);
    var that = this
    let info = await that.selctmarketid(e.currentTarget.dataset.id.market_id)
    // console.log("info-----", that.data.info);
  },
  selctmarketid: function (e) {
    var that = this
    //console.log("+++555+++++");
    // 根据id查询信息
    return new Promise((resolve) => {
      wx.request({
        url: app.globalData.serverApi + '/selectMarket',
        method: 'POST',
        data: {
          id: e,
          wxOpenId: wx.getStorageSync('openid'),
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success(res) {
          resolve(res.data.response.content[0])
          // console.log("------------------");
          // console.log(res.data);
          if (res.data.response.content) {
            res.data.response.content.forEach(item => {
              let d = new Date(item.target.create_time).getTime();
              item.target.create_time = util.commentTimeHandle(d);
              // if (item.target.images != "") {
              if (item.target.images != "" && item.target.images != null) {
                item.target.images = item.target.images.split(",");
                if(item.target.choose_location){
                  item.target.choose_location = JSON.parse(item.target.choose_location);
                }
              }
            })
            let info = res.data.response.content[0]
            let url
            let type = res.data.response.content[0].target.category_type
            type <= 5 ? url = 'wupin' : (type <= 9 ? url = 'jineng' : url = 'xvqiu')
            // console.log(url);
            info = JSON.stringify(info)
            wx.navigateTo({
              url: "/pages/" + url + "_detail/index?info=" + info
            })
          } else {
            console.log(res);
          }
        }
      })
    })
  },
  goTop(e) {
    if (wx.pageScrollTo) {
      wx.pageScrollTo({
        scrollTop: 0
      })
      // console.log('top');
    } else {
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新版微信后重试',
      })
    }
  },
  onLoad(options) {
    var infos = JSON.parse(options.info)
    // console.log("infos", infos);
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
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})