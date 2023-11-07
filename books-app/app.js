require("dotenv").config()
require("./db")

const express = require("express")
const app = express()

require('./config')(app)
require('./config/session.config')(app)

app.locals.appTitle = `BookKing_`

const indexRoutes = require("./routes/index.routes")
app.use("/", indexRoutes)

const booksRoutes = require("./routes/books.routes")
app.use("/libros", booksRoutes)

const authRoutes = require("./routes/auth.routes")
app.use("/", authRoutes)

const userRoutes = require("./routes/user.routes")
app.use("/", userRoutes)

require("./error-handling")(app)

module.exports = app