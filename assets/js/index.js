$(function () {
  getUserInfo();

  $("#btnLogout").on("click", function () {
    //提示用户是否确认退出
    layui.layer.confirm(
      "确定要退出账号吗?",
      { icon: 3, title: "提示" },
      function (index) {
        //清除token
        localStorage.removeItem("token");
        //跳转到首页
        location.href = "/login.html";
        //关闭询问框
        layui.layer.close(index);
      }
    );
  });
});

//请求用户信息
function getUserInfo() {
  $.ajax({
    method: "GET",
    url: "/my/userinfo",
    // headers: {
    //   Authorization: localStorage.getItem("token") || "",
    // },
    success: function (res) {
      console.log(res);
      if (res.status !== 0) {
        return layui.layer.msg("获取用户信息失败!");
      }
      //调用渲染头像的函数
      renderAvatar(res.data);
    },
  });
}

//渲染头像
function renderAvatar(user) {
  //获取用户名称
  var name = user.nickname || user.username;
  //设置欢迎文本
  $("#welcome").html("欢迎&nbsp;&nbsp" + name);
  //渲染用户头像或者文本头像
  if (user.user_pic !== null) {
    $(".layui-nav-img").attr("src", user.user_pic).show();
    $(".text-avatar").hide();
  } else {
    $(".layui-nav-img").hide();
    var first = name[0].toUpperCase();
    $(".text-avatar").html(first);
  }
}
