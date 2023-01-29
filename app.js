const express = require('express')
const mongoose = require('mongoose')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const app = express()
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
// 以上套件因使用上有包含相關變數，故一定要在app = express()之後宣告

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
app.use(methodOverride('_method'))

//主頁
app.get('/', (req, res) => {
  Todo.find() // 取出Todo model中的資料
    .sort({ _id: 'asc' }) // 正序：asc、反序：desc
    .lean() // ※point※把Mongoose的Model物件換成乾淨的JS資料
    .then(todos => { res.render('index', { todos }) }) // {todos} = { todos : todos }
    .catch(error => { console.error(error) }) //錯誤捕捉
})

// 新增頁
app.get('/todos/new', (req, res) => {
  return res.render('new')
})

// 資料儲存
app.post('/todos', (req, res) => {
  const name = req.body.name
  return Todo.create({ name }) //存回資料庫
    .then(() => { res.redirect('/') }) //新增厚導回首頁
    .catch(error => { console.log(error) })
})

// 特定資料瀏覽
app.get('/todos/:id', (req, res) => {
  const id = req.params.id
  return Todo.findById(id)
    .lean()
    .then(todo => res.render('detail', { todo }))
    .catch(error => { console.log(error) })
})

// 資料編輯頁
app.get('/todos/:id/edit', (req, res) => {
  const id = req.params.id
  return Todo.findById(id)
    .lean()
    .then((todo) => res.render('edit', { todo }))
    .catch(error => console.log(error))
})

// 資料編輯後儲存
app.put('/todos/:id', (req, res) => {
  const id = req.params.id
  const { name, isDone } = req.body

  return Todo.findById(id)
    .then(todo => {
      todo.name = name
      todo.isDone = isDone === 'on'
      return todo.save()
    })
    .then(() => { res.redirect(`/todos/${id}`) })
    .catch(error => console.log(error))
})

// 資料刪除
app.delete('/todos/:id', (req, res) => {
  const id = req.params.id
  return Todo.findById(id)
    .then(todo => todo.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

app.listen(3000, () => {
  console.log('Succeed in running on port 3000.')
})