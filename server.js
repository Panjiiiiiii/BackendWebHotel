const express = require('express')
const app = express()
const port = 3000
const cors = require('cors')
const bodyParser = require("body-parser")

const usersRoute = require('./routes/users.route')
const typeRoute = require('./routes/tipe_kamars.route')
const pemesananRoute = require('./routes/pemesanans.route')
const auth = require('./routes/auth.route')

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))

app.use('/users', usersRoute)
app.use('/tipe_kamar', typeRoute)
app.use('/pemesanan', pemesananRoute)
app.use(express.static(__dirname))
app.use(`/auth`, auth)

app.listen(port, () => {
    console.log(`Server hotel UKK runs on port ${port}`)
})