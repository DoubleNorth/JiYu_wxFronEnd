const app = getApp();
const apiUrl = app.globalData.apiUrl

Page({
  timer: null, // 计时器变量
  data: {
    messageList:  [],
    inputValue: '',
    currentUserID: '',
    currentUserAvatar: '',
    friendName: "",
    friendId: "",
    friendAvatar: "",
  },
  onInput(event) {
    this.setData({
      inputValue: event.detail.value
    })
  },
  // 进入的时候获取数据并且展示
  onLoad(options) {
    var that = this
    // console.log(options);
    wx.getStorage({
      key: 'userInfo',
      success: function (res) {
        console.log("获取用户信息成功")
        console.log(res.data);
        that.setData({
          currentUserAvatar: res.data.avatarUrl,
          currentUserID: res.data.id
        })
      },
      fail: function () {
      }
    })

    that.setData({
      friendAvatar: options.avatar,
      friendId: options.friendId,
      friendName: options.friendName
    }) 

    that.getMessages()
    that.startTimer()
  },
  getMessages() {
    var that = this
    var id = that.data.friendId
    var curId = wx.getStorageSync('userInfo').id

    wx.request({
      url: `${apiUrl}/message/showmessage?id=` + id + '&curId=' + curId,
      method: 'GET',
      header: {
        'Content-Type': 'application/json'
      },
      success(res) {
        var messages = res.data.data
        console.log(messages);
        // 格式化时间和排序
        messages.forEach((message) => {
          const date = new Date(message.time);
          const formattedTime = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
          message.time = formattedTime;
        });
        messages.sort((a, b) => {
          const timeA = new Date(a.time);
          const timeB = new Date(b.time);
          return timeA - timeB;
        });
        that.setData({
          messageList: messages
        })
      },
      fail(error) {}
    })
  },
  sendMessage() {
    var that = this
    // 别管这段注释  之前模拟用的
    // const date = new Date()
    // const formattedTime = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;

    // const newMessage = {
    //   senderID: this.data.currentUserID,
    //   messageType: 0,
    //   messageID: Date.now(),
    //   messageContent: this.data.inputValue,
    //   time: formattedTime
    // }

    var curId = that.data.currentUserID
    var id = that.data.friendId
    var content= that.data.inputValue

    // 在这发送
    wx.request({
      url: `${apiUrl}/message/addmessage?id=${id}&curId=${curId}&messageType=0&messageContent=${content}`,
      method: 'GET',
      header: {
        'Content-Type': 'application/json'
      },
      success(res) {
        that.getMessages()
      },
      fail(error) {}
    })

    // 消息框清空
    that.setData({
      inputValue: ''
    });
  },
  onUnload(options) {
    // 页面隐藏时调用，停止计时器
    this.stopTimer();
  },
  // 计时器 实时接收消息
  startTimer: function () {
    // 每隔一段时间执行的函数
    const interval = 500; // 时间间隔，单位：毫秒
    var that = this
    this.timer = setInterval(() => {
      // 间隔 500ms 查收一下消息
      that.getMessages()
    }, interval);
  },
  stopTimer: function () {
    // 结束计时器
    if (this.timer) {
      // console.log(this.timer);
      clearInterval(this.timer);
      this.timer = null;
    }
  },
  withdrawMessage(e) {
    const index = e.currentTarget.dataset.index;
    const message = this.data.messageList[index];
    console.log('当前消息信息：', message);
    var that = this
    if (this.data.currentUserID == message.senderID) {
      wx.showActionSheet({
        itemList: ['撤回消息'],
        success: (res) => {
          if (res.tapIndex === 0) {
            // 删除好友
            that.deleteMessage(message.messageID)
          }
        },
      })
    }
  },
  deleteMessage(messageId) {
    wx.request({
      url: `${apiUrl}/message/delmessage?messageID=${messageId}`,
      method: 'POST',
      header: {
        'Content-Type': 'application/json'
      },
      success(res) {
      },
      fail(error) {
      }
    })
  }
})
