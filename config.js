exports.config = {
    general: {
        packageName: "com.zh.tourist",
        db: {
            host: "192.168.1.179",
            port: 3306,
            database: "zh_tourist",
            username: "root",
            password: "zh2018"
        },
        basePath: "/Users/panjing/dev/tourist-parent",
        // basePath: "/Users/panjing/Downloads/",
        author: "panjing",
        //自动创建文件夹
        mkdirs: true
    },
    templates: [{
        "template": "entity.fc",
        "outSuffix": ".java",
        "outPath": "/tourist-common/src/main/java/com/zh/tourist/entity",
        "project": "tourist-common",
        //覆盖文件
        overwrite: true
    }, {
        "template": "mapper.fc",
        "outSuffix": "Mapper.java",
        "outPath": "/tourist-service/src/main/java/com/zh/tourist/dao",
        "project": "tourist-service",
        overwrite: true
    }, {
        "template": "mapper.xml.fc",
        "outSuffix": "Mapper.xml",
        "outPath": "/tourist-service/src/main/resources/mybatis/mapper",
        overwrite: true
    },
        {
            "template": "service.fc",
            "outSuffix": "Service.java",
            "outPath": "/tourist-common/src/main/java/com/zh/tourist/service",
            "project": "tourist-common",
            overwrite: true
        },
        {
            "template": "serviceImpl.fc",
            "outSuffix": "ServiceImpl.java",
            "outPath": "/tourist-service/src/main/java/com/zh/tourist/service/impl",
            "project": "tourist-service",
            overwrite: true
        }
        , {
            "template": "controller.fc",
            "outSuffix": "Controller.java",
            "outPath": "/tourist-api/src/main/java/com/zh/tourist/api/controller",
            "project": "tourist-api",
            overwrite: true
        }
    ],
    //数据库类型对代码类型的映射
    typeMappers: {
        longs: {
            //包名
            package: 'java.lang.Long',
            //简写类型名
            typeName: 'Long',
            //数据库类型
            types: ["SMALLINT", "MEDIUMINT", "BIGINT"]
        },
        strings: {
            package: 'java.lang.String',
            typeName: 'String',
            types: ["VARCHAR", "CHAR", "TEXT", "MEDIUMTEXT"]
        },
        ints: {
            package: 'java.lang.Integer',
            typeName: "Integer",
            types: ['TINYINT', "INTEGER", "INT", "BIT", "BOOLEAN"]
        },
        doubles: {
            package: 'java.lang.Double',
            typeName: 'Double',
            types: ["FLOAT", "DOUBLE", "DECIMAL"]
        },
        dates: {
            package: 'java.util.Date',
            typeName: 'Date',
            types: ["DATE", "DATETIME", "TIMESTAMP", "YEAR"]
        },
        times: {
            package: 'java.sql.Time',
            typeName: 'Time',
            types: ["TIME"]
        }

    },
    //过滤器，执行每个model的时候调用
    filter: function (model, template) {

        if (template.template != 'mapper.xml.fc') {
            return false;
        }
        return true;
    },
    //扩展方法，执行完所有模块后调用
    extends: [function () {

        //生成api文档
        require('./builder-doc').build(this.models, () => {
            console.log('文档生成完成。');
        });
    }],
    //模块
    models: {
        ScenicTag: {
            table: 'scenic_tag',
            remark: '景区标签',
            url: 'scenic/tag'
        }
    }
}