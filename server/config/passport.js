'use strict';

const passport = require("passport");
const passportJWT = require("passport-jwt");
const User = require('./../models/user');
const config = require('./config');

const ExtractJwt = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;

var params = {
    secretOrKey: config.jwtSecret,
    jwtFromRequest: ExtractJwt.fromAuthHeader()
};

module.exports = function () {
    // Definindo a estratégia JWT
    let strategy = new JwtStrategy(params, function (payload, next) {
        User.findById(payload._id, function (err, user) {
            if (err) return next(err, false);

            if (user) return next(null, user);

            return next(null, false);
        });
    });

    passport.use(strategy);

    return {
        initialize: function () {
            return passport.initialize();
        },
        authenticate: function () {
            return passport.authenticate("jwt", config.jwtSession);
        }
    };
};