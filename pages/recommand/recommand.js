const app = getApp();
const apiUrl = app.globalData.apiUrl

Page({
  data: {
    curId: 0,
    loginState: false,
    friendList: []
  },
  addFriend: function (event) {
    var that = this
    var index = event.currentTarget.dataset.index;
    var target = this.data.friendList[index]
    var curId = wx.getStorageSync('userInfo').id
    wx.showModal({
      title: '添加关注',
      content: '您确定要添加 ' + target.name + ' 到您的关注列表吗',
      complete: (res) => {
        if (res.cancel) {
        }
        if (res.confirm) {
          // 信息都全了  调用接口
          wx.request({
            url: `${apiUrl}/user/isfriend?id=`+target.id+ '&curId='+curId,
            method: 'GET',
            header: {
              'Content-Type': 'application/json'
            },
            success(res) {
              if (res.data.data==true) {
                wx.showToast({
                  title: '您已添加过该用户',
                  icon: 'none',
                  duration: 1000,
                })
              } else {
                that.requestToAdd(target.id, curId)
              }
            },
            fail(error) {
            }
          })
        }
      }
    })
  },
  /*生命周期函数*/
  onShow(options) {
    var that = this
    // 获取当前登陆状态
    wx.getStorage({
      key: 'loginState',
      success: function (res) {
        that.setData({
          loginState: res.data
        })
        console.log("loginstate in recommandation  " + that.data.loginState);
      },
      fail: function () {}
    })

    this.setData({
      curId: wx.getStorageSync('userInfo').id
    })

    wx.request({
      url: `${apiUrl}/user/recommend?curId=`+this.data.curId+'&pageSize=8&pageNum=1',
      method: 'GET',
      header: {
        'Content-Type': 'application/json'
      },
      success(res) {
        console.log(res.data.data);
        const info =res.data.data.records.map(obj => ({
          id: obj.id,
          name: obj.username,
          avatar: obj.avatarUrl,
          tags:  JSON.parse(obj.tags)
        }));
    
        that.setData({
          friendList: info
        })
      },
      fail(error) {

      }
    })


  },
  requestToAdd(id, curId) {
    wx.showLoading({
      title: '添加中',
    })
    wx.request({
      url: `${apiUrl}/user/addfriend?id=`+id+'&curId='+curId,
      method: 'GET',
      header: {
        'Content-Type': 'application/json'
      },
      success(res) {
        wx.hideLoading()
        wx.showToast({
          title: '添加好友成功',
          duration: 1000,
        })
      },
      fail(error) {
        wx.hideLoading()
        wx.showToast({
          title: '添加好友失败',
          icon: 'none',
          duration: 1000,
        })
      }
    })

  }
})