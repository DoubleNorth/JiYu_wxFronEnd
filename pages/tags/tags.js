// pages/tag/tag.js
const app = getApp();
const apiUrl = app.globalData.apiUrl

Page({
  onShareAppMessage() {
    return {
      title: '兴趣标签',
      path: 'pages/tag/tag.js'
    }
  },
  /**
   * 页面的初始数据
   */
  data: {
    loginstatus: false,
    items: [
      // {value: '羽毛球', name: '羽毛球', checked: true},
      // {value: '篮球', name: '篮球', },
      // {value: '唱', name: '唱',},
      // {value: '跳', name: '跳', },
      // {value: 'RAP', name: 'RAP',},
      // {value: '足球', name: '足球'}
    ],
    newTag:"",
    selectedTag: [],
    curId: 0,

  },

  checkboxChange(e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value)
    const items = this.data.items
    const values = e.detail.value
    for (let i = 0, lenI = items.length; i < lenI; ++i) {
      items[i].checked = false

      for (let j = 0, lenJ = values.length; j < lenJ; ++j) {
        if (items[i].value === values[j]) {
          items[i].checked = true
          break
        }
      }
    }

    this.setData({
      selectedTag: values
    })
  },
  onShow() {
    var that = this
    this.setData({
      loginstatus: wx.getStorageSync('loginState')
    })

    wx.getStorage({
      key: 'userInfo',
      success: function (res) {
        console.log("获取用户信息成功")   
        var tagsArray = JSON.parse(res.data.tags);
        console.log(tagsArray);
        var userItems = [];
        var selected = [];
        tagsArray.map(function(item) {
          userItems.push({value: item, name: item, checked: true});
          selected.push(item)
        });

        that.setData({
          curId: res.data.id,
          items: userItems,
          selectedTag: selected
        })
      },
      fail: function () {
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
  tagInput(e) {
    this.data.newTag = e.detail.value;    
  },
  AddTag(){
    if (this.data.newTag == '')  {
      wx.showToast({
        title: '请输入标签内容',
        icon: 'none',
        duration: 1000
      }); 
      return
    }
    var newtag={value:this.data.newTag , name: this.data.newTag,checked: 'true'};
    this.data.items.push(newtag); 
    console.log(this.data.selectedTag);
    this.data.selectedTag.push(this.data.newTag)
    console.log(this.data.selectedTag);
    this.setData({ 
      items: this.data.items,
      newTag: '',
      selectedTag: this.data.selectedTag
    });  
  },
  PostTag(){
    var that = this
    console.log(that.data.selectedTag);

    wx.showLoading({
      title: '保存中...',
      mask: true // 是否显示透明蒙层，防止触摸穿透，默认：false
    });
    wx.request({
      url: `${apiUrl}/user/updateTag?curId=` + that.data.curId,
      method: 'POST',
      header: {
        'Content-Type': 'application/json'
      },
      data: that.data.selectedTag,
      success(res) {
        wx.hideLoading();
        console.log("修改tag成功");  
        that.updateStorage(that.data.selectedTag)
      },
      fail(res) {
        wx.hideLoading();
      }
    })

    wx.hideLoading()
  },
  updateStorage: function (tagsArray) {
    // 从 Storage 中获取 userInfo 对象
    var userInfo = wx.getStorageSync('userInfo');
    // 修改 tag 字符串
    userInfo.tags = JSON.stringify(tagsArray);
    // 将修改后的 userInfo 对象存储回 Storage
    wx.setStorageSync('userInfo', userInfo);
  }
})