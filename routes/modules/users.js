const express = require('express')
const router = express.Router()
const User = require('../../models/user')

router.get('/login', (req, res) => {
  res.render('login')
})

router.post('/login', (req, res) => {

})

router.get('/register', (req, res) => {
  res.render('register')
})

router.post('/register', (req, res) => {
  const { name, email, password, confirmPassword } = req.body

  User.findOne({ email }).then(user => {
    if (user) {
      console.log('使用者已註冊')
      res.render('register', { name, email, password, confirmPassword })
    } else {
      return User.create({
        name, email, password
      })
        .then(() => res.redirect('/'))
        .catch(error => console.log(error))
    }
  })
    .catch(error => console.log(error))
})


module.exports = router