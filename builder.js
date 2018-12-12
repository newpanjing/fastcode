var mysql = require('mysql');
var async = require('async');
var config = require('./config').config;
var db = config.general.db;
var fs = require('fs');
var path = require('path');

var art = require('art-template');

var connection = mysql.createConnection({
    host: db.host,
    port: db.port,
    user: db.username,
    password: db.password,
    database: db.database
});
connection.on('error', err => console.log(err))
connection.connect(function () {
    process();
});

/**
 * 首字母大写
 * @returns {string}
 */
String.prototype.toUpFirst = function () {
    return this.substring(0, 1).toUpperCase() + this.substring(1);
}
/**
 * 首字母小写
 * @returns {string}
 */
String.prototype.toLowFirst = function () {
    return this.substring(0, 1).toLowerCase() + this.substring(1);
}

Date.prototype.format = function (fmt) { //author: meizz
    var o = {
        "M+": this.getMonth() + 1,                 //月份
        "d+": this.getDate(),                    //日
        "h+": this.getHours(),                   //小时
        "m+": this.getMinutes(),                 //分
        "s+": this.getSeconds(),                 //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds()             //毫秒
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}
Date.prototype.now = function () {
    return this.format('yyyy-MM-dd hh:mm:ss');
}

/**
 * 开始处理模板
 */
function process() {

    //读取models部分的表结构信息
    //字段：packageName、modelRemark、modelName、author、、now、url、tableName、idField、idFieldName、columns、

    //project

    //columns: fieldName、typeName、columnName、
    async.waterfall([function (callback) {
        //处理表结构
        processModels(callback);
    }, function (models, callback) {
        processTemplates(models, callback);
    }], function (err, result) {
        console.log(result[0])
        console.log('所有模板处理完成')
        //关闭mysql连接
        connection.end();
    })

}

/**
 * 处理模板
 * @param models
 * @param callback
 */
function processTemplates(models, callback) {

    async.map(models, function (model, callback) {
        //读取模板文件
        art.defaults.rules.push({
            test: /\${([\w\W]*?)}/,
            use: function (match, code) {
                return {
                    code: code,
                    output: 'escape'
                }
            }
        });


        art.defaults.imports.up_first = function (str) {
            return str.substring(0, 1).toUpperCase() + str.substring(1);
        }
        art.defaults.imports.low_first = function (str) {
            return str.substring(0, 1).toLowerCase() + str.substring(1);
        }
        //循环模板

        async.map(config.templates, (template, callback) => {
            model.project = template.project;
            var source = fs.readFileSync(path.join(__dirname, `./templates/${template.template}`), 'utf8');
            var content = art.render(source, model);

            //写入文件，文件路径需要自己去创建，默认不创建，防止写错文件且发现不了
            var dir = config.general.basePath + template.outPath;
            var file = dir + "/" + model.modelName + template.outSuffix;

            if (!fs.existsSync(dir)) {
                if (config.general.mkdirs) {
                    //自动创建文件夹
                    mkdirs(dir);
                    console.log(`自动创建文件夹 ${dir}`)
                } else {
                    throw new Error(`路径 ${dir} 不存在`);
                }
            }

            //判断创建或覆盖
            //存在、覆盖、跳过
            if (fs.existsSync(file)) {
                //覆盖文件
                if (template.overwrite) {
                    fs.writeFileSync(file, content, 'utf-8');
                    console.log(`覆盖 ${file}`)
                } else {
                    console.log(`跳过 ${file}`)
                }
            } else {
                //创建文件
                fs.writeFileSync(file, content, 'utf-8');
                console.log(`创建 ${file}`)
            }

            console.log(template.template + " 生成完成。")
            callback(null, template.template);
        }, callback);

    }, callback);

}

/**
 * 处理模块结构
 * @param callback
 * @returns {Promise<void>}
 */
function processModels(callback) {
    var models = [];
    for (var m in config.models) {
        var item = config.models[m];
        var model = {
            // config: config,
            packageName: config.general.packageName,
            modelRemark: item.remark,
            modelName: m,
            author: config.general.author,
            now: new Date().now(),
            url: item.url,
            tableName: item.table,
            columns: [],
            packages: []

        };
        models.push(model);
    }

    async.map(models, (model, callback) => {

        getTableInfo(model.tableName, (err, rs) => {

            rs.forEach(info => {

                var column = info.name;
                var field = getFieldName(column);

                if (info.column_key) {
                    model.idColumn = column;
                    model.idField = field;
                }

                //fieldName、typeName、columnName、
                var fieldType = getType(info.type.toUpperCase());

                if (model.packages.indexOf(fieldType.package) == -1) {
                    model.packages.push(fieldType.package);
                }

                model.columns.push({
                    columnName: column,
                    fieldName: field,
                    typeName: fieldType.typeName,
                    remark: info.comment,
                    type: info.type.toUpperCase()
                });
            });
            callback(null, model);
        });

    }, callback);
}

/**
 * 获取字段类型
 * @param dataType
 */
function getType(dataType) {

    for (var i in config.typeMappers) {
        var item = config.typeMappers[i];

        if (item.types.indexOf(dataType) != -1) {
            return {
                package: item.package,
                typeName: item.typeName,
            };
        }
    }


}

/**
 * 获取表信息
 * @param table
 * @param callback
 */
function getTableInfo(table, callback) {
    connection.query(`select column_name as name,column_comment as comment,data_type as type,if(COLUMN_KEY='PRI',true,false) as column_key from information_schema.columns where table_name='${table}' and table_schema='${db.database}'`, callback);
}

/**
 * 获取字段名
 * @param column
 * @returns {string}
 */
function getFieldName(column) {
    var array = column.toLowerCase().split(/-|_/g);
    var frist = true;
    var field = "";
    array.forEach(str => {
        if (frist) {
            field += str.toLowFirst();
            frist = false;
        } else {
            field += str.toUpFirst();
        }
    });

    return field;

}

/**
 * 创建文件夹
 * @param path
 */
function mkdirs(path) {
    var temps = []
    path.split(/\/|\\/).forEach(str => {
        temps.push(str);
        if (temps.length <= 1) {
            return;
        }
        var dir = temps.join("/");
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
    })
}