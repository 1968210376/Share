var app = getApp()
Page({
    data: {
        // animationData: {},
        // animationDatas: {},
        animation:false
    },

    onLoad: function () {},
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
    }
})