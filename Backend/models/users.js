const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    username: {type: String, required: true},
    email: {type: String, required: true}, 
    password: {type: String, required: true}, 
    createdAt : {type: Date, default: Date.now}, // Date de création du compte
    profilePicture: {type: String, default: 'default.jpg'}  
})

const User = mongoose.model('users', userSchema);
module.exports = User;
