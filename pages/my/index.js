const app = getApp()
Page({
    data: {
        nickName: "编辑个人信息",
        avatarUrl: "/images/0.png",
        bgImg:'https://img.vinua.cn/images/VR7R.jpeg',
        item:0,
        index:0
    },

    onShow(options) {
        let that = this
        let user = wx.getStorageSync('userInfo')
        console.log("my/index.js获取本地userInfo:", JSON.stringify(wx.getStorageSync('userInfo')));
        if (user!="") {
            that.setData({
                nickName: user.nickName !=null ? user.nickName:this.data.nickName,
                avatarUrl: user.avatarUrl !=null ? user.avatarUrl:this.data.avatarUrl,
            })
            console.log("显示用户信息")
        }
    },

    // 跳转到个人信息页面
    to_niu_my_edit_information:function(){
        wx.navigateTo({
            url: "/pages/my_edit_information/index"
        })
    },

})