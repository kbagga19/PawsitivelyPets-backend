const mongoose = require('mongoose');
const {Schema, model} = mongoose;

const PetSchema = new Schema({
    name: String,
    type: String,
    breed: String,
    gender: String,
    vaccination: String,
    age: String, 
    content: String,
    cover: String,
    owner: {type:Schema.Types.ObjectId, ref:'User'},
});

const PetModel = model('Pet', PetSchema);

module.exports = PetModel;