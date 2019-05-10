let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let produtSchema = new Schema({
    "productId": String,
    "productName": String,
    "salePrice": Number,
    "productImage": String,
    'productNum': Number,
    'checked': Number,
});

module.exports = mongoose.model('Good', produtSchema);
// 如果连接集合没有加S表示复数，可在model（）中，第三个参数指定集合名字