const express = require('express')
const app = express()
const port = 3000 || process.env.PORT
const path = require('path')
const bodyParser = require('body-parser')
const userRouter = require('./routes/userRouter')
const mongoose = require('mongoose')


mongoose.connect(process.env.MONGO_URL).then(console.log('connected')).catch((err) => console.log(err))

app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));

app.use('/users', userRouter)

app.post('/', (req, res) => {
    console.log(req.body);
})

app.listen(port, () => {
    console.log('listening on port '+ port)
})