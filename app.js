const express = require('express')
const mongoose = require('mongoose')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const app = express()
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })

// 引用todo.js中的 Schema
const Todo = require('./models/todo')

const db = mongoose.connection
// 連線失敗
db.on('error', () => {
  console.log('mongodb error!')
})
// 連線成功
db.once('open', () => {
  console.log('mongodb connected!')
})

// extname:指定副檔名為縮寫的hbs
app.engine('hbs', exphbs.engine({ extname: '.hbs', defaultLayout: 'main' }))
app.set('view engine', 'hbs')

app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', (req, res) => {
  Todo.find() // 取出Todo model中的資料
    .lean() // ※point※把Mongoose的Model物件換成乾淨的JS資料
    .then(todos => { res.render('index', { todos }) }) // {todos} = { todos : todos }
    .catch(error => { console.error(error) }) //錯誤捕捉
})

app.get('/todos/new', (req, res) => {
  return res.render('new')
})

app.post('/todos', (req, res) => {
  const name = req.body.name
  return Todo.create({ name }) //存回資料庫
    .then(() => { res.redirect('/') }) //新增厚導回首頁
    .catch(error => { console.log(error) })
})

app.get('/todos/:id', (req, res) => {
  const id = req.params.id
  return Todo.findById(id)
    .lean()
    .then(todo => res.render('detail', { todo }))
    .catch(error => { console.log(error) })
})

app.listen(3000, () => {
  console.log('Succeed in running on port 3000.')
})