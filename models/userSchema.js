const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true,
        min: [10, "must be at least 10 years old"]
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    photo: {
        type: String,
        required: false
    },
    friends: {
        type: [mongoose.SchemaTypes.ObjectId],
        ref: "User",
        required: false
    }
})

const User = mongoose.model('User', userSchema)
module.exports = User