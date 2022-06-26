const User = require('../models/userSchema')
const bcrypt = require('bcrypt')
const fs = require('fs')
require('dotenv').config()
const cloudinary = require('cloudinary').v2

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

const addNewUser = async (req, res, next) => {
    const filePath = req.file.path
    const uniqueFileName = new Date().getMilliseconds()
    cloudinary.uploader.upload(
        filePath,
        { public_id: `express-elad/${uniqueFileName}` },
        async (err, image) => {
            if (err) return res.send(err)
            console.log('file-uploaded');
            fs.unlinkSync(filePath)
            const newUser = req.body
            const hashedPassword = await bcrypt.hash(newUser.password, 10)
            newUser.password = hashedPassword
            const userToSave = new User(newUser)
            userToSave.photo = image.secure_url
            await userToSave.save(function (err, userToSave) {
                if (err) return console.error(err)
            })
            res.send(userToSave)
        }
    )

}

const getAllUsers = (req, res) => {
    User.find(function (err, users) {
        if (err) return console.error(err);
        res.send(users);
    })
};

const updateUser = async (req, res) => {
    const userId = req.params.id
    const data = req.body
    const userToUpdate = await User.findOne({ _id: userId })
    if (await bcrypt.compare(data.password, userToUpdate.password)) {
        userToUpdate.firstName = data.firstName
        userToUpdate.lastName = data.lastName
        userToUpdate.email = data.email
        await userToUpdate.save()
        res.send(userToUpdate)
    } else {
        res.send('wrong pass')
    }
}

module.exports = { addNewUser, getAllUsers, updateUser };