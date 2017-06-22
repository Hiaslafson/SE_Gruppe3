var express = require('express');
var passport = require('passport');
var Account = require('../model/account');
var mongoose = require('mongoose'); //mongo connection
var bodyParser = require('body-parser'); //parses information from POST
var methodOverride = require('method-override'); //used to manipulate POST
var router = express.Router();

//Any requests to this controller must pass through this 'use' function
//Copy and pasted from method-override
router.use(bodyParser.urlencoded({ extended: true }));
router.use(methodOverride(function(req, res){
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        var method = req.body._method;
        delete req.body._method;
        return method
    }
}));


router.route('/register')
    .post(function(req, res) {
    Account.register(new Account({ username: req.body.username }),
        req.body.password, function(err, account) {
            if (err) {
                return res.status(500).json({
                    err: err
                });
            }
            passport.authenticate('local')(req, res, function () {
                return res.status(200).json({
                    status: 'Registration successful!'
                });
            });
        });
});



router.route('/login')
    .post(function(req, res, next) {
        passport.authenticate('local', function(err, user, info) {
            if (err) {
                return next(err);
            }
            if (!user) {
                return res.status(401).json({
                    err: info
                });
            }
            req.logIn(user, function(err) {
                if (err) {
                    return res.status(500).json({
                        err: 'Could not log in user'
                    });
                }
                res.status(200).json({
                    status: 'Login successful!'
                });
            });
        })(req, res, next);
    });

router.route('logout')
    .get(function(req, res) {
        req.logout();
        res.status(200).json({
            status: 'Bye!'
        });
    });

router.get('/ping', function(req, res){
    res.status(200).send("pong!");
});

module.exports = router;
