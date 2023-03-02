// var QQMapWX = require('../../libs/qqmap-wx-jssdk.min.js')
const app = getApp()
Page({
  data: {
    latitude: 35.30351, //默认定位纬度
    longitude: 113.87523, //默认定位经度
    markers: [
      // {
      //   id: 0,
      //   iconPath: "/images/home(1).png",
      //   latitude: 34.28594472914285,
      //   longitude: 108.07340294122699,
      //   width: 20, //图片显示宽度
      //   height: 20, //图片显示高度
      //   title: "牛亚博",
      //   alpha: 1 //透明度 0-1 
      // },
      // {
      //   id: 1,
      //   iconPath: "/images/delect.png",
      //   latitude: 34.28345098172088,
      //   longitude: 108.07423643767835,
      //   width: 20,
      //   height: 20,
      //   callout: {
      //     // color:'#ffffff',
      //     content: '气泡内容',
      //     fontSize: 12,
      //     borderRadius: 5,
      //     borderWidth: 1,
      //     bgColor: '#FFFFFFcc',
      //     padding: 5,
      //     textAlign: 'center',
      //     display: "ALWAYS",
      //     alpha: 0.1,
      //   },
      //   // alpha: 0.1 //透明度 0-1 
      // },
      // {
      //   id: 2,
      //   iconPath: "/images/delect.png",
      //   latitude: 34.28520896777005,
      //   longitude: 108.0694815516472,
      //   width: 20,
      //   height: 20,
      //   // title: "牛亚博",
      //   label: {
      //     content: "999"
      //   }
      // },
    ]
  },
  // 微信获取地理位置 选择位置  授权位置信息
  getUserLocation: function () {
    let vm = this;
    wx.getSetting({
      success: (res) => {
        console.log(JSON.stringify(res))
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
                      //再次授权，调用wx.getLocation的API
                      vm.getLocation();
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
          // vm.getLocation();
        } else {
          //调用wx.getLocation的API
          // vm.getLocation();
        }
      }
    })
  },

  // 获取当前位置定位
  onLoad: function () {
    var that = this
    that.getUserLocation()
    that.selectMarket()
    // getLocation
    // wx.getFuzzyLocation({
    //   type: "wgs84",
    //   success: function (res) {
    //     console.log("-----");
    //     console.log(res);
    //     that.setData({
    //       latitude: res.latitude,
    //       longitude: res.longitude,
    //       markers: [{
    //         latitude: res.latitude,
    //         longitude: res.longitude
    //       }]
    //     })
    //   }
    // })
  },
  // 获取附近的共享



  onShow: function () {
    var that = this
    // that.selectMarket()

    var location = that.data.latitude + "," + that.data.longitude
    console.log(location)

  },

  // 地图显示附近共享

  // 点击共享进入详情页面


  selectMarket: function () {
    // var that = this
    var userInfo = wx.getStorageSync('userInfo');
    wx.request({
      url: app.globalData.serverApi + '/selectMarket',
      method: 'POST',
      data: {
        wxOpenId: userInfo.wxOpenId,
        CategoryType: "1",
        title: "",
        publictiy: 1
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        console.log("selectmarket===>res");
        console.log(res);
        if (res.data.code == 1) {
          // 如果没有查询出数据 load改变为已完成没有下一页了。
          if (res.data.response.content == 0) {
            return
          }
          var list = res.data.response.content
          let arr = [];
          // var item = {};

          list.forEach((mar, list) => {
            // let d = new Date(item.target.create_time).getTime();
            // item.target.create_time = this.commentTimeHandle(d);
            // console.log(item.target.create_time)
            // if (item.target.images != "") {
            //   item.target.images = item.target.images.split(",");
            // }
            var item = {};
            item.id = mar.id;
            item.width = 30; //这个后端数据没反,就自己设置图标大小
            item.height = 35; //这个后端数据没反,就自己设置图标大小
            item.latitude = mar.target.latitude;
            item.longitude = mar.target.longitude;
            // item.iconPath = '/images/delect.png';
            item.iconPath = mar.target.avatar_url;
            item.callout = {
                // color:'#ffffff',
                color: '#FF0000 ',
                content: (mar.target.title.length > 10 ? mar.target.title.substr(0, 10) + "..." : mar.target.title) + "￥:" + mar.target.pirce,
                fontSize: 12,
                borderRadius: 5,
                borderWidth: 1,
                bgColor: '#FFFFFFcc',
                width: 1,
                // borderColor:"#rrrrrr",
                padding: 5,
                textAlign: 'center',
                display: "ALWAYS",
              },
              arr.push(item)
          })
          let that = this
          that.setData({
            markers: arr,
          })

          // that.setData({
          //   mapCtx: wx.createMapContext('map')
          // })
          // let {
          //   mapCtx
          // } = this.data
          // let points = []
          // // result.forEach(item => {
          // //   let obj = {
          // //     latitude: item.lat,
          // //     longitude: item.lng
          // //   }
          // //   points.push(obj)
          // // })
          // mapCtx.includePoints({
          //   padding: [10, , 10000, 100000],
          //   // points,
          //   arr,
          // })

        }
      },
      fail: res => {
        wx.showToast({
          title: "加载失败",
        })
      }
    })
  },



  clickmap: function (res) {
    console.log(res)
    this.selectMarket()
  },
  // 点击标记点时触发
  markertap: function (res) {
    console.log(res)
  },
  // 视野发生变化时触发，
  // regionchange: function (res) {

  // },
  // bindtap:function(res){
  //   console.log(res)
  //   var that = this
  //   console.log(res.detail)
  //   that.setData({
  //     latitude: res.detail.latitude,
  //     longitude: res.detail.longitude,
  //     markers: [{
  //       latitude: res.latitude,
  //       longitude: res.longitude
  //     }]
  //   })
  //   that.onShow()
  // },

  // 获取当前所在城市
  getLocal: function (latitude, longitude) {
    let vm = this;
    qqmapsdk.reverseGeocoder({
      location: {
        latitude: latitude,
        longitude: longitude
      },
      success: function (res) {
        // console.log(JSON.stringify(res));
        let province = res.result.ad_info.province
        let city = res.result.ad_info.city
        console.log("当前城市：", city)
        // 如果不是这些区域，就提示未开放
        // if(city != "驻马店市"){
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
        vm.setData({
          province: province,
          city: city,
          latitude: latitude,
          longitude: longitude
        })

      },
      fail: function (res) {
        console.log(res);
      },
      complete: function (res) {
        // console.log(res);
      }
    });
  },
  get: function () {
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        console.log('纬度' + res.latitude)
        console.log('经度' + res.longitude)
        console.log(JSON.stringify(res))
        var latitude = res.latitude
        var longitude = res.longitude
        var speed = res.speed
        var accuracy = res.accuracy;
        vm.getLocal(latitude, longitude)
      }
    })
  },
  // 周边搜索（圆形范围）
  shousuo: function () {
    // wx.request({
    //   url: 'https://apis.map.qq.com/place_cloud/search/nearby',
    //   // url:'&filter=x.price>18 and x.price<=20 and x.star>=3&orderby=x.price desc',
    //   method: 'GET',
    //   data: {
    //     table_id: '0o_YuzfKv09CC36Lv1',
    //     key: 'PMWBZ-KDRLX-H3C4C-ZAH36-WB2YT-GYBN5',
    //     // location: '35.30351,113.87523',
    //     location: location,
    //     radius: 10000, //半径，单位：米，默认5,000米，最大支持10,000米
    //     auto_extend: 1,
    //     // keyword:"车",
    //     // chooseLocation: JSON.stringify(that.data.chooseLocation == null ? "" : that.data.chooseLocation),
    //   },
    //   success: (res) => {
    //     console.log(res);
    //     let list = res.data.result.data;
    //     let arr = [];

    //     list.forEach((item, list) => {
    //       item.width = 30; //这个后端数据没反,就自己设置图标大小
    //       item.height = 35; //这个后端数据没反,就自己设置图标大小
    //       item.latitude = item.location.lat;
    //       item.longitude = item.location.lng;
    //       item.iconPath = '/images/delect.png';
    //       item.callout = {
    //           // color:'#ffffff',
    //           content: '气泡内容',
    //           fontSize: 12,
    //           borderRadius: 5,
    //           borderWidth: 1,
    //           bgColor: '#FFFFFFcc',
    //           // borderColor:"#rrrrrr",
    //           padding: 5,
    //           textAlign: 'center',
    //           display: "ALWAYS",
    //         },
    //         arr.push(item)
    //     })
    //     let that = this
    //     that.setData({
    //       markers: arr,
    //     })
    //     console.log(that.data.markers)
    //   },
    //   fail: res => {
    //     wx.showToast({
    //       title: "失败",
    //     })
    //   }
    // })
  },


})