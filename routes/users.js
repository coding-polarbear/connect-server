var express = require('express');
var router = express.Router();
var User = new require('../models/User');

var validator = require('../tools/validator');

// /* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

router.post('/', (req, res) => {
  console.log(req.body);
  User.findOne({username : req.body.username}, (err, user) => {
    if(err)
      res.status(200).json({result : {success : false, message : '알 수 없는 오류가 발생하였습니다!'}});
    if(!user) {
        if (req.files && req.files.profile) {
            var userData = validator.checkData(req, res, 'basic', true);
            if (!userData) return;
            req.files.profile.mv(`${__dirname}/../public/images/${userData.username}.jpg`, (err) => {
              if(err) res.json({result : {success : false, message : '프로필 업로드에서 에러가 발생하였습니다!'}});
              User.create(userData, (err, user) => {
                  if(err) {
                      console.log(err.stack);
                  } else{
                      res.json({result: {success: true, message: '회원가입에 성공하였습니다'}});
                  }
              });
            });
        } else {
          res.json({result : {success : false, message : '프로필을 업로드해주세요!'}});
        }
    } else {
      res.json({result : {success : false, message : '이미 존재하는 아이디입니다!'}});
    }
  });
});


router.put('/:username', (req, res) => {
    if(!validator.isLogin(req, res)) return;
    var userData = validator.checkData(req, res, 'basic', false);
    console.log(req.body);
    if(!userData) return;
    if(req.params.username === req.user.username) {
        User.update({username: req.params.username}, req.body, (err, result) => {
            if (err) {
                res.status(200).json({result: {success: false, message: '알 수 없는 오류가 발생했습니다!'}});
                console.log(err);
            }
            User.findOne({username : req.params.username} ,(err, user) => {
                if (req.files && req.files.profile) {
                    req.files.profile.mv(`${__dirname}/../public/images/${userData.username}.jpg`, (err) => {
                        if(err) res.status(200).json({result: {success: false, message: '프로필 업로드 도중 오류가 발생하였습니다!'}});
                    });
                }
                res.json({
                    result : {success : true, message : '성공적으로 회원 정보를 업데이트 하였습니다!'},
                    user : user});
            }).select('-password');
        });
    } else {
        res.json({result : {success :  false, message : '권한이 없습니다!'}});
    }
});

router.delete('/:username',(req, res) => {
    if(!validator.isLogin(req,res)) return;
    if(req.user.username === req.params.username) {
        User.findOne({username: req.params.username}, (err, user) => {
            if (err) {
                res.json({result: {success: false, messae: '알 수 없는 오류가 발생하였습니다!'}});
            }
            user.remove();
            res.json({result: {success: true, message: '회원 탈퇴에 성공하였습니다!'}});
        });
    } else {
        res.json({result : {success : false, message : '권한이 없습니다!'}});
    }
});
module.exports = router;
