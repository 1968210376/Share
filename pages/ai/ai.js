// pages/ai/ai.js
const CryptoJS = require("crypto-js.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    app_id: '63fc25fc',
    APIKey: '9e237c43eef519095a77df9d61abc4a7',
    APISecret: 'YzcyMTVlMzM4MDBhMTVjNGVhNDc0OTMz',
    chatList: [],
    content: '',
    userinfo: '',
    tempRes: '', // 临时答复保存
    sparkResult: '',
    userMessage: '',
    status: false
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.connectWebsocket()
    this.setData({
      userinfo: wx.getStorageSync('userInfo')
    })
  },
  //鉴权
  getWebsocketUrl() {
    return new Promise((resolve, reject) => {
      // var APISecret = this.data.APISecret
      // var APIKey = this.data.APIKey
      var url = "wss://spark-api.xf-yun.com/v2.1/chat";
      var host = "spark-api.xf-yun.com";
      var apiKeyName = "api_key";
      var date = new Date().toGMTString();
      var algorithm = "hmac-sha256";
      var headers = "host date request-line";
      var signatureOrigin = "host: ".concat(host, "\ndate: ").concat(date, "\nGET /v2.1/chat HTTP/1.1");
      var signatureSha = CryptoJS.HmacSHA256(signatureOrigin, this.data.APISecret);
      var signature = CryptoJS.enc.Base64.stringify(signatureSha);
      var authorizationOrigin = "".concat(apiKeyName, "=\"").concat(this.data.APIKey, "\", algorithm=\"").concat(algorithm, "\", headers=\"").concat(headers, "\", signature=\"").concat(signature, "\"");
      var authorization = weBtoa(authorizationOrigin);
      url = "".concat(url, "?authorization=").concat(authorization, "&date=").concat(encodeURI(date), "&host=").concat(host);
      console.log(url);
      resolve(url)
    })

    function weBtoa(string) {
      var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
      string = String(string);
      var bitmap, a, b, c, result = "",
        i = 0,
        rest = string.length % 3;
      for (; i < string.length;) {
        if ((a = string.charCodeAt(i++)) > 255 ||
          (b = string.charCodeAt(i++)) > 255 ||
          (c = string.charCodeAt(i++)) > 255)
          throw new TypeError("Failed to execute 'btoa' on 'Window': The string to be encoded contains characters outside of the Latin1 range.");
        bitmap = (a << 16) | (b << 8) | c;
        result += b64.charAt(bitmap >> 18 & 63) + b64.charAt(bitmap >> 12 & 63) +
          b64.charAt(bitmap >> 6 & 63) + b64.charAt(bitmap & 63);
      }
      return rest ? result.slice(0, rest - 3) + "===".substring(rest) : result;
    };
  },

  // 链接websocket
  connectWebsocket() {
    // wx.showLoading({
    //   title: '正在与母星建立连接。。。',
    // })
    var _this = this;

    this.getWebsocketUrl().then(res => {
      wx.connectSocket({
        url: res,
        method: "GET",
        header: {
          'content-type': 'application/json'
        },
        // protocols: ['protocol1'],
        success(res) {
          console.log('连接成功', res)

        },
        fail(err) {
          console.log(err, "出错了")
        }
      });

      wx.onSocketOpen(function () {
        console.log('WebSocket 已连接')
        _this.setData({
          status: true
        })
        // wx.hideLoading()
      })

      wx.onSocketMessage(function (res) {
        // console.log('收到服务器内容：')
        // console.log(res.data)

        console.log('收到API返回的内容：', res.data);
        var obj = JSON.parse(res.data);
        // console.log("我打印的"+obj.payload);
        var dataArray = obj.payload.choices.text;

        for (var i = 0; i < dataArray.length; i++) {
          _this.data.sparkResult = _this.data.sparkResult + dataArray[i].content;
          _this.data.tempRes = _this.data.tempRes + dataArray[i].content;
        }
        // _this.data.sparkResult =_this.data.sparkResult+ 
        var temp = JSON.parse(res.data);
        // console.log("0726",temp.header.code)
        if (temp.header.code !== 0) {
          console.log("".concat(temp.header.code, ":").concat(temp.message));
          wx.closeSocket()
        }
        if (temp.header.code === 0) {
          if (res.data && temp.header.status === 2) {
            _this.data.sparkResult = _this.data.sparkResult + "\r\n**********************************************";
            _this.data.chatList.push({
              "role": "assistant",
              "content": _this.data.tempRes
            })
            _this.setData({
              chatList: _this.data.chatList
            })
            wx.hideLoading()
            _this.data.sparkResult = ''
            _this.data.tempRes = ''
            _this.data.chatList.forEach((i) => {
              console.log(i);
            })
            /* let dataArray= obj.payload.choices.text;
            for(let i=0;i<dataArray.length;i++){
              _this.data.sparkResult =_this.data.sparkResult+ dataArray[i].content
            } */
            // setTimeout(function () {
            //   wx.closeSocket()
            // }, 1000);
          }
        }

      })
      wx.onSocketError(function (res) {
        console.log(res, "出错了")
      })
      wx.onSocketClose((res) => {
        console.log(res, "连接关闭了")
        if (_this.data.status) {
          _this.connectWebsocket()
        }
      })
    }).catch(err => {})
  },
  sendMessage() {
    if (this.data.content == "") {
      wx.showToast({
        title: '请输入您的问题',
        icon: 'error'
      })
    }
    wx.showLoading({
      title: '正在与母星通信。。。',
    })
    // if (!this.data.status) {
    //   this.onLoad()
    // }
    var params = {
      "header": {
        "app_id": this.data.app_id,
        // "u_id": "aef9f963-7"
      },
      "parameter": {
        "chat": {
          "domain": "generalv2",
          "temperature": 0.5,
          "max_tokens": 1024
        }
      },
      "payload": {
        "message": {
          "text": this.data.chatList
        }
      }
    }
    wx.sendSocketMessage({
      data: JSON.stringify(params)
    })
    this.data.chatList.forEach((i) => {
      console.log(i);
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  saveContent(e) {
    this.setData({
      content: e.detail.value
    })
    this.data.chatList.push({
      role: 'user',
      content: this.data.content
    })
    console.log(e.detail.value, this.data.content);
  },
  cleanInput() {
    var setMessage = {
      content: this.data.userMessage
    }
    this.setData(setMessage)
  },
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
    wx.closeSocket()
    console.log('页面关闭了');
    this.setData({
      status: false
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