// pages/share/share.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    info:{
      value:{

      },
      type:Object
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    //海报
    posterDatas: {
      width: 300, //画布宽度
      height: 450, //画布高度
      // 缓冲区，无需手动设定
      pic: null,
      buttonType: 1,
      show: false, // 显示隐藏海报弹窗
      success: false, // 是否成功生成过海报
      canvas: null, // 画布的节点
      ctx: null, // 画布的上下文
      dpr: 1, // 设备的像素比
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //海报生成
    //画布 生成 海报[海报]
    onBuildPosterSaveAlbum: function (e) {
      console.log(e)
      var image = e.currentTarget.dataset.info.images[0]
      var title = e.currentTarget.dataset.info.title
      var pirce = e.currentTarget.dataset.info.pirce
      var content = e.currentTarget.dataset.info.content
      var content1 = e.currentTarget.dataset.info.content1
      var name = e.currentTarget.dataset.info.nick_name

      var that = this;
      var posterDatas = that.data.posterDatas
      var canvas = posterDatas.canvas
      var ctx = posterDatas.ctx
      //已生成过海报的直接显示弹窗
      // if (posterDatas.success) {
      //     posterDatas["show"] = true;
      //     that.setData({
      //         posterDatas
      //     })
      //     return;
      // }
      posterDatas.show = true;
      that.setData({
        posterDatas
      })
      wx.showLoading({
        title: '海报生成中',
        mask: true
      });
      //二维码
      var promise = new Promise(function (resolve, reject) {
        // var photo;
        // try {
        //     photo = canvas.createImage();
        // } catch (e) {
        //     photo = canvas.createImage();
        //     console.log("异常")
        // }
        var photo = canvas.createImage();
        // photo = canvas.createImage();
        // photo.src = that.data.goodsDetail.images[0];
        photo.src = image
        photo.onload = (e) => {
          resolve(photo);
        }
      }).catch((e) => {});
      var promise1 = new Promise(function (resolve, reject) {
        var photo1 = canvas.createImage();
        // photo1 = canvas.createImage();
        photo1.src = "../../images/xcxma.png";
        photo1.onload = (e) => {
          resolve(photo1);
        }
      }).catch((e) => {});
      var promise2 = new Promise(function (resolve, reject) {
        var photo1 = canvas.createImage();
        // photo1 = canvas.createImage();
        photo1.src = "./bg.png";
        photo1.onload = (e) => {
          resolve(photo1);
        }
      }).catch((e) => {});
      //获取图片信息
      Promise.all(
        [promise, promise1, promise2]
      ).then(res => {
        // 绘制白色背景
        // util.roundRect(ctx, 0, 0, posterDatas.width, posterDatas.height, 10);
        ctx.fillStyle = "#fffafa";
        //绘制[主图片]
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        // ctx.drawImage(res[0], 0, 0, posterDatas.width, 370);
        // 图片地址 x y 宽300 高450
        // b=背景图
        ctx.drawImage(res[2], 0, 0, 300, 450);
        // 图片
        // 图片尺寸超过300x300的限制
        // var originWidth = res[0].width
        // var originHeight = res[0].height
        // var maxWidth = 274
        // var maxHeight = 200
        // var targetWidth = originWidth
        // var targetHeight = originHeight;
        // if (originWidth > maxWidth || originHeight > maxHeight) {
        //   if (originWidth / originHeight > maxWidth / maxHeight) {
        //       targetWidth = maxWidth;
        //       targetHeight = Math.round(maxWidth * (originHeight / originWidth));
        //   } else {
        //       targetHeight = maxHeight;
        //       targetWidth = Math.round(maxHeight * (originWidth / originHeight));
        //   }
        // }
        // ctx.drawImage(res[0], 200,200,20,20,0, 0, 300, 300);
        // ctx.drawImage(res[0], maxWidth,0, originWidth, originHeight, 13, 10, maxWidth, maxHeight);
        // ctx.drawImage(res[0], (maxWidth-targetWidth)/2+13, 10, targetWidth, targetHeight);
        ctx.drawImage(res[0], 13, 10, 274, 200);
        // 二维码
        ctx.drawImage(res[1], 200, 290, 70, 70);
        //名称
        //底部说明
        ctx.font = "bold 12px Arial"; //字体大小
        ctx.textAlign = "center"
        ctx.fillStyle = "#666"; //字体颜色
        ctx.font = "bold 10px Arial"; //字体大小
        ctx.fillText("来自：" + name + "的分享", 150, 230);
        ctx.font = "bold 15px Arial"; //字体大小
        ctx.fillText(title, 150, 250);
        ctx.textAlign = "left"
        ctx.font = "bold 12px Arial"; //字体大小
        if (content != "") {
          ctx.fillText(content, 30, 310);
        }
        if (content1 !== undefined && content1!== null) {
          ctx.fillText(content1, 30, 330);
        }
        // ctx.textAlign = "center"
        ctx.fillStyle = "#ff6666"; //字体颜色
        ctx.font = "bold 16px Arial"; //字体大小
        if (pirce != "") {
          ctx.fillText("￥" + pirce, 30, 360);
        }
        // 关闭loading
        wx.hideLoading();
        //显示海报
        posterDatas.success = true;
        that.setData({
          posterDatas
        })
      }).catch(err => {
        console.log(err)
        wx.hideLoading();
        wx.showToast({
          icon: 'none',
          title: '海报生成失败,请稍后再试.',
        })
      })
    },

    //画布 转 图片[海报]
    onCanvasBuildImges: function () {
      var that = this;
      var posterDatas = that.data.posterDatas;
      wx.canvasToTempFilePath({
        canvas: posterDatas.canvas,
        width: posterDatas.width,
        height: posterDatas.height,
        destWidth: posterDatas.width * 3,
        destHeight: posterDatas.height * 3,
        success: function success(res) {
          posterDatas["pic"] = res.tempFilePath;
          that.setData({
            posterDatas
          })
          that.onDownloadImges();
        },
        fail: function complete(e) {
          wx.hideLoading();
          wx.showToast({
            icon: 'none',
            title: 'sorry 保存失败,请稍后再试.',
          })
          return;
        }
      });
    },

    //下载图片[海报]
    onDownloadImges: function () {
      wx.showLoading({
        title: '保存中',
        mask: true
      });
      var that = this;
      var posterDatas = that.data.posterDatas;
      if (!posterDatas.pic) {
        that.onCanvasBuildImges();
        return;
      }
      //可写成函数调用 这里不做解释
      wx.saveImageToPhotosAlbum({
        filePath: posterDatas.pic,
        success(res) {
          wx.hideLoading();
          wx.showToast({
            icon: 'none',
            title: '已保存到相册，快去分享吧',
          })
          posterDatas["buttonType"] = 2;
          that.setData({
            posterDatas
          })
        },
        fail: function (res) {
          wx.hideLoading();
          wx.showToast({
            icon: 'none',
            title: '进入设置页，开启“保存到相册”',
          })
          posterDatas["buttonType"] = 3;
          that.setData({
            posterDatas
          })
          return;
        }
      })
    },

    //在打开授权设置页后回调[海报]
    onBindOpenSetting: function () {
      var that = this;
      var posterDatas = that.data.posterDatas;
      posterDatas["buttonType"] = 1;
      that.setData({
        posterDatas
      })
    },

    //隐藏海报[海报]
    onIsCanvas: function () {
      var that = this;
      var posterDatas = that.data.posterDatas;
      posterDatas["buttonType"] = 1;
      posterDatas["show"] = false;
      that.setData({
        posterDatas
      })
    },

    //自定义弹窗后禁止屏幕滚动（滚动穿透）[海报]
    preventTouchMove: function () {
      //在蒙层加上 catchtouchmove 事件
      //这里什么都不要放
    },
  },
  pageLifetimes: {
    // 组件所在页面的生命周期函数
    show:function() {
     
    },
    hide: () => {}
  },
  lifetimes: {
    attached: function () {
      var that = this
      //生成海报初始化
      var posterDatas = that.data.posterDatas
      const query = that.createSelectorQuery()
      query.select('#firstCanvas').fields({
          node: true,
          size: true
        },
        function (res) {
          const canvas = res.node
          const ctx = canvas.getContext('2d')
          const dpr = wx.getSystemInfoSync().pixelRatio
          canvas.width = posterDatas.width * dpr
          canvas.height = posterDatas.height * dpr
          ctx.scale(dpr, dpr)
          posterDatas.canvas = canvas
          posterDatas.ctx = ctx
          posterDatas.dpr = dpr
          //存储
          that.setData({
            posterDatas
          })
        }).exec()
    }
  }
})