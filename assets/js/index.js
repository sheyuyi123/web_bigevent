// 获取用户基本信息
function getUserIofo() {
    $.ajax({
        type: "GET",
        url: '/my/userinfo',
        // headers: {
        //     Authorization: localStorage.getItem("token"),
        // },
        success: res => {
            console.log(res)
            if (res.status != 0) return layer.msg(res.message)
            layer.msg(res.message)
           renderAvatar(res.data)
        }
    })
}
// 渲染用户信息
const renderAvatar = (user) => {
    console.log(user);
    let uname = user.nickname || user.username
    // 渲染欢迎语
    $('#welcome').html(`欢迎您${uname}`)
    // 按需渲染头像
    if (user.user_pic !== null) {
        // 设置图片头像
        $(".layui-nav-img").attr("src", user.user_pic).show();
        $(".text-avatar").hide();
    }
    else {
        // 设置文本头像
        $(".layui-nav-img").hide();
        $(".text-avatar").html(uname[0].toUpperCase())
    }
}

$('#btnlogout').click(() => {
    layer.confirm("是否确认退出?", { icon: 3, title: "提示" }, function (index) {
        localStorage.removeItem('token')
        location.href = '/login.html'
    })
})


getUserIofo()