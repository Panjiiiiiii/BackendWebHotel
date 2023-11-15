const express = require('express')
const bodyParser = require("body-parser")
const app = express()
const {authenticate} = require(`../controller/auth.controller`)

app.use(express.json())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
app.post(`/`, authenticate)

module.exports = app