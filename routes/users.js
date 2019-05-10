var express = require('express');
var router = express.Router();

let User = require('../models/user.js');

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});

router.post('/login', (req, res, next) => {
    let param = {
        userName: req.body.userName,
        userPwd: req.body.userPwd
    };
    User.findOne(param, (err, doc) => {
        if (err) {
            res.json({
                success: false,
                msg: err.message
            });
        } else {
            if (doc) {
                res.json({
                    success: true,
                    user: doc
                });
            } else {
                res.cookie('userId', doc.userId, {
                    path: '/',
                    maxAge: 1000 * 60 * 60
                });
                res.json({
                    success: false,
                    msg: '账号密码有误'
                });
            }
        }
    });
});

module.exports = router;
