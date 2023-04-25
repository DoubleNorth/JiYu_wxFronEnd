const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ids: -1,
    phone: '',
    wxnum: '',
    qqnum: '',
    email: '',
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
  },
})