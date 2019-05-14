var express = require('express');
var router = express.Router();

let User = require('../models/user.js');

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});

// 登录
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
                res.cookie('userId', doc.userId, {
                    path: '/',
                    maxAge: 1000 * 60 * 60
                });
                res.cookie('userName', doc.userName, {
                    path: '/',
                    maxAge: 1000 * 60 * 60
                });
                res.json({
                    success: true,
                    user: doc
                });
            } else {
                res.json({
                    success: false,
                    msg: '账号密码有误'
                });
            }
        }
    });
});

// 登出
router.post('/logout', (req, res, next) => {
    res.cookie('userId', '', {
        path: '/',
        maxAge: -1
    });
    res.json({
        success: true,
    });
});

// 检查登录
router.post('/checkLogin', (req, res, next) => {
    User.findOne({ userId: req.cookies.userId }, (err, doc) => {
        if (err) {
            res.json({
                success: false,
                msg: err.message
            });
        } else {
            if (doc) {
                res.cookie('userId', doc.userId, {
                    path: '/',
                    maxAge: 1000 * 60 * 60
                });
                res.cookie('userName', doc.userName, {
                    path: '/',
                    maxAge: 1000 * 60 * 60
                });
                res.json({
                    success: true,
                    user: doc
                });
            }
        }
    });
});

// 查询当前用户的购物车
router.post('/cartList', (req, res, next) => {
    let userId = req.cookies.userId;
    User.findOne({ userId }, (err, doc) => {
        if (err) {
            res.json({
                success: false,
                msg: err.message
            });
        } else {
            if (doc) {
                res.json({
                    success: true,
                    cartList: doc.cartList
                });
            } else {
                res.json({
                    success: false,
                    cartList: []
                });
            }
        }
    });
});

// 删除购物车商品
router.post('/cart/del', (req, res, next) => {
    let userId = req.cookies.userId, productId = req.body.productId;
    User.update({ userId }, {
        $pull: {
            'cartList': {
                'productId': productId
            }
        }
    }, (err, doc) => {
        if (err) {
            res.json({
                success: false,
                msg: err.message
            });
        } else {
            res.json({
                success: true
            });
        }
    });
});

module.exports = router;
