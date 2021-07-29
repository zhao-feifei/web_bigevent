// 每次调用$请求之前都会调用此函数,
//注意：这里拼接顺序不能搞错了
$.ajaxPrefilter(function (options) {
  options.url = "http://api-breakingnews-web.itheima.net" + options.url;

  //为需要权限的接口设置请求头
  if (options.url.indexOf("/my/") !== -1) {
    options.headers = { Authorization: localStorage.getItem("token") || "" };
  }

  //全局统一挂载回调
  options.complete = function (res) {
    //判断服务器返回的信息是否符合页面跳转的前提
    if (
      res.responseJSON.status === 1 &&
      res.responseJSON.message === "身份认证失败！"
    ) {
      //清空token并且跳转到登录页面
      localStorage.removeItem("token");
      location.href = "/login.html";
    }
  };
});
