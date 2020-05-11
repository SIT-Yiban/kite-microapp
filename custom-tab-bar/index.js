// custom-tab-bar/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    list: [{
      pagePath: "/pages/index/index",
      text: "主页"
    },{
      pagePath: "/pages/person/person",
      text: "个人"
    }]
  },

  /**
   * 组件的方法列表
   */
  methods: {
   switchTab(e){
    const data = e.currentTarget.dataset
    const url = data.path
    wx.switchTab({
       url
    })
   }
  }
})
