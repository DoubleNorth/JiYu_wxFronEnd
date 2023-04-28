const app = getApp();
const apiUrl = app.globalData.apiUrl
Page({
  /**
   * 页面的初始数据
   */
  data: {
    ids: 0,
    password: '',
    confirmPwd: '',
    name: '',
    campus: [{
          name: '四平校区',
          id: 0
        },
        {
          name: '嘉定校区',
          id: 1
        },
        {
          name: '沪西校区',
          id: 2
        },
        {
          name: '彰武校区',
          id: 3
        }],
    isLogin: true,
    isRegister: false,
  },
  changeFunc() {
    if (this.data.isLogin==true) {
      this.setData({
        isLogin: false,
        isRegister: true
      }) 
      return
    }
    if (this.data.isLogin==false) {
      this.setData({
        isLogin: true,
        isRegister: false
      })
    }
  },
  // 数据处理函数
  nameInput(e) {
    this.data.name = e.detail.value;  
    // console.log(this.data.name);
  },
  passwordInput(e) {
    this.data.password = e.detail.value;    
  },
  confirmPwdInput(e) {
    this.data.confirmPwdInput = e.detail.value;
  },
  choose(e) {
    let that = this;
    that.setData({
      ids: e.detail.value
    })
  },
  wxInput(e) {
    this.data.wxnum = e.detail.value;   
    // console.log(this.data.wxnum);
  },
  qqInput(e) {
    this.data.qqnum = e.detail.value;
  },
  resetData() {
    this.setData({
      password: '',
      name: '',
      confirmPwd: ''
    })
  },
  checkData() {
    let that = this;
    console.log(this.data.name);
    if (that.data.name == '') {
      wx.showToast({
        title: '请输入用户名',
        icon: 'none',
        duration: 2000
      }); 
      return false;
    }
    if (that.data.password == '') {
      wx.showToast({
        title: '请输入密码',
        icon: 'none',
        duration: 2000
      });
      return false;
    }
    if (that.data.ids == -1) {
      wx.showToast({
        title: '请先选择您的校区',
        icon: 'none',
        duration: 2000
      });
      return false;
    }

    return true;
  },
  //  登陆注册函数
  register:function() {
     if (!this.checkData(1))   // 检查注册参数
      return;
    let that = this
    wx.showLoading({
      title: '加载中...',
      mask: true // 是否显示透明蒙层，防止触摸穿透，默认：false
    });
    wx.request({
      url: `${apiUrl}/api/user/register`,
      method: 'POST',
      header: {
        'Content-Type': 'application/json'
      },
      data: {
        "userAccount": that.data.name,
        "checkPassword": that.data.password,
        "userPassword":  that.data.confirmPwd,
      },
      success(res) {
        console.log(res.data);
        wx.hideLoading();    
        // 注册失败
        if (res.data.data == null) {
          wx.showModal({
            title: '注册失败',
            content: 'ID已被使用 请重新输入',
            showCancel: false,
          })
          that.resetData()
          return;
        }
        // 注册成功  跳转到登录
        that.resetData()
        that.changeFunc()   
      },
      fail(error) {
        console.log(error);
        wx.hideLoading();
        wx.showModal({
          title: '注册失败',
          content: '服务器繁忙 请稍后重试',
          showCancel: false,
        })
      }
    })
  },
  login: function () {
    if (!this.checkData(2))  // 检查登录参数 
      return;
    let that = this
    wx.showLoading({
      title: '加载中...',
      mask: true // 是否显示透明蒙层，防止触摸穿透，默认：false
    });
    wx.request({
      url: `${apiUrl}/api/user/login`,
      method: 'POST',
      header: {
        'Content-Type': 'application/json'
      },
      data: {
        "userAccount": that.data.name,
        "userPassword": that.data.password,
      },
      success(res) {
        console.log(res.data);
        wx.hideLoading();
        // 这里要处理一下数据  把数据放到info   传给 me 界面
        // 登录失败
        if (res.data.data == null) {
          wx.showModal({
            title: '登录失败',
            content: '用户名或密码错误 请重新登录',
            showCancel: false,
          })
          that.resetData()
          return;
        }
        // 登陆成功
        var info = {
          "status": true,
          "data": res.data.data
        }
        that.gotoMe(info)
      },
      fail(error) {
        console.log(error);
        wx.hideLoading();
        wx.showModal({
          title: '登陆失败',
          content: '服务器繁忙 请稍后重试',
          showCancel: false,
        })
      }
    })
  },
  // 注册 或者 登录成功  跳回主页面
  gotoMe:function(info) {
    // 往主页传数据
    var pages = getCurrentPages();
    var prevPage = pages[pages.length-2]
    prevPage.setData({
      userinfo: info
    })
    // 向回跳转一个界面
    wx.navigateBack({
      delta:1,
    })
  },
})

