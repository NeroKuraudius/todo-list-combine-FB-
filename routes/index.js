const express = require('express')
// 引入路由模組
const router = express.Router()

// 引入驗證器當中間件
const { authenticator } = require('../middleware/auth')

// 路由的路徑若為'/todos'，就執行todos中的程式碼
const todos = require('./modules/todos')
router.use('/todos', authenticator, todos)

// 路由的路徑若為'/users'，就執行todos中的程式碼
const users = require('./modules/users')
router.use('/users', users)

// 當路由的路徑為'/'時，執行home裡面的程式碼
const home = require('./modules/home')
router.use('/', authenticator, home)

// 匯出路由器
module.exports = router