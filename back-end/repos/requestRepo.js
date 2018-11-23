var db = require("../fn/mysql-db");

exports.loadAll = () => {
    var sql = "select * from request";
    return db.load(sql);
};

exports.getRequest = id => {
    var sql = `select * from request where id=${id}`;
    return db.excute(sql);
};
var add = function(requestEntity) {
    // requestEntity = {
    //     name: 'phong,
    //     phone: '0123456789',
    //     address: 'quan 11',
    //     note: 'abc'
    // }
    let locator =
        requestEntity.locator === undefined
            ? null
            : "'" + requestEntity.locator + "'";
    var sql = `insert into request(id, name, phone, address, note, status, location_x, location_y, driver_id, locator)
     values(${requestEntity.id},'${requestEntity.name}','${
        requestEntity.phone
    }','${requestEntity.address}',
    '${requestEntity.note}', ${requestEntity.status}, ${
        requestEntity.location_x
    }, ${requestEntity.location_y}, ${requestEntity.driver_id}, ${locator})`;
    return db.excute(sql);
};
exports.add = requestEntity => {
    return add(requestEntity);
};

var Delete = function(id) {
    var sql = `delete from request where id= ${id}`;
    return db.excute(sql);
};
exports.delete = id => {
    return Delete(id);
};
exports.update = requestEntity => {
    // requestEntity = {
    //     id: 1540633245124,
    //     name: 'phong,
    //     phone: '0123456789',
    //     address: 'quan 11',
    //     note: 'abc'
    // }
    return new Promise((resolve, reject) => {
        Delete(requestEntity.id) //delete request
            .then(value => {
                return add(requestEntity); //add request
            })
            .then(value => resolve(value))
            .catch(err => reject(err));
    });
};
//NL
exports.loadInfo = (id, status) => {
    //Trả về thông tin tài xế, vị trí và vị trí của khách
    var sql = `SELECT req.id as 'request_id', req.location_x as 'request_loX', req.location_y as 'request_loY',
		dri.name as 'driver_name', dri.phone as 'driver_phone', dri.bike_id as 'driver_bikeid',
		cur_dri.location_X as 'driver_loX', cur_dri.location_Y as 'driver_loY' 
	FROM request req, driver dri, currentdriver cur_dri
	WHERE req.driver_id = dri.id AND cur_dri.id_driver = dri.id AND req.status = ${status} AND req.id = ${id}`;
    return db.excute(sql);
};

exports.getRequestBetterID = id => {
    var sql = `select * from request where id>=${id}`;
    return db.load(sql);
};

// Phi
exports.getLocateHistory = locator => {
    var sql = `select * from request where locator='${locator}'`;
    return db.excute(sql);
};
