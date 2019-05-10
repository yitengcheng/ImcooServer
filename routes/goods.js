let express = require('express');
let router = express.Router();

let Goods = require('../models/goods.js');
let User = require('../models/user.js');
const PRICEFILTER = [
    {
        startPrice: 0.00,
        endPrice: 500.00
    },
    {
        startPrice: 500.00,
        endPrice: 1000.00
    },
    {
        startPrice: 1000.00,
        endPrice: 2000.00
    }
];

// 查询商品列表
router.post('/', (req, res, next) => {
    let page = req.body.page;
    let pageSize = 10;
    let sort = req.body.sort;
    let params = {};
    let priceLevel = req.body.priceLevel;
    if (priceLevel !== 'all') {
        params = {
            salePrice: {
                $gt: PRICEFILTER[priceLevel].startPrice,
                $lte: PRICEFILTER[priceLevel].endPrice
            }
        };
    }
    Goods.find(params).skip((page - 1) * pageSize).limit(pageSize)
        .sort({ 'salePrice': sort })
        .exec((err, doc) => {
            if (err) {
                res.json({
                    success: false,
                    msg: err.message
                });
            } else {
                res.json({
                    success: true,
                    count: doc.length,
                    list: doc
                });
            }
        });
});

// 加入购物车
router.post("/addCart", (req, res, next) => {
    let userId = "100000077";
    let productId = req.body.productId;
    let user = {};
    User.findOne({ userId }, (err, userDoc) => {
        if (err) {
            res.json({
                success: false,
                msg: err.message
            });
        } else {
            if (userDoc) {
                let goodsItem = '';
                userDoc.cartList.forEach(item => {
                    if (item.productId === productId) {
                        goodsItem = item;
                        item.productNum++;
                    }
                });
                if (goodsItem) {
                    userDoc.save((err, doc) => {
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
                } else {
                    Goods.findOne({ productId }, (err, goodDoc) => {
                        if (err) {
                            res.json({
                                success: false,
                                msg: err.message
                            });
                        } else {
                            goodDoc.productNum = 1;
                            goodDoc.checked = 1;
                            userDoc.cartList.push(goodDoc);
                            userDoc.save((err, doc) => {
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
                        }
                    });
                }

            }
        }
    });


});

module.exports = router;