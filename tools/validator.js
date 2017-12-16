const CHECK_LIST = {
    basic: [
        { code: 1, property: 'username', reg: /^(?=.*)[a-zA-Z0-9]{6,20}$/, message: '6~20자 이내의 대소문자 & 숫자 조합인 ID가 필요합니다.' },
        { code: 2, property: 'password', reg: /^(?=.*[0-9])[a-zA-Z0-9!@#$%^&*]{6,20}$/, message: '6~20글자의 대소문자, 숫자가 포함된 암호가 필요합니다.' },
        { code: 3, property : 'schoolName', reg: /^.{1,30}$/m, message : '학교 이름을 제대로 입력하세요'},
        { code: 4, property : 'position', reg: /^(parent|teacher)$/, message : 'parent or teacher를 입력하세요' }
    ],
    diary : [
        {code : 3, property : 'title', reg : /^.{1,20}$/m, message : '제목은 20자 이내로 입력해야 합니다!'},
        {code : 4, property : 'content', reg : /^.{1,1000}$/m, message : '본문은 1000자 이내로 입력해야 합니다!'}
    ]
};
module.exports = {

    checkData: (req, res, service, isStrict) => {
        let result = {};
        for (let item of CHECK_LIST[service]) {
            // 해당 property가 존재하지 않을 시 isStrict가 true 면 정규식 검사 후 !false
            // 해당 property가 존재하지 않을 시 isStrict가 false 면 pass
            if (req.body[item.property] && item.reg.exec(req.body[item.property])) {
                result[item.property] = req.body[item.property];
            } else {
                if (!isStrict && !req.body[item.property]) continue;
                res.status(200).json({
                    result: { success: false, message: `${item.property} : ${item.message}` },
                    code: item.code
                }).end();
                return false;
            }
        }
        return result;
    },

    isLogin: (req, res) => {
        if (req.user) return true;
        res.status(200).json({
            result: { success: false, message: '로그인이 필요한 서비스입니다.' }
        }).end();
        return false;
    },

    isAdmin: (req, res) => {
        if (req.user.isAdmin === true) return true;
        res.status(200).json({
            result: { success: false, message: '권한이 부족합니다.' }
        }).end();
        return false;
    },

};