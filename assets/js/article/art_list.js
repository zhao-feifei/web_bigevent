$(function () {
  var layer = layui.layer;
  var form = layui.form;
  var laypage = layui.laypage;
  //时间过滤器
  template.defaults.imports.dataFormat = function (date) {
    const dt = new Date(date);
    var y = padZero(dt.getFullYear());
    var m = padZero(dt.getMonth() + 1);
    var d = padZero(dt.getDate());

    var hh = padZero(dt.getHours());
    var mm = padZero(dt.getMinutes());
    var ss = padZero(dt.getSeconds());

    return y + "-" + m + "-" + d + " " + hh + ":" + mm + ":" + ss;
  };

  //定义补零的函数
  function padZero(n) {
    return n > 9 ? n : "0" + n;
  }

  //请求参数对象，后面提交到服务器
  var q = {
    pagenum: 1, //页码
    pagesize: 2, //每页显示几条数据
    cate_id: "-1", //分类id
    state: "", //发布状态
  };
  initTable();
  initCate();
  //获取文章列表数据的方法
  function initTable() {
    $.ajax({
      method: "GET",
      url: "/my/article/list",
      data: q,
      success: function (res) {
        if (res.status !== 0) {
          console.log(res);
          return layer.msg("获取文章数据失败！");
        }
        // console.log(res);
        //使用模板引擎渲染数据
        var htmlStr = template("tpl-table", res);
        // console.log(htmlStr);
        $("tbody").html(htmlStr);
        //调用渲染分页的方法
        renderPage(res.total);
      },
    });
  }

  //初始化文章分类的方法
  function initCate() {
    $.ajax({
      method: "GET",
      url: "/my/article/cates",
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg("获取分类数据失败！");
        }
        // console.log(res);
        //调用模板引擎渲染分类可选项
        var htmlStr = template("tpl-cate", res);
        $("[name=cate_id").html(htmlStr);
        form.render();
      },
    });
  }

  //为筛选表单绑定事件
  $("#form-search").on("submit", function (e) {
    e.preventDefault();
    //获取表单中选中项的值
    var cate_id = $("[name=cate_id").val();
    var state = $("[name=state").val();
    q.cate_id = cate_id;
    q.state = state;
  });

  //渲染分页的方法
  function renderPage(total) {
    laypage.render({
      elem: "pageBox", //分页容器ID
      count: total, //总条数
      limit: q.pagesize,
      curr: q.pagenum, //默认被选中的页
      layout: ["count", "limit", "prev", "page", "next", "skip"],
      limits: [2, 3, 5, 10],
      //分页发生切换时触发jump
      jump: function (obj, first) {
        //可以通过first参数判断触发jump回调的方式
        q.pagenum = obj.curr;
        q.pagesize = obj.limit;
        //根据最新的q获取数据列表并渲染表格
        if (!first) {
          initTable();
        }
      },
    });
  }

  //通过代理为删除按钮绑定事件
  $("tbody").on("click", ".btn-delete", function () {
    //获取删除按钮的个数
    var len = $(".btn-delete").length;
    //获取到文章的ID
    var id = $(this).attr("data-id");
    layer.confirm("确认删除?", { icon: 3, title: "提示" }, function (index) {
      $.ajax({
        method: "GET",
        url: "/my/article/delete/" + id,
        success: function (res) {
          if (res.status !== 0) {
            return layer.msg("删除失败！");
          }
          layer.msg("删除成功！");
          //判断当前页是否还有数据，没有则  页码值减一
          if (len === 1) {
            q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1;
          }
          initTable();
        },
      });
      layer.close();
    });
  });
});
