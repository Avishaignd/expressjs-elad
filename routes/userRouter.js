const express = require('express')
const router = express.Router()
const data = require('../mock-data.json')
const { addNewUser } = require('../controls/userCtrl.js')
const multer = require('multer')
const upload = multer({ dest: 'uploads/' })


router.get('/', (req, res) => {
    res.send(data)
})

router.post('/AddUser', upload.none(), addNewUser)


module.exports = router