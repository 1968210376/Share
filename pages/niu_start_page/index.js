// pages/niu_start_page/index.js
// 2022年9月20日 牛亚博 打开微信小程序，1s后跳转到首页。
const app = getApp()
Page({
    /**
     * 页面的初始数据
     */
    data: {
        testList: ["/images/beijing5.png"], //显示的背景图片
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        setTimeout(function () {
            wx.switchTab({
                url: '/pages/fenlei/index',
            })
        }, 1000);
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
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

    },

    // autoImage(e) {
    //     var that = this;
    //     var originalWidth = e.detail.width;
    //     var originalHeight = e.detail.height;
    //     var imageWidth = 0;
    //     var imageHeight = 0;
    //     wx.getSystemInfo({
    //         complete: (res) => {
    //             var winWidth = res.windowWidth;
    //             if (originalWidth > winWidth) {
    //                 var autoWidth = winWidth;
    //                 var autoHeight = (autoWidth * originalHeight) / originalWidth;
    //                 imageWidth = autoWidth + 'px';
    //                 imageHeight = autoHeight + 'px';
    //             } else {
    //                 imageWidth = originalWidth + 'px';
    //                 imageHeight = originalHeight + 'px';
    //             }
    //             that.setData({
    //                 imgWidth: imageWidth,
    //                 imgHeight: imageHeight
    //             });
    //         }
    //     })
    // },

})