
const db = require('../db/index')
const bcrypt = require('bcryptjs')
// 获取用户的基本信息
module.exports.userinfo = (req, res) => {
    const sql = `select id, username, nickname, email, user_pic from ev_user where id=?`
    db.query(sql, req.user.id, (err, data) => {
        if (err) {
            return res.cc(err)
        }
        if (data.length !== 1) {
            return res.cc('获取用户信息失败！')
        }
        res.send({
            status: 0,
            message: '获取用户基本信息成功！',
            data: data[0],
        })
    })
}
// 更新用户的基本信息
module.exports.updateUserInfo = (req, res) => {
    const sql = `update ev_user set ? where id=?`
    db.query(sql, [req.body, req.body.id], (err, result) => {
        if (err) {
            return res.cc(err);
        }
        if (result.affectedRows) {
            return res.cc('修改用户基本信息失败！')
        }
        return res.cc('修改用户基本信息成功！', 0)
    })
}
// 更新密码
module.exports.updatePassword = (req, res) => {
    //根据id查询信息
    const sql = `select * from ev_user where id=?`
    db.query(sql, req.user.id, (err, result) => {
        if (err) {
            return res.cc(err)
        }
        if (result.length !== 1) {
            return res.cc('用户不存在！')
        }
        // 判断提交的旧密码是否正确
        const compareResult = bcrypt.compareSync(req.body.oldPwd, result[0].password)
        if (!compareResult) return res.cc('原密码错误！')
        req.body.newPwd = bcrypt.hashSync(req.body.newPwd, 10)
        const sql = `update ev_user set password=? where id=?`
        db.query(sql, [req.body.newPwd, req.user.id], (err, results) => {
            // SQL 语句执行失败
            if (err) return res.cc(err)

            // SQL 语句执行成功，但是影响行数不等于 1
            if (results.affectedRows !== 1) return res.cc('更新密码失败！')

            // 更新密码成功
            res.cc('更新密码成功！', 0)
        })
    })
}
//更新头像
module.exports.updateAvatar = (req, res) => {
    // SQL 语句执行
    const sql = 'update ev_user set user_pic=? where id=?'
    db.query(sql, [req.body.avatar, req.user.id], (err, result) => {
        if (err) {
            return res.cc(err)
        }
        if (result.affectedRows !== 1) {
            return res.cc('更新头像失败！')
        }
        return res.cc('更新头像成功！', 0)
    })

}