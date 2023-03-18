Component({
  properties:{
    starValue:{
      value: 5,//父组件传过来的评分数字
      type:Number
    },
    disabled:{//是否只读，disabled="true"可评分，disabled="false"只显示（刚好写反了）
      value:false,
      type:Boolean
    },
    isShowStarValue:{
      value:false,//父组件传过来的是否显示评分
      type:Boolean
    },
    WH:{
      value: 50,//父组件设置评分星星的宽高
      type:Number
    },
    isInteger:{//父组件设置是操作整颗星 || 半颗星
      value:false,
      type:Boolean
    }
  },
 
  data: {
    stars: [0, 1, 2, 3, 4],
    normalSrc: '/images/sc(1).png',//没有点亮的星星图片
    selectedSrc: '/images/sc(2).png',//完全点亮的星星图片
    halfSrc: '',//点亮一半的星星图片
    showTap:true//是否可以点击
  },
  methods: {
    //点击左边,半颗星
    selectLeft: function (e) {
      console.log("left");
      var key = e.currentTarget.dataset.key
      if (this.data.starValue == 0.5 && e.currentTarget.dataset.key == 0.5) {
        //只有一颗星的时候,再次点击,变为0颗
        key = 0;
      }
      this.setData({
        starValue: key
      })
      this.triggerEvent('getStarValue',{params: this.data.starValue});
    },
    //点击右边,整颗星
    selectRight: function (e) {
      console.log("right");
      var key = e.currentTarget.dataset.key
      this.setData({
        starValue: key
      })
      this.triggerEvent('getStarValue',{params: this.data.starValue});
    },
    //点击整颗星
    selectAll(e){
      console.log("all");
      var key = e.currentTarget.dataset.key;
      if (this.data.starValue == 1 && e.currentTarget.dataset.key == 1) {
        //只有一颗星的时候,再次点击,变为0颗
        key = 0;
      }
      this.setData({
        starValue: key
      })
      this.triggerEvent('getStarValue',{params: this.data.starValue});
    },
  },
  attached: function () {
    this.starValue == 0? this.setData({starValue:5}) : ''
    this.setData({
      showTap: this.properties.disabled
    })
  }
})