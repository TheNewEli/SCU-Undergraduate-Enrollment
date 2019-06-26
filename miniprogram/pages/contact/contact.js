// miniprogram/pages/contact/contact.js
Page({
  recognition:function(e){
    var urls = ["https://s2.ax1x.com/2019/06/26/ZZoxkF.png", "https://s2.ax1x.com/2019/06/26/ZZozY4.jpg"];
    wx.previewImage({
      current: urls[e.target.dataset.id-1], // 当前显示图片的http链接
      urls: urls // 需要预览的图片http链接列表
    })
  }
})