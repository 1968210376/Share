// pages/jineng_detail/index.js
const util = require("../../libs/util")
const app = getApp()

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
    liuyan_value: '',
    count:0,
    is_clicked:true,
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
  is_shouCang() {
    var that = this
    var info = that.data.info
    if (that.data.is_clicked) {
      that.setData({
        is_clicked: false
      })
      if (this.data.is_shouCang == true) {
        // //console.log('删除');
        wx.request({
          url: app.globalData.serverApi + '/deleteLikes',
          method: 'POST',
          data: {
            marketId: info.target.id,
            likesUserWxOpenId: info.target.wx_open_id, //物品发布人openid
            likesPostWxOpenId: wx.getStorageSync('openid'), //评论人openid
          },
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          success: (res) => {
            console.log('删除成功',res);
            // //console.log();
            that.setData({
              is_shouCang: false,
              count: res.data.response.count,
              is_clicked: true
            })
          },
          fail: res => {
            wx.showToast({
              title: "加载收藏失败",
            })
          }
        })
      } else {
        // //console.log('info===>',info);

        wx.request({
          url: app.globalData.serverApi + '/addLikes',
          method: 'POST',
          data: {
            marketId: info.target.id,
            likesUserWxOpenId: info.target.wx_open_id, //物品发布人openid
            likesPostWxOpenId: wx.getStorageSync('openid'), //评论人openid
          },
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          success: (res) => {
            console.log('收藏成功');
            console.log(res);
            if (res.data.code == 1) {
              that.setData({
                is_shouCang: true,
                count: res.data.response.count
              })
            }
            // //console.log();
            this.setData({
              is_clicked: true
            })
          },
          fail: res => {
            wx.showToast({
              title: "加载收藏失败",
            })
          }
        })
      }
    }

  },
  cha_shouCang(){
    var that = this
    var info = that.data.info
    if(info.target.market_id){
      var id = info.target.market_id
    }else{
      var id = info.target.id 
    }
    wx.request({
      url: app.globalData.serverApi + '/findAllByMarketIdFormLikes',
      method: 'POST',
      data: {
        marketId: id,
        likesUserWxOpenId: info.target.wx_open_id, //物品发布人openid
        likesPostWxOpenId: wx.getStorageSync('openid'), //评论人openid
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        //console.log("是否收藏",res);
        that.setData({
        count:res.data.response.count
        })
        if(res.data.response.flag!==0){
          that.setData({
            is_shouCang: true
          })  
        } else{
          that.setData({
            is_shouCang:false
          })
        }
      },
      fail: res => {
        console.log(res);
        wx.showToast({
          title: "加载收藏失败",
        })
      }
    })
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
    this.cha_shouCang()
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