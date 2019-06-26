Page({
  data: {
    cardCur: 0,
    swiperList: [{
      id: 0,
      type: 'image',
      url: 'https://7363-scu-undergraduate-tu0da-1259519748.tcb.qcloud.la/images/coverImg14.jpg?sign=d72012103d9bde541d752565d78982fb&t=1561541939'
    }, {
      id: 1,
      type: 'image',
      url: 'https://7363-scu-undergraduate-tu0da-1259519748.tcb.qcloud.la/images/coverImg2.jpg?sign=d5081702708ca5ae91b7806561793df9&t=1561538216'
    }, {
      id: 2,
      type: 'image',
      url: 'https://7363-scu-undergraduate-tu0da-1259519748.tcb.qcloud.la/images/coverImg8.jpeg?sign=f66212b0b3f2795791945a6cccf7ea02&t=1561540378'
    }, {
      id: 3,
      type: 'image',
      url: 'https://7363-scu-undergraduate-tu0da-1259519748.tcb.qcloud.la/images/coverImg6.jpeg?sign=5659047017c050789ae6c7e6c1195e52&t=1561540409'
    }, {
      id: 4,
      type: 'image',
      url: 'https://7363-scu-undergraduate-tu0da-1259519748.tcb.qcloud.la/images/coverImg9.jpeg?sign=6f0d8aecab4cccd68d8d709ae943a2ca&t=1561540449'
    }, {
      id: 5,
      type: 'image',
      url: 'https://7363-scu-undergraduate-tu0da-1259519748.tcb.qcloud.la/images/coverImg10.jpg?sign=e61a0ef62db291bcb17be3c12e3c2c71&t=1561541390'
    }],
    elements: [{
        title: '招生简章',
        name: 'brochures',
        color: 'cyan',
        icon: 'formfill'
      },
      {
        title: '招生专业 ',
        name: 'professional',
        color: 'blue',
        icon: 'vipcard'
      }
    ],
    list: [{
      title: '联系招生组',
      img: 'https://image.weilanwl.com/color2.0/plugin/sylb2244.jpg',
      url: '/contact/contact'
    }]
  },
  onLoad() {
    this.towerSwiper('swiperList');
    // 初始化towerSwiper 传已有的数组名即可
  },
  DotStyle(e) {
    this.setData({
      DotStyle: e.detail.value
    })
  },
  toTab: function(e) {
    console.log(e);
    wx.switchTab({
      url: '../contact/contact'
    })
  },
  // cardSwiper
  cardSwiper(e) {
    this.setData({
      cardCur: e.detail.current
    })
  },
  // towerSwiper
  // 初始化towerSwiper
  towerSwiper(name) {
    let list = this.data[name];
    for (let i = 0; i < list.length; i++) {
      list[i].zIndex = parseInt(list.length / 2) + 1 - Math.abs(i - parseInt(list.length / 2))
      list[i].mLeft = i - parseInt(list.length / 2)
    }
    this.setData({
      swiperList: list
    })
  },
  // towerSwiper触摸开始
  towerStart(e) {
    this.setData({
      towerStart: e.touches[0].pageX
    })
  },
  // towerSwiper计算方向
  towerMove(e) {
    this.setData({
      direction: e.touches[0].pageX - this.data.towerStart > 0 ? 'right' : 'left'
    })
  },
  // towerSwiper计算滚动
  towerEnd(e) {
    let direction = this.data.direction;
    let list = this.data.swiperList;
    if (direction == 'right') {
      let mLeft = list[0].mLeft;
      let zIndex = list[0].zIndex;
      for (let i = 1; i < list.length; i++) {
        list[i - 1].mLeft = list[i].mLeft
        list[i - 1].zIndex = list[i].zIndex
      }
      list[list.length - 1].mLeft = mLeft;
      list[list.length - 1].zIndex = zIndex;
      this.setData({
        swiperList: list
      })
    } else {
      let mLeft = list[list.length - 1].mLeft;
      let zIndex = list[list.length - 1].zIndex;
      for (let i = list.length - 1; i > 0; i--) {
        list[i].mLeft = list[i - 1].mLeft
        list[i].zIndex = list[i - 1].zIndex
      }
      list[0].mLeft = mLeft;
      list[0].zIndex = zIndex;
      this.setData({
        swiperList: list
      })
    }
  }
})