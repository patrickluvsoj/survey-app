var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var UserSchema = new Schema({
    user_id: {type: String, required: true},
});

//Export model
mongoose.model('users', UserSchema);