$(function(){
    // 点击去注册链接事件
    $('#link_reg').on('click',function(){
        $('.login-box').hide()
        $('.reg-box').show()
    })
    // 点击去登陆链接事件
    $('#link_login').on('click',function(){
        $('.login-box').show()
        $('.reg-box').hide()
    })

    //从layui上获取表单元素
    let form=layui.form

    //自定义校验规则
    form.verify({
        'pass': [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ]
    })

})