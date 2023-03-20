const express = require('express')
const router = express.Router()
const User = require('../../models/user')
const passport = require('passport')

router.get('/login', (req, res) => {
  res.render('login')
})

router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/users/login',
  failureFlash:true
}))

router.get('/logout', (req, res) => {
  req.logout()
  req.flash('success_msg', "You've been logged out.")
  res.redirect('/users/login')
})

router.get('/register', (req, res) => {
  res.render('register')
})

router.post('/register', (req, res) => {
  const { name, email, password, confirmPassword } = req.body
  const errors = []

  if (!name || !email || !password || !confirmPassword) {
    errors.push({ message: 'All of the blanks are required.' })
  }
  if (password !== confirmPassword) {
    errors.push({ message: 'The password are different.' })
  }
  if (errors.length) {
    return res.render('register', {
      errors, name, email, password, confirmPassword
    })
  }

  User.findOne({ email }).then(user => {
    if (user) {
      errors.push({ message: 'The email has been registered.' })
      res.render('register', {
        errors, name, email, password, confirmPassword
      })
    }
    return User.create({
      name, email, password
    })
      .then(() => res.redirect('/'))
      .catch(error => console.log(error))
  })
})


module.exports = router