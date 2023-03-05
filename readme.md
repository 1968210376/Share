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
