const express = require('express')
const router = express.Router()
const { addNewUser, getAllUsers, updateUser, getFriends, alternateUpdate, addFriend, complexQuery } = require('../controls/userCtrl.js')
const multer = require('multer')

// defining where multer will save the files we upload to the server //

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './uploads')
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname)
    }
})

const upload = multer({ storage })

router.get('/', getAllUsers)

router.get('/complex', complexQuery)

router.get('/friends/:id', getFriends)

router.post('/AddUser', upload.single('photo'), addNewUser)

router.put('/:id', updateUser)

router.put('/:id/alt', alternateUpdate)

router.put('/:id/addFriend', addFriend)


module.exports = router