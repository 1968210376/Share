// var QQMapWX = require('../../libs/qqmap-wx-jssdk.min.js')
const app = getApp()
Page({
  data: {
    latitude: 35.30351, //默认定位纬度
    longitude: 113.87523, //默认定位经度
    scale:14,
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

  onLoad: function () {
    // 获取当前位置信息定位
    this.mapCtx = wx.createMapContext('map')
    app.getUserLocation()
  },
  onShow: function () {
    var that = this
    that.setData({
      longitude: wx.getStorageSync('longitude'),
      latitude: wx.getStorageSync('latitude')
    })
    // 获取周边信息
    this.selectMarket()
  },
  // 获取附近的共享 地图显示附近共享 已完成
  selectMarket: function () {
    var that = this
    var userInfo = wx.getStorageSync('userInfo');
    console.log(that.data.latitude, that.data.longitude)
    wx.request({
      url: app.globalData.serverApi + '/selectMarket',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        wxOpenId: userInfo.wxOpenId,
        CategoryType: "1",
        title: "",
        publictiy: 1,
        latitude: that.data.latitude,
        longitude: that.data.longitude,
        pageIndex: 0,
        pageSize: 20,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        console.log("selectmarket===>res");
        console.log(res);
        if (res.data.code == 1) {
          var list = res.data.response.content
          let arr = [];
          list.forEach((mar, list) => {
            var item = {};
            item.id = mar.target.id;
            item.width = 30; //这个后端数据没反,就自己设置图标大小
            item.height = 35; //这个后端数据没反,就自己设置图标大小
            item.latitude = mar.target.latitude;
            item.longitude = mar.target.longitude;
            item.iconPath = mar.target.avatar_url;
            item.callout = {
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
  // 视野发生变化时触发，已完成
  regionchange: function (e) {
    var that = this
    
    console.log(e)
    if (e.type == 'end') {
      this.mapCtx.getCenterLocation({
        success: function (res) {
          // 解决拖动地图执行三次该方法 导致的多次查询周边信息
          if(that.data.longitude==res.longitude||that.data.latitude==res.latitude){
            return
          }
          that.setData({
            longitude: res.longitude,
            latitude: res.latitude
          })
          // 获取周边信息
          that.selectMarket()
        }
      })
    }
  },
  // 点击目标 回到初始位置 即刷新页面
  controltap: function () {
    var that = this
    // that.mapCtx.moveToLocation()
    // this.getMyLocation()
    that.setData({
      scale: 14
    })
    that.onShow()

  },

  // 点击共享进入详情页面
  // 点击标记点时触发
  markertap: function (res) {
    console.log(res)
  },


  // clickmap: function (res) {
  //   console.log(res)
  //   // this.selectMarket()
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