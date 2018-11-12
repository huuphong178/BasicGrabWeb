var db = require("../fn/mysql-db");

exports.loadAll = () => {
    var sql =
        "select request.* from requestqueue, request where request.id = requestqueue.id and requestqueue.status = 0";
    return db.load(sql);
};

exports.insert = function(requestEntity) {
    var sql = `insert into requestqueue(id, name, address)
     values(${requestEntity.id},'${requestEntity.name}','${
        requestEntity.address
    }')`;
    return db.excute(sql);
};

exports.delete = function(id) {
    var sql = `delete from requestqueue where id = ${id}`;
    return db.excute(sql);
};

exports.update = function(id, status) {
    var sql = `update requestqueue
	set status = ${status}
	where id = ${id};`;
    return db.excute(sql);
};
