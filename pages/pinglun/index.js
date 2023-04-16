// pages/pinglun/index.js
const app = getApp()
var util = require('../../libs/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: '',
    id: 0,
    wxOpenId: '',
    pageIndex: 1,
    pageSize: 13,
    end: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var infos = JSON.parse(options.info)
    // console.log(infos);
    this.setData({
      list: infos
    })
    var that = this
    var user = wx.getStorageSync('userInfo')
    // console.log("my/index.js获取本地userInfo:", wx.getStorageSync('userInfo'));
    if (user != "") {
      that.setData({
        wxOpenId: user.wxOpenId
      })
      // console.log("显示用户信息")
    }
  },
  show(e) {
    // console.log(e.currentTarget.dataset.index);
    var id = e.currentTarget.dataset.index
    var that = this
    this.setData({
      id: id
    })
  },
  delete(e) {
    // console.log(e);
    e.currentTarget.dataset.id.comment_post_wx_open_id == wx.getStorageSync('openid') ? this.detele_(e) : wx.showToast({
      icon:"none",
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
                pageIndex:1
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
  jiazai() {
    var that = this
    wx.request({
      url: app.globalData.serverApi + '/selectOpenidComment',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        // status: 1,
        pageIndex: that.data.pageIndex,
        pageSize: that.data.pageSize,
        commentUserWxOpenId: that.data.wxOpenId,
        status: 1
      },
      success(res) {
        // console.log("res", res);
        if (res.data.response.content.length > 0) {
          // console.log("pageIndex:", that.data.pageIndex);
          res.data.response.content.forEach(item => {
            let d = new Date(item.target.create_time).getTime();
            item.target.create_time = util.commentTimeHandle(d);
          })
          that.setData({
            list: that.data.pageIndex == 1 ? res.data.response.content : that.data.list.concat(res.data.response.content)
          })
        } else {
          that.setData({
            end: true
          })
          wx.showToast({
            title: '已到底',
          })
        }
      }
    })
  },
  goTop() {
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
    var that = this
    that.setData({
      pageIndex: that.data.pageIndex + 1
    })
    that.jiazai()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})