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
    pingfen: 5,
    show: false,
    pingjia: '',
    pageIndex: 1,
    pageSize: 10,
    content: '',
    end: false,
    is_img_click: false,
    img_src: '',
    floorstatus: false,
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
        // console.log("count---", res);
        that.setData({
          count: res.data.response.count
        })
      }
    })
  },
  toggleDialog() {
    this.setData({
      showDialog: !this.data.showDialog,
      copy: false,
    });
  },
  // 点击定位 2023年3月5日 牛亚博 
  navigateToChooseLocation: function (e) {
    let json = e.currentTarget.dataset.id
    app.getUserLocation();
    if (json == undefined || json == null) {
      return
    }
    app.clickdingwei(json);
  },
  // 实现点击复制功能
  copy(e) {
    var that = this
    // console.log(e.currentTarget.dataset.text);
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
    this.data.pingjia ? '' : this.setData({
      pingjia: "默认好评"
    })
    this.setData({
      show: false,
    })
    var that = this
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
      },
      success(res) {
        that.selectCommentscore()
      }
    })
  },
  selectCommentscore(e) {
    var that = this
    wx.request({
      url: app.globalData.serverApi + '/selectCommentscore',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        marketId: that.data.info.target.id,
        pageIndex: that.data.pageIndex,
        pageSize: that.data.pageSize,
        // status:0
      },
      success(res) {
        // console.log("ping", res.data);
        that.setData({
          content: that.data.pageIndex == 1 ? res.data.response.content : that.data.content.concat(res.data.response.content),
          end: res.data.response.content.length < res.data.response.pageSize ? true : false
        })
        // console.log("end:===", that.data.end);
      }
    })
  },
  getStarValue(e) {
    // console.log(e);
    e.detail.params ? this.setData({
      pingfen: e.detail.params
    }) : this.setData({
      pingfen: 5
    })
  },
  pingjia(e) {
    // console.log(e);
    this.setData({
      pingjia: e.detail.value
    })
  },
  call_phone: function (e) {
    var that = this
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.text, //这里是电话号码
      success: function () {
        // console.log("拨打电话成功！")
        that.setData({
          copy: true,
          show: true
        })
        that.toggleDialog()
      },
      fail: function () {
        // console.log("拨打电话失败！")
        that.setData({
          copy: true,
          show: true
        })
        that.toggleDialog()
      }
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
  img_click(e) {
    var that = this
    var img = that.data.img_src
    // console.log(img);
    var imgs = e.currentTarget.dataset.imgs
    wx.previewImage({
      current: img, // 当前显示图片的http链接 String
      urls: imgs // 需要预览的图片http链接列表 Array
    })
  },
  img_click_url(e) {
    // console.log(e);
    this.setData({
      img_src: e.currentTarget.dataset.url ? e.currentTarget.dataset.url : ''
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var info = JSON.parse(options.info)
    // console.log('info', info);
    var categories = wx.getStorageSync('categories')
      // console.log(categories);
      var categroyName = "心愿享"
      categories.forEach(item => {
        if (item.categoryType == info.target.category_type) {
          categroyName = item.categoryName
        }
      })
      wx.setNavigationBarTitle({
        title: categroyName
      })
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
    // this.data.ping ? '' : this.setData({
    //   pingfen: 3
    // })
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
    wx.showNavigationBarLoading()
    this.setData({
      pageIndex: 1
    })
    this.selectCommentscore()
    this.top()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    var that = this
    that.data.end ? '' :
      (this.setData({
        pageIndex: that.data.pageIndex + 1
      }), that.selectCommentscore())
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