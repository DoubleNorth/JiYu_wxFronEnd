const app = getApp();
const config = require("../../config.js");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    showShare: false,
    // poster: JSON.parse(config.data).share_poster,
    userinfo: {
      "status": false,
      "data": null,
    },
    avatarUrl: '',
  },
  login:function() {
    wx.navigateTo({
      url: '/pages/login/login',
      success: function(res) {
      }
    })
  },
  gotoUserInfo:function() {
    wx.navigateTo({
      url: '/pages/userInfo/userInfo',
    })
  },
  gotoTagEdit:function() {
    wx.navigateTo({
      url: '/pages/tags/tags',
    })
  },
  logout:function() {
    var info = this.data.userinfo
    info.status = false;
    this.setData({
      userinfo: info
    })
    wx.setStorageSync('loginState', false)
  }
})