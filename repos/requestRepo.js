var db = require('../fn/mysql-db');

exports.loadAll = () => {
	var sql = 'select * from request';
	return db.load(sql);
}

//NL
exports.loadInfo = (id, status) => {
	//Trả về thông tin tài xế, vị trí và vị trí của khách
	var sql = `SELECT req.id as 'request_id', req.location_x as 'request_loX', req.location_y as 'request_loY',
		dri.name as 'driver_name', dri.phone as 'driver_phone', dri.bike_id as 'driver_bikeid',
		cur_dri.location_X as 'driver_loX', cur_dri.location_Y as 'driver_loY' 
	FROM request req, driver dri, currentdriver cur_dri
	WHERE req.driver_id = dri.id AND cur_dri.id_driver = dri.id AND req.status = ${status} AND req.id = ${id}`
	return db.excute(sql);
}