// pages/niu_my_edit_information/index.js
const app = getApp()
var COS = require('../../libs/cos-wx-sdk-v5.js')
var util = require('../../libs/util.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    nickName: "",
    avatarUrl: '/images/0.png',
    hiddenmodalputnickName: true, //可以通过hidden是否掩藏弹出框的属性，来指定那个弹出框
    fileIDs: [], //上传云存储后的返回值
    indexstatus: 0, //默认显示1
    hideModal: true, //模态框的状态  true-隐藏  false-显示
    animationData: {}, //
    gender: 0,
    sex: "请选择性别",
    sexList: [
      '请选择性别', '男', '女', //1男 2女
    ],
    phone: '',
    contact_qq: '',
    contact_wx: '',
    showModal: true, //模态框的状态  true-隐藏  false-显示
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 从本地获取个人信息
    var user = wx.getStorageSync('userInfo');
    // console.log("userInfo:" + userInfo)
    // var user = app.globalData.userInfo;
    // console.log("获取本地userInfo:", user);
    let that = this
    if (user) {
      this.setData({
        sex: that.data.sexList[user.gender],
        gender: user.gender != null ? user.gender : that.data.gender,
        nickName: that.data.nickName != null ? user.nickName : that.data.nickName,
        avatarUrl: user.avatarUrl != null ? user.avatarUrl : that.data.avatarUrl,
        phone: that.data.phone != null ? user.phone : that.data.phone,
        contact_qq: that.data.contact_qq != null ? user.contact_qq : that.data.contact_qq,
        contact_wx: that.data.contact_wx != null ? user.contact_wx : that.data.contact_wx,

      })
    }
  },

  // 保存头像 获取临时路径 保存本地
  onChooseAvatar(e) {
    const {
      avatarUrl
    } = e.detail
    this.setData({
      avatarUrl,
    })
    // console.log("头像信息的临时路径：" + avatarUrl)
    // 保存到本地
    var userInfo = wx.getStorageSync('userInfo');
    userInfo.avatarUrl = this.data.avatarUrl
    app.globalData.userInfo = userInfo
    wx.setStorageSync('userInfo', userInfo)
    // 保存到数据库
    // this.saveupdataniuuser(userInfo);
    this.add_COSfileImages();

  },
  // 文件图片上传腾讯对象存储COS
  add_COSfileImages: function (e) {
    var userInfo = wx.getStorageSync('userInfo');
    var avatarUrl = userInfo.avatarUrl
    wx.showLoading({
      title: '上传中',
    })
    var cos = new COS({
      SecretId: 'AKIDrb9SYPbMn1zmOno25EGcpnW8VgnpdFsN',
      SecretKey: 'TrCsPO7artiKo37wWrwmOuAE8rLchWCm',
    });
    var that = this
    let suffix = /\.\w+$/.exec(avatarUrl); //正则表达式返回文件的扩展名
    // console.log("item:", avatarUrl);
    // console.log("suffix:", suffix);
    var filePath = avatarUrl;
    // var filename = filePath.substr(filePath.lastIndexOf('/') + 1);
    // 获取时间作为文件夹名
    var time = util.dateFormat(new Date(), "YMD");
    // console.log("时间：", time);
    // console.log("随机：", Math.random().toString())
    var filename = Number(Math.random().toString().substr(3, 6) + new Date().getTime()).toString(36) + suffix;
    // console.log("filename:", filename)
    cos.postObject({
      Bucket: 'niuyabo-1257122371',
      Region: 'ap-chengdu',
      Key: 'xiaochengxu/touxiang/' + time + '/' + filename,
      FilePath: filePath,
      onProgress: function (info) {
        console.log(JSON.stringify(info));
      }
    }, function (err, data) {
      // console.log(err || data);
      // console.log("data:", data);
      // console.log("err:", err);
      // json = JSON.parse(info)
      var res = data;
      // console.log(JSON.stringify(info).Location)
      res = res.Location;
      var fileID = "http://" + res;
      // console.log("fileID:", fileID);
      that.setData({
        fileIDs: that.data.fileIDs.concat(fileID)
      })
      // console.log("fileIDs:", that.data.fileIDs) //输出上传后图片的返回地址
      wx.hideLoading();
      wx.showToast({
        title: "上传成功",
      })
      var userInfo = wx.getStorageSync('userInfo');
      userInfo.avatarUrl = fileID
      app.globalData.userInfo = userInfo
      wx.setStorageSync('userInfo', userInfo)
      // 保存到数据库
      that.saveupdataniuuser(userInfo);
    });
  },

  // 把userinfo信息保存到数据库
  saveupdataniuuser: function (userInfo) {
    // 保存到数据库
    var userInfo = wx.getStorageSync('userInfo');
    // console.log(userInfo.wxOpenId);
    wx.request({
      url: app.globalData.serverApi + '/updataniuuser',
      method: 'POST',
      data: {
        wxOpenId: userInfo.wxOpenId,
        nickName: userInfo.nickName,
        gender: userInfo.gender,
        avatarUrl: userInfo.avatarUrl,
        phone: userInfo.phone,
        contact_qq: userInfo.contact_qq,
        contact_wx: userInfo.contact_wx

      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        wx.showToast({
          title: '提交成功！',
        })
        // console.log("saveupdataniuuser===>res");
        // console.log(res);
      }
    })
  },

  //昵称确认 保存本地
  confirm: function (e) {
    // console.log(e);
    let that = this
    this.setData({
      hiddenmodalputnickName: true,
    })
    // console.log("昵称：" + that.data.nickName);
    setTimeout(function () {
      that.setData({
        nickName: that.data.nickName,
      })
    }, 200);
    // 保存到本地
    var userInfo = wx.getStorageSync('userInfo');
    userInfo.nickName = that.data.nickName
    app.globalData.userInfo = userInfo
    wx.setStorageSync('userInfo', userInfo)
    // 保存到数据库
    this.saveupdataniuuser(userInfo);
  },

  // 性别 隐藏遮罩层 点击确定获取点击其他地方 保存本地
  hideModal: function () {
    var that = this;
    var animation = wx.createAnimation({
      duration: 100, //动画的持续时间 默认400ms   数值越大，动画越慢   数值越小，动画越快
      timingFunction: 'ease', //动画的效果 默认值是linear
    })
    this.animation = animation
    that.fadeDown(); //调用隐藏动画   
    setTimeout(function () {
      that.setData({
        hideModal: true
      })
    }, 100) //先执行下滑动画，再隐藏模块
    // 保存到本地
    var userInfo = wx.getStorageSync('userInfo');
    userInfo.gender = that.data.gender
    app.globalData.userInfo = userInfo
    wx.setStorageSync('userInfo', userInfo)
    // console.log("niu_my_edit_info==>userInfo")
    // console.log(userInfo)
    // 保存到数据库
    that.saveupdataniuuser(userInfo);
  },

  // 选择性别
  modalinputgender(e) {
    // console.log(e)
    // console.log("选择的性别是：")
    // console.log(e.currentTarget.dataset.dialogid)
    let that = this
    let dialogid = e.currentTarget.dataset.dialogid;
    // console.log(that.data.sexList[dialogid])
    this.setData({
      sex: that.data.sexList[dialogid], //赋值给输入框
      indexstatus: dialogid, //更新
      gender: dialogid
    })
  },

  //昵称点击按钮指定的hiddenmodalput弹出框
  modalinputnickName: function () {
    this.setData({
      hiddenmodalputnickName: !this.data.hiddenmodalputnickName
    })
  },

  //昵称输入框取消按钮
  cancel: function () {
    this.setData({
      hiddenmodalputnickName: true
    });
  },

  //昵称输入框光标失去焦点触发保存局域
  setToName: function (e) {
    // console.log("输入内容===>" + e.detail.value);
    // var that=this
    this.data.nickName = e.detail.value
    // console.log("输入的修改昵称===》" + e.detail.value)
    // this.setData({
    //     nickName: e.detail.value,
    // })
  },

  // 性别 显示遮罩层
  showModal: function () {
    var that = this;
    that.setData({
      hideModal: false,
      sex: that.data.sexList[that.data.gender],
    })
    var animation = wx.createAnimation({
      duration: 100, //动画的持续时间 默认400ms   数值越大，动画越慢   数值越小，动画越快
      timingFunction: 'ease', //动画的效果 默认值是linear
    })
    this.animation = animation
    setTimeout(function () {
      that.fadeIn(); //调用显示动画
    }, 100)
  },

  //昵称 动画集
  fadeIn: function () {
    this.animation.translateY(0).step()
    this.setData({
      animationData: this.animation.export() //动画实例的export方法导出动画数据传递给组件的animation属性
    })
  },

  // 昵称隐藏动画
  fadeDown: function () {
    this.animation.translateY(600).step()
    this.setData({
      animationData: this.animation.export(),
    })
  },
  model: function () {
    var that = this;
    that.setData({
      showModal: false
    })
  },

  //联系方式输入框取消按钮
  cancels: function () {
    this.setData({
      showModal: true
    });
  },
  //联系方式确认 保存本地
  confirms: function (e) {
    let that = this
    if (that.data.phone != "" && that.data.phone != 'undefined' && that.data.phone !=null) {
      // console.log(e);
      that.setData({
        showModal: true,
      })
      console.log("联系方式 phone:" + that.data.phone, "contact_qq:", that.data.contact_qq, "contact_wx:", that.data.contact_wx);
      var userInfo = wx.getStorageSync('userInfo');
      userInfo.phone = that.data.phone
      userInfo.contact_qq = that.data.contact_qq
      userInfo.contact_wx = that.data.contact_wx
      app.globalData.userInfo = userInfo
      wx.setStorageSync('userInfo', userInfo)
      // 保存到数据库
      this.saveupdataniuuser(userInfo);
    }else{
      that.setData({
        showModal: true,
      })
      wx.showToast({
        icon:'none',
        title: '手机号不能为空',
      })
    }
  },
  //手机号输入框光标失去焦点触发保存局域
  setToPhone: function (e) {
    // console.log("输入内容===>" + e.detail.value);
    // var that=this
    if (e.detail.value !== '') {
      this.setData({
        phone: e.detail.value
      })
      console.log("输入的手机号===》" + e.detail.value)
    } else {
      wx.showToast({
        title: '手机号不能为空',
      })
    }
    // this.setData({
    //     nickName: e.detail.value,
    // })
  },
  //qq号输入框光标失去焦点触发保存局域
  setToQQ: function (e) {
    // console.log("输入内容===>" + e.detail.value);
    // var that=this
    this.setData({
      contact_qq: e.detail.value
    })

  },
  //wx号输入框光标失去焦点触发保存局域
  setToWx: function (e) {
    // console.log("输入内容===>" + e.detail.value);
    // var that=this
    this.setData({
      contact_wx: e.detail.value
    })
    // console.log("输入的微信号===》" + e.detail.value)
  
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})