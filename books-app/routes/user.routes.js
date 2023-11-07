const express = require('express')
const router = express.Router()

const { isLoggedIn, checkRole } = require('../middleware/route-guard')

router.get("/perfil", isLoggedIn, (req, res) => {
  res.render("user/profile", { user: req.session.currentUser })
})

// new: role-based access
router.get("/admin", isLoggedIn, checkRole('ADMIN', 'EDITOR'), (req, res) => {
  res.render("user/admin-panel", { user: req.session.currentUser })
})

module.exports = router