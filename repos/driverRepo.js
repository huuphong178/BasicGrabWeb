var db = require('../fn/mysql-db');

exports.loadAll = () => {
	var sql = 'select * from currentdriver';
	return db.load(sql);
}

var Delete = (id) => {
    var sql = `DELETE
            FROM currentdriver
            WHERE id_driver = ${id}`;
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

exports.insertCurrDriver = (id, status, location) => {
    var sql = `INSERT INTO currentdriver values(${id}, ${status}, ${location.X}, ${location.Y})`;
    return db.excute(sql);
}

var checkUsername = username =>{
    console.log(username);
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
    return new Promise((resolve, reject) => {
        checkUsername(driverEntity.username)
            .then(rows =>{
                if(rows.length <= 0){
                    var sql = `INSERT INTO driver (id, name, phone, address, bike_id, bike_type, username, password)
                        VALUES(${driverEntity.id}, '${driverEntity.name}', '${driverEntity.phone}',
                        '${driverEntity.address}', '${driverEntity.bike_id}', '${driverEntity.bike_type}',
                        '${driverEntity.username}', '${driverEntity.password}')`;
                    return db.excute(sql);
                }else{
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

