const express = require('express')
// 引入路由模組
const router = express.Router()

// 引入 home 模組程式碼
// 當路由的路徑為'/'時，執行home裡面的程式碼
const home = require('./modules/home')
router.use('/', home)

// 引入todos模組程式碼
const todos = require('./modules/todos')
// 路由的路徑若為'/todos'，就執行todos中的程式碼
router.use('/todos', todos)

// 引入user模組程式碼
const users = require('./modules/users')
// 路由的路徑若為'/users'，就執行todos中的程式碼
router.use('/users', users)

// 匯出路由器
module.exports = router