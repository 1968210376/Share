const app = getApp()
var util = require('./util.js')
const GET = 'GET';
const POST = 'POST';
const baseUrl = app.globalData.serverApi
// 2023年3月24日 

function request(method, url, data) {
	return new Promise((resolve, reject) => {
		let header = {
        'content-type': 'application/x-www-form-urlencoded'
		};
		wx.request({
			url: baseUrl + url,
			method: method,
			header: header,
			data: method === POST ? JSON.stringify(data) : data,
			success: (res) => {
				if(res.data.code === 1){
					resolve(res);
				} else {
					reject('运行时错误,请稍后再试');
				}
			},
			fail: (err) => {
				reject(err);
			}
		})
	})
}

function requestSelectMarket(method, url, data) {
	return new Promise((resolve, reject) => {
		let header = {
        'content-type': 'application/x-www-form-urlencoded'
		};
		wx.request({
			url: baseUrl + url,
			method: method,
			header: header,
			data: method === POST ? JSON.stringify(data) : data,
			success: (res) => {
				if(res.data.code === 1){
          if (res.data.response) {
            res.data.response.content.forEach(item => {
              let aaa = "";
              var uuu = item.target.latitude;
              if (uuu !== "") {
                aaa = app.GetDistance(wx.getStorageSync("latitude"), wx.getStorageSync("longitude"), item.target.latitude, item.target.longitude);
                aaa = (aaa >= 1 ? (aaa.toFixed(1) + "km") : ((aaa * 1000).toFixed(0) + "m"));
              }
              let d = new Date(item.target.create_time).getTime();
              item.target.create_time = util.commentTimeHandle(d);
              item.target.distance = aaa;
              if (item.target.choose_location !== "") {
                item.target.choose_location = JSON.parse(item.target.choose_location);
              }
              if (item.target.images) {
                item.target.images = item.target.images.split(",");
              }
            })
          }
					resolve(res);
				} else {
					reject('运行时错误,请稍后再试');
				}
			},
			fail: (err) => {
				reject(err);
			}
		})
	})
}

const Api = {
  // getsiwper: () => request(GET, 'media/activity/newest'),
	selectCategory: (data) => request(POST, '/selectCategory', data), // 查询分类
	selectMarket: (data) => requestSelectMarket(POST, '/selectMarket', data), //查询共享信息
	selectAllBanner: (data) => request(POST, '/selectAllBanner', data), //查询轮播图
	
};
module.exports = {
	Api:Api
}

