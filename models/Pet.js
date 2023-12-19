const mongoose = require('mongoose');
const {Schema, model} = mongoose;

const PetSchema = new Schema({
    name: String,
    type: String,
    breed: String,
    gender: String,
    isVaccinated: String,
    isRescued: String,
    age: String, 
    aboutPet: String,
    reasonForAdoption: String,
    img: String,
    location: String,
    email: String,
    contactName: String
},{
    timestamps: true,
});

const PetModel = model('Pet', PetSchema);

module.exports = PetModel;