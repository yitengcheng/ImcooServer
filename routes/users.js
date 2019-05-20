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

// 修改购物车中商品数量
router.post('/cart/edit', (req, res, next) => {
    let userId = req.cookies.userId,
        productId = req.body.productId,
        productNum = req.body.productNum,
        checked = req.body.checked;
    User.update({ userId, 'cartList.productId': productId }, {
        'cartList.$.productNum': productNum,
        'cartList.$.checked': checked
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

// 购物车全选
router.post('/cart/editCheckAll', (req, res, next) => {
    let userId = req.cookies.userId,
        checkAll = req.body.checkAll;
    User.findOne({ userId }, (err, user) => {
        if (err) {
            res.json({
                success: false,
                msg: err.message
            });
        } else {
            if (user) {
                user.cartList.forEach(item => {
                    item.checked = checkAll ? 1 : 0;
                });
            } else {
                res.json({
                    success: false,
                    msg: '数据错误'
                });
            }
            user.save((err1, doc) => {
                if (err1) {
                    res.json({
                        success: false,
                        msg: err1.message
                    });
                } else {
                    res.json({
                        success: true
                    });
                }
            });
        }
    });
});

// 查询用户地址列表
router.post('/addressList', (req, res, next) => {
    let userId = req.cookies.userId;
    User.findOne({ userId }, (err, userDoc) => {
        if (err) {
            res.json({
                success: false,
                msg: err.message
            });
        } else {
            if (userDoc) {
                res.json({
                    success: true,
                    addressList: userDoc.addressList
                });
            } else {
                res.json({
                    success: false,
                    msg: '数据错误'
                });
            }
        }
    });
});

// 设置默认地址
router.post('/setDefault', (req, res, next) => {
    let userId = req.cookies.userId;
    let addressId = req.body.addressId;
    // eslint-disable-next-line no-console
    console.log(addressId);
    if (!addressId) {
        res.json({
            success: false,
            msg: 'addressId为空'
        });
        return;
    }
    User.findOne({ userId }, (err, doc) => {
        if (err) {
            res.json({
                success: false,
                msg: err.message
            });
        } else {
            if (doc) {
                let addressList = doc.addressList;
                addressList.forEach(item => {
                    if (item.addressId === addressId) {
                        item.isDefault = true;
                    } else {
                        item.isDefault = false;
                    }
                });
                doc.save((err1, doc1) => {
                    if (err1) {
                        res.json({
                            success: false,
                            msg: err1.message
                        });
                    } else {
                        res.json({
                            success: true,
                        });
                    }
                });
            } else {
                res.json({
                    success: false,
                    msg: '数据错误'
                });
            }
        }
    });
});

module.exports = router;
