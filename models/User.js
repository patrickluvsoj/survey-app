var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var UserSchema = new Schema({
    user_id: String
});

//Export model
mongoose.model('users', UserSchema);
