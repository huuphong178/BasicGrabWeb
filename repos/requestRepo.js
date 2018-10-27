var db = require('../fn/mysql-db');

exports.loadAll = () => {
	var sql = 'select * from request';
	return db.load(sql);
}