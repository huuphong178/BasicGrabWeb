var db = require('../fn/mysql-db');

var md5 = require('crypto-js/md5');
var haversine = require('haversine');
//sO LAn tim kiem driver
var LOOP_FIND = 2;
//Ban kinh tim driver
var LIMIT_DISTANCE = 2000000; //meter


exports.loadAll = () => {
    var sql = 'select * from currentdriver';
    return db.load(sql);
}
var loadDriverToSend = (id_request) => {
    var sql = `SELECT * FROM currentdriver 
        WHERE id_driver NOT IN (SELECT id_driver from blacklist WHERE id_request=${id_request})
        AND status = 1`;
    return db.load(sql);
}
var Delete = (id) => {
    var sql = `DELETE
            FROM currentdriver
            WHERE id_driver = ${id}`;
    return db.excute(sql);
}
exports.getCurrentDriver = id => {
    var sql = `select * from currentdriver where id_driver=${id}`;
    return db.excute(sql);
}

exports.update = (id, status, location) => {
    return new Promise((resolve, reject) => {
        Delete(id)
            .then(value => {
                var sql = `INSERT INTO currentdriver values(${id}, ${status}, ${location.X}, ${location.Y})`;
                return db.excute(sql);
            })
            .then(value => resolve(value))
            .catch(err => reject(err));
    });
}
exports.updateStatus = (id, status) => {
    var sql = `UPDATE currentdriver SET status=${status} where id_driver=${id}`;
    return db.excute(sql);
}
exports.updateLocation = (id, location) => {
    var sql = `UPDATE currentdriver SET location_X=${location.X}, location_Y=${location.Y} where id_driver=${id}`;
    return db.excute(sql);
}

exports.insertCurrDriver = (id, status, location) => {
    var sql = `INSERT INTO currentdriver values(${id}, ${status}, ${location.X}, ${location.X})`;
    return db.excute(sql);
}

var checkUsername = username => {
    //console.log(username);
    var sql = `select 1 from driver where username = '${username}'`;
    return db.excute(sql);
}

exports.register = (driverEntity) => {
    // driverEntity = {
    //     name: "",
    //     phone: "123",
    //     address: "Q5",
    //     bike_id: "77C1",
    //     bike_type: "Suzuki"
    // }
    console.log(driverEntity.password);
    var md5_pwd = md5(driverEntity.password);
    console.log(`pass:${md5_pwd}`);
    return new Promise((resolve, reject) => {
        checkUsername(driverEntity.username)
            .then(rows => {
                if (rows.length <= 0) {
                    var sql = `INSERT INTO driver (id, name, phone, address, bike_id, bike_type, username, password)
                        VALUES(${driverEntity.id}, '${driverEntity.name}', '${driverEntity.phone}',
                        '${driverEntity.address}', '${driverEntity.bike_id}', '${driverEntity.bike_type}',
                        '${driverEntity.username}', '${md5_pwd}')`;
                    return db.excute(sql);
                } else {
                    return db.excute("select 0");
                }
            })
            .then(value => resolve(value))
            .catch(err => {
                console.log(err);
                err => reject(err)
            });
    })


    // var sql = `INSERT INTO driver (id, name, phone, address, bike_id, bike_type, username, password)
    //     VALUES(${driverEntity.id}, '${driverEntity.name}', '${driverEntity.phone}',
    //     '${driverEntity.address}', '${driverEntity.bike_id}', '${driverEntity.bike_type}',
    //     '${driverEntity.username}', '${driverEntity.password}')`;
    // return db.excute(sql);
}

exports.login = loginEntity => {
    // loginEntity={
    //     username:"huuphong",
    //     password: "123456"
    // }
    console.log(loginEntity.password);
    var md5_pwd = md5(loginEntity.password);
    console.log(`pass:${md5_pwd}`);
    var sql = `select * from driver where username = '${loginEntity.username}' and password = '${md5_pwd}'`;
    return db.load(sql);

}
//Tra ra list driver thoa yeu cau
var excuteHarversine = (locationRe, id_request) => {
    return new Promise((resolve, reject) => {
        loadDriverToSend(id_request)
            .then(rows => {
                if (rows.length > 0) {
                    var resultbest = [];
                    rows.forEach(element => {
                        var locationDri = {
                            latitude: element.location_X,
                            longitude: element.location_Y
                        };
                        var Distance = haversine(locationDri, locationRe, {
                            unit: 'meter'
                        });
                        if (Distance <= LIMIT_DISTANCE) {
                            resultbest.push({
                                id: element.id_driver,
                                Distance: Distance
                            })
                        }

                    });

                    console.log(resultbest);
                    return resultbest;
                } else return [];
            }).then(value => resolve(value))
            .catch(err => reject(err));
    })
}

//Tim driver gan nhat
var findDriverBest = (locationRe, id_request) => {
    return new Promise((resolve, reject) => {
        excuteHarversine(locationRe, id_request)
            .then(haversineDri => {
                if (haversineDri.length > 0) {
                    var minDri = haversineDri[0].Distance;
                    var idDri = haversineDri[0].id;

                    haversineDri.forEach(element => {
                        if (element.Distance < minDri) {
                            minDri = element.Distance;
                            idDri = element.id;
                        }
                    })
                    // return new Promise (resolve => resolve(idDri))
                    return idDri;
                } else
                    return -1;
                // return new Promise (reject => reject(-1))
            })
            .then(value => resolve(value))
            .catch(value => reject(value))
    })
}

exports.getDriverBest = async function (locationRequest, requestID) {
    let check = false;
    let result = -1;
    for (let i = 0; i < 5000; i++) {
        if (!check) {
            await findDriverBest(locationRequest, requestID).then(value => {
                console.log(`id_driver: ${value} được chọn để gửi` )
                if (value != -1) {
                    console.log('abcd');
                    check = true;
                    result = value;

                }
            });
        } else { return result; }

        console.log(i);
    }
	return result;
}