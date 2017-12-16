var express = require('express');
var router = express.Router();
var School = new require('../models/School');
var validator = require('../tools/validator');
var Channel = new require('../models/Channels');

router.get('/:schoolName', (req, res) => {
    School.findOne({schoolName : req.params.schoolName}, (err, school) => {
        if(err) {
            res.status(200).json({result : {success: false, message : '알 수 없는 오류가 발생하였습니다!'}});
        }
        res.json({
            result: {success: true, message: '학교 정보에 대해 성공적으로 조회하였습니다!'},
            school : school
        });
    });
});

router.post('/', (req, res) => {
    if(!validator.isLogin(req, res)) return;
    School.findOne({schoolName : req.body.schoolName}, (err, school) => {
        if(err) {
            res.status(200).json({result : {success : false, message: '알 수 없는 오류가 발생하였습니다!'}});
            console.log(err.stack);
        }
        if(!school) {
            School.create({schoolName : req.body.schoolName}, (err, school) => {
                if(err) {
                    res.json({result : {success :false, message: '알 수 없는 오류가 발생하였습니다!'}});
                    console.log(err.stack);
                }
                res.json({result : {success: true, message: '학교명이 성공적으로 등록되었습니다!'}});
            });
        } else {
            console.log(school);
            res.json({result : {success : false, message: '이미 존재하는 학교입니다!'}});
        }
    });
});

router.post('/add', (req, res) => {
    if(!validator.isLogin(req, res)) return;
    console.log(req.body.schoolName);
    School.findOne({schoolName : req.body.schoolName}, (err, school) => {
        if(err) {
            console.log(err.stack);
            res.status(200).json({result : {success: false, message: '알 수 없는 오류가 발생하였습니다!'}});
        }
            school.classNames.push({name: req.body.className});
            school.save();

            Channel.create({schoolName: req.body.schoolName, className: req.body.className}, (err, channel) => {
                if (err) {
                    console.log(err.stack);
                    res.status(200).json({result: {success: false, message: '알 수 없는 오류가 발생하였습니다!'}});
                }
                res.json({result: {success: true, message: '성공적으로 학급 채널을 등록하였습니다!'}});
            });
    });
});

module.exports = router;