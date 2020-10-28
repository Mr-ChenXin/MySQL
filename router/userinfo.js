//个人中心
const express = require('express');
//创建路由对象
const router = express.Router()
//导入验证规则
const { update_userinfo_schema, update_password_schema, update_avatar_schema } = require('../schema/user')
//导入
const expressJoi = require('@escook/express-joi')
const userinfo_handler = require('../router_handler/userinfo')
//获取用户的基本信息
router.get('/userinfo', userinfo_handler.userinfo)
// 更新用户的基本信息
router.post('/userinfo', expressJoi(update_userinfo_schema), userinfo_handler.updateUserInfo)
//更新密码
router.post('/updatepwd', expressJoi(update_password_schema), userinfo_handler.updatePassword)
//更新用户头像
router.post('/update/avatar', expressJoi(update_avatar_schema), userinfo_handler.updateAvatar)
//将路由对象暴露
module.exports = router;