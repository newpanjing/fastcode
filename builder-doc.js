var builder = require('./builder');
var http = require('http');

/**
 * 生成文档
 * @param models
 */
exports.build = function (models, callback) {

    var content = builder.render('./api.html', {models: models});
    //创建http服务显示
    http.createServer(function (req, res) {
        res.end(content);
    }).listen(8888,()=>{
        console.log('API地址：http://127.0.0.1:8888');
    });

    callback(null, 'ok');
}