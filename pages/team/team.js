const app = getApp();
const apiUrl = app.globalData.apiUrl

Page({
  /**
   * 页面的初始数据
   */
  data: {
    teams: [],
    searchText: '',      
    status: 0,  // status 0 为公开  1 为私有 2 为加密
  },
  onLoad(options) {
    this.getTeams()
  },
  getTeams() {
    var that = this;

    // 准备数据
    var searchText = this.data.searchText
    var pageNum = 1
    var curId = wx.getStorageSync('userInfo').id
    var status = this.data.status

    wx.request({
      // status 0 为公开  1 为私有 2 为加密
      url: `${apiUrl}/team/list?pageNum=${pageNum}&curId=${curId}&status=${status}&searchText=${searchText}`,
      method: 'GET',
      header: {
        'Content-Type': 'application/json'
      },
      success(res) {
        var teams = res.data.data
        console.log(res.data);
        if (typeof teams === 'undefined') {
          that.setData({
            teams: []
          })
        } else {
          teams.forEach((team) => {
            team.createTime = that.formatTime(team.createTime);
            team.expireTime = that.formatTime(team.expireTime);
          });
          
          that.setData({
            teams: teams
          });
        }           
      },
      fail(error) {
      }
    })
    
  },
  // 将时间格式转换为指定格式的函数
  formatTime(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  },
  onSearchInput(event) {
    const searchText = event.detail.value;
    this.setData({
      searchText: searchText
    });
  },
  onSearch() {
    const searchText = this.data.searchText;
    // 执行搜索操作 把有关键字的活动展示出来
    console.log('搜索关键字：', searchText);
    this.setData({
      searchText: searchText
    })
    this.getTeams()
    
  },
  checkTeam: function(event) {
    // 把 当前队伍编号储存在 storage中
    const index = event.currentTarget.dataset.index; // 获取当前活动的索引值
    const currentTeam = this.data.teams[index]; // 根据索引值获取当前活动对象
    console.log(currentTeam);
    wx.setStorageSync('curTeam', currentTeam)
    wx.navigateTo({
      url: '/pages/teamdetail/teamdetail',
    })
  },
  handleFilter(event) {
    const type = event.currentTarget.dataset.type;
    this.setData({
      status: type
    });
    this.getTeams()
  },

})