var mongoose = require('mongoose');
var channelSchema = new mongoose.Schema({
    schoolName : {type : String, required : true},
    className : {type : String, required: true},
    contents : [{
        date : {type : Date, default : Date.now()},
        content : {type : String, required : true},
        aurthor : {type : String, required : true}
    }]
});

module.exports = mongoose.model('channel', channelSchema);