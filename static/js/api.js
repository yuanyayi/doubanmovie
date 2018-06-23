let base_url = 'http://api.douban.com'
let urls = {
  'top250': '/v2/movie/top250',
  'beimei': '/v2/movie/us_box',
  'search': '/v2/movie/search'
}
// 获取实际url
function getUrl(name) {
  return base_url + urls[name] || ''
}
// 参数字符串拼接
function normalizeParams(obj) {
  let str = '?'
  for(let key in obj) {
    if(obj[key] === undefined) break;
    str += key+'='+obj[key]+'&'
  }
  return str.slice(0,-1)
}
// getData
function getMovieListData(name, option) {
  if(!name) {
    console.log('必须指定一个榜单名')
    return false
  }
  if(!urls[name]) {
    console.log('此榜单不存在！')
    return false
  }
  let params = {
    start: option.start || 0,
    count: option.count || 20
  }
  if(name === 'search') {
    for(let key in option.search){
      params[key] = option.search[key]
    }
  }
  return new Promise((resolve, reject) => {
    $.ajax({
      url: getUrl(name)+normalizeParams(params),
      crossDomain: true,
      dataType: "jsonp",
      success: (res) => {
        resolve(res);
      },
      error: (error)=>{
        reject(error);
      }
    })
  })
}