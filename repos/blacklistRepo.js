var db = require('../fn/mysql-db');

exports.loadAll = () => {
    var sql = 'select * from blacklist';
    return db.load(sql);
}
exports.add=blackentity=>{
    var sql=`insert into blacklist(id_driver, id_request) values(${blackentity.id_driver}, ${blackentity.id_request})`;
    return db.excute(sql);
}