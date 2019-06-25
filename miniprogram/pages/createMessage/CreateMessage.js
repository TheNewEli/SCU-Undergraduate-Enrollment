

const db = wx.cloud.database(
  { env: 'scu-undergraduate-tu0da' }
);
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {

    content:"",
    due:"",
    status:"未回复",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var openid = app.globalData.openid; //用户登陆后从缓存中获取

    if (openid == undefined) {
      var that = this;

      wx.cloud.callFunction({
        name: 'login',
        data: {},
        success: res => {
          console.log('user openid: ', res.result.openid)
          app.globalData.openid = res.result.openid

          that.setData({
            openid: res.result.openid
          })
        },
        fail: err => {
          console.error('[云函数] [login] 调用失败', err)
        }
      })
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  OnSubmitQuestion: function(){

    if(this.content.length <= 7)
    {
      wx.showToast({
        title: '字数太短',
        icon:"none",
        duration:2000
      });
      return;
    }
      this.due = new Date();
      // console.log(this.due);
      // console.log(this.content);

      var that = this;

      db.collection("questions").add({

        data:{
          openid: app.globalData.openid,
          status: that.status,
          submition_time: that.due,
          content: that.content
        },

        success: function (res) {
          wx.showToast({
            title: '提问成功',
            icon:"success",
            duration:1500
          })
        },
        fail: console.error

      })
  },

  onContentChanged:function(event){
    this.content = event.detail.detail.value;
    //console.log(this.content);
  }

})