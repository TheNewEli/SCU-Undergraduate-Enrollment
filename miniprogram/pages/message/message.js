const db = wx.cloud.database(
  { env: 'scu-undergraduate-tu0da' }
);
const app = getApp()


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
    });


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
          });

          that.displayMessages(that);
        },
        fail: err => {
          console.error('[云函数] [login] 调用失败', err)
        }
      })
    }

    else
      this.displayMessages(this);

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

  displayMessages:function (that){

    db.collection("questions").where({
      _openid: that.data.openid
    }).get({
      success:function(res){
        //console.log(res.data);
        that.formatData(res.data,that);
      },
      fail:function(error){
        console.log(error);
      }
    })
  },

  formatData:function (data, that){

    if(data.length!=0){
      app.globalData.personalInfoCompleted = true;

      data.sort(function(a,b){
        if (a.submition_time < b.submition_time)
          return 1;
        else
          return -1;
      });
    }

    var messages = [];

    for(var item of data){
      var message = {};
      message.content = item.content;
      message.id = item._id;
      
      var GMT_time = item.submition_time;
      var year= GMT_time.getFullYear();
      var month = GMT_time.getMonth();
      var day = GMT_time.getDate();
      var hours = GMT_time.getHours();
      if(hours < 10)
        hours = "0"+hours;

      var minutes = GMT_time.getMinutes();  
      if(minutes < 10)
        minutes = "0" + minutes;

      message.date = year+"-"+month+"-"+day+" "+hours+":"+minutes;
      
      if(item.status == "未回复")
        message.replied = false;
      else
        message.replied = true;
      //console.log(message);
      messages.push(message);
    }
    that.setData({
      messages : messages,
    })
  },

  onCreateNewMessage:function(){

    if (!app.globalData.personalInfoCompleted){
      wx.showModal({
        title: '提示',
        content: '请完善个人信息',
        success(res) {
          if (res.confirm) {
            console.log("用户点击确认")
            wx.switchTab({
              url: '/pages/mine/mine',
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
  
    }
    else{
      wx.navigateTo({
        url: '/pages/createMessage/createMessage',
      })
    }
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

  onItemTaped:function(e){
    //console.log(e.currentTarget.id);

    var id = e.currentTarget.id;
    var message = this.data.messages[id];

    if(message.replied){

      wx.setStorage({
        key: 'currentMessage',
        data: message,
      })

      wx.navigateTo({
        url: '/pages/response/response',
      });
    }else{
      wx.showToast({
        title: '没有更过信息了~',
        icon:"none",
        duration:1500
      })
    }
  }

})