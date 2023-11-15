const express = require('express')
const bodyParser = require("body-parser")
const typesController = require('../controller/tipe_kamars.controller')
const app = express()

app.use(express.json())
app.use(bodyParser.urlencoded({extended:false}))

app.get("/", typesController.getAllType)
app.post("/find", typesController.findType)
app.post("/insert",typesController.addType)
app.put("/update/:id", typesController.updateType)
app.delete("/delete/:id", typesController.deleteType)

module.exports = app