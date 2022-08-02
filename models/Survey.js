const mongoose = require('mongoose');
const RecipientSchema = require('./Recipient');

const { Schema } = mongoose;

const SurveySchema = new Schema({
    title: String,
    subject: String,
    body: String,
    from: String,
    recipients: [RecipientSchema],
    yes: { type: Number, default: 0},
    no: { type: Number, default: 0},
    _user: { type: Schema.Types.ObjectId, ref: 'users'},
    dateSent: Date,
    lastResponded: Date,
});

//Export model
mongoose.model('surveys', SurveySchema);
