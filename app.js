const express = require('express')
const session = require('express-session')
const usePassport = require('./config/passport')
const flash = require('connect-flash')


const app = express()
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')
// 以上套件因使用上有包含相關變數，故一定要在app = express()之後宣告

const PORT = process.env.PORT || 3000

// 引用todo.js中的 Schema
const Todo = require('./models/todo')
require('./config/mongoose')

// extname:指定副檔名為縮寫的hbs
app.engine('hbs', exphbs.engine({ extname: '.hbs', defaultLayout: 'main' }))
app.set('view engine', 'hbs')

app.use(session({
  secret: 'ThisIsMySecret',
  resave: false,
  saveUninitialized: true
}))

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

usePassport(app)
app.use(flash())
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated()
  res.locals.user = req.user
  res.locals.success_msg = req.flash('success_msg')
  res.locals.warning_msg = req.flash('warning_msg')
  next()
})

// 引用路由器 (設定/routes即會自動尋找底下的index.js)
const routes = require('./routes')
// 將 request 導入路由器
app.use(routes)


app.listen(PORT, () => {
  console.log(`Succeed in running on port ${PORT}.`)
})