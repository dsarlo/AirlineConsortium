const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const itemRoutes = express.Router();
const userRoutes = express.Router();
const PORT = 4000;

const bcrypt = require('bcrypt');
const saltRounds = 10;

let Item = require('./item.model');
let User = require('./user.model');

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://127.0.0.1:27017/blockchain', { useNewUrlParser: true });
const connection = mongoose.connection;

connection.once('open', function() {
    console.log("MongoDB database connection established successfully");
});

//Get request at "/items"
itemRoutes.route('/').get(function(req, res) {
    Item.find(function(err, items) {
        if(err) {
            console.log(err);
        } else {
            res.json(items);
        }
    });
});

//Get request at "/items/:id"
itemRoutes.route('/:id').get(function(req, res) {
    let id = req.params.id;

    Item.findById(id, function(err, item) {
        if(err) {
            console.log(err);
        } else {
            res.json(item);
        }
    });
});

//Delete request at "/items/bought/:id"
itemRoutes.route('/bought/:id').delete(function(req, res) {
    let id = req.params.id;

    Item.findByIdAndDelete(id, function(err, item) {
        if(err) {
            console.log(err);
            res.status(404).send('data is not found and could not be deleted')
        } else {
            res.status(200).send({'item': 'item deleted successfully'})
        }
    });
});

//Post request at "/items/add"
itemRoutes.route('/add').post(function(req, res) {
    let item = new Item(req.body);

    item.save().then(item => {
        res.status(200).json({'item': 'item added successfully'});
    })
    .catch(err => {
        res.status(400).send('adding new item failed');
    });
});

//Post request for UPDATE at "/items/update/:id"
itemRoutes.route('/update/:id').post(function(req, res) {
    Item.findById(req.params.id, function(err, item) {
        if(!item) {
            res.status(404).send('data is not found');
        } else {
            item.item_description = req.body.item_description;
            item.item_price = req.body.item_price;
            item.item_status = req.body.item_status;

            item.save().then(() => {
                res.json('Item updated successfully');
            })
            .catch(err => {
                res.status(400).send('Update not possible');
                console.log(err);
            });
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

app.use('/items', itemRoutes);
app.use('/user', userRoutes);

app.listen(PORT, function() {
    console.log("Server is running on Port: " + PORT);
});