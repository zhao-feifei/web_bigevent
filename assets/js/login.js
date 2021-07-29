$(function () {
  // 点击去注册链接事件
  $("#link_reg").on("click", function () {
    $(".login-box").hide();
    $(".reg-box").show();
  });
  // 点击去登陆链接事件
  $("#link_login").on("click", function () {
    $(".login-box").show();
    $(".reg-box").hide();
  });

  //从layui上获取表单元素
  let form = layui.form;
  let layer = layui.layer;

  //自定义校验规则
  form.verify({
    pass: [/^[\S]{6,12}$/, "密码必须6到12位，且不能出现空格"],
    repwd: function (value) {
      let pwd = $(".reg-box [name=password]").val();
      if (pwd != value) {
        console.log(value, pwd);
        return "两次密码不一致！";
      }
    },
  });

  //注册表单提交
  $("#form_reg").on("submit", function (e) {
    e.preventDefault();
    $.post(
      "/api/reguser",
      {
        username: $("#form_reg [name=username]").val(),
        password: $("#form_reg [name=password]").val(),
      },
      function (res) {
        // console.log(data.username, data.password);
        if (res.status !== 0) {
          return layer.msg(res.message);
        }
        layer.msg("注册成功!");
        //注册成功后模拟点击按钮
        $("#link_login").click();
      }
    );
  });

  // 登陆表单的提交;
  $("#form_login").submit(function (e) {
    e.preventDefault();
    $.ajax({
      url: "/api/login",
      method: "POST",
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg("登录失败");
        }
        layer.msg("登陆成功");
        //将获取到的token值保存到localStorage中
        localStorage.setItem("token", res.token);
        //跳转到后台主页
        location.href = "/index.html";
      },
    });
  });
});
