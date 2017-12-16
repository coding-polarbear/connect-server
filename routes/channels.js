var express = require('express');
var router = express.Router();
var Channel = new require('../models/Channels');
var School = new require('../models/School');
var validator = require('../tools/validator');

router.post('/schools', (req, res) => {
    if(!validator.isLogin(req, res)) return;
    if(req.user.position !== 'admin')
        res.json({result : {success :false, message: '관리자만 학교에 메시지를 넣을 수 있습니다!'}});
    School.findOne({schoolName : req.body.schoolName} , (err, school) => {
        if(err) {
            res.status(200).json({result : {success: false, message : '알 수 없는 오류가 발생하였습니다!'}});
        }
        school.contents.push({
            content : req.body.content,
            aurthor : req.user.username
        });
        school.contents.save();
        res.json({result : {success :true, message : '성공적으로 데이터를 업로드 했습니다!'}});
    });
});