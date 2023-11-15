const express = require('express')
const bodyParser = require("body-parser")
const pemesananController = require('../controller/pemesanans.controller')
const app = express()

app.use(express.json())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended : false}))

app.post('/order', pemesananController.addpemesanan)

module.exports = app