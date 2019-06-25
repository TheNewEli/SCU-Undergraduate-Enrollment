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
    correct:[1,1,1,1,1,1],

    _id: "",
    openid:"",

    genders:[{
      id:0,
      value:"男性"
    },
      {
        id: 1,
        value: "女性"
      }
    ],

    subjects: [{
      id: 0,
      value: "文科"
    },
    {
      id: 1,
      value: "理科"
    }
    ]
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

    else
      this.getData();
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
    this.setData({
      editable:false,
      completed:false,
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    this.setData({
      editable: false,
      completed: false,
    })
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
          app.globalData.personalInfoCompleted = true;
          //console.log(personal_data);

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

    this.checkValid();

    if(!this.data.editable){
      this.setData({
        editable:true
      })
    }
    else if(this.data.completed)
    {
      this.sendModifiedData();
    }
    else
      this.checkValid();

  },

  sendModifiedData: function () {

    var data = this.data;

    console.log(data);

    db.collection('students').doc(this._id).update({
      data: {
        art_n_sicence: data.subject,
        district: data.originalAddress,
        gender: data.gender,
        name: data.name,
        phone_number: data.telNumber,
        ranking: data.rank,
        school: data.highSchool,
        score: data.score
      },
      success: function (res) {

        console.log(res);

        if(res.stats.updated==0){
          db.collection('students').add({
            data: {
              art_n_sicence: data.subject,
              district: data.originalAddress,
              gender: data.gender,
              name: data.name,
              phone_number: data.telNumber,
              ranking: data.rank,
              school: data.highSchool,
              score: data.score
            },
            success:function(res){

              app.globalData.personalInfoCompleted = true;
              wx.showToast({
                title: '添加成功',
                icon: 'success',
                duration: 2000
              });

              wx.switchTab({
                url: '/pages/message/message',
              })
            }
          })
        }
        else
        {
          app.globalData.personalInfoCompleted = true;
          wx.showToast({
            title: '修改成功',
            icon: 'success',
            duration: 2000
          })

          wx.switchTab({
            url: '/pages/message/message',
          })
        }
      
      }
    })
  },

  checkValid: function () {

    let errorMsg;
    for(var idx in this.data.correct){
      if(!this.data.correct[idx]){
        this.setData({
          completed: false,
        })
        switch(idx){
          case '0':
            errorMsg = "姓名错误";
            break;
          case '3':
            errorMsg = "手机号错误";
            break;
          case '4':
            errorMsg = "成绩错误";
            break;
          case '5':
            errorMsg = "位次错误";
            break;
        }

        wx.showToast({
          title: errorMsg,
          icon:"none"
        });

        return;
      }
    }

    this.setData({
      completed:true,
    })

  },

  onNameChanged: function (event){

    console.log(event)

    this.data.name = event.detail.detail.value;

    if ((/^[\x07-\xff]*$/.test(this.data.name))){

      this.data.correct[0]= 0;

      wx.showToast({
        title: '名字非法,请重新填写',
        icon:'none'
      })
    }
    else
      this.data.correct[0] = 1;
    
    this.checkValid();
  },

  onGenderChanged: function (event) {
    console.log(event);
    this.data.gender = event.detail.value;
  },

  onDistrictChanged: function (event) {
    this.data.originalAddress = event.detail.detail.value;
  },
  onSchoolChanged: function (event) {
    this.data.highSchool= event.detail.detail.value;
  },
  onSubjectChanged: function (event) {
   this.data.subject = event.detail.value;
  },

  onTelChanged: function (event) {

    if (event.detail.detail.value.length != 11)
    {
      wx.showToast({
        title: '手机号无效，重新填写',
        icon: 'none'
      });

      this.data.correct[3] = 0;
    }
    else{
      this.data.correct[3] = 1;
    }

    this.data.telNumber = event.detail.detail.value;

    this.checkValid();
  },
  onScoreChanged: function (event) {

    if (event.detail.detail.value < 0 || event.detail.detail.value > 1000 ){
       wx.showToast({
        title: '您的成绩也太奇怪了吧',
        icon: 'none'
      });

      this.data.correct[4] = 0;
    }
    else
      this.data.correct[4] = 1;

    this.data.score = event.detail.detail.value;

    this.checkValid();
  },
  onRankChanged: function (event) {

    if (event.detail.detail.value < 0){
      wx.showToast({
        title: '排名不存在',
        icon: 'none'
      });
      this.data.correct[5] = 0;
    }

    else
      this.data.correct[5] = 1;

    this.data.rank = event.detail.detail.value;

    this.checkValid();
  },

})