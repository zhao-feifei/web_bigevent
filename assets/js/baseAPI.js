//每次调用$请求之前都会调用此函数
$.ajaxPrefilter(function (options) {
  options.url = options.url + "http://api-breakingnews-web.itheima.net";
});
