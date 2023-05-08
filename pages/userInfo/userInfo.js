const app = getApp();
const apiUrl = app.globalData.apiUrl

Page({

  /**
   * 页面的初始数据
   */
  data: {    
    loginstatus: false,
    edit: true,
    userInfo: null,
    newName: '',
    newPhone: '',
    newMail: '',
    genders: ['男', '女', '保密'],
    genderIndex: 2,
  },
  // input输入函数
  bindPickerChange: function(e) {
    this.setData({
      genderIndex: e.detail.value
    })
  },
  nameInput(e) {
    this.data.newName = e.detail.value; 
  },
  mailInput(e) {
    this.data.newMail = e.detail.value; 
  },
  phoneInput(e) {
    this.data.newPhone = e.detail.value; 
  },
  /**
   * 生命周期函数--监听页面展示
   */
  onShow(options) {
    this.setData({
      loginstatus: wx.getStorageSync('loginState')
    })
    var that = this
    // 获取用户信息
    wx.getStorage({
      key: 'userInfo',
      success: function (res) {
        console.log("获取用户信息成功")
        that.setData({
          userInfo: res.data,
          newName: res.data.username,
          newMail: res.data.email,
          newPhone: res.data.phone,
          genderIndex: res.data.gender
        })
        // 要把 可以修改的值  从userInfo里拿出来
        console.log(res.data)
      },
      fail: function () {
        console.log('获取用户信息失败，使用默认信息，弹窗提示')
        wx.showModal({
          title: '',
          content: '请先登录',
          showCancel: false,
          complete: (res) => {
            if (res.confirm) {
              wx.navigateBack({
                delta: 1 // 返回上一级页面
              })
            }
          }
        })
      }
    })

  },

  enterEditStatus:function() {
    this.setData({
      edit: false,
    })
  },
  enterCheckStatus:function() {
    // 这个是因为后面的 this指针可能会指向不同的对象 在这里用that保存当前这个Page的this 后面用that来存取data
    var that = this
    wx.showLoading({
      title: '保存中...',
      mask: true // 是否显示透明蒙层，防止触摸穿透，默认：false
    });

    var id = that.data.userInfo.id
    console.log("update was evoked");
    wx.request({
      url: `${apiUrl}/user/update?curId=` + id,
      method: 'POST',
      header: {
        'content-type': 'application/json', 
      }, 
      // 这里不能有 null 值 会报400错误
      data: {
        'id': id,
        'username': that.data.newName,
        'email': that.data.newMail,
        'gender': that.data.genderIndex,
        'phone': that.data.newPhone
      },
      success(res) {
        wx.hideLoading()
        console.log(res.data, '更新请求成功');
        // 成功的话更新本地存储
        // 准备数据 发送请求更改数据
        var tmpInfo = that.data.userInfo;
        tmpInfo.username = that.data.newName;
        tmpInfo.email = that.data.newMail;
        tmpInfo.gender = that.data.genderIndex;
        tmpInfo.phone = that.data.newPhone;

        wx.setStorage({
          key: 'userInfo',
          data: tmpInfo,
          success: function () {
            // console.log('本地存储更新成功')
          }
        })
      },
      fail(res) {
        wx.hideLoading()
        console.log('更新请求失败', res);
      }
    })

    this.setData({
      edit: true
    })

  }

})