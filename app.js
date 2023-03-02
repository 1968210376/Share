// app.js
App({
  globalData: {
    userInfo: null,
    openid: null,
    serverApi: "http://172.16.3.52:8080/wx/api", //内网穿透测试
  },
  //  初始化的时候执行
  onLaunch: function () {
    if (this.globalData.userInfo == null) {
      this.getwxopenid();
    }
  },
  // 获取用户openid 和个人信息保存缓存和全局变量
  getwxopenid: function () {
    //获取openId（需要code来换取）这是用户的唯一标识符
    wx.login({
      success: (res) => {
        let code = res.code
        console.log("获取code：",res);
        // 通过code换取openId
        wx.request({
          url: this.globalData.serverApi + '/logingetopenid/' + code,
          method: 'POST',
          success: (res) => {
            // console.log(res.data);
            if (res.data.code == 0) {
              console.log(res.data.message);
            }
            let openid = res.data.response.wxOpenId
            if (openid) {
              this.globalData.openid = openid
              this.globalData.userInfo = res.data.response
              wx.setStorageSync('openid', openid);
              wx.setStorageSync('userInfo', this.globalData.userInfo);
            }
            console.log("app.js获取到的userInfo===>",this.globalData.userInfo);
          }
        })
      }
    })
  },


})