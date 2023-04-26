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
  },
  login:function() {
    wx.navigateTo({
      url: '/pages/login/login',
      success: function(res) {
      }
    })
  },
  test:function() {
    console.log(this.data.userinfo.name);
  }

})