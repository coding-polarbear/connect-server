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

router.post('/schools/classes', (req, res) => {
    if(!validator.isLogin(req, res)) return;
    Channel.findOne({className : req.body.className, schoolName : req.body.schoolName}, (err, channel) => {
        if(err) {
            console.log(err.stack);
            res.status(200).json({result : {success : false, message : '알 수 없는 오류가 발생하였습니다!'}});
        }
        if(channel) {
            channel.contents.push({content: req.body.content, aurthor: req.user.username});
            console.log(channel.contents);
            channel.save();
            res.json({result : {success :true, message: '성공적으로 등록되었습니다!'}});
        } else {
            res.json({result :  {success :false, message: '채널이 없습니다!'}});
        }
    });
});

router.post('/schools/classes/withImages', (req, res) => {
    if(!validator.isLogin(req, res)) return;
    Channel.findOne({className : req.body.className,schoolName : req.body.schoolName}, (err, channel) => {
        if(err) {
            console.log(err.stack);
            res.status(200).json({result : {success : false, message : '알 수 없는 오류가 발생하였습니다!'}});
        }
        var date = Date.now();
        if(channel && req.files && req.files.profile) {
            req.files.profile.mv(`${__dirname}/../public/images/${req.user.username}-${date}.jpg`);
            channel.contents.push({content: req.body.content, aurthor: req.user.username , date : date});
            channel.save();
            res.json({result : {success :true, message: '성공적으로 등록되었습니다!'}});
        } else {
            console.log(channel);
            res.json({result :  {success :false, message: '채널이 없습니다!'}});
        }
    });
});

router.get('/schools/classes/:schoolName', (req, res) => {
    Channel.findOne({schoolName : req.params.schoolName}, (err, channel) => {
        if(err) {
            console.log(err);
            res.status(200).json({result : {success : false, message : '알 수 없는 오류가 발생하였습니다!'}});
        }
        if(channel) {
            console.log(channel);
            res.json({
                result: {success: true, message: '성공적으로 조회되었습니다!'},
                contents: channel.contents
            });
        }
    });
});

module.exports = router;