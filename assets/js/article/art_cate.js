$(function () {
  var layer = layui.layer;
  var form = layui.form;
  initArtCateList();
  //获取文章分类列表
  function initArtCateList() {
    $.ajax({
      method: "GET",
      url: "/my/article/cates",
      success: function (res) {
        //将数据填充到id为tpl-table的模板中
        var htmlStr = template("tpl-table", res);
        //渲染进表格
        $("tbody").html(htmlStr);
      },
    });
  }
  //弹出层的索引，保存下来关闭时候用
  var indexAdd = null;
  //添加类别按钮绑定事件
  $("#btnAddCate").on("click", function () {
    indexAdd = layer.open({
      type: 1,
      title: "添加文章分类",
      area: ["500px", "250px"],
      content: $("#dialog-add").html(),
    });
  });

  //这里通过代理的形式为表单绑定提交时间，因为表单是动态渲染出来的不能直接绑定
  $("body").on("submit", "#form-add", function (e) {
    e.preventDefault();
    $.ajax({
      method: "POST",
      url: "/my/article/addcates",
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg("添加分类失败！");
        }
        initArtCateList();
        layer.msg("添加分类成功！");
        //根据索引关闭弹出层
        layer.close(indexAdd);
      },
    });
  });

  //为编辑按钮绑定点击事件
  var indexEdit = null;
  $("body").on("click", ".btn-edit", function () {
    //弹出层
    indexEdit = layer.open({
      type: 1,
      title: "修改文章分类",
      area: ["500px", "250px"],
      content: $("#dialog-edit").html(),
    });

    var id = $(this).attr("data-id");
    console.log(id);
    //发起请求获取分类数据
    $.ajax({
      method: "GET",
      url: "/my/article/cates/" + id,
      success: function (res) {
        form.val("form-edit", res.data);
      },
    });
  });

  //通过代理为修改分类的表单绑定submit事件
  $("body").on("submit", "#form-edit", function (e) {
    e.preventDefault();
    $.ajax({
      method: "POST",
      url: "/my/article/updatecate",
      data: $(this).serialize(),
      success: function (res) {
        console.log(res);
        if (res.status !== 0) {
          return layer.msg("更新分类失败！");
        }

        layer.msg("更新分类成功！");
        //根据索引关闭弹出层
        layer.close(indexEdit);
        initArtCateList();
      },
    });
  });

  //通过代理的形式为删除按钮绑定单击事件
  $("tbody").on("click", ".btn-delete", function (e) {
    var id = $(this).attr("data-id");
    //提示用户是否删除
    layer.confirm(
      "确定要删除此分类🐎?",
      { icon: 3, title: "确认删除" },
      function (index) {
        $.ajax({
          method: "GET",
          url: "/my/article/deletecate/" + id,
          success: function (res) {
            if (res.status !== 0) {
              return layer.msg("删除分类失败！");
            }
            layer.msg("删除分类成功！");
            initArtCateList();
            layer.close(index);
          },
        });
      }
    );
  });
});
