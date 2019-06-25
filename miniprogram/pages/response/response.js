const db = wx.cloud.database(
  { env: 'scu-undergraduate-tu0da' }
);
const app = getApp()


Page({

  /**
   * 页面的初始数据
   */
  data: {
    
    question_id:"",
    reply_id:"",
    reply_content:"",
    question_content:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var message  = wx.getStorageSync("currentMessage");

    this.setData({
      question_id: message.id,
      question_content: message.content
    });

    this.disPlayContent();

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

  disPlayContent:function(){

    var that = this;

    db.collection("replies").where({
      question_id: that.data.question_id
    }).get().then(res=>{


      var data = res.data[0];
      //console.log(data);
      that.setData({
        reply_content: data.reply,
      })
    })
  }

})