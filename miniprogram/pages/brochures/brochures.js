// miniprogram/pages/brochures.js
Page({
  downloadPDF:function(){
    wx.downloadFile({
      url: 'https://7363-scu-undergraduate-tu0da-1259519748.tcb.qcloud.la/Admissionsattachment.pdf?sign=8312831978d07bee699456f52c40defb&t=1561537675',
      success: function (res) {
        const filePath = res.tempFilePath
        wx.openDocument({
          filePath: filePath,
          success: function (res) {
            console.log('打开文档成功')
          }
        })
      }
    })
  }
})