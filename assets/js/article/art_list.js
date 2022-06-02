$(function () {
    const laypage = layui.laypage
     const form = layui.form
    // 定义查询参数对象，存放发送请求时的数据
    const q = {
        pagenum: 1, // 页码，默认为第一个
        pagesize: 2, // 每页显示的条数
        cate_id: "", // 查询分类文章的id
        status: "" // 查询文章的状态
    }

    // 获取表格数据
    const initTable = function () {
        $.ajax({
            type: "GET",
            url: "/my/article/list",
            data:q,
            success: res => {
                console.log(res);
                if (res.status !== 0) return layer.msg('获取文章列表失败')
                const htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
                renderpage(res.total)
            }
            
        })
    }
    const initCate = () => {
        $.ajax({
            type: 'GET',
            url: "/my/article/cates",
            success: res => {
                if (res.status !== 0) return layer.msg('获取文章失败')
                const htmlStr = template('tpl-cate',res)
                $('[name =cate_id]').html(htmlStr)
                form.render()
            }
        })
    }
    // 渲染页面
    const renderpage = (total) => {
        laypage.render({
            elem: 'pageBox', // 分页容器的 Id
            count: total, // 总数据条数
            limit: q.pagesize, // 每页显示几条数据
            curr: q.pagenum, // 设置默认被选中的分页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],// 每页展示多少条
            // jump 触发条件
            // 1、渲染的时候会先加载一次，此时 first参数为true
            // 2、切换页码的时候也会触发，此时 first 参数为 undefined
            jump: (obj, first) => {
                console.log(first);
                q.pagenum = obj.curr
                q.pagesize = obj.limit
                // 渲染的时候不要调用，只有切换的时候才去调用
                if (!first) {
                    initTable()
                }
            }
        })
    }
    // 删除文章
    $('tbody').on('click', '.btn-delete', function () {
        const len = $('.btn-delete').length
        const id = $(this).attr('data-id')
        layer.confirm('是否删除?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                type: 'GET',
                url: '/my/article/delete/' + id,
                success: res => {
                    if (res.status !== 0) return layer.msg('删除文章失败')
                    layer.msg('删除文章成功')
                    if (len === 1) {
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    initTable()
                    layer.close(index)
                }
            
            })
        })
    })



    $('#form-search').on('submit', function (e) {
        e.preventDefault()
        q.cate_id = $('[name="cate_id"]').val()
        q.state = $('[name="state"]').val()
        initTable()
    })
    // 定义美化时间的过滤器
    template.defaults.imports.dataFormat = function(date) {
        const dt = new Date(date)

        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }

    // 定义补零的函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }

    initTable()
    initCate()
})