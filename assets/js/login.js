$(function () {
    // 登录注册切换功能
    $('#link_reg').click(() => {
        $('.login-box').hide();
        $('.reg-box').show();
    })
    $('#link_login').click(() => {
        $('.login-box').show();
        $('.reg-box').hide();
    })
    // 引入 form 模块
    const form = layui.form;
    const layer =layui.layer
    // 自定义检测规则
    form.verify({
        // 密码校验规则
        pwd: [/^[\S]{6,12}$/, "密码必须6到12位，且不能出现空格"],
        // 确认密码校验规则
        repwd: (value) => {
            // 1.获取当前输入的值
            // 2.获取密码框的值
            // 3.两者进行判断
            // 4.如果不一致，进行提示
            const pwd = $('#form_reg [name="password"]').val();
            if (pwd !== value) return '输入的密码不一致'
        }
    })
   

    $('#form_reg').on('submit', (e) => {
        e.preventDefault();
        $.ajax({
            type: 'POST',
            url:  '/api/reguser',
            data: {
                username: $("#form_reg [name=username").val(),
                password: $("#form_reg [name=password").val(),
            },
            success: (res) => {
                if (res.status != 0) return layer.msg(res.message)
                layer.msg(res.message)
                $('#link_login').click()
            }
        })
    })

    // 登入功能
    $('#form_login').on('submit', function (e) {
        e.preventDefault()
        $.ajax({
            type: 'POST',
            url: '/api/login',
            data: $(this).serialize(),
            success: res => {
                if (res.status !== 0) return layer.msg(res.message)
                layer.msg(res.message)
                // 登入成功后把token令牌放在本地
                localStorage.setItem("token", res.token)
                // 跳转到主页
                location.href ='/index.html'
            }
        })
    })
})