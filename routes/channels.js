var express = require('express');
var router = express.Router();
var Channel = new require('../models/Channels');
var School = new require('../models/School');
var validator = require('../tools/validator');

router.post('/schools', (req, res) => {
    if(!validator.isLogin(req, res)) return;
    if(!validator.isAdmin(req, res)) return;
    School.findOne({schoolName : req.body.schoolName} , (err, school) => {
        if(err) {
            res.status(200).json({result: {success: false, message: '알 수 없는 오류가 발생하였습니다!'}});
        }
        console.log(req.body);
        if(school) {
            school.contents.push({content: req.body.content, aurthor: req.user.username});
            school.save();
            console.log(school);
            res.json({result: {success: true, message: '성공적으로 데이터를 업로드 했습니다!'}});
        } else {
            res.json({result : {success : false, message : '없는 학교입니다'}});
        }
    });
});

router.post('/schools/withImages', (req, res) => {
    if(!validator.isLogin(req, res)) return;
    if(!validator.isAdmin(req, res)) return;
    School.findOne({schoolName : req.body.schoolName} , (err, school) => {
        if(err) {
            res.status(200).json({result : {success: false, message : '알 수 없는 오류가 발생하였습니다!'}});
        }
        var date = Date.now();
        if(school &&  req.files && req.files.profile) {
            req.files.profile.mv(`${__dirname}/../public/images/${req.user.username}-${date}.jpg`);
            school.contents.push({
                content: req.body.content,
                aurthor: req.user.username,
                date: date
            });
            school.save();
            res.json({result: {success: true, message: '성공적으로 데이터를 업로드 했습니다!'}});
        }
    });
});

module.exports = router;