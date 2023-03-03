// index.js
const app = getApp()
const chooseLocation = requirePlugin('chooseLocation');
var COS = require('../../libs/cos-wx-sdk-v5.js')
var util = require('../../libs/util.js')
Page({
  data: {
    tab: 0,
    tabs: 0,
    item: 0,
    l_id: 0,
    navHeight: 100,
    location: "定位",
    time: '',
    chooseLocation: "", //位置
    banner: '',
    list: [{ //物品列表
        id: 0,
        avatar: '/images/shouye.png',
        nickName: 'MR.D',
        time: '2023年3月1日',
        location: '新乡学院D10',
        distance: '100M',
        title: "扩展屏",
        content: "DIY扩展屏，由14寸笔记本屏幕、主板、充电宝、微积木DIY拼成。",
        imgBox: ["https://img.vinua.cn/images/nSBX.jpeg", "https://img.vinua.cn/images/nE0b.jpeg"],
        price: '188',
        is_shouCang: true,
        phone: '18738388052',
        wx: 'dzg18738388052',
        qq: '1968210376'

      },
      {
        id: 1,
        avatar: '/images/shouye.png',
        nickName: 'MR.D',
        time: '2023年3月1日',
        location: '新乡学院D10',
        distance: '100M',
        title: "扩展屏",
        content: "DIY扩展屏，由14寸笔记本屏幕、主板、充电宝、微积木DIY拼成。",
        imgBox: ['/images/home.png', '/images/pengyouquan.png'],
        price: '188',
        is_shouCang: false,
        phone: '18738388052',
        wx: 'dzg18738388052',
        qq: '1968210376'
      },
      {
        id: 1,
        avatar: '/images/shouye.png',
        nickName: 'MR.D',
        time: '2023年3月1日',
        location: '新乡学院D10',
        distance: '100M',
        title: "扩展屏",
        content: "DIY扩展屏，由14寸笔记本屏幕、主板、充电宝、微积木DIY拼成。",
        imgBox: ['/images/home.png', '/images/pengyouquan.png'],
        price: '188',
        is_shouCang: false,
        phone: '18738388052',
        wx: 'dzg18738388052',
        qq: '1968210376'
      },
      {
        id: 1,
        avatar: '/images/shouye.png',
        nickName: 'MR.D',
        time: '2023年3月1日',
        location: '新乡学院D10',
        distance: '100M',
        title: "扩展屏",
        content: "DIY扩展屏，由14寸笔记本屏幕、主板、充电宝、微积木DIY拼成。",
        imgBox: ['/images/home.png', '/images/pengyouquan.png'],
        price: '188',
        is_shouCang: false,
        phone: '18738388052',
        wx: 'dzg18738388052',
        qq: '1968210376'
      },
      { //物品列表
        id: 0,
        avatar: '/images/shouye.png',
        nickName: 'MR.D',
        time: '2023年3月1日',
        location: '新乡学院D10',
        distance: '100M',
        title: "扩展屏",
        content: "DIY扩展屏，由14寸笔记本屏幕、主板、充电宝、微积木DIY拼成。",
        imgBox: ["https://img.vinua.cn/images/nSBX.jpeg", "https://img.vinua.cn/images/nE0b.jpeg"],
        price: '188',
        is_shouCang: true,
        phone: '18738388052',
        wx: 'dzg18738388052',
        qq: '1968210376'

      }, { //物品列表
        id: 0,
        avatar: '/images/shouye.png',
        nickName: 'MR.D',
        time: '2023年3月1日',
        location: '新乡学院D10',
        distance: '100M',
        title: "扩展屏",
        content: "DIY扩展屏，由14寸笔记本屏幕、主板、充电宝、微积木DIY拼成。",
        imgBox: ["https://img.vinua.cn/images/nSBX.jpeg", "https://img.vinua.cn/images/nE0b.jpeg"],
        price: '188',
        is_shouCang: true,
        phone: '18738388052',
        wx: 'dzg18738388052',
        qq: '1968210376'

      }, { //物品列表
        id: 0,
        avatar: '/images/shouye.png',
        nickName: 'MR.D',
        time: '2023年3月1日',
        location: '新乡学院D10',
        distance: '100M',
        title: "扩展屏",
        content: "DIY扩展屏，由14寸笔记本屏幕、主板、充电宝、微积木DIY拼成。",
        imgBox: ["https://img.vinua.cn/images/nSBX.jpeg", "https://img.vinua.cn/images/nE0b.jpeg"],
        price: '188',
        is_shouCang: true,
        phone: '18738388052',
        wx: 'dzg18738388052',
        qq: '1968210376'

      }, { //物品列表
        id: 0,
        avatar: '/images/shouye.png',
        nickName: 'MR.D',
        time: '2023年3月1日',
        location: '新乡学院D10',
        distance: '100M',
        title: "扩展屏",
        content: "DIY扩展屏，由14寸笔记本屏幕、主板、充电宝、微积木DIY拼成。",
        imgBox: ["https://img.vinua.cn/images/nSBX.jpeg", "https://img.vinua.cn/images/nE0b.jpeg"],
        price: '188',
        is_shouCang: true,
        phone: '18738388052',
        wx: 'dzg18738388052',
        qq: '1968210376'

      },
    ],
    lists: [{ //技能
        avatar: 'https://img.vinua.cn/images/VLmW.png',
        nickName: '海默之语',
        job: '前端开发工程师',
        price: '13050',
        tag: ['全职工作者', '协作开发者'],
        jineng: 'HTML5，CSS，JavaScript，Vue，Node.js，jQuery，TypeScript',
        zuopin: '龙源音乐，绿叶商城后台管理系统，秒选商城',
        star: "5",
        city: "上海",
        jingyan: '前端 3年',
        phone: '18738388052',
        wx: 'dzg18738388052',
        qq: '1968210376'
      }, {
        avatar: 'https://img.vinua.cn/images/V9CA.png',
        nickName: 'tinys',
        job: 'java高级开发',
        price: '17400',
        tag: ['全职自由工作者', '协作开发者'],
        jineng: 'springboot,Python，Mybatis，Java,MySQL,Redis,RabbitMQ',
        zuopin: '首农农业小程序，云乐汇小程序，惟视眼科',
        star: "5",
        city: "邢台",
        jingyan: 'Java 6年',
        phone: '18738388052',
        wx: 'dzg18738388052',
        qq: '1968210376'
      },
      { //技能
        avatar: 'https://img.vinua.cn/images/VLmW.png',
        nickName: '海默之语',
        job: '前端开发工程师',
        price: '13050',
        tag: ['全职工作者', '协作开发者'],
        jineng: 'HTML5，CSS，JavaScript，Vue，Node.js，jQuery，TypeScript',
        zuopin: '龙源音乐，绿叶商城后台管理系统，秒选商城',
        star: "5",
        city: "上海",
        jingyan: '前端 3年',
        phone: '18738388052',
        wx: 'dzg18738388052',
        qq: '1968210376'
      }, {
        avatar: 'https://img.vinua.cn/images/V9CA.png',
        nickName: 'tinys',
        job: 'java高级开发',
        price: '17400',
        tag: ['全职自由工作者', '协作开发者'],
        jineng: 'springboot,Python，Mybatis，Java,MySQL,Redis,RabbitMQ',
        zuopin: '首农农业小程序，云乐汇小程序，惟视眼科',
        star: "5",
        city: "邢台",
        jingyan: 'Java 6年',
        phone: '18738388052',
        wx: 'dzg18738388052',
        qq: '1968210376'
      },
      { //技能
        avatar: 'https://img.vinua.cn/images/VLmW.png',
        nickName: '海默之语',
        job: '前端开发工程师',
        price: '13050',
        tag: ['全职工作者', '协作开发者'],
        jineng: 'HTML5，CSS，JavaScript，Vue，Node.js，jQuery，TypeScript',
        zuopin: '龙源音乐，绿叶商城后台管理系统，秒选商城',
        star: "5",
        city: "上海",
        jingyan: '前端 3年',
        phone: '18738388052',
        wx: 'dzg18738388052',
        qq: '1968210376'
      }, {
        avatar: 'https://img.vinua.cn/images/V9CA.png',
        nickName: 'tinys',
        job: 'java高级开发',
        price: '17400',
        tag: ['全职自由工作者', '协作开发者'],
        jineng: 'springboot,Python，Mybatis，Java,MySQL,Redis,RabbitMQ',
        zuopin: '首农农业小程序，云乐汇小程序，惟视眼科',
        star: "5",
        city: "邢台",
        jingyan: 'Java 6年',
        phone: '18738388052',
        wx: 'dzg18738388052',
        qq: '1968210376'
      },
      { //技能
        avatar: 'https://img.vinua.cn/images/VLmW.png',
        nickName: '海默之语',
        job: '前端开发工程师',
        price: '13050',
        tag: ['全职工作者', '协作开发者'],
        jineng: 'HTML5，CSS，JavaScript，Vue，Node.js，jQuery，TypeScript',
        zuopin: '龙源音乐，绿叶商城后台管理系统，秒选商城',
        star: "5",
        city: "上海",
        jingyan: '前端 3年',
        phone: '18738388052',
        wx: 'dzg18738388052',
        qq: '1968210376'
      }, {
        avatar: 'https://img.vinua.cn/images/V9CA.png',
        nickName: 'tinys',
        job: 'java高级开发',
        price: '17400',
        tag: ['全职自由工作者', '协作开发者'],
        jineng: 'springboot,Python，Mybatis，Java,MySQL,Redis,RabbitMQ',
        zuopin: '首农农业小程序，云乐汇小程序，惟视眼科',
        star: "5",
        city: "邢台",
        jingyan: 'Java 6年',
        phone: '18738388052',
        wx: 'dzg18738388052',
        qq: '1968210376'
      },

    ],
    listss: [{
        avatar: 'https://img.vinua.cn/images/VLmW.png',
        nickName: '海默之语',
        job: '前端开发工程师',
        xvqiu: ['JavaScript', 'Vue', 'Node.js', 'jQuery', 'TypseScript', '2-3年经验', '一个月'],
        gongsi: '杭州势然网络科技有限公司',
        price: '￥1-6k/月',
        phone: '18738388052',
        wx: 'dzg18738388052',
        qq: '1968210376'
      },
      {
        avatar: 'https://img.vinua.cn/images/VLmW.png',
        nickName: '海默之语',
        job: '前端开发工程师',
        xvqiu: ['JavaScript', 'Vue', 'Node.js', 'jQuery', 'TypseScript', '2-3年经验', '一个月'],
        gongsi: '杭州势然网络科技有限公司',
        price: '￥1-6k/月',
        phone: '18738388052',
        wx: 'dzg18738388052',
        qq: '1968210376'
      },
      {
        avatar: 'https://img.vinua.cn/images/VLmW.png',
        nickName: '海默之语',
        job: '前端开发工程师',
        xvqiu: ['JavaScript', 'Vue', 'Node.js', 'jQuery', 'TypseScript', '2-3年经验', '一个月'],
        gongsi: '杭州势然网络科技有限公司',
        price: '￥1-6k/月',
        phone: '18738388052',
        wx: 'dzg18738388052',
        qq: '1968210376'
      },
      {
        avatar: 'https://img.vinua.cn/images/VLmW.png',
        nickName: '海默之语',
        job: '前端开发工程师',
        xvqiu: ['JavaScript', 'Vue', 'Node.js', 'jQuery', 'TypseScript', '2-3年经验', '一个月'],
        gongsi: '杭州势然网络科技有限公司',
        price: '￥1-6k/月',
        phone: '18738388052',
        wx: 'dzg18738388052',
        qq: '1968210376'
      },
      {
        avatar: 'https://img.vinua.cn/images/VLmW.png',
        nickName: '海默之语',
        job: '前端开发工程师',
        xvqiu: ['JavaScript', 'Vue', 'Node.js', 'jQuery', 'TypseScript', '2-3年经验', '一个月'],
        gongsi: '杭州势然网络科技有限公司',
        price: '￥1-6k/月',
        phone: '18738388052',
        wx: 'dzg18738388052',
        qq: '1968210376'
      },

    ]
  },
  changeTab: function (e) {
    // console.log(e);
    this.setData({
      tab: e.target.dataset.item
    })
  },
  changeTabs: function (e) {
    // console.log(e);
    this.setData({
      tabs: e.detail.current
    })
  },
  changeItem(e) {
    // console.log(e);
    this.setData({
      item: e.target.dataset.item
    })
  },
  search(e) {
    wx.showToast({
      title: '搜索' + e.detail.value,
    })
  },
  add() {
    // console.log('1');
    wx.reLaunch({
      url: '/pages/add/add',
    })
  },
  is_shouCang(e) {
    var i = e.target.dataset.item
    var is = this.data.list[i].is_shouCang
    var liNo = this.data.list[i]
    console.log(is);
    is = !is
    console.log(this.data.list[i].is_shouCang);
  },
  time() {
    var today = new Date()
    var YY = today.getFullYear()
    var MM = today.getMonth() + 1
    var DD = today.getDate()
    var RR = today.getDay()
    var hh = today.getHours()
    var mm = today.getMinutes()
    var ss = today.getSeconds()
    var time = YY + '年' + MM + '月' + DD + '日'
    this.setData({
      time: time
    })
    // console.log(time);
  },
  location() {
    // 获取用户地理位置
    wx.getLocation({
      type: 'wgs84',
      success(res) {
        const latitude = res.latitude
        const longitude = res.longitude
        const speed = res.speed
        const accuracy = res.accuracy
        console.log(res);
      },
    })
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
          vm.getLocation();
        } else {
          //调用wx.getLocation的API
          vm.getLocation();
        }
      }
    })
  },

  // 微信选择位置 调用API 定位当前位置 获取坐标
  getLocation: function () {
    // const key = 'YPJBZ-3VICP-OYWDV-VQDUT-FCI7J-MPFYK'; //使用在腾讯位置服务申请的key
    // const referer = 'wx789e5aabeb07bfef'; //调用插件的app的名称
    const key = 'PMWBZ-KDRLX-H3C4C-ZAH36-WB2YT-GYBN5'; //使用在腾讯位置服务申请的key
    const referer = 'wx6d3c8ce12b2a4f0c'; //调用插件的app的名称
    wx.navigateTo({
      url: 'plugin://chooseLocation/index?key=' + key + '&referer=' + referer
    });

    //选择地址
    //  let that = this;
    //  wx.chooseLocation({
    //   success: function(res) {
    //     console.info(res);
    //     that.setData({
    //       chooseLocation: res,
    //     })
    //   },
    // })
  },
  banner() { //轮播图
    var that = this
    wx.request({
      url: app.globalData.serverApi + '/selectAllBanner',
      method: 'POST',
      success(res) {
        console.log('lunbo:', res.data.response);
        that.setData({
          banner: res.data.response
        })
      }
    })
  },
  // 跳转物品详情页
  wupin_detail(e) {
    console.log(e);
    var info = this.data.list[e.currentTarget.dataset.id]
    console.log(info);
    info = JSON.stringify(info)
    wx.navigateTo({
      url: '/pages/wupin_detail/index?info=' + info,
      success: (result) => {},
      fail: (res) => {},
      complete: (res) => {},
    })
  },
  jineng_detail(e) {
    console.log(e);
    var info = this.data.lists[e.currentTarget.dataset.id]
    console.log(info);
    info = JSON.stringify(info)
    wx.navigateTo({
      url: '/pages/jineng_detail/index?info=' + info,
      success: (result) => {},
      fail: (res) => {},
      complete: (res) => {},
    })
  },
  xvqiu_detail(e) {
    console.log(e);
    var info = this.data.listss[e.currentTarget.dataset.id]
    console.log(info);
    info = JSON.stringify(info)
    wx.navigateTo({
      url: '/pages/xvqiu_detail/index?info=' + info,
      success: (result) => {},
      fail: (res) => {},
      complete: (res) => {},
    })
  },
  onLoad() {
    this.time()
    this.location()
    this.setData({
      navHeight: app.globalData.navHeight,
    })
  },
  onShow() {
    // 从地图选点插件返回后，在页面的onShow生命周期函数中能够调用插件接口，取得选点结果对象
    let location = chooseLocation.getLocation(); // 如果点击确认选点按钮，则返回选点结果对象，否则返回null
    console.log("location133:", location)
    // console.log("location144:", location.name)
    let that = this;
    // JSON.stringify(location)
    // JSON.parse(location)
    this.setData({
      chooseLocation: location,
    })
    if (location) {
      this.setData({
        location: location.district
      })
    }
    this.banner()

  }
})