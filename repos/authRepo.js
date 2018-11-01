var db = require('../fn/mysql-db');
var jwt = require('jsonwebtoken');
var rndToken = require('rand-token');
var moment = require('moment');

const SECRET_ADMIN = 'adminbasicgrab'; //khoa bi mat
const SECRET_DRIVER = 'driverbasicgrab'; //khoa bi mat
const AC_LIFETIME = 600; // 60 seconds

exports.generateAccessTokenDriver = userEntity => {
    var payload = {
        user: userEntity,
        info: 'sign in driver'
    }
    var token = jwt.sign(payload, SECRET_DRIVER, {
        expiresIn: AC_LIFETIME
    });
    return token;
}

exports.generateAccessTokenAdmin = userEntity => {
    var payload = {
        user: userEntity,
        info: 'sign in driver'
    }
    var token = jwt.sign(payload, SECRET_ADMIN, {
        expiresIn: AC_LIFETIME
    });
    return token;
}

exports.verifyAccessToken = (req, res, next) => {

    var token = req.headers['x-access-token'];
    console.log(token);
    if (token) {
        jwt.verify(token, SECRET_ADMIN, (err, payload) => {
            if (err) {
                jwt.verify(token, SECRET_DRIVER, (err, payload) => {
                    if (err) {
                        res.statusCode = 401;
                        res.json({
                            msg: 'INVALID_TOKEN',
                        })
                    } else {
                        req.token_payload = payload;
                        next();
                    }
                });
            } else {
                req.token_payload = payload;
                next();
            }
        });
    } else {
        res.statusCode = 403;
        res.json({
            msg: 'NO_TOKEN'
        })
    }
}

exports.verifyAccessTokenAdmin = (req, res, next) => {
    var token = req.headers['x-access-token'];
    console.log(token);
    if (token) {
        jwt.verify(token, SECRET_ADMIN, (err, payload) => {
            if (err) {
                res.statusCode = 401;
                res.json({
                    msg: 'INVALID_TOKEN',
                })
            } else {
                req.token_payload = payload;
                next();
            }
        });
    } else {
        res.statusCode = 403;
        res.json({
            msg: 'NO_TOKEN'
        })
    }
}

exports.generateRefreshToken = () => {
    const SIZE = 100;
    return rndToken.generate(SIZE);
}

exports.updateRefreshToken = (userid, rfToken) => {
    return new Promise((resolve, reject) => {
        var sql = `delete from user_refreshtoken where id=${userid}`;
        db.excute(sql)
            .then(value => {
                var rdt = moment().format('YYYY-MM-DD HH:mm:ss');
                sql = `insert into user_refreshtoken(id, rfToken, rdt) values(${userid},'${rfToken}','${rdt}')`;
                return db.excute(sql);
            })
            .then(value => resolve(value)
                .cacth(err => reject(err)))
    });
}