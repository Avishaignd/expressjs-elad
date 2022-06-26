const express = require('express')
const router = express.Router()
const { addNewUser, getAllUsers, updateUser } = require('../controls/userCtrl.js')
const multer = require('multer')

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, './uploads')
    },
    filename: function(req, file, cb) {
      cb(null, file.originalname)
    }
})

const upload = multer({ storage })

router.get('/', getAllUsers)

router.post('/AddUser', upload.single('photo'), addNewUser)

router.put('/:id', updateUser)

module.exports = router