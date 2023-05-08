const app = getApp();
const apiUrl = app.globalData.apiUrl


Page({

  /**
   * 页面的初始数据
   */
  data: {
    loginState: false,
    friendList: [],
   
  },
  onFriendItemClick(event) {
    var index = event.currentTarget.dataset.index;
    var friend = { ...this.data.friendList[index]};
    wx.navigateTo({
      url: '/pages/chatbox/chatbox?friendName=' + friend.username + '&friendId=' + friend.id + '&avatar=' + friend.avatarUrl
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onShow(options) {
    var that = this
    wx.getStorage({
      key: 'loginState',
      success: function (res) {
        that.setData({
          loginState: res.data
        })
        console.log("loginstate in friends  " + that.data.loginState);
      },
      fail: function () {}
    })
    that.getFriendList()
  },
  getFriendList() {
    var that = this
    var curId = wx.getStorageSync('userInfo').id
    wx.request({
      url: `${apiUrl}/user/friend?id=` + curId,
      method: 'GET',
      header: {
        'Content-Type': 'application/json'
      },
      success(res) {
        that.setData({
          friendList: res.data.data
        })
      },
      fail(error) {}
    })
  },
  onFriendItemLongPress(e) {
    var index = e.currentTarget.dataset.index;
    var friend = this.data.friendList[index];
    var that = this
    wx.showActionSheet({
      itemList: ['删除好友'],
      success: (res) => {
        if (res.tapIndex === 0) {
          // 删除好友
          that.deleteFriend(friend.id)
        }
      },
    })
  },
  deleteFriend(id) {
    var curId = wx.getStorageSync('userInfo').id
    var that = this
    wx.showLoading({
      title: '删除中',
    })
    wx.request({
      url: `${apiUrl}/user/deletefriend?id=` + id + '&curId=' + curId,
      method: 'GET',
      header: {
        'Content-Type': 'application/json'
      },
      success(res) {
        wx.hideLoading()
        that.getFriendList()
        wx.showToast({
          title: '删除好友成功',
          duration: 1000,
        })
        
      },
      fail(error) {
        wx.hideLoading()
        wx.showToast({
          title: '删除好友失败',
          icon: 'none',
          duration: 1000,
        })
      }
    })
  }
})