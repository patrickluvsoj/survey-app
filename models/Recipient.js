
const mongoose = require('mongoose');

const { Schema } = mongoose;


const RecipientSchema = Schema({
    email: String,
    responded: { type: Boolean, default: false },
});

module.exports = RecipientSchema;