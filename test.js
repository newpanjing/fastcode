var fs = require('fs');

var path = '/Users/panjing/Downloads/aaa/vvv/vsdasd/sad/asdas/dsadsaasd/asda/asd/sas/';

var temps=[]
path.split(/\/|\\/).forEach(str=>{
    temps.push(str);
    if(temps.length<=1){
        return;
    }
    var dir = temps.join("/");
    console.log(dir)
    if(!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }
})