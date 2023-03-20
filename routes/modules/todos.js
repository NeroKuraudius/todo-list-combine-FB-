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
  const userId = req.user._id
  const name = req.body.name
  return Todo.create({ name, userId }) //存回資料庫
    .then(() => { res.redirect('/') }) //新增後導回首頁
    .catch(error => { console.log(error) })
})

// 特定資料瀏覽
router.get('/:id', (req, res) => {
  const userId = req.user._id
  const id = req.params.id
  return Todo.findOne({ id, userId })
    .lean()
    .then(todo => res.render('detail', { todo }))
    .catch(error => { console.log(error) })
})

// 資料編輯頁
router.get('/:id/edit', (req, res) => {
  const userId = req.user._id
  const id = req.params.id
  return Todo.findOne({ id, userId })
    .lean()
    .then((todo) => res.render('edit', { todo }))
    .catch(error => console.log(error))
})

// 資料編輯後儲存
router.put('/:id', (req, res) => {
  const userId = req.user._id
  const id = req.params.id
  const { isDone, name } = req.body

  return Todo.findOne({ id, userId })
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
  const userId = req.user._id
  const id = req.params.id
  return Todo.findOne({ id, userId })
    .then(todo => todo.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

// 匯出模組
module.exports = router