const express = require('express')
const app = express()
const path = require('path')
const indexRouter = require('./app/routes/index')
const noteRouter = require("./app/routes/note")
const userRouter = require("./app/routes/user")
const handleError = require("./app/services/handleError")

require('dotenv').config()
require('./app/config/connection')

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))

app.use((req, res, next) => {
    console.log('\x1b[35m > Request time:', Date.now(), '\x1b[0m')
    console.log('\x1b[35m > Request method:', req.method, '\x1b[0m')
    console.log('\x1b[35m > Request path:', req.path, '\x1b[0m')
    console.log('\x1b[35m > Request url:', req.url, '\x1b[0m')
    next()
})
app.use("/note", noteRouter)
app.use("/user", userRouter)
app.use("/", indexRouter)

app.use((req, res, next) => {
    let err = {}
    if (!req.route) {
        err.statusCode = 404
        err.message = "Router Not Found"
        return next(err)
    }
    next()
})

app.use((err, req, res, next) => {
    handleError(err, res)
})

app.set('PORT', process.env.PORT)
app.listen(app.get('PORT'), function () {
    console.log(`\x1b[33m > Server listen on port ${app.get('PORT')}\x1b[0m`)
})