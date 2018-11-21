var db = require("../fn/mysql-db");
var md5 = require("crypto-js/md5");

exports.register = locatorEntity => {
    // console.log(locatorEntity.password);
    // var md5_pwd = md5(locatorEntity.password);
    // console.log(`pass:${md5_pwd}`);
    return new Promise((resolve, reject) => {
        checkUsername(locatorEntity.username)
            .then(rows => {
                if (rows.length <= 0) {
                    var sql = `INSERT INTO locator (id, username, name, password)
                        VALUES(${locatorEntity.id}, '${
                        locatorEntity.username
                    }', '${locatorEntity.name}', '${locatorEntity.password}')`;
                    return db.excute(sql);
                } else {
                    return { duplicate: true };
                }
            })
            .then(value => resolve(value))
            .catch(err => {
                console.log(err);
                err => reject(err);
            });
    });
};

exports.login = loginEntity => {
    // loginEntity={
    //     username:"huuphong",
    //     password: "123456sgsdgsfdghrtdfgdge" md5
    // }
    var sql = `select * from locator where username = '${
        loginEntity.username
    }' and password = '${loginEntity.password}'`;
    return db.load(sql);
};

var checkUsername = username => {
    //console.log(username);
    var sql = `select 1 from locator where username = '${username}'`;
    return db.excute(sql);
};
