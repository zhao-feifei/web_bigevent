$(function () {
  var form = layui.form;

  form.verify({
    nickname: function (value) {
      if (value.length > 6) {
        return "昵称必须小于6";
      }
    },
  });

  initUserInfo();
  //初始化用户信息
  function initUserInfo() {
    $.ajax({
      method: "GET",
      url: "/my/userinfo",
      success: function (res) {
        if (res.status !== 0) {
          return layui.layer.msg("获取用户信息失败！");
        }
        //调用form为表单快速复赋值
        form.val("formUserInfo", res.data);
      },
    });
  }
  //重置表单
  $("#btnReset").on("click", function (e) {
    //阻止表单的默认清空
    e.preventDefault();
    //重置表单信息
    initUserInfo();
  });

  //修改用户信息
  $(".layui-form").on("submit", function (e) {
    e.preventDefault();
    $.ajax({
      method: "POST",
      url: "/my/userinfo",
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layui.layer.msg("更新用户信息失败");
        }
        layui.layer.msg("更新用户信息成功");
        //调用父页面中的方法，更新头像和信息
        window.parent.getUserInfo();
      },
    });
  });
});
