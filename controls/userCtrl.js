const User = require("../models/userSchema");
const bcrypt = require("bcrypt");
const fs = require("fs");
require("dotenv").config();
const cloudinary = require("cloudinary").v2;

// using ditenv we are able to keep some data private and configure cloudinary's connection settings //

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});


// creating a new user with a hashed password using bcrypt, checking if a photo was uploaded, updating the user's image url, after the user was created the image is removed from our uploads folder and the user data is sent to the client //

const addNewUser = async (req, res, next) => {
  const newUser = req.body;
  const hashedPassword = await bcrypt.hash(newUser.password, 10);
  newUser.password = hashedPassword;
  const userToSave = new User(newUser);
  if (req.file) {
    const filePath = req.file.path;
    const uniqueFileName = new Date().toISOString();
    cloudinary.uploader.upload(
      filePath,
      { public_id: `express-elad/${uniqueFileName}` },
      async (err, image) => {
        if (err) return res.send(err);
        console.log("file-uploaded");
        fs.unlinkSync(filePath);
        userToSave.photo = image.secure_url;
        await userToSave.save(function (err, userToSave) {
          if (err) {
            console.error(err.message);
            res.send(err.message);
          }
        });
        res.status(201).json(userToSave);
      }
    );
  } else {
    await userToSave.save(function (err, userToSave) {
      if (err) {
        console.error(err.message);
        res.send(err.message);
      }
      res.status(201).json(userToSave);
    });
  }
};

const getAllUsers = (req, res) => {
  User.find(function (err, users) {
    if (err) return console.error(err);
    res.status(200).json(users);
  });
};


// finding a user by id, comparing the password sent to the hashed one, updating all the fields sent from the client side, and then saving the updated user //

const updateUser = async (req, res) => {
  const userId = req.params.id;
  const data = req.body;
  const userToUpdate = await User.findOne({ _id: userId });
  if (await bcrypt.compare(data.password, userToUpdate.password)) {
    userToUpdate.firstName = data.firstName;
    userToUpdate.lastName = data.lastName;
    userToUpdate.email = data.email;
    userToUpdate.age = data.age;
    await userToUpdate.save((err, user) => {
      if (err) {
        console.error(err);
        res.status(400).send(err.message);
      } else {
        res.status(200).json(user);
      }
    });
  } else {
    res.status(401).send("wrong pass");
  }
};

// does not go through schema validation and therefore should not be used as much //
// the data passed to the function is the id, the data to update in the doc, options, and a callback //

const alternateUpdate = async (req, res) => {
  const userId = req.params.id;
  const data = req.body;
  User.findByIdAndUpdate(
    userId,
    { age: data.age },
    {returnDocument: "after"},
    function (err, docs) {
      if (err) {
        console.log(err);
        res.send(err.message)
      } else {
        console.log("Updated User : ", docs);
        res.send(docs)
      }
    }
  );
};

const addFriend = async (req, res) => {
    const userId = req.params.id;
    const {name} = req.body
    const userToEdit = await User.findOne({_id: userId})
    const userToAddToFriends = await User.findOne({firstName: name})
    userToEdit.friends.push(userToAddToFriends._id)
    const edited = await userToEdit.save()
    res.send(edited)
}


// the populate method gets us the actual document of the friend instead of just giving us it's id //

const getFriends = async (req, res) => {
  const userId = req.params.id;
  const user = await User.findOne({ _id: userId }).populate({
    path: "friends",
    limit: 1
  });
  res.send(user);
};

// different query options //

const complexQuery = async (req, res) => {
  // const found = await User.find({age: {$lt: 60, $gt: 19}}, {email: 0}).and({friends: {$eq: []}})
  // const found = await User.find({firstName: {$in: ['boris']}})
  const found = await User.find({friends: {$size: 1}})
  res.status(200).json(found);
}

module.exports = { addNewUser, getAllUsers, updateUser, getFriends, alternateUpdate, addFriend, complexQuery };
