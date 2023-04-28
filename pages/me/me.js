const app = getApp();
const config = require("../../config.js");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    showShare: false,
    poster: JSON.parse(config.data).share_poster,
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
  // 获取用户信息
  getAvator() {
    wx.getUserProfile({    
      success: (res) => {
        console.log('wx.getUserProfile: ', res.userInfo)
        this.setData({
          avatarUrl: res.userInfo.avatarUrl
        })
      }
    })
  },
  
})