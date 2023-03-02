// // pages/map/map.js
// var QQMapWX = require('../../libs/qqmap-wx-jssdk.min.js')
const app = getApp()
Page({
  data: {
    // longitude: 108.07332649827005, //默认定位经度
    // latitude: 34.28626496061992, //默认定位纬度
    latitude: 35.30351, //默认定位纬度
    longitude: 113.87523, //默认定位经度
    markers: [
      //八教垃圾桶位置
      {
        id: 0,
        iconPath: "/images/home(1).png",
        latitude: 34.28594472914285,
        longitude: 108.07340294122699,
        width: 20, //图片显示宽度
        height: 20, //图片显示高度
        title: "牛亚博",
        alpha: 1 //透明度 0-1 
      },
      //三教垃圾桶位置
      {
        id: 1,
        iconPath: "/images/delect.png",
        latitude: 34.28345098172088,
        longitude: 108.07423643767835,
        width: 20,
        height: 20,
        callout: {
          // color:'#ffffff',
          content: '气泡内容',
          fontSize: 12,
          borderRadius: 5,
          borderWidth: 1,
          bgColor: '#FFFFFFcc',
          padding: 5,
          textAlign: 'center',
          display: "ALWAYS",
          alpha: 0.1,
        },
        // alpha: 0.1 //透明度 0-1 
      },
      //北秀垃圾桶位置
      {
        id: 2,
        iconPath: "/images/delect.png",
        latitude: 34.28520896777005,
        longitude: 108.0694815516472,
        width: 20,
        height: 20,
        // title: "牛亚博",
        label: {
          content: "999"
        }
      },
      //信工楼垃圾桶位置
      {
        id: 3,
        iconPath: "/images/delect.png",
        latitude: 34.2842427171466,
        longitude: 108.0724158883095,
        width: 20,
        height: 20,
        title: "牛亚博",
      },
      //10号寝室楼的位置
      {
        id: 4,
        iconPath: "/images/delect.png",
        latitude: 34.286067170734036,
        longitude: 108.0664473026991,
        width: 20,
        height: 20,
        title: "牛亚博",
      },
      //14号寝室楼的位置 
      {
        id: 5,
        iconPath: "/images/delect.png",
        latitude: 34.287375788724745,
        longitude: 108.06752823293209,
        width: 20,
        height: 20,
        title: "牛亚博",
      },
      //理学院垃圾桶位置
      {
        id: 6,
        iconPath: "/images/delect.png",
        latitude: 34.28801845563627,
        longitude: 108.07408086955549,
        width: 20,
        height: 20,
        title: "牛亚博",
      },
      //食品院垃圾桶位置
      {
        id: 7,
        iconPath: "/images/delect.png",
        latitude: 34.288367488192435,
        longitude: 108.07558692991735,
        width: 20,
        height: 20,
        title: "牛亚博",
      },
      //动科楼垃圾桶位置
      {
        id: 8,
        iconPath: "/images/delect.png",
        latitude: 34.28487044889044,
        longitude: 108.07326279580593,
        width: 20,
        height: 20,
        title: "牛亚博",
      }
    ]
  },

  // 获取当前位置定位
  onLoad: function () {
    var that = this;
    wx.getLocation({
      type: "wgs84",
      success: function (res) {
        // var latitude = res.latitude;
        // var longitude = res.longitude;
        console.log(res);
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude,
          // markers: [{
          //   latitude: res.latitude,
          //   longitude: res.longitude
          // }]
        })
      }
    })
  },
  // 获取附近的共享
  // 周边搜索（圆形范围）
  onShow: function () {
    var that = this
    that.selectMarket()

    // var location = that.data.latitude + "," + that.data.longitude
    // console.log(location)
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
        CategoryType:"1",
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
            // wx.hideLoading()
            // this.setData({
            //     load: false
            // });
            return
          }
          let arr = [];
          res.data.response.content.forEach(mar => {
            // let d = new Date(item.target.create_time).getTime();
            // item.target.create_time = this.commentTimeHandle(d);
            // console.log(item.target.create_time)
            // if (item.target.images != "") {
            //   item.target.images = item.target.images.split(",");
            // }
            var item = [];
            item.id = mar.id,
            item.width = 30; //这个后端数据没反,就自己设置图标大小
            item.height = 35; //这个后端数据没反,就自己设置图标大小
            item.latitude = mar.latitude;
            item.longitude = mar.longitude;
            item.iconPath = '/images/delect.png';
            item.callout = {
                // color:'#ffffff',
                content: mar.title,
                fontSize: 12,
                borderRadius: 5,
                borderWidth: 1,
                bgColor: '#FFFFFFcc',
                // borderColor:"#rrrrrr",
                padding: 5,
                textAlign: 'center',
                display: "ALWAYS",
              },
              arr.push(item)
          })
          console.log(this.data.markers)

          console.log("---------")
          console.log(arr)
    var that = this

          that.setData({
            // circle_of_marget: that.data.circle_of_marget.concat(res.data.response.list),
            // pageSize: res.data.response.pageSize,
            // pageIndex: res.data.response.pageIndex,
            markers: arr,
          });
          console.log("---------")
          console.log(this.data.markers)
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
})