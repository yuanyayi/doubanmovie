$(function() {
  // 取消a标签的默认行为
  $('a').on('click', (ev) => {
    ev.preventDefault()
    return false
  })
  // 列表：
  let movieList = {
    'top250': new MovieDataList('top250'),
    'beimei': new MovieDataList('beimei'),
    'search': new MovieDataList('search', screen = $('#searchList'), auto = false)
  }
  // 上拉加载更多
  $('main .movieList').on('scroll', (ev) => {
    let $this = $(ev.target)
    let diff = Math.abs($this.height() + $this.scrollTop() - $this.children('ul').height())
    if (diff < 200) {
      movieList[$this.children('ul').prop('id').replace('List', '')].getData()
    }
    // goTop
    // let $goTop = $this.find('.goTop')
    // console.log($goTop.offset().top+ $this.scrollTop())
    // $goTop.animate({top: $goTop.position().top + $this.scrollTop()}, 1000)
  })
  // tabs
  function switchToTab(index) {
    let film = $('main .film')
    $('.tabs').children('.tab').eq(index).addClass('cur').siblings().removeClass('cur')
    film.animate({ left: film.offset().left - film.children().eq(index).offset().left }, 1000)
    return 'animate'
  }
  $('.tabs').on('click', '.tab', (ev) => {
    switchToTab($(ev.currentTarget).index())
  })
  // searchBox
  $('#query').on('click', () => {
    $('#tagLists').slideToggle()
  })
  // search
  $('#searchBtn').on('click', (ev) => {
    let q = $('#query').val()
    if (q && q !== '' && movieList.search) {
      movieList.search.getData('q', q)
    }
  })
  $('#tagLists').on('click', 'li', (ev) => {
    let text = $(ev.target).text()
    movieList.search.getData('tag', text)
  })
})
// --------------- LIBRARY --------------- //
// 制作li.movie
function createNewMovieLi(movie) {
  movie = movie.subject || movie
  let li = `<li class="movie">
  <a href="${movie.alt}">
    <div class="frame">
      <img src="${movie.images.small}" alt="${movie.title}">
    </div>
    <h4 class="title">${movie.title}</h4>
    <p><span class="theme">${movie.rating.average}</span>分 / ${movie.rating.stars}收藏</p>
    <p>${movie.year} / ${movie.genres.join(' / ')}</p>
    <p>导演：${movie.directors.map((el)=>{return el.name}).join('、')}</p>
    <p class="lines">主演：${movie.casts.map((el)=>{return el.name}).join('、')}</p>
  </a>
</li>`
  return li
}
// 取数据并生成新列表
function MovieDataList(name, screen, auto) {
  this.start = 0
  this.count = 20
  this.$screen = screen || $('#' + name)
  this.$loading = this.$screen.siblings('.loading')
  this.timer = {}
  this.search = {}
  // 私有方法，获取数据
  this._getData = () => {
    let _this = this
    let option = {
      start: this.start,
      count: this.count,
    }
    // 查询
    if (name === 'search') {
      option.search = this.search
    }
    // 榜单
    getMovieListData(name, option).then((res) => {
      _this.start += _this.count
      for (let i in res.subjects) {
        _this.$screen.append(createNewMovieLi(res.subjects[i]))
      }
      this.$loading.hide()
    })
  }
  // 外部使用的获取数据方法
  this.getData = (query, str) => {
    if (['q', 'tag'].indexOf(query) !== -1) {
      // 更新数据
      if (!this.search[query] || this.search[query] !== str) {
        this.$screen.html('')
        this.search = {}
        this.search[query] = str
      }
    }
    this.$loading.show()
    if (this.timer) {
      clearTimeout(this.timer)
    }
    this.timer = setTimeout(this._getData, 300)
  }
  // init
  if (auto || auto === undefined) {
    this._getData()
  }
  return this
}