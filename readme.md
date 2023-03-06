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