// 导入express模块
const express = require('express')
const expressJWT = require('express-jwt')
const config = require('./config')
//创建服务器实例
// 导入并使用文章分类路由模块
const artCateRouter = require('./router/artcate')
const app = express()
// 导入 cors 中间件解决跨域
const cors = require('cors')
const joi = require('@hapi/joi')
// 将 cors 注册为全局中间件
app.use(cors())
//获取用户提交表单的数据
app.use(express.urlencoded({ extended: false }));
//一定要在路由前封装res.cc函数
app.use((req, res, next) => {
    //status 默认是1 表示失败
    //err的值 可能是错误对象 
    res.cc = function (err, status = 1) {
        res.send({
            status,
            // 状态描述，判断 err 是 错误对象 还是 字符串
            message: err instanceof Error ? err.message : err,
        })
    }
    next()
})
//解析json格式的数据
app.use(express.json())
// 托管静态资源文件
app.use('/uploads', express.static('./uploads'))
app.use(expressJWT({ secret: config.jwtSecretKey }).unless({ path: [/^\/api\//] }))
// 导入并注册用户路由模块
const userRouter = require('./router/user')
app.use('/api', userRouter)
// 导入并使用用户信息路由模块
const userinfoRouter = require('./router/userinfo')
// 注意：以 /my 开头的接口，都是有权限的接口，需要进行 Token 身份认证
app.use('/my', userinfoRouter)
// 为文章分类的路由挂载统一的访问前缀 /my/article
app.use('/my/article', artCateRouter)
// 导入并使用文章路由模块
const articleRouter = require('./router/article')
// 为文章的路由挂载统一的访问前缀 /my/article
app.use('/my/article', articleRouter)
// 错误中间件
app.use(function (err, req, res, next) {
    // console.log(err);
    // 数据验证失败
    if (err instanceof joi.ValidationError) return res.cc(err)
    if (err.name === 'UnauthorizedError') return res.cc('身份认证失败！')
    // 未知错误
    res.cc(err)
})
//调用listen方法启动服务器
app.listen(80, () => {
    console.log('http://127.0.0.1');
})