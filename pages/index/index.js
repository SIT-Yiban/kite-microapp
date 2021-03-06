// 主页
// pages/person/person.js
const app = getApp();
const requestUtils = require("../../utils/requestUtils");

Page({
  data: {
    selected: -1,
    id: "",
    animation_data: "",
    notice:[],
    menu_list: [{
        id: "welcome",
        text: "迎新",
        iconPath: "/asset/icon/main_icon/user.png"
      },
      {
        id: "inquiry",
        text: "电费",
        iconPath: "/asset/icon/main_icon/electricity.png"
      } /* ,
      {
        id: "education",
        text: "教务",
        iconPath: "/asset/icon/main_icon/kecheng.png"
      },
      {
        id: "activity",
        text: "活动",
        iconPath: "/asset/icon/main_icon/tuandui.png"
      },
      {
        id: "shopping",
        text: "闲置",
        iconPath: "/asset/icon/main_icon/dianpu.png"
      }, {
        id: "lost",
        text: "失物",
        iconPath: "/asset/icon/main_icon/sousuo.png"
      } */
    ]
  },

  onLoad() {
    this.getNotice();
  },

  getNotice() {

    const url = `${app.globalData.commonUrl}/notice`;
    const data = {};
    const header = {
      "content-type": "application/x-www-form-urlencoded",
      "Authorization": `Bearer ${app.globalData.token}`
    };

    requestUtils.doGET(url, data, header).then(res => {
      this.setData({notice: res.data.data});
      console.log("公告数据：", res.data.data);
    }).catch(
      res => console.log(res)
    );

  },

  move(e) {
    const dataset = e.currentTarget.dataset;
    this.setData({
      animation_data: "animation: living .5s ease;",
      selected: dataset.index,
      id: dataset.id
    });
    this.router(this.data.id);
  },

  router(pageId) {

    const url_freshman = "/freshman/pages/freshman";

    let url = new Map([
        [ "welcome"   , url_freshman + "/welcome/welcome" ],
        [ "qrcode"    , "/pages/qrcode/qrcode" ],
        [ "education" , "/pages/education/education" ],
        [ "activity"  , "/pages/activity/activity" ],
        [ "shopping"  , "/pages/shopping/shopping" ],
        [ "lost"      , "/pages/lost/lost" ],
        [ "inquiry"   , "/pages/consume/electricity/electricity" ]
    ]).get(pageId);

    if (url === undefined) {
      console.error("找不到对应的 url", {id: pageId, url});
      throw "找不到对应的 url";
    }

    // 如果点击新生但是 userDetail 不为空，那么直接跳入到 stuInfoDetail
    const userDetail = app.globalData.userDetail;
    if (pageId === "welcome" && userDetail != "" && userDetail != null) {
      url = url_freshman + "/stuInfoDetail/stuInfoDetail";
    }

    const isLogin = app.globalData.isLogin;
    if (isLogin) {
      // 已登录，跳转到目标页面
      wx.navigateTo({
        url,
        fail: () => wx.showModal({ // 页面跳转失败时，显示未完成
          title: "尚未完成",
          content: "别急别急，正在努力开发~",
          confirmText: "知道了",
          showCancel: false
        })
      })
    } else {
      // 未登录，提示用户登录
      wx.showModal({ // 页面跳转失败显示未完成
        title: "请登录",
        content: "尚未登录，请前往登录",
        success: res => res.confirm && this.goLogin()
      })
    }
  },

  goLogin() {
    wx.switchTab({
      url: '/pages/person/person'
    })
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 0 });
    }
  },

  goTemp() {
    const userDetail = app.globalData.userDetail;
    const url = "/pages/freshman" + (
      userDetail != "" && userDetail != null
      ? "/stuInfoDetail/stuInfoDetail"
      : "/welcome/welcome"
    );
    wx.navigateTo({
      url: url,
      success: function () {
        console.log("跳转成功")
      },
      fail: function (res) {
        console.log(res);
        console.log("跳转失败")
      }
    })
  },

  goNavigate() {
    wx.navigateTo({
      url: '/pages/freshman/navigate/navigate'
    });
  },
  onShareAppMessage() {
    return {
      title: "上应小风筝",
      path: "pages/index/index"
    };
  }
})
