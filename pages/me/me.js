Page({
  data: {
    melist: [
      {
        imagePath: "/images/lunbotu/one.jpg",
      },
      {
        name: "/images/geren/four.jpg",
        imagePath: "/images/geren/five.jpg",
        time: "/images/geren/six.jpg",
      },

    ]
  },
  onShareAppMessage: function () {
    return {
      title: '欢迎使用JiYu',
      path: '/pages/index/index',
    }
  }
})