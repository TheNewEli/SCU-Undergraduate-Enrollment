// pages/message/message.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

    messages:[
     
    ],

    hasUserInfo:false,
    userInfo:{},

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {

    var that = this;

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              //console.log(res.userInfo);
              wx.setStorageSync("userInfo", res.userInfo);
              that.setData({
                userInfo: res.userInfo,
                hasUserInfo: true
              })
            }
          })
        }
        else
        {
          that.setData({
            hasUserInfo:false
          })
        }
      }
    })
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

  onCreateNewMessage:function(){
    console.log("test");
  },


  onGotUserInfo: function (e) {
    // console.log(e.detail.errMsg)
    // console.log(e.detail.userInfo)
    // console.log(e.detail.rawData)
    wx.setStorageSync("userInfo", e.detail.userInfo);

    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo:true
    });

    this.onCreateNewMessage();
  },

})