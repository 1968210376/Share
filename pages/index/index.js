// index.js
Page({
  data: {
    item: 0,
    tab: 0,
    location:"定位",
  },
  changeItem: function (e) {
    console.log(e);
    this.setData({
      item: e.target.dataset.item
    })
  },
  changeTab: function (e) {   
    console.log(e);
    this.setData({
      tab: e.detail.current
    })
  },

})