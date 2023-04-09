// pages/ping/ping.js
const util = require("../../libs/util")
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    info: {
      value: {},
      type: Object
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    show: false,
    pinglun: [],
    value: '',
    pageIndex: 1,
    end: false,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    pinglun(e) {
      this.setData({
        show: true
      })
      // console.log(e);
      this.select_pinglun(e)
    },
    send_pinglun(e) {
      // console.log("评论",e);
      var that = this
      var info = this.properties.info
      // console.log(info);
      var content = e.detail.value.input ? e.detail.value.input : e.detail.value
      this.setData({
        value: e.detail.value
      })
      content == '' ? (wx.showToast({
        title: '请输入内容',
        icon: "error"
      })) : (
        wx.request({
          url: app.globalData.serverApi + '/commentOn',
          method: 'POST',
          data: {
            marketId: info.id,
            content: content,
            commentUserWxOpenId: info.wx_open_id, //物品发布人openid
            commentPostWxOpenId: wx.getStorageSync('openid'), //评论人openid
            city: wx.getStorageSync('city'),
            status: 1
          },
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          success(res) {
            // console.log(res);
            res.data.code == 1 ? (wx.showToast({
              title: '评论成功',
            })) : (wx.showToast({
              title: res.data.response,
            }))
            that.setData({
              ping: false,
              value: ''
            })
            that.select_pinglun()
          },
          fail() {
            that.setData({
              value: ''
            })
          }
        }))
    },
    select_pinglun(e) {
      // console.log(e);
      var that = this
      var info = this.properties.info
      // console.log("info", info);
      // var info = e.currentTarget.dataset.ping
      wx.request({
        url: app.globalData.serverApi + '/selectComment',
        method: 'POST',
        data: {
          marketId: info.id,
          status: 1,
          pageIndex: that.data.pageIndex
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success(res) {
          res.data.response.content.forEach(item => {
            let d = new Date(item.target.create_time).getTime();
            item.target.create_time = util.commentTimeHandle(d);
          })
          res.data.response.content.length < 10 ? that.setData({
            end: true
          }) : ''
          that.setData({
            pinglun: res.data.response.content.length == 0 ? (that.data.pageIndex == 1 ? '' : that.data.pinglun) : (that.data.pageIndex == 1 ? res.data.response.content : that.data.pinglun.concat(res.data.response.content)),
          })
          // console.log(that.data.pinglun);
        }
      })
    },
    load_ping() {
      // console.log('上拉加载');
      var that = this
      // if(!this.loading && this.data.pageIndex<this.data.pages ){
      // console.log('当前页', that.data.pageIndex);
      if (!this.data.end) {
        that.setData({
          pageIndex: that.data.pageIndex + 1
        })
        // console.log('当前页', that.data.pageIndex);
        this.select_pinglun()
      } else {
        wx.showToast({
          title: '已到底！',
        })
      }
    },
    delete(e) {
      // console.log("e===>", e);
      e.currentTarget.dataset.id.comment_post_wx_open_id == wx.getStorageSync('openid') ? this.detele_(e) : wx.showToast({
        title: '不是本人的留言',
      })
    },
    detele_(e) {
      var that = this
      wx.showModal({
        title: '是否删除该留言？',
        success(res) {
          if (res.confirm) {
            // console.log('用户点击确定')
            wx.request({
              url: app.globalData.serverApi + '/deleteComment',
              method: 'POST',
              header: {
                'content-type': 'application/x-www-form-urlencoded'
              },
              data: {
                id: e.currentTarget.dataset.id.id
              },
              success(res) {
                that.setData({
                  pageIndex: 1,
                })
                that.select_pinglun()
              }
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    },
    exit(e) {
      this.setData({
        end: false,
        pageIndex: 1,
      })
    },
  }
})