const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const flightRoutes = express.Router();
const userRoutes = express.Router();
const PORT = 4000;

const bcrypt = require('bcrypt');
const saltRounds = 10;

let Flight = require('./flight.model');
let User = require('./user.model');

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://127.0.0.1:27017/ask', { useNewUrlParser: true });
const connection = mongoose.connection;

connection.once('open', function() {
    console.log("MongoDB database connection established successfully");
});

//Get request at "/flights"
flightRoutes.route('/').get(function(req, res) {
    Flight.find(function(err, flights) {
        if(err) {
            console.log(err);
        } else {
            res.json(flights);
        }
    });
});

//Get request at "/flights/:id"
flightRoutes.route('/:id').get(function(req, res) {
    let id = req.params.id;

    Flight.findById(id, function(err, flight) {
        if(err) {
            console.log(err);
        } else {
            res.json(flight);
        }
    });
});

//Post request for UPDATE at "/user/updateBalance/:username"
userRoutes.route('/updateBalance/:username').post(function(req, res) {
    let user = new User(req.body);
    let username = user.username;

    User.findOne({username: username}, function(err, lookup) {
            if(err) {
                console.log(err);
            }
            if(lookup) {
                user.password = lookup.password;
                user.save().then(() => {
                    res.json('User balance updated successfully');
                    lookup.delete();
                })
                .catch(err => {
                    res.status(400).send('Balance update not possible');
                    console.log(err);
                });
            } else {
                console.log("User not found");
                res.status(400).send("User not found");
            }
        });
});

//Post request for REGISTER at "/user/registerUser"
userRoutes.route('/registerUser').post(function(req, res) {
    let user = new User(req.body);
    let username = user.username;

    bcrypt.hash(user.password, saltRounds, function(err, hash) {
        let login = new User({
            username: user.username,
            password: hash,
            balance: user.balance,
            first_name: user.first_name,
            last_name: user.last_name
        });

        User.findOne({username: username}, function(err, lookup) {
            if(err) {
                console.log(err);
            }
            if(lookup) {
                res.status(404).send("User already exists");
            } else {
                login.save().then(user => {
                    res.status(200).json({'user': "user registered successfully"});
                })
                .catch(err => {
                    res.status(400).send('registration failed for new user');
                });
            }
        });
    });
});

//Get request for LOGIN at "/user/:username"
userRoutes.route('/login/:user/:pass').get(function(req, res) {
    let username = req.params.user;
    let password = req.params.pass;
    console.log(req.params);

    User.findOne({username: username}, function(err, lookup) {
        if(err) {
            console.log(err);
        }
        if(lookup) {
            console.log(lookup);
            if(bcrypt.compareSync(password, lookup.password) == true) {
                lookup.password = '';
                res.json(lookup);
            } else {
                res.status(404).send("Invalid login info");
            }
        } else {
            res.status(404).send("Invalid login info");
        }
    });
});

app.use('/flights', flightRoutes);
app.use('/user', userRoutes);

app.listen(PORT, function() {
    console.log("Server is running on Port: " + PORT);
});