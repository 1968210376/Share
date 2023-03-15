// pages/jineng_detail/index.js
const util = require("../../libs/util")
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    info: ''
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
          }
        })
      }
    })
  },
 // 点击定位 2023年3月5日 牛亚博 
 navigateToChooseLocation: function (e) {
  // //console.log(e);
  // let json = JSON.parse(e.currentTarget.dataset.id) 
  let json = e.currentTarget.dataset.id
  app.getUserLocation();

  ////console.log("json===============：")
  ////console.log(json)
  if (json == undefined || json == null) {
    return
  }
  app.clickdingwei(json);
  // ////console.log("options：", json) 
  // // let key = 'YPJBZ-3VICP-OYWDV-VQDUT-FCI7J-MPFYK'; //使用在腾讯位置服务申请的key 
  // let key = 'PMWBZ-KDRLX-H3C4C-ZAH36-WB2YT-GYBN5'; //使用在腾讯位置服务申请的key 
  // let referer = 'wx6d3c8ce12b2a4f0c'; //调用插件的app的名称 
  // let endPoint = JSON.stringify({ //终点 
  //   'id': 1, 
  //   'name': json.name, 
  //   'latitude': json.latitude, 
  //   'longitude': json.longitude 
  // }); 
  // wx.navigateTo({ 
  //   url: 'plugin://routePlan/index?key=' + key + '&referer=' + referer + '&endPoint=' + endPoint 
  // }); 
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var info = JSON.parse(options.info)
    console.log(info);
    this.setData({
      info: info
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
    // 获取当前页面栈
    const pages = getCurrentPages();
    // 获取上一级页面
    const beforePage = pages[pages.length - 2];

    beforePage.setData({ //直接修改上个页面的数据（可通过这种方式直接传递参数）
      backRefresh: true //函数封装，传值为true时调接口刷新页面
    })
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