const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    user_id: String,
    credits: {type: Number, default: 0}
});

mongoose.model('users', UserSchema);
