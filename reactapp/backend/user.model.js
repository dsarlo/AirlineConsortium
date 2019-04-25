const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let User = new Schema({
    username: {
        type: String
    },
    password: {
        type: String
    },
    first_name: {
        type: String
    },
    last_name: {
        type: String
    },
    balance: {
        type: Number
    },
    booked_flight: {
        type: String
    },
    is_airline: {
        type: Boolean
    }
});

module.exports = mongoose.model('User', User);