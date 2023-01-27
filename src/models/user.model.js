const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
    },
    score : {
        type : Number,
        required : true
    }
},{
    versionKey : false,

}
);

const User = mongoose.model('user', userSchema);

module.exports = User;