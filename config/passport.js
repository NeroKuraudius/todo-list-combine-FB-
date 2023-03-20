const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

const User = require('../models/user')

module.exports = app => {
  // 初始化 passport模組
  app.use(passport.initialize())
  app.use(passport.session())

  // 設定登入策略：本地策略
  passport.use(new LocalStrategy({ usernameField: 'email', passReqToCallback: true }, (req, email, password, done) => {
    User.findOne({ email })
      .then(user => {
        if (!user) {
          return done(null, false, req.flash('warning_msg', 'This email has not been registered.'))
        }
        if (user.password !== password) {
          return done(null, false, req.flash('warning_msg', 'The password is incorrect.'))
        }
        return done(null, user)
      })
      .catch(error => done(err, false))
  }))

  // 設定序列化、反序列化
  passport.serializeUser((user, done) => {
    done(null, user._id)
  })
  passport.deserializeUser((id, done) => {
    User.findById(id)
      .lean()
      .then(user => done(null, user))
      .catch(err => done(err))
  })
} 