const db = require("../db");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const config = require('../config')
exports.reguser = (req, res) => {
    //获取客户端的表单数据
    const userinfo = req.body

    //判断数据是否合法
    // if (!userinfo.username || !userinfo.password) {
    //     return res.cc('用户名或密码不能为空！')
    // }
    //判断用户名是否被占用
    // const sql = '' + userinfo.username;
    const sql = `select * from ev_user where username= '${userinfo.username}'`

    db.query(sql, function (err, results) {
        // 执行 SQL 语句失败
        if (err) {
            return res.cc(err)
        }
        console.log(results);
        // 用户名被占用
        if (results.length > 0) {
            return res.cc('用户名被占用，请更换其他用户名！')
        }
        // TODO: 用户名可用，继续后续流程...
        //用户名可用
        // 对用户的密码,进行 bcrype 加密，返回值是加密之后的密码字符串
        userinfo.password = bcrypt.hashSync(userinfo.password, 10);
        console.log(userinfo.password);
        //定义插入新用户的语句
        const sql1 = 'insert into ev_user set ?'
        //定义db.query()执行sql语句
        db.query(sql1, { username: userinfo.username, password: userinfo.password }, function (err, results) {
            // 执行 SQL 语句失败
            if (err) return res.cc(err)
            // SQL 语句执行成功，但影响行数不为 1
            if (results.affectedRows !== 1) {
                return res.cc('注册用户失败，请稍后再试！')
            } else {
                // 注册成功
                res.cc('注册成功！', 0)
            }

        })


    })
}
exports.login = (req, res) => {
    const userinfo = req.body;
    //sql语句
    const sql = `select * from ev_user where username=?`
    db.query(sql, userinfo.username, function (err, results) {
        // 执行 SQL 语句失败
        if (err) {
            return res.cc(err)
        }
        // 执行 SQL 语句成功，但是查询到数据条数不等于 1
        if (results.length !== 1) {
            return res.cc('登录失败！')
        }
        // TODO：判断用户输入的登录密码是否和数据库中的密码一致
        const compareResult = bcrypt.compareSync(userinfo.password, results[0].password)
        // 比较密码
        if (!compareResult) {
            return res.cc('登录失败！')
        }

        const user = { ...results[0], password: '', user_pic: '' }
        const tokenStr = jwt.sign(user, config.jwtSecretKey, { expiresIn: '10h' })
        //将token响应给客户端
        res.send({
            status: 0,
            message: '登录成功！',
            // 为了方便客户端使用 Token，在服务器端直接拼接上 Bearer 的前缀
            token: tokenStr
        })
    })
}