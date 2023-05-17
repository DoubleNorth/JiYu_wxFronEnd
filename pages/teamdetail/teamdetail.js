// pages/teamdetail/teamdetail.js
const app = getApp();
const apiUrl = app.globalData.apiUrl

Page({

  /**
   * 页面的初始数据
   */
  data: {
    team: {},
    userList: [],
    inTeam: false, 

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var curTeam = wx.getStorageSync('curTeam')
    this.setData({
      team: curTeam
    })

    this.getUser()
  },

  getUser() {
    var that = this
    wx.request({
      url: `${apiUrl}/team/getmember?id=${that.data.team.id}`,
      method: 'GET',
      header: {
        'Content-Type': 'application/json'
      },
      success(res) {
        console.log(res.data);
        that.setData({
          userList: res.data.data
        })

        // 获取用户的时候判断自己是否已经加入队伍
        var curId = wx.getStorageSync('userInfo').id

        var isInList = that.data.userList.some(function(user) {
          return user.id === curId;
        });

        that.setData({
          inTeam: isInList
        })
        console.log(that.data.inTeam);
      },
      fail(error) {
      }
    })
  },
  joinTeam() {    
    var teamId = this.data.team.id
    var curId = wx.getStorageSync('userInfo').id
    var that = this

    wx.request({
      url: `${apiUrl}/team/join?curId=${curId}`,
      method: 'POST',
      header: {
        'Content-Type': 'application/json'
      },
      data: {
        teamId: teamId,
        password: ''
      },
      success(res) {
        that.getUser()
      },
      fail(error) {
      }
    })
    console.log("joinTeam");
  },
  quitTeam() {
    var teamId = this.data.team.id
    var curId = wx.getStorageSync('userInfo').id
    var that = this

    wx.request({
      url: `${apiUrl}/team/quit?curId=${curId}`,
      method: 'POST',
      header: {
        'Content-Type': 'application/json'
      },
      data: {
        teamId: teamId  
      },
      success(res) {
        that.getUser()
      },
      fail(error) {
      }
    })
    console.log("joinTeam");
  }

})