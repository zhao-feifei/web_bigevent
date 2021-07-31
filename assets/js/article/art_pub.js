$(function () {
  var layer = layui.layer;
  //初始化富文本编辑器
  initEditor();
  // 定义加载文章分类的方法
  initCate();
  function initCate() {
    $.ajax({
      method: "GET",
      url: "/my/article/cates",
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg("初始化文章分类失败！");
        }
        //调用模板引擎，渲染下拉菜单
        var htmlStr = template("tpl-cate", res);
        $("[name=cate_id").html(htmlStr);
        //重新渲染
        layui.form.render();
      },
    });
  }

  // 1. 初始化图片裁剪器
  var $image = $("#image");

  // 2. 裁剪选项
  var options = {
    aspectRatio: 400 / 280,
    preview: ".img-preview",
  };

  // 3. 初始化裁剪区域
  $image.cropper(options);
  //   为选择封面按钮绑定事件
  $("#btnChooseImage").on("click", function () {
    $("#coverFile").click();
  });

  //   监听coverFile的change事件
  $("#coverFile").on("change", function (e) {
    //拿到文件列表
    var files = e.target.files;
    if (files.length === 0) {
      return;
    }
    var newImgURL = URL.createObjectURL(files[0]);
    $image
      .cropper("destroy") // 销毁旧的裁剪区域
      .attr("src", newImgURL) // 重新设置图片路径
      .cropper(options); // 重新初始化裁剪区域
  });

  //   定义文章的发布状态，默认是已发布
  var art_state = "已发布";
  //存为草稿按钮的点击事件
  $("#btnSave2").on("click", function () {
    art_state = "草稿";
  });

  //为表单绑定提交事件
  $("#form_pub").on("submit", function (e) {
    e.preventDefault();
    //基于表单快速创建一个form对象
    var fd = new FormData($(this)[0]);
    //将文章的发布状态保存到fd中
    fd.append("state", art_state);
    //将裁剪后的图片转化为文件对象
    $image
      .cropper("getCroppedCanvas", {
        // 创建一个 Canvas 画布
        width: 400,
        height: 280,
      })
      .toBlob(function (blob) {
        // 将 Canvas 画布上的内容，转化为文件对象
        // 得到文件对象后，进行后续的操作
        //将文件对象存储到fd中
        fd.append("cover_img", blob);
        //发出请求
        publishArticle(fd);
      });
  });

  //定义发布文章的方法
  function publishArticle(fd) {
    $.ajax({
      method: "POST",
      url: "/my/article/add",
      data: fd,
      //如果向服务器提交的是Formdata格式的数据，
      //必须添加以下两个配置项
      contentType: false,
      processData: false,
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg("发布文章失败！");
        }
        layer.msg("发布文章成功！");
        //发布之后跳转到文章列表页面
        location.href = "/article/art_list.html";
      },
    });
  }
});
