const express = require('express')
const router = express.Router()
// 引用 Todo model
const Todo = require('../../models/todo')


// 新增頁
router.get('/new', (req, res) => {
  return res.render('new')
})

// 資料儲存
router.post('/', (req, res) => {
  const name = req.body.name
  return Todo.create({ name }) //存回資料庫
    .then(() => { res.redirect('/') }) //新增厚導回首頁
    .catch(error => { console.log(error) })
})

// 特定資料瀏覽
router.get('/:id', (req, res) => {
  const id = req.params.id
  return Todo.findById(id)
    .lean()
    .then(todo => res.render('detail', { todo }))
    .catch(error => { console.log(error) })
})

// 資料編輯頁
router.get('/:id/edit', (req, res) => {
  const id = req.params.id
  return Todo.findById(id)
    .lean()
    .then((todo) => res.render('edit', { todo }))
    .catch(error => console.log(error))
})

// 資料編輯後儲存
router.put('/:id', (req, res) => {
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
router.delete('/:id', (req, res) => {
  const id = req.params.id
  return Todo.findById(id)
    .then(todo => todo.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

// 匯出模組
module.exports = router