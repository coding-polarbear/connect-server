var mongoose = require('mongoose');
var userSchema = new mongoose.Schema({
    username : {type : String, required : true},
    password : {type : String, required : true},
    schoolName : {type : String, required : true},
    position : {type : String, required : true},
    classNames : [{
        name : {type : String, required : true}
    }]
});

module.exports = mongoose.model('user', userSchema);