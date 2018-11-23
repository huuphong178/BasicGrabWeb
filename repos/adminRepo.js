var db = require("../fn/mysql-db");
var md5 = require("crypto-js/md5");

exports.register = adminEntity => {
    var md5_pwd = md5(adminEntity.password);
    return new Promise((resolve, reject) => {
        checkUsername(adminEntity.username)
            .then(rows => {
                if (rows.length <= 0) {
                    var sql = `insert into manager (id, username, name, password)
                        values(${adminEntity.id}, '${adminEntity.username}', '${
                        adminEntity.name
                    }', '${md5_pwd}')`;
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
    var md5_pwd = md5(loginEntity.password);
    var sql = `select * from manager where username = '${
        loginEntity.username
    }' and password = '${md5_pwd}'`;
    return db.load(sql);
};

var checkUsername = username => {
    var sql = `select 1 from manager where username = '${username}'`;
    return db.excute(sql);
};
