var jwt = require('jsonwebtoken');
var config = require('../configs/config');
module.exports = (req, res, next) => {
    console.log("header : " + req.headers.toString());
    if(req.headers.authorization) {
        jwt.verify(req.headers.authorization, config.salt , (err, decoded) => {
            if (!err && decoded) {
                req.user = decoded;
            }
        });
    }
    next();
};