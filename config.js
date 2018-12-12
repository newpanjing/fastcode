exports.config = {
    general: {
        packageName: "com.zh.car",
        db: {
            host: "192.168.1.179",
            port: 3306,
            database: "zh_tourist",
            username: "root",
            password: "zh2018"
        },
        basePath: "/Users/panjing/Downloads/car-parent",
        author: "panjing",
        //自动创建文件夹
        mkdirs: true
    },
    templates: [{
        "template": "entity.fc",
        "outSuffix": ".java",
        "outPath": "/car-common/src/main/java/com/zh/car/entity",
        "project": "car-common",
        //覆盖文件
        overwrite: true
    }, {
        "template": "mapper.fc",
        "outSuffix": "Mapper.java",
        "outPath": "/car-service/src/main/java/com/zh/car/dao",
        "project": "car-service",
        overwrite: true
    }, {
        "template": "mapper.xml.fc",
        "outSuffix": "Mapper.xml",
        "outPath": "/car-service/src/main/resources/mybatis/mapper",
        overwrite: true
    }, {
        "template": "service.fc",
        "outSuffix": "Service.java",
        "outPath": "/car-common/src/main/java/com/zh/car/service",
        "project": "car-common"
    }, {
        "template": "serviceImpl.fc",
        "outSuffix": "ServiceImpl.java",
        "outPath": "/car-service/src/main/java/com/zh/car/service/impl",
        "project": "car-service"
    }, {
        "template": "controller.fc",
        "outSuffix": "Controller.java",
        "outPath": "/car-api/src/main/java/com/zh/car/api/controller",
        "project": "car-api"
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
            types: ["DATE", "TIME", "DATETIME", "TIMESTAMP", "YEAR"]
        }

    },
    //模块
    models: {
        SysUser: {
            table: 'sys_user',
            remark: '系统用户',
            url: 'sys/user'
        },
        // SysRole: {
        //     table: "sys_role",
        //     remark: '角色模块',
        //     url: 'sys/role',
        //     //引用其他模块的字段
        //     fields: [],
        //
        //     //操作方法
        //     methods: {}
        // }
    }
}
