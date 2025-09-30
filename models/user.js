const mongoose = require('mongoose');
const passportlocal = require('passport-local-mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    email: {
        type:String,
        required: true,
        unique: true
    }
});
// to add on username and password:
UserSchema.plugin(passportlocal);

module.exports = mongoose.model('User', UserSchema);
