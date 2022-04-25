const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    user_id: String
});

//Export model
mongoose.model('users', UserSchema);
