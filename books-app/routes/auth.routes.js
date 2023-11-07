const express = require('express')
const router = express.Router()

const bcrypt = require('bcryptjs')
const User = require('../models/User.model')
const saltRounds = 10

const { isLoggedOut } = require('../middleware/route-guard')

router.get("/registro", isLoggedOut, (req, res) => {
  res.render("auth/signup")
})

router.post("/registro", isLoggedOut, (req, res, next) => {

  const { username, email, plainPassword } = req.body

  bcrypt
    .genSalt(saltRounds)
    .then(salt => bcrypt.hash(plainPassword, salt))
    .then(passwordHash => User.create({ username, email, password: passwordHash }))
    .then(() => res.redirect('/inicio-sesion'))
    .catch(err => next(err))
})






router.get("/inicio-sesion", isLoggedOut, (req, res) => {
  res.render("auth/login")
})

router.post("/inicio-sesion", isLoggedOut, (req, res, next) => {

  const { email, password } = req.body

  if (email.length === 0 || password.length === 0) {
    res.render('auth/login', { errorMessage: 'Rellena todos los campos' })
    return
  }

  User
    .findOne({ email })
    .then(foundUser => {

      if (!foundUser) {
        res.render('auth/login', { errorMessage: 'Email no registrado' })
        return
      }

      if (bcrypt.compareSync(password, foundUser.password) === false) {
        res.render('auth/login', { errorMessage: 'Contraseña incorrecta' })
        return
      }

      req.session.currentUser = foundUser     // inicio de sesión
      console.log('SESIÓN INICIADA ->', req.session)
      res.redirect('/')
    })
    .catch(err => next(err))
})



router.get('/cerrar-sesion', (req, res) => {
  req.session.destroy(() => res.redirect('/'))
})


module.exports = router