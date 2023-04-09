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
    show: false,
    end: false,
    delete:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
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
  show() {
    this.setData({
      show: !this.data.show
    })
  },
  delete(e) {
    var that = this
    // console.log(e);
    var userInfo = wx.getStorageSync('userInfo')
    var wxOpenId = userInfo.wxOpenId
    // console.log("wxOpenId", wxOpenId);
    var that = this
    wx.showModal({
      title: '是否删除？',
      success(res) {
        if (res.confirm) {
          // console.log('用户点击确定')
          wx.request({
            url: app.globalData.serverApi + '/deleteMarket',
            method: 'POST',
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            data: {
              id: e.currentTarget.dataset.id,
              wxOpenId: wxOpenId
            },
            success(res) {
              wx.showToast({
                title: '删除成功',
              })
              that.setData({
                pageIndex:1,
                delete:true
              })
              that.jiazai()
              that.goTop()
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
   
  },
  refresh() { //上拉加载
    // console.log('上拉加载');
    var that = this
    // if(!this.loading && this.data.pageIndex<this.data.pages ){
    // console.log('当前页', that.data.pageIndex);
    this.data.end !== true ?
      (that.setData({
          pageIndex: that.data.pageIndex + 1
        }),
        that.jiazai()) :
      wx.showToast({
        title: '已到底！',
      })
  // this.setData({

  // })
  // }
},
goTop(e) {
  wx.pageScrollTo ?
    wx.pageScrollTo({
      scrollTop: 0
    }) : wx.showModal({
      title: '提示',
      content: '当前微信版本过低，无法使用该功能，请升级到最新版微信后重试'
    })
},
ontopRefresh() {
  this.onPullDownRefresh()
},
jiazai(e) {
  var that = this
  var wxOpenId = wx.getStorageSync('userInfo').wxOpenId
  // console.log("wxOpenId", wxOpenId);
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
      res.data.response.content < 10 ? (that.setData({
        end: true
      }), that.return(res)) : that.return(res)
    },
    fail() {
      console.log('请求失败');
    }
  })
},
return (res) {
  // console.log("进来了");
    var that = this
    res.data.response.content.forEach(item => {
      let d = new Date(item.target.create_time).getTime();
      item.target.create_time = util.commentTimeHandle(d);
      if (item.target.images != "" && item.target.images != null) {
        item.target.images = item.target.images.split(",");
      }
    })
    var list
   ( that.data.delete == true || that.data.pageIndex == 1) ? list = res.data.response.content : list = that.data.list.concat(res.data.response.content)
    that.setData({
      list: list
    })
  },
  onLoad(options) {
    var infos = JSON.parse(options.info)
    // console.log(infos);
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
    // this.jiazai()
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
  onPullDownRefresh() { //下拉刷新
    //显示顶部加载图标
    // if (!this.loading && this.data.pageIndex < this.data.pages) {
    //  this.ontopRefresh()
    wx.showNavigationBarLoading()
    this.setData({
      pageIndex: 1
    })
    this.jiazai()
    this.goTop()
    // console.log('下拉刷新');
    this.setData({
      end: false
    })
    // }
  },
  onReachBottom() {
    // console.log('上拉刷新');
    this.refresh()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})