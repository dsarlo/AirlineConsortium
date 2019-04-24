const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Flight = new Schema({
    flight_origin: {
        type: String
    },
    flight_destination: {
        type: String
    },
    flight_airline: {
        type: String
    },
    flight_board_time: {
        type: Date
    },
    flight_cost: {
        type: Number
    }
});

module.exports = mongoose.model('Flight', Flight);