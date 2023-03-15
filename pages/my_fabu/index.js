// pages/shoucang/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  wupin_detail(e){
    var that = this
    console.log(e);
    if(e.currentTarget.dataset.reside ===1 ){
     var info = that.data.list[e.currentTarget.dataset.index]
       console.log("info==>", info);
       info = JSON.stringify(info)
       wx.navigateTo({
         url: '/pages/wupin_detail/index?info=' + info
       })
    }else if(e.currentTarget.dataset.reside === 2){
     var info = that.data.list[e.currentTarget.dataset.index]
     console.log("info==>", info);
     info = JSON.stringify(info)
     wx.navigateTo({
       url: '/pages/jineng_detail/index?info=' + info
     })
    }else{
     var info = that.data.list[e.currentTarget.dataset.index]
     console.log("info==>", info);
     info = JSON.stringify(info)
     wx.navigateTo({
       url: '/pages/xvqiu_detail/index?info=' + info
     })
    }
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