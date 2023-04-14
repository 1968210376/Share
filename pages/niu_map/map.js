// var QQMapWX = require('../../libs/qqmap-wx-jssdk.min.js')
const util = require("../../libs/util")
const app = getApp()
Page({
  data: {
    latitude: 35.30351, //默认定位纬度
    longitude: 113.87523, //默认定位经度
    scale: 14,
    markers: [],
    flag: true,
    animation: false,
    info: '',
  },
  onReady: function (e) {
    this.mapCtx = wx.createMapContext('map')
  },
  onLoad: function () {
    // 获取当前位置信息定位
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
    // console.log(that.data.latitude, that.data.longitude)
    wx.request({
      url: app.globalData.serverApi + '/selectMarket',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        wxOpenId: userInfo.wxOpenId,
        CategoryType: "",
        title: "",
        publictiy: 1,
        latitude: that.data.latitude,
        longitude: that.data.longitude,
        pageIndex: 0,
        pageSize: 20,
        status: 1
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        // console.log("selectmarket===>res");
        // console.log(res);
        if (res.data.code == 1) {
          var list = res.data.response.content
          let arr = [];
          var length = list.length
          list.forEach((mar, list) => {
            if (mar.target.images != "" && mar.target.images != null) {
              mar.target.images = mar.target.images.split(",");
            }
            if (mar.target.choose_location != null && mar.target.choose_location != "") {
              mar.target.choose_location = JSON.parse(mar.target.choose_location);
            }
            // console.log(that.data.latitude, that.data.longitude)
            // 调用 return的距离单位为km
            let aaa = app.GetDistance(that.data.latitude, that.data.longitude, mar.target.latitude, mar.target.longitude);
            aaa = aaa >= 1 ? (aaa.toFixed(1) + "km") : ((aaa * 1000).toFixed(0) + "m");
            // console.log(aaa>=1?(aaa+"km"):(aaa*1000/10+"m"));
            var item = {};
            // item.juli = aaa;
            item.id = mar.target.id;
            item.width = 38;
            item.height = 38;
            item.latitude = mar.target.latitude;
            item.longitude = mar.target.longitude;
            // item.iconPath = mar.target.avatar_url;
            // item.iconPath = mar.target.images != "" && mar.target.images != null ? mar.target.images[0]:mar.target.avatar_url;
            item.alpha = 0.8; //透明度 0-1 
            //   title: "牛亚博",
            // item.callout = {
            //     // color: '#000000 ',
            //     // color: '#ff6666 ',
            //     // borderColor: "#ff6666",
            //     content: (mar.target.title.length > 10 ? mar.target.title.substr(0, 10) + "..." : mar.target.title) + "￥:" + mar.target.pirce,
            //     fontSize: 12,
            //     borderRadius: 5,
            //     borderWidth: 1,
            //     bgColor: '#ffffffff',
            //     // bgColor: '#00ffff00',
            //     width: 1,
            //     // borderColor: "#ff0000",
            //     // borderColor: "#00ff00",
            //     padding: 8,
            //     textAlign: 'center',
            //     display: "ALWAYS",
            //   },
            // if(Math.random()*length<3){
            item.iconPath = mar.target.avatar_url;
            item.customCallout = {
              // content:999,
              color: '#ff6666 ',
              content: (mar.target.title.length > 20 ? mar.target.title.substr(0, 20) + "..." : mar.target.title),
              price: "￥" + mar.target.pirce,
              image: mar.target.images != "" && mar.target.images != null ? mar.target.images[0] : "",
              fontSize: 14,
              borderRadius: 5,
              borderWidth: 1,
              bgColor: '#ffffffff',
              // bgColor: '#00ffff00',
              width: 1,
              // borderColor: "#ff0000",
              // borderColor: "#00ff00",
              borderColor: "#ff6666",
              padding: 8,
              textAlign: 'center',
              display: "ALWAYS",
            }
            // }
            arr.push(item)
          })
          that.setData({
            markers: arr,
          })
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
  onChangeRegion: function (e) {
    var that = this
    // console.log(e)
    // if (e.type == 'begin') {
    //   that.setData({
    //     flag: false
    //   })
    // }
    if (e.type == 'end' && e.causedBy === 'drag') {
      this.mapCtx.getCenterLocation({
        success: function (res) {
          // 解决拖动地图执行三次该方法 导致的多次查询周边信息
          if (that.data.longitude == res.longitude || that.data.latitude == res.latitude) {
            return
          }
          that.setData({
            longitude: res.longitude,
            latitude: res.latitude,
            animation: true,
            flag: true
          })
          // 获取周边信息
          that.selectMarket()
        }
      })
    }
  },
  onMarkerAnimationend() {
    this.setData({
      animation: false
    });
  },
  // 点击目标 回到初始位置 即刷新页面
  controltap: function () {
    var that = this
    // that.mapCtx.moveToLocation()
    // this.getMyLocation()
    that.setData({
      longitude: wx.getStorageSync('longitude'),
      latitude: wx.getStorageSync('latitude'),
      scale: 14
    })
    that.onShow()
  },

  // 点击共享进入详情页面
  // 点击标记点时触发
  markertap: function (res) {
    // marker.addEventListener("dragend", function () {
    //   var me = this;
    //   attribute(dragFlag, this)
    // });
    // console.log("点击了标记点")
    // console.log(res)
    // console.log(res.markerId)
    this.to_wupin_detail(res.markerId)
  },
  // 点击气泡时触发
  bindcallouttap: function (res) {
    // console.log("res",res)
    // console.log(res.markerId)
    // if (!this.data.flag) {
    //   console.log("false")
    // } else {
    //   this.to_wupin_detail(res.markerId)
    //   // console.log("true")
    // }
    // this.setData({
    //   flag: true
    // })
    this.to_wupin_detail(res.markerId)
  },
  // 根据id进入详情页
  async to_wupin_detail(e) {
    var that = this
    let info = await that.selctmarketid(e)
    // console.log("info-----", that.data.info);
  },
  selctmarketid: function (e) {
    var that = this
    //console.log("+++555+++++");
    // 根据id查询信息
    return new Promise((resolve) => {
      wx.request({
        url: app.globalData.serverApi + '/selectMarket',
        method: 'POST',
        data: {
          id: e,
          wxOpenId: wx.getStorageSync('openid'),
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success(res) {
          resolve(res.data.response.content[0])
          // console.log("------------------");
          // console.log(res.data);
          if (res.data.response.content) {
            res.data.response.content.forEach(item => {
              let d = new Date(item.target.create_time).getTime();
              item.target.create_time = util.commentTimeHandle(d);
              // if (item.target.images != "") {
              if (item.target.images != "" && item.target.images != null) {
                item.target.images = item.target.images.split(",");
                item.target.choose_location = JSON.parse(item.target.choose_location);
              }
            })
            let info = res.data.response.content[0]
            let url
            let type = res.data.response.content[0].target.category_type
            type <= 5 ? url = 'wupin' : (type <= 9 ? url = 'jineng' : url = 'xvqiu')
            // console.log(url);
            info = JSON.stringify(info)
            wx.navigateTo({
              url: "/pages/" + url + "_detail/index?info=" + info
            })
          } else {
            console.log(res);
          }
        }
      })
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
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


  // get: function () {
  //   wx.getLocation({
  //     type: 'wgs84',
  //     success: function (res) {
  //       console.log('纬度' + res.latitude)
  //       console.log('经度' + res.longitude)
  //       console.log(JSON.stringify(res))
  //       var latitude = res.latitude
  //       var longitude = res.longitude
  //       var speed = res.speed
  //       var accuracy = res.accuracy;
  //       vm.getLocal(latitude, longitude)
  //     }
  //   })
  // },
  // // 周边搜索（圆形范围）
  // shousuo: function () {
  //   // wx.request({
  //   //   url: 'https://apis.map.qq.com/place_cloud/search/nearby',
  //   //   // url:'&filter=x.price>18 and x.price<=20 and x.star>=3&orderby=x.price desc',
  //   //   method: 'GET',
  //   //   data: {
  //   //     table_id: '0o_YuzfKv09CC36Lv1',
  //   //     key: 'PMWBZ-KDRLX-H3C4C-ZAH36-WB2YT-GYBN5',
  //   //     // location: '35.30351,113.87523',
  //   //     location: location,
  //   //     radius: 10000, //半径，单位：米，默认5,000米，最大支持10,000米
  //   //     auto_extend: 1,
  //   //     // keyword:"车",
  //   //     // chooseLocation: JSON.stringify(that.data.chooseLocation == null ? "" : that.data.chooseLocation),
  //   //   },
  //   //   success: (res) => {
  //   //     console.log(res);
  //   //     let list = res.data.result.data;
  //   //     let arr = [];

  //   //     list.forEach((item, list) => {
  //   //       item.width = 30; //这个后端数据没反,就自己设置图标大小
  //   //       item.height = 35; //这个后端数据没反,就自己设置图标大小
  //   //       item.latitude = item.location.lat;
  //   //       item.longitude = item.location.lng;
  //   //       item.iconPath = '/images/delect.png';
  //   //       item.callout = {
  //   //           // color:'#ffffff',
  //   //           content: '气泡内容',
  //   //           fontSize: 12,
  //   //           borderRadius: 5,
  //   //           borderWidth: 1,
  //   //           bgColor: '#FFFFFFcc',
  //   //           // borderColor:"#rrrrrr",
  //   //           padding: 5,
  //   //           textAlign: 'center',
  //   //           display: "ALWAYS",
  //   //         },
  //   //         arr.push(item)
  //   //     })
  //   //     let that = this
  //   //     that.setData({
  //   //       markers: arr,
  //   //     })
  //   //     console.log(that.data.markers)
  //   //   },
  //   //   fail: res => {
  //   //     wx.showToast({
  //   //       title: "失败",
  //   //     })
  //   //   }
  //   // })
  // },

})