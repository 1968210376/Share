const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

/**
 * 时间戳转化为年 月 日 时 分 秒
 * number: 传入时间戳
 * format：返回格式，支持自定义，但参数必须与formateArr里保持一致
 */
function dateFormat(number, format) {
  var formateArr = ['Y', 'M', 'D', 'h', 'm', 's'];
  var returnArr = [];
  var date = new Date(number);
  returnArr.push(date.getFullYear());
  returnArr.push(formatNumber(date.getMonth() + 1));
  returnArr.push(formatNumber(date.getDate()));

  returnArr.push(formatNumber(date.getHours()));
  returnArr.push(formatNumber(date.getMinutes()));
  returnArr.push(formatNumber(date.getSeconds()));

  for (var i in returnArr) {
    format = format.replace(formateArr[i], returnArr[i]);
  }
  return format;
}


// 时间转换成time时间之前
function commentTimeHandle(dateStr) {
  // dateStr = 2018-09-06 18:47:00" 测试时间
  var publishTime = dateStr / 1000, //获取dataStr的秒数  打印结果--1536230820000
    date = new Date(publishTime * 1000), //获取dateStr的标准格式 console.log(date) 打印结果  Thu Sep 06 2018 18:47:00 GMT+0800 (中国标准时间)
    // 获取date 中的 年 月 日 时 分 秒
    Y = date.getFullYear(),
    M = date.getMonth() + 1,
    D = date.getDate(),
    H = date.getHours(),
    m = date.getMinutes(),
    s = date.getSeconds();
  // 对 月 日 时 分 秒 小于10时, 加0显示 例如: 09-09 09:01
  if (M < 10) {
    M = '0' + M;
  }
  if (D < 10) {
    D = '0' + D;
  }
  if (H < 10) {
    H = '0' + H;
  }
  if (m < 10) {
    m = '0' + m;
  }
  if (s < 10) {
    s = '0' + s;
  }
  // console.log("年", Y); // 年 2018
  // console.log("月", M); // 月 09
  // console.log("日", D); // 日 06
  // console.log("时", H); // 时 18
  // console.log("分", m); // 分 47
  // console.log("秒", s); // 秒 00
  var nowTime = new Date().getTime() / 1000, //获取此时此刻日期的秒数
    diffValue = nowTime - publishTime, // 获取此时 秒数 与 要处理的日期秒数 之间的差值
    diff_days = parseInt(diffValue / 86400), // 一天86400秒 获取相差的天数 取整
    diff_hours = parseInt(diffValue / 3600), // 一时3600秒
    diff_minutes = parseInt(diffValue / 60),
    diff_secodes = parseInt(diffValue);

  if (diff_days > 0 && diff_days < 3) { //相差天数 0 < diff_days < 3 时, 直接返出
    return diff_days + "天前";
  } else if (diff_days <= 0 && diff_hours > 0) {
    return diff_hours + "小时前";
  } else if (diff_hours <= 0 && diff_minutes > 0) {
    return diff_minutes + "分钟前";
  } else if (diff_secodes < 60) {
    if (diff_secodes <= 0) {
      return "刚刚";
    } else {
      return diff_secodes + "秒前";
    }
  } else if (diff_days >= 3 && diff_days < 30) {
    return M + '-' + D + ' ' + H + ':' + m;
  } else if (diff_days >= 30) {
    return Y + '-' + M + '-' + D + ' ' + H + ':' + m;
  }
}

module.exports = {
  formatTime: formatTime,
  dateFormat: dateFormat,
  commentTimeHandle: commentTimeHandle,
}