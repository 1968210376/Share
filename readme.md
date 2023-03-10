 // {
      //   "pagePath": "pages/niu_market/index",
      //   "iconPath": "images/pengyouquan(1).png",
      //   "selectedIconPath": "images/pengyouquan.png",
      //   "text": "市场"
      // },
      // {
      //   "pagePath": "pages/niu_friends/index",
      //   "iconPath": "images/pengyouquan(1).png",
      //   "selectedIconPath": "images/pengyouquan.png",
      //   "text": "圈子"
      // },
      // {
      //   "pagePath": "pages/niu_my/index",
      //   "iconPath": "images/shouye(1).png",
      //   "selectedIconPath": "images/shouye.png",
      //   "text": "我的"
      // }

      <swiper class="swiper" current="{{item}}" bindchange="changeTab">
      <swiper-item class="content_item">
        <!-- 引入整个import页面 -->
        <include src="./wupin/wupin.wxml" />
      </swiper-item>
      <swiper-item class="content_item">
        <include src="./jineng/jineng.wxml" />
      </swiper-item>
      <swiper-item class="content_item">
        <include src="./xvqiu/xvqiu.wxml" />
      </swiper-item>
    </swiper>

    "navigationBarBackgroundColor": "#007AFF",


 <swiper-item>
    <scroll-view scroll-y="{{true}}" style="height:{{navHeight}}px">
      <view class="card" wx:for="{{list}}" data-id="{{index}}" wx:key="index" bindtap="wupin_detail">
        <view class="userInfo">
          <view class="img">
            <image src="{{item.target.avatar_url}}" />
          </view>
          <view class="info">
            <view class="nickName">
              {{item.target.nick_name}}
            </view>
            <view class="time">
              {{item.target.create_time}}
            </view>
          </view>
          <view class="weizhi">
            <view wx:if="{{item.target.distance}}">
              距离：{{item.target.distance}}
            </view>
            <view wx:if="{{item.target.choose_location}}">
              {{item.target.choose_location.city}}{{item.target.choose_location.district}}

            </view>
          </view>
        </view>
        <view class="jianJie">
          {{item.target.title}}
          {{item.target.content}}
        </view>
        <view class="fixed_box">
          <view wx:for="{{item.target.images}}" wx:key="index">
            <image class="fixed_pic" src="{{item}}" mode="widthFix" />
          </view>
        </view>
        <view class="btnBox">
          <view class="red price">
            ￥{{item.target.pirce}}
          </view>
          <!-- <view class="btn {{item.target.is_shouCang ? gold :''}}" data-item="{{item.target.id}}" bindtap="is_shouCang"> -->
          <view class="btn">
            <image src="/images/sc(1).png" class="icon" mode="" />
          </view>
          <view class="btn">
            <image src="/images/ly.png" class="icon" mode="" />
          </view>
          <view class="btn">
            <image src="/images/xy.png" class="icon" mode="" />
          </view>

        </view>
      </view>
      <!-- 空列表提示 -->
      <view wx:if="{{ list.length == 0 }}" class="center">
        <image class="data-img" lazy-load mode="widthFix" src="/images/no_result.png" />
        <view>还没有数据哦~</view>
      </view>
      <!-- 置底了 -->
      <view class="center">
        ~ 到底啦 ~
      </view>
    </scroll-view>
  </swiper-item>
  <swiper-item>
    <scroll-view scroll-y="{{true}}" style="height:{{navHeight}}px">
      <view class="liushi_container">
        <view class="picture">
          <block wx:for="{{list}}" wx:key="index">
            <view class="item" data-id="{{index}}" bindtap="wupin_detail">
              <view>
                <image class="image" lazy-load mode="widthFix" src="{{ item.target.images}}" />
              </view>
              <view style="font-size: 14px;padding-left: 10rpx;">{{ item.target.title }}</view>

              <view style="display: flex; align-items: center;">
                <image class="icon" src="{{item.target.avatar_url}}" mode="" />
                <text class="font-mini">{{item.target.nick_name}}</text>
                <view class="red price right">
                  ￥{{item.target.price}}
                </view>
              </view>
            </view>
            <view class="null-wrap"></view>
          </block>
        </view>
        <!-- 空列表提示 -->
        <view wx:if="{{ list.length == 0 }}" class="center">
          <image class="data-img" lazy-load mode="widthFix" src="/images/no_result.png" />
          <view>还没有数据哦~</view>
        </view>
        <!-- 置底了 -->
        <view class="center">
          ~ 到底啦 ~
        </view>
      </view>
    </scroll-view>
  </swiper-item>


  <!-- 原发布页 -->
  <!--pages/add/add.wxml-->
<view class="container">
    <form bindsubmit="formSubmit">
        <view class="form">
            <view class="form_item">
                <text>标题</text>
                <input type="text" placeholder="请输入标题" />
            </view>
            <view class="space"></view>
            <view class="form_item">
                <picker bindchange="bindPickerChange" value="{{index}}" range="{{categories}}">
                    <view class="picker">
                        当前选择：{{categories[index]}}
                    </view>
                </picker>
            </view>
            <view class="space"></view>
            <view class="form_item"  bindtap="getLocation">
                <input disabled type="text" style="flex: 9;" placeholder="请输入位置" value="{{chooseLocation.address}}" />
                <button style="flex: 1;background-color: #fff;">
                    <image style="width: 80rpx;height: 80rpx;" src="/images/Location.png" mode="scaleToFit" />
                </button>
            </view>
            <view class="space"></view>
            <view class="form_items">
                <textarea placeholder="{{placeholder}}" value="" />
            </view>
            <view class="space"></view>
            <view>
                <text>请选择图片</text>
                <view class="img_box">
                    <view bindtap="imgbox">
                        <image class="imgs" bindtap="addPic1" src="/images/sc.png" mode="aspectFill" />
                    </view>
                    <view bindtap="imgDelete1" data-deindex="{{index}}" class="img" wx:for="{{imgbox}}" wx:key="index">
                        <image src="{{item}}" mode="aspectFit" />
                    </view>
                </view>
            </view>
            <view class="space">

            </view>
            <view class="form_item">
                <button type="primary" bindtap="formSubmit">提交</button>
            </view>
        </view>
    </form>
</view>



const app = getApp()
const chooseLocation = requirePlugin('chooseLocation');
var COS = require('../../libs/cos-wx-sdk-v5.js')
var util = require('../../libs/util.js')
Page({
    data: {
        imgbox: [], //选择图片
        fileIDs: [], //上传云存储后的返回值
        formats: {},
        readOnly: false,
        placeholder: '快来描述一下你的宝贝吧',
        chooseLocation: "", //位置
        detebase: "issue_entre",
        product_img: [], //上传完成后的图片路径需要保存到数据库
        categories: [], //分类
        issuePicSum: 9, //最多上传几张图片
    },

    onLoad: function () {
        // wx.showModal({
        //     title: '隐私协议',
        //     content: '发布的数据将用来在市场页面展示，删除后平台不保留任何数据信息。',
        //     cancelText: '取消',
        //     confirmText: "查看",
        //     success: function (res) {
        //         if (res.confirm) {
        //             console.log("查看隐私协议")
        //             wx.navigateTo({
        //                 url: "/pages/niu_my_fuwuyinshi/index"
        //             })
        //         } else {
        //             console.log("取消")
        //             // wx.switchTab({
        //             //     url: "/pages/niu_market/index"
        //             // })
        //         }
        //     }
        // })
        // this.selectcategory();
    },

    // to_niu_my_fuwuyinshi:function(){
    //     wx.navigateTo({
    //         url: "/pages/niu_my_fuwuyinshi/index"
    //     })
    // },

    // 获取分类
    selectcategory: function () {
        wx.request({
            url: app.globalData.serverApi + '/selectcategory',
            method: 'POST',
            data: {
                reside: 1,
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: (res) => {
                console.log("selectcategory===>res");
                console.log(res);
                if (res.data.code == 1) {
                    if (res.data.response.list == 0) {
                        return
                    }
                    res.data.response.list[0].checked = true;
                    this.setData({
                        categories: res.data.response.list,
                    });
                }
            },
            fail: res => {
                wx.showToast({
                    title: "加载类别失败",
                })
            }
        })
    },

    onShow() {
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
        // 从地图选点插件返回后，在页面的onShow生命周期函数中能够调用插件接口，取得选点结果对象
        let location = chooseLocation.getLocation(); // 如果点击确认选点按钮，则返回选点结果对象，否则返回null
        console.log("location133:", location)
        // console.log("location144:", location.name)
        let that = this;
        // JSON.stringify(location)
        // JSON.parse(location)
        this.setData({
            chooseLocation: location,
        })
    },

    //////////////////提交数据保存到数据库 文件保存到存储//////////////////////
    formSubmit: function (e) {
        console.log('form发生了submit事件，携带数据为：', e.detail.value)
        // let category_type =  JSON.parse(e.detail.value.category_type);
        if (!e.detail.value.category_type) {
            wx.showToast({
                icon: 'none',
                title: '请选择一个类别'
            });
        } else if (!e.detail.value.scrap_title) {
            wx.showToast({
                icon: 'none',
                title: '请输入标题'
            });
        } else if (!this.data.imgbox.length) {
            // !this.data.imgbox.length && !e.detail.value.information
            wx.showToast({
                icon: 'none',
                title: '选择至少一张图片'
            });
        } else {
            // 文件图片的上传
            // this.add_fileImages(e);
            this.add_COSfileImages(e);
        }
    },
    // 文件图片上传腾讯对象存储COS
    add_COSfileImages: function (e) {
        var that = this
        if (that.data.imgbox.length) { //上传图片到云存储
            wx.showLoading({
                title: '上传中',
            })
            let promiseArr = [];
            var cos = new COS({
                SecretId: 'AKIDrb9SYPbMn1zmOno25EGcpnW8VgnpdFsN',
                SecretKey: 'TrCsPO7artiKo37wWrwmOuAE8rLchWCm',
            });
            for (let i = 0; i < that.data.imgbox.length; i++) {
                // var thats = this
                promiseArr.push(new Promise((reslove, reject) => {
                    let item = that.data.imgbox[i];
                    let suffix = /\.\w+$/.exec(item)[0]; //正则表达式返回文件的扩展名
                    console.log("item:", item);
                    console.log("suffix:", suffix);
                    var filePath = item;
                    // var filename = filePath.substr(filePath.lastIndexOf('/') + 1);
                    // 获取时间作为文件夹名
                    var time = util.dateFormat(new Date(), "YMD");
                    console.log("时间：", time);
                    console.log("随机：", Math.random().toString())
                    var filename = Number(Math.random().toString().substr(3, 6) + new Date().getTime()).toString(36) + suffix;
                    console.log("filename:", filename)
                    cos.postObject({
                        Bucket: 'niuyabo-1257122371',
                        Region: 'ap-chengdu',
                        Key: 'xiaochengxu/' + time + '/' + filename,
                        FilePath: filePath,
                        onProgress: function (info) {
                            console.log(JSON.stringify(info));
                        }
                    }, function (err, data) {
                        console.log(err || data);
                        console.log("data:", data);
                        console.log("err:", err);
                        // json = JSON.parse(info)
                        var res = data;
                        // console.log(JSON.stringify(info).Location)
                        res = res.Location;
                        var fileID = "http://" + res;
                        console.log("fileID:", fileID);
                        that.setData({
                            fileIDs: that.data.fileIDs.concat(fileID)
                        })
                        console.log("fileIDs:", that.data.fileIDs) //输出上传后图片的返回地址
                        that.data.product_img.push(fileID);
                        reslove();
                        wx.hideLoading();
                        wx.showToast({
                            title: "上传成功",
                        })
                    });
                }));
            }
            Promise.all(promiseArr).then(res => { //等数组都做完后做then方法
                console.log("图片上传完成后再执行")
                console.log(this.data.product_img);
                this.add_sell_scrap(e);
                this.setData({
                    imgbox: [],
                    product_img: []
                })
            })
        } else {
            this.add_sell_scrap(e);
        }

    },

    // 上传数据到数据库中
    add_sell_scrap: function (e) {
        let category_type = JSON.parse(e.detail.value.category_type);
        console.log(category_type)
        var userInfo = wx.getStorageSync('userInfo');
        console.log(userInfo.wxOpenId);
        let that = this;
        wx.request({
            url: app.globalData.serverApi + '/addupdatemarket',
            method: 'POST',
            data: {
                wxOpenId: userInfo.wxOpenId,
                phone: e.detail.value.scrap_phone,
                title: e.detail.value.scrap_title,
                chooseLocation: JSON.stringify(that.data.chooseLocation),
                pirce: (Number(e.detail.value.scrap_price)),
                contact_qq: e.detail.value.scrap_qq,
                contact_wx: e.detail.value.scrap_wx,
                status: 1,
                content: e.detail.value.information,
                Images: that.data.product_img,
                LikesNumber: 0,
                CommentsNumber: 0,
                // publictiy:e.detail.value.publictiy,
                publictiy: 2,
                CategoryType: category_type.type,
                Address: e.detail.value.scrap_address,
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: (res) => {
                console.log("addupdatemarket===>res");
                console.log(res);
                wx.showToast({
                    title: "上传成功",
                })
                if (res.data.code == 1) {
                    // if (res.data.response.list == 0) {
                    //     return
                    // }
                    // this.setData({
                    //     categories: res.data.response.list,
                    // });
                    //         console.log("跳转页面")
                    wx.reLaunch({
                        //页面跳转携带参数
                        url: '../../pages/niu_market/index',
                        success: function () {
                            console.log("跳转页面成功")
                        },
                    })
                }
            },
            fail: res => {
                wx.showToast({
                    title: "失败",
                })
            }
        })

    },

    // 微信获取地理位置 选择位置  授权位置信息
    getUserLocation: function () {
        let vm = this;
        wx.getSetting({
            success: (res) => {
                console.log(JSON.stringify(res))
                // res.authSetting['scope.userLocation'] == undefined    表示 初始化进入该页面
                // res.authSetting['scope.userLocation'] == false    表示 非初始化进入该页面,且未授权
                // res.authSetting['scope.userLocation'] == true    表示 地理位置授权
                if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) {
                    wx.showModal({
                        title: '请求授权当前位置',
                        content: '需要获取您的地理位置，请确认授权',
                        success: function (res) {
                            if (res.cancel) {
                                wx.showToast({
                                    title: '拒绝授权',
                                    icon: 'none',
                                    duration: 1000
                                })
                            } else if (res.confirm) {
                                wx.openSetting({
                                    success: function (dataAu) {
                                        if (dataAu.authSetting["scope.userLocation"] == true) {
                                            wx.showToast({
                                                title: '授权成功',
                                                icon: 'success',
                                                duration: 1000
                                            })
                                            //再次授权，调用wx.getLocation的API
                                            vm.getLocation();
                                        } else {
                                            wx.showToast({
                                                title: '授权失败',
                                                icon: 'none',
                                                duration: 1000
                                            })
                                        }
                                    }
                                })
                            }
                        }
                    })
                } else if (res.authSetting['scope.userLocation'] == undefined) {
                    //调用wx.getLocation的API
                    vm.getLocation();
                } else {
                    //调用wx.getLocation的API
                    vm.getLocation();
                }
            }
        })
    },

    // 微信选择位置 调用API 定位当前位置 获取坐标
    getLocation: function () {
        // const key = 'YPJBZ-3VICP-OYWDV-VQDUT-FCI7J-MPFYK'; //使用在腾讯位置服务申请的key
        // const referer = 'wx789e5aabeb07bfef'; //调用插件的app的名称
        const key = 'PMWBZ-KDRLX-H3C4C-ZAH36-WB2YT-GYBN5'; //使用在腾讯位置服务申请的key
        const referer = 'wx6d3c8ce12b2a4f0c'; //调用插件的app的名称
        wx.navigateTo({
            url: 'plugin://chooseLocation/index?key=' + key + '&referer=' + referer
        });

        //选择地址
        //  let that = this;
        //  wx.chooseLocation({
        //   success: function(res) {
        //     console.info(res);
        //     that.setData({
        //       chooseLocation: res,
        //     })
        //   },
        // })
    },

    //////////////////选择多张图片//////////////////////
    // 删除照片 &&
    imgDelete1: function (e) {
        console.log(e);
        let that = this;
        let index = e.currentTarget.dataset.deindex;
        let imgbox = this.data.imgbox;
        imgbox.splice(index, 1)
        that.setData({
            imgbox: imgbox
        });
    },
    // 选择图片 &&&
    addPic1: function (e) {
        var imgbox = this.data.imgbox;
        console.log(imgbox)
        var that = this;
        var n = that.data.issuePicSum;
        if (that.data.issuePicSum > imgbox.length > 0) {
            n = that.data.issuePicSum - imgbox.length;
        } else if (imgbox.length == that.data.issuePicSum) {
            n = that.data.issuePicSum;
        }
        wx.chooseImage({
            count: n, // 默认that.data.issuePicSum，设置图片张数
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (res) {
                // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                var tempFilePaths = res.tempFilePaths
                if (imgbox.length == 0) {
                    imgbox = tempFilePaths
                } else if (that.data.issuePicSum > imgbox.length) {
                    imgbox = imgbox.concat(tempFilePaths);
                }
                that.setData({
                    imgbox: imgbox
                })
                console.log(imgbox);
            }
        })
    },
    //图片
    imgbox: function (e) {
        this.setData({
            imgbox: e.detail.value
        })
    },

    // 文件图片的上传到云存储
    // add_fileImages: function (e) {
    //     if (this.data.imgbox.length) { //上传图片到云存储
    //         wx.showLoading({
    //             title: '上传中',
    //         })
    //         let promiseArr = [];
    //         for (let i = 0; i < this.data.imgbox.length; i++) {
    //             promiseArr.push(new Promise((reslove, reject) => {
    //                 let item = this.data.imgbox[i];
    //                 let suffix = /\.\w+$/.exec(item)[0]; //正则表达式返回文件的扩展名
    //                 wx.cloud.uploadFile({
    //                     cloudPath: this.data.detebase + "/" + new Date().getTime() + suffix, // 上传至云端的路径
    //                     filePath: item, // 小程序临时文件路径
    //                     success: res => {
    //                         this.setData({
    //                             fileIDs: this.data.fileIDs.concat(res.fileID)
    //                         });
    //                         console.log(res.fileID) //输出上传后图片的返回地址
    //                         this.data.product_img.push(res.fileID);
    //                         reslove();
    //                         wx.hideLoading();
    //                         wx.showToast({
    //                             title: "上传成功",
    //                         })
    //                     },
    //                     fail: res => {
    //                         wx.hideLoading();
    //                         wx.showToast({
    //                             title: "上传失败",
    //                         })
    //                     }
    //                 })
    //             }));
    //         }
    //         Promise.all(promiseArr).then(res => { //等数组都做完后做then方法
    //             console.log("图片上传完成后再执行")
    //             console.log(this.data.product_img);
    //             this.add_sell_scrap(e);
    //             this.setData({
    //                 imgbox: [],
    //                 product_img: []
    //             })
    //         })
    //     } else {
    //         this.add_sell_scrap(e);
    //     }
    // },

})


/* pages/add/add.wxss */
.form {
    width: 90vw;
    margin: 0 auto;
}

.form .form_item {
    width: 90vw;
    /* height: 95rpx; */
    height: 150rpx;
    background: #fff;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.form_items {
    width: 90vw;
    /* height: 95rpx; */
    height: 300rpx;
    padding: 10rpx 0;
    background: #fff;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
}

.space {
    width: 100vw;
    height: 16rpx;
    background: #F4F5F9;
}

.form_item text {
    width: 40%;
    font-size: 28rpx;
    font-weight: normal;
    color: #333;
    line-height: 104rpx;
    /* background-color: darkmagenta; */
    float: left;
    padding: 0%;
    text-align: left;
}

.form_item input,
.form_item r {
    width: 55%;
    height: 100%;
    font-size: 28rpx;
    color: #999;
    padding: 0%;
    /* background-color:darksalmon; */
    float: right;
}

textarea {
    width: 90vw;
    /* border: #333 1px solid; */
}

image {
    width: 200rpx;
    height: 200rpx;
}

.img_box {
    width: 90vw;
    margin: 0 auto;
    display: flex;
    flex-wrap: wrap;
    justify-content:flex-start;
    align-items: center;
}

.img,
.imgs {
    width: 210rpx;
    height: 210rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 5rpx;
}

.img {
    border: 1px solid #333;
    position: relative;
}