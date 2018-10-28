var db = require('../fn/mysql-db');

exports.loadAll = () => {
	var sql = 'select * from request';
	return db.load(sql);
}

exports.getRequest=id=>{
    var sql=`select * from request where id=${id}`;
    return db.excute(sql);
}

var GenerateID=function(){
    var day = new Date();
    var timenow = day.getTime();
    return timenow;
}
var add=function(requestEntity){
    // requestEntity = {
    //     name: 'phong,
    //     phone: '0123456789',
    //     address: 'quan 11',
    //     note: 'abc'
    // }
    var id=GenerateID();
    var sql=`insert into request(id, name, phone, address, note) values(${id},'${requestEntity.name}',
    '${requestEntity.phone}','${requestEntity.address}','${requestEntity.note}')`;
    return db.excute(sql);
}
exports.add=requestEntity=>{
    return add(requestEntity);
};

var Delete=function(id){
    var sql=`delete from request where id= ${id}`;
    return db.excute(sql);
}
exports.delete=id=>{
    return Delete(id);
}
exports.update=requestEntity=>{
    // requestEntity = {
    //     id: 1540633245124,    
    //     name: 'phong,
    //     phone: '0123456789',
    //     address: 'quan 11',
    //     note: 'abc'
    // }
    return new Promise((resolve, reject)=>{
        Delete(requestEntity.id)//delete request
            .then(value=>{
                return add(requestEntity); //add request
        })
        .then(value=> resolve(value))
        .catch(err=>reject(err));
    });
}
