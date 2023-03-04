const util = require("../../libs/util")
const app = getApp()

// pages/wupin_detail/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info: '',
    // want: false,
    showDialog: false,
    is_shouCang: false,
    content: '',
    liuyan_value: ''
  },
  // want() {
  //   var want = !this.data.want
  //   this.setData({
  //     want: want
  //   })
  //   // console.log(this.data.want);
  //   if (want) {
  //     wx.showModal
  //   }
  // },
  is_shouCang() {
    this.setData({
      is_shouCang: !this.data.is_shouCang
    })
    var info = this.data.info
    info.is_shouCang = this.data.is_shouCang
    this.setData({
      info: info
    })

  },
  /**
   * 控制 pop 的打开关闭
   * 该方法作用有2:
   * 1：点击弹窗以外的位置可消失弹窗
   * 2：用到弹出或者关闭弹窗的业务逻辑时都可调用
   */
  toggleDialog() {
    this.setData({
      showDialog: !this.data.showDialog
    });
  },

  // 实现点击复制功能
  copy(e) {
    console.log(e);
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
          }
        })
      }
    })
  },

  call_phone: function (e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.text, //这里是电话号码
      success: function () {
        console.log("拨打电话成功！")
      },
      fail: function () {
        console.log("拨打电话失败！")
      }
    })
  },
  liuyan(res) {
    console.log(res.detail.value);
    var that = this
    var info = this.data.info.target
    var city = wx.getStorageSync('city');
    console.log(city);
    wx.request({
      url: app.globalData.serverApi + '/commentOn',
      method: 'POST',
      data: {
        marketId: info.id,
        content: res.detail.value,
        commentUserWxOpenId: info.wx_open_id, //物品发布人openid
        commentPostWxOpenId: wx.getStorageSync('openid'), //评论人openid
        city:city
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        console.log(res);
        wx.showToast({
          title: res.data.response,
        })
        that.setData({
          liuyan_value: ''
        })
        that.show_liuyan()
      },
      fail: res => {
        wx.showToast({
          title: "加载类别失败",
        })
      }
    })
  },
  show_liuyan() {
    console.log('ok');
    var that = this
    var info = this.data.info.target
    wx.request({
      url: app.globalData.serverApi + '/selectComment',
      method: 'POST',
      data: {
        marketId: info.id,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        console.log(res.data);
        if(res.data.response.content){

          res.data.response.content.forEach(item => {
            let d = new Date(item.target.create_time).getTime();
            item.target.create_time = util.commentTimeHandle(d);
          })
          that.setData({
            content: res.data.response.content
          })
          console.log("pl--->",that.data.content);
        }
        
      },
      fail: res => {
        wx.showToast({
          title: "加载留言失败",
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var info = JSON.parse(options.info)
    console.log(info);
    this.setData({
      info: info
    })
    this.setData({
      is_shouCang: info.is_shouCang
    })
    // this.show_liuyan()
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
    this.show_liuyan()
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