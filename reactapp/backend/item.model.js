const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Item = new Schema({
    item_description: {
        type: String
    },
    item_price: {
        type: Number
    },
    item_status: {
        type: String
    },
    item_owner: {
        type: String
    }
});

module.exports = mongoose.model('Item', Item);