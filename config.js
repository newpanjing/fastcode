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
            types: ["DATE", "TIME", "DATETIME", "TIMESTAMP", "YEAR"]
        }

    },
    //模块
    models: {
        AdSpace: {
            table: 'ad_space',
            remark: '广告位模块',
            url: '/ad/space/',
            methods: [{
                name: 'saveTest',
                remark: '保存测试',
                url: '/test',
                //result 分为map和list，如果是list直接add 字段，如果是map xxx.put(key,value)
                //一个 字段的类型，多个object
                //单个字段 单个返回
                result: ['$this'],
                // result: {$ref:['id','createTime']},
                actions: [{
                    'save': {
                        id: '$uuid',
                        createTime: '$now',
                        updateTime: '$createTime',
                        alias: 'aaa',
                        type: 1
                    }
                }]
            }, {
                name: 'updateTest',
                remark: '更新测试',
                url: '/update',
                result: '$this',
                actions: [{
                    "update": {
                        $ref: {
                            id: '$id',
                            name: '123',
                            type: 111,
                        },
                        updateTime: '$now',
                        createTime: '$createTime'
                    }
                }]
            }]
        },
        AdSpaceItem: {
            table: 'ad_space_item',
            remark: '广告位详情',
            url: '/ad/space/item/',
        },
        Contact: {
            table: 'contact',
            remark: '联系人',
            url: '/contact',
            verify: {
                save: ['userId', 'mobile', 'name'],
                update: ['id'],
                delete: ['id'],
                list: ['userId']
            }
        },
        Order: {
            table: 'order',
            remark: '订单',
            url: '/order'
        },
        OrderItem: {
            table: 'order_item',
            remark: '订单详情',
            url: '/order/item',
        },
        OrderComment: {
            table: 'order_comment',
            remark: '订单评价',
            url: '/order/comment',
            verify: {
                save: ['userId', 'orderId', 'star', 'content'],
                update: ['id'],
                delete: ['id'],
                list: ['userId']
            }
        },
        OrderRefund: {
            table: 'order_refund',
            remark: '订单退款',
            url: '/order/refund'
        },
        Scenic: {
            table: 'scenic',
            remark: '景点',
            url: '/scenic'
        },
        ScenicTag: {
            table: 'scenic_tag',
            remark: '景点标签',
            url: '/scenic/tag'
        },
        ScenicTagRelation: {
            table: 'scenic_tag_relation',
            remark: '景点标签映射'
        },
        ScenicTicket: {
            table: 'scenic_ticket',
            remark: '景点门票'
        }
    },
    //过滤器，执行每个model的时候调用
    filter: function (model,template) {
        // if (template.template == 'controller.fc') {
        //     //不生成控制器
        //     return false;
        // }
        return true;
    },
    //扩展方法，执行完所有模块后调用
    extends: [function () {

        //生成api文档
        require('./builder-doc').build(this.models,()=>{
            console.log('文档生成完成。');
        });
    }]
}
