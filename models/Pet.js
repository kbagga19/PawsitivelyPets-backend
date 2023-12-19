const mongoose = require('mongoose');
const {Schema, model} = mongoose;

const PetSchema = new Schema({
    name: String,
    gender: String,
    content: String,
    age: String, 
    cover: String,
    owner: {type:Schema.Types.ObjectId, ref:'User'},
});

const PetModel = model('Pet', PetSchema);

module.exports = PetModel;