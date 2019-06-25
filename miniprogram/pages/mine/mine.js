// pages/home/home.js


const db = wx.cloud.database(
  { env: 'scu-undergraduate-tu0da' }
);


const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: "",
    gender: "",
    originalAddress: "",
    highSchool: "",
    subject: "",
    telNumber: "",
    score: "",
    rank: "",

    editable: false,
    completed: false,

    _id: "",
    openid:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var openid = app.globalData.openid; //用户登陆后从缓存中获取

    if(openid==undefined)
    {
      var that =this;

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
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

    this.getData();
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

  getData:function(){

    var that = this;

    db.collection('students').where({
      _openid: that.openid
    }).get({
      success: function (res) {
        //console.log(res.data[0])
        if (res.data.length == 0) {

          that.setData({
            editable: true,
            completed: false,
          });
        }
        else {
          var personal_data = res.data[0];
          console.log(personal_data);


          that.setData({
            name: personal_data.name,
            gender: personal_data.gender,
            originalAddress: personal_data.district,
            highSchool: personal_data.school,
            subject: personal_data.art_n_sicence,
            telNumber: personal_data.phone_number,
            rank: personal_data.ranking,
            score: personal_data.score,

            _id: personal_data._id,
          })
        }
      }
    })
  },

  onEdit: function () {

    var data = this.data;

    var editable = data.editable;
    var completed = data.completed;

    if(!editable){
      editable = true;
    }
    else if(completed)
    {
      this.sendModifiedData();
    }
    else
    {
      wx.showToast({
        title: "填写有误",
        icon: 'none',
        duration: 2000
      });

      completed = false;
      editable = false;

    }

    this.setData({
      editable:editable,
      completed:completed
    })
  },

  sendModifiedData: function () {

    var data = this.data;
    db.collection('students').doc(this._id).update({
      data: {
        art_n_sicence: data.art_n_sicence,
        district: data.district,
        gender: data.gender,
        name: data.name,
        openid: data.openid,
        phone_number: data.phone_number,
        ranking: data.ranking,
        school: data.school,
        score: data.score
      },
      success: function (res) {
        wx.showToast({
          title: '成功',
          icon: 'success',
          duration: 2000
        })
      }
    })
  },

  checkValid: function () {
  }

})