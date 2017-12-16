var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var User = new require('../models/User');
var config = require('../configs/config');

router.post('/', (req, res) => {
    User.findOne({username : req.body.username}, (err, user) => {
        if(err)
            res.status(200).json({result : {success :false, message : '알 수 없는 오류가 발생하였습니다!'}});
        if(user && user.password === req.body.password) {
            var payload = {
                username : user.username,
                className : user.className,
                schoolName: user.schoolName,
                position : user.Position,
                isAdmin : user.isAdmin
            };
            console.log(payload);
            var token = jwt.sign(payload, config.salt, {algorithm : config.jwtAlgorithm});
            user.password = undefined;
            res.json({
                result : {
                    success : true,
                    message : '로그인에 성공하였습니다!'
                },
                token : {token : token},
                user : user
            });
        } else {
            res.json({result : {success : false, message : '아이디 또는 비밀번호를 확인해주세요!!'}});
        }
    });
});

module.exports = router;