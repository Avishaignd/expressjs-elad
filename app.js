const express = require('express')
const app = express()
const port = 3000
const path = require('path')
const bodyParser = require('body-parser')
const userRouter = require('./routes/userRouter')


app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));

app.use('/users', userRouter)


app.listen(port, () => {
    console.log('listening on port '+ port)
})