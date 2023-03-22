const express = require('express')
// 引入路由模組
const router = express.Router()

// 引入驗證器當中間件
const { authenticator } = require('../middleware/auth')

const todos = require('./modules/todos')
router.use('/todos', authenticator, todos)

const users = require('./modules/users')
router.use('/users', users)

const auth = require('./modules/auth')
router.use('/auth',auth)

const home = require('./modules/home')
router.use('/', authenticator, home)

// 匯出路由器
module.exports = router