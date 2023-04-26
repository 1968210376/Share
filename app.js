// app.js
// 2023年3月3日 牛亚博 修改
var QQMapWX = require('./libs/qqmap-wx-jssdk.min.js')
var qqmapsdk;
var app = getApp()

App({
  globalData: {
    userInfo: null,
    openid: null,
    navHeight: 100,
    city: '',
    latitude: '',
    longitude: '',
    location: '',
    navBarHeight: 0, // 导航栏高度
    menuRight: 0, // 胶囊距右方间距（方保持左、右间距一致）
    menuTop: 0, // 胶囊距顶部间距
    menuHeight: 0, // 胶囊高度（自定义内容可与胶囊高度保证一致）
    // serverApi: "http://172.16.3.52:8080/wx/api", //内网穿透测试
    // serverApi: "https://localhost:8080/wx/api", //本地测试
    // serverApi: "https://172.16.3.52:8080/wx/api", //内网穿透测试
    serverApi: "https://niuyabo.xyz:8080/wx/api", //发布地址
  },
  // 点击定位
  clickdingwei: function (json) {
    // console.log("options：", json)
    // let key = 'YPJBZ-3VICP-OYWDV-VQDUT-FCI7J-MPFYK'; //使用在腾讯位置服务申请的key
    let key = 'PMWBZ-KDRLX-H3C4C-ZAH36-WB2YT-GYBN5'; //使用在腾讯位置服务申请的key
    let referer = 'wx6d3c8ce12b2a4f0c'; //调用插件的app的名称
    let endPoint = JSON.stringify({ //终点
      'id': 1,
      'name': json.name,
      'latitude': json.latitude,
      'longitude': json.longitude
    });
    wx.navigateTo({
      url: 'plugin://routePlan/index?key=' + key + '&referer=' + referer + '&endPoint=' + endPoint
    });
  },


  // 方法定义 lat,lng  计算距离
  GetDistance: function (lat1, lng1, lat2, lng2) {
    var radLat1 = lat1 * Math.PI / 180.0;
    var radLat2 = lat2 * Math.PI / 180.0;
    var a = radLat1 - radLat2;
    var b = lng1 * Math.PI / 180.0 - lng2 * Math.PI / 180.0;
    var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) +
      Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
    s = s * 6378.137; // EARTH_RADIUS;
    s = Math.round(s * 10000) / 10000;
    return s;
  },
  // 获取分类 
  selectcategory: function (reside) {
    wx.request({
      url: this.globalData.serverApi + '/selectCategory',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      // data: {
      //   categoryType: reside
      // },
      success: (res) => {
        console.log("selectcategory===>res"); 
        console.log(res); 
        wx.setStorageSync('categories', res.data.response.content)
      }
    })
  },
  //  初始化的时候执行
  onLaunch: function () {
    if (this.globalData.userInfo == null) {
      this.getwxopenid();
    }
    this.banner();
    this.selectcategory();
    wx.getSystemInfo({
      success: res => {
        this.globalData.navHeight = res.windowHeight; //动态获得窗口高度。当然，别忘了要在app.js中设置全局变量navHeight,以及上面主文件的js文件也是同理。
        // console.log(this.globalData.navHeight, 'this.globalData.navHeight')
      },
      fail(err) {
        console.log(err);
      }
    })
    this.getUserLocation();
    qqmapsdk = new QQMapWX({
      key: 'YPJBZ-3VICP-OYWDV-VQDUT-FCI7J-MPFYK'
    });
    wx.getStorageSync('longitude');
    // this.getLocal(wx.getStorageSync('latitude'), wx.getStorageSync('longitude'));
    this.getLocal(this.globalData.latitude, this.globalData.longitude)
    const that = this;
    // 获取系统信息
    const systemInfo = wx.getSystemInfoSync();
    // 胶囊按钮位置信息
    const menuButtonInfo = wx.getMenuButtonBoundingClientRect();
    // console.log(systemInfo)
    // console.log(menuButtonInfo)
    // 导航栏高度 = 状态栏高度 + 44(所有机型都适用)
    that.globalData.navBarHeight = systemInfo.statusBarHeight + 44;
    that.globalData.menuRight = systemInfo.screenWidth - menuButtonInfo.right;
    that.globalData.menuTop = menuButtonInfo.top;
    that.globalData.menuHeight = menuButtonInfo.height;
  },
  banner() { //轮播图
    var that = this
    wx.request({
      url: that.globalData.serverApi + '/selectAllBanner',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        status: 1
      },
      success(res) {
        console.log('lunbo:', res.data.response);
        wx.setStorageSync("banner", res.data.response);
        // that.setData({
        //   isshow: res.data.response.length > 2 ? true : false
        // })
        wx.setStorageSync("isshow", res.data.response.length > 2 ? true : false);
        // console.log(that.data.isshow);
      }
    })
  },
  // 获取当前所在城市
  getLocal: function (latitude, longitude) {
    var that = this
    qqmapsdk.reverseGeocoder({
      location: {
        latitude: latitude,
        longitude: longitude
      },
      success: function (res) {
        // console.log(JSON.stringify(res));
        let province = res.result.ad_info.province
        let city = res.result.ad_info.city
        // console.log("当前城市：", province, city)
        that.globalData.city = city
        wx.setStorageSync('city', city);
        wx.setStorageSync('province', province);

        // 如果不是这些区域，就提示未开放
        // if(city != "新乡市"){
        //   wx.showModal({
        //     title: '当前城市未开通',
        //     content: '如有需要请联系管理员开放该区域',
        //     success: function(res) {
        //       if (res.confirm) {
        //         console.log('用户点击确定')
        //       } else if (res.cancel) {
        //         console.log('用户点击取消')
        //       }
        //     }
        //   })
        // }
        // that.setData({
        //   province: province,
        //   city: city,
        //   latitude: latitude,
        //   longitude: longitude
        // })
      },
      fail: function (res) {
        console.log(res);
      },
      complete: function (res) {}
    });
  },

  // 获取用户openid 和个人信息保存缓存和全局变量 已完成
  getwxopenid: function () {
    //获取openId（需要code来换取）这是用户的唯一标识符
    wx.login({
      success: (res) => {
        let code = res.code
        // console.log("获取code：", res);
        // 通过code换取openId
        wx.request({
          url: this.globalData.serverApi + '/logingetopenid/' + code,
          method: 'POST',
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          success: (res) => {
            // console.log(res.data);
            if (res.data.code == 0) {
              // console.log(res.data.message);
            }
            var openid = res.data.response.wxOpenId
            if (openid) {
              this.globalData.openid = openid
              this.globalData.userInfo = res.data.response
              wx.setStorageSync('openid', openid);
              wx.setStorageSync('userInfo', this.globalData.userInfo);
            }
            // console.log("app.js获取到的userInfo===>", this.globalData.userInfo);
          }
        })
      }
    })
  },
  // 微信获取地理位置 选择位置  授权位置信息 已完成
  getUserLocation: function () {
    let that = this;
    wx.getSetting({
      success: (res) => {
        // res.authSetting['scope.userLocation'] == undefined    表示 初始化进入该页面
        // res.authSetting['scope.userLocation'] == false    表示 非初始化进入该页面,且未授权
        // res.authSetting['scope.userLocation'] == true    表示 地理位置授权
        if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) {
          wx.showModal({
            title: '请求授权当前位置',
            content: '需要获取您的地理位置，请确认授权',
            success: function (res) {
              if (res.cancel) {
                wx.showToast({
                  title: '拒绝授权',
                  icon: 'none',
                  duration: 1000
                })
              } else if (res.confirm) {
                wx.openSetting({
                  success: function (dataAu) {
                    if (dataAu.authSetting["scope.userLocation"] == true) {
                      wx.showToast({
                        title: '授权成功',
                        icon: 'success',
                        duration: 1000
                      })
                      //调用wx.getLocation的API
                      that.getLocation();
                    } else {
                      wx.showToast({
                        title: '授权失败',
                        icon: 'none',
                        duration: 1000
                      })
                    }
                  }
                })
              }
            }
          })
        } else if (res.authSetting['scope.userLocation'] == undefined) {
          //调用wx.getLocation的API
          that.getLocation();
        } else {
          //调用wx.getLocation的API
          that.getLocation();
        }
      }
    })
  },
  getLocation: function () {
    var that = this
    wx.getLocation({
      type: "wgs84",
      success(res) {
        // console.log(res);
        wx.setStorageSync('latitude', res.latitude);
        wx.setStorageSync('longitude', res.longitude);
        that.globalData.latitude = res.latitude
        that.globalData.longitude = res.longitude
        that.globalData.location = res
        that.getLocal(that.globalData.latitude, that.globalData.longitude)

      }
    })
  },

})