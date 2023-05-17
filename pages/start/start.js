Page({

      /**
       * 页面的初始数据
       */
      data: {
            count: 3,
      },
      onLoad(){          
            this.countDown();
      },
      go() {
        clearInterval(this.interval);
        wx.switchTab({
          url: '/pages/team/team',
        })
      },
      // 倒计时3秒进入
      countDown: function() {
            let that = this;
             let total = 3;
            this.interval = setInterval(function() {
                  total > 0 && (total--, that.setData({
                        count: total
                  })), 0 === total && (that.setData({
                        count: total
                  }), wx.switchTab({
                        url: "/pages/team/team"
                  }), clearInterval(that.interval));
            }, 1e3);
      },
      
})