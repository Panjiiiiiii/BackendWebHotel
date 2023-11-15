const express = require('express')
const bodyParser = require("body-parser")
const usersController = require('../controller/users.controller')
let {validateuser} = require(`../middlewares/users-validation`)
const { authVerify } = require('../auth/auth')
const { checkRole } = require('../middlewares/checkrole')
const app = express()

app.use(express.json())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

app.post("/login", usersController.login)
app.get("/", authVerify, checkRole (["admin", "resepsionis"]), usersController.getAllUsers)
app.post("/find/:id", authVerify, checkRole(["admin", "resepsionis"]), usersController.findUsers)
app.post("/register", usersController.LoginRegister)
app.post("/insert", usersController.addUsers)
app.put("/update/:id", usersController.updateUsers)
app.delete("/delete/:id", usersController.deleteUsers)
app.post("/validate/insert", [validateuser], usersController.addUsers)
app.put("/validate/update/:id", [validateuser], usersController.updateUsers)

module.exports = app