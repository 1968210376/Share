// index.js
const app = getApp()
// const chooseLocation = requirePlugin('chooseLocation');
var util = require('../../libs/util.js')
Page({
  data: {
    tab: 0,
    tabs: 0,
    item: 0,
    navHeight: 100,
    openid: '',
    pageIndex: 0, //页数
    loading: false, //加载状态
    location: "定位",
    chooseLocation: "", //位置
    categories: [], //子分类
    categoryType: 1,
    reside: 1, //大分类
    banner: '',
    list: [], //数据列表 
    lists: [],
    listss: [],
    searchKey: '',
    end: false,
    state:false,
    top:0,
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
  changeTab: function (e) { //一级导航栏切换
    var that = this
    if (e) {
      var reside = parseInt(e.target.dataset.tab) + 1
      // console.log(reside);

    } else {
      var reside = 1
    }
    this.setData({
      tab: e.target.dataset.tab
    })
    this.setData({
      tabs: 0
    })
    this.setData({
      item: 0
    })
    this.setData({
      end: false
    })
    this.getCategory(reside)

  },
  changeTabs: function (e) { //二级导航栏滑动切换
    var that = this
    console.log("tabs===>", e.detail.current);
    this.setData({
      tabs: e.detail.current
    })
    this.setData({
      item: e.detail.current
    })
    if (that.data.categories.length !== 0) {

      this.setData({
        // categoryType: that.data.tab+that.father.length +1
        categoryType: that.data.categories[e.detail.current].categoryType
      });
    }
    this.setData({
      end: false
    })
    // console.log(this.data.categoryType);
    this.getShuju()

  },
  changeItem(e) { //二级导航栏点击切换
    var that = this
    // console.log('+++++++++++', e);

    if (e.currentTarget.dataset !== '') {

      var i = e.target.dataset.id

      this.setData({
        tabs: e.currentTarget.dataset.item
      })
      this.setData({
        item: e.currentTarget.dataset.item
      })
      // console.log('item--->', this.data.item);
      this.setData({
        categoryType: i
      })
      this.setData({
        end: false
      })
      // console.log('分类id', this.data.categoryType);
      this.getShuju()
    }
  },
  search(e) { //搜索
    wx.showToast({
      title: '搜索' + e.detail.value,
    })
    this.setData({
      searchKey: e.detail.value
    })
    var openid = wx.getStorageSync('openid')
    this.setData({
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
        pageIndex: 0,
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
        that.data.setData({
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
    wx.showLoading({

      title: '数据加载中...',

    });
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
        categoryType: that.data.categoryType
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
        setTimeout(()=>{
          wx.hideLoading();
          wx.hideNavigationBarLoading()
         },3000)
      }

    })
  },
  getShujus: function (e) { //上滑获取更多数据
    var openid = wx.getStorageSync('openid')
    this.setData({
      openid: openid
    })
    var that = this
    this.loading = true
    if (e) {
      var page = e
      console.log("e:",e);
    } else {
      page = that.data.pageIndex
      console.log("page:",page);
    }
    // console.log('openid', openid);
    var that = this
    wx.showLoading({
      title: '数据加载中...',
    });
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
        categoryType: that.data.categoryType
      },
      success(res) {
        that.loading = false
        console.log("shuju==>", res.data);
        if (res.data.response.content.length!==0) {
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
          if (res.data.response.content !== 0) {
            that.setData({
              list: that.data.list.concat(res.data.response.content)
            })
            that.setData({
              pageIndex: that.data.pageIndex + 1
            })
          } else {
            that.setData({
              end: true
            })
          }
          // console.log("list====>", that.data.list);
        } else {
          that.end = true
          console.log('没有数据');
        }

      },
      complete() {
       setTimeout(()=>{
        wx.hideLoading();
        wx.hideNavigationBarLoading()
       },3000)
      }

    })
  },
  refresh() { //上拉加载
    console.log('上拉加载');
    var that = this
    // if(!this.loading && this.data.pageIndex<this.data.pages ){
    console.log('当前页',that.data.pageIndex);
    this.getShujus(this.data.pageIndex + 1)
    // this.setData({

    // })
    // }
  },
  goTop(e){
    if(wx.pageScrollTo){
      wx.pageScrollTo({
        scrollTop:0
      })
      this.setData({
        top:0
      })
      console.log('top');
    }else{
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新版微信后重试',
      })
    }
  },
  ontopRefresh() {
    //显示顶部加载图标
    // if (!this.loading && this.data.pageIndex < this.data.pages) {
    wx.showNavigationBarLoading()
    this.setData({
      pageIndex:0
    })
    this.getShuju(0)
    console.log('下拉刷新');
    // }
  },
  onLoad() {
    this.setData({ //动态高度
      navHeight: app.globalData.navHeight,
    })

  },
  onShow() {
    var that = this
    var city = wx.getStorageSync('city');
    this.setData({
      chooseLocation: location,
      location: city
    })
    this.banner()
    if (this.data.categories.length == 0) {
      that.getCategory()
    }
    wx.showLoading({
      title: '数据加载中...',
    });
  },
  onPullDownRefresh() { //下拉刷新
    //显示顶部加载图标
    // if (!this.loading && this.data.pageIndex < this.data.pages) {
     
    wx.showNavigationBarLoading()
    this.setData({
      pageIndex:0
    })
    this.getShuju()
    console.log('下拉刷新');
    // }
  },
  onReachBottom() {
    console.log('上拉刷新');
  }
})