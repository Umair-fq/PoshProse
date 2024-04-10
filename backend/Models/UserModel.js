const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const UserSchema = new Schema ({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
    },
    googleId: { 
        type: String, 
        unique: true, 
        sparse: true 
    }, // Unique if not null
    bio: {
        type: String,
    }, 
    status: { // Possible values: 'active', 'inactive', 'banned'
        type: String, 
        default: 'active' 
    }, 
    favorites: [{
        type: Schema.Types.ObjectId,
        ref: 'Blog'
    }],

}, {timestamps:true})

const User = mongoose.model('User', UserSchema);
module.exports = User;