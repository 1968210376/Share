const app = getApp()
Page({
    data: {
        nickName: "编辑个人信息",
        avatarUrl: "/images/0.png",
        bgImg: 'https://img.vinua.cn/images/VR7R.jpeg ',
        // bgImg:'https://uiverse.io/build/_assets/sad-astronaut-2GA54L3F.png',
        item: 0,
        index: 0,
        id: '',
        wxOpenId: '',
        list: [],
        navHeight: 100,

    },

    onShow(options) {
        var that = this
        var user = wx.getStorageSync('userInfo')
        console.log("my/index.js获取本地userInfo:", wx.getStorageSync('userInfo'));
        if (user != "") {
            that.setData({
                nickName: user.nickName !== null ? user.nickName : this.data.nickName,
                avatarUrl: user.avatarUrl !== null ? user.avatarUrl : this.data.avatarUrl,
                // id:user.id,
                wxOpenId: user.wxOpenId
            })
            console.log("显示用户信息")
        }
        var that = this

        this.setData({ //动态高度
            navHeight: app.globalData.navHeight,
        })
    },
    showDetail(e) {
        var that = this
        console.log(that.data);
        if (e.currentTarget.dataset.index == 1) {

        }
        if (e.currentTarget.dataset.index == 2) {
            wx.request({
                url: app.globalData.serverApi + '/selectComment',
                method: 'POST',
                header: {
                    'content-type': 'application/x-www-form-urlencoded'
                },
                data: {
                    // status: 1,
                    pageIndex: 1,
                    pageSize: 10,
                    wxOpenId: that.data.wxOpenId
                },
                success(res) {
                    console.log(res);
                }
            })
        } else if (e.currentTarget.dataset.index == 3) {
            wx.request({
                url: app.globalData.serverApi + '/selectMarketOpenId',
                method: 'POST',
                header: {
                    'content-type': 'application/x-www-form-urlencoded'
                },
                data: {
                    wxOpenId: that.data.wxOpenId,
                    pageIndex: 1,
                    pageSize: 10,
                    // categoryType:4
                    // id:that.data.id,
                },
                success(res) {
                    // console.log(res);
                      that.setData({
                          list:res.data.response.content
                      })
                },
                fail() {
                    console.log('请求失败');
                }
            })
        }

    },
    // 跳转到个人信息页面
    to_niu_my_edit_information: function () {
        wx.navigateTo({
            url: "/pages/my_edit_information/index"
        })
    },

})