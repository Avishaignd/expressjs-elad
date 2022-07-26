const express = require('express')
const app = express()
const port = 3000 || process.env.PORT
const path = require('path')
const userRouter = require('./routes/userRouter')
const mongoose = require('mongoose')

mongoose.connect(process.env.MONGO_URL).then(console.log('App is connected to Database')).catch((err) => console.log(err))

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3006')
    next()
})
app.use('/users', userRouter)

// this middleware simply logs in the console "hey" and calls the next middleware in line //

function logging(req, res, next) {
    console.log("hey!");
    next()
}

// this middleware logs "hey again!" and then ends the request response cycle by sending the client a status 200 and a message //

function otherLogging(req, res, next) {
    console.log("hey again!");
    res.status(200).send("all is good")
}

// this function sends as a response a file to the client //

app.get('/html', (req, res) => {
    res.download(path.join(__dirname, 'assets/Capture.PNG'))
})

// listen to specified port and execute a function //

app.listen(port, () => {
    console.log('listening on port '+ port)
})