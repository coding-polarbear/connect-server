var mongoose = require('mongoose');
var schoolSchema = new mongoose.Schema({
    schoolName : {type: String, required:true},
    classNames :[{
        name : {type : String, required : true}
    }],
    contents : [{
        aurthor : {type : String, required : true},
        date : {type : Date, default : Date.now()},
        content : {type : Date, required : true}
    }]
});
module.exports = mongoose.model('school', schoolSchema);