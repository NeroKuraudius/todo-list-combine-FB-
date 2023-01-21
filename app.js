const express = require('express')
const mongoose = require('mongoose')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const app = express()
const exphbs = require('express-handlebars')
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })

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

app.get('/', (req, res) => {
  Todo.find() // 取出Todo model中的資料
    .lean() // ※point※把Mongoose的Model物件換成乾淨的JS資料
    .then(todos => { res.render('index', { todos }) }) // {todos} = { todos : todos }
    .catch(error => { console.error(error) }) //錯誤捕捉
})

app.listen(3000, () => {
  console.log('Succeed in running on port 3000.')
})