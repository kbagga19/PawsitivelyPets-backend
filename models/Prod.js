const mongoose = require('mongoose');
const {Schema, model} = mongoose;

const products = new Schema({
    description: String,
    price: String,
    title: String,
    img: String,
    qty: String
});

const prod = model('products', products);

module.exports = prod;