const mongoose = require('mongoose');
const {Schema, model} = mongoose;

const UserSchema = new Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, min: 10, unique: true},
    password: {type: String, required: true, min: 5}
});

const UserModel = model('User', UserSchema);


module.exports = UserModel;
