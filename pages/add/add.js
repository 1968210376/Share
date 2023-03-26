var app = getApp()
Page({
    data: {
        // animationData: {},
        // animationDatas: {},
        animation:false,
        isshow:false
    },

    onLoad: function () {
      this.banner();
    },
    banner() { //轮播图
      var that = this
      wx.request({
        url: app.globalData.serverApi + '/selectAllBanner',
        method: 'POST',
        success(res) {
          console.log('lunbo:', res.data.response);
          that.setData({
            isshow: res.data.response.length>2?true:false
          })
          wx.setStorageSync("isshow",that.data.isshow);
          console.log(that.data.isshow);
        }
      })
    },
    formSubmit: function (e) {
      var that = this
      console.log('form发生了submit事件，携带数据为：', e.detail.value)
      // let category_type =  JSON.parse(e.detail.value.category_type);
      if (!e.detail.value.title) {
        wx.showToast({
          icon: 'none',
          title: '请输入标题'
        });
      }
    },
    to_niu_my_fuwuyinshi: function () {
      wx.navigateTo({
        url: "/pages/niu_my_fuwuyinshi/index"
      })
    },
    goAdd(e) {
        var url
        if(e.currentTarget.dataset.index == 1){
            url = '/pages/wupin_add/index'
        }else if(e.currentTarget.dataset.index ==2){
            url = '/pages/jineng_add/index'
        }else{
            url = '/pages/xvqiu_add/index'
        }
        console.log(e);
        wx.navigateTo({
          url:url,
          success: (result) => {},
          fail: (res) => {},
          complete: (res) => {},
        })
    },
    onShow() {
        // this.setData({
        //     animation:false
        // })
        this.setData({
            animation:true
        })
        console.log('true');
        var userInfo = wx.getStorageSync('userInfo');
        console.log("issue");
        if (userInfo.avatarUrl == "" || userInfo.nickName == "" || userInfo.wxOpenId == "") {
            setTimeout(function () {
                wx.showToast({
                    title: '请完善个人信息',
                })
            }, 1000);
            wx.redirectTo({
                url: "/pages/niu_my_edit_information/index"
            })
        }
    },
    onHide(){
        this.setData({
            animation:false
        })
        console.log('false');
    },
     /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})