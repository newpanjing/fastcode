# 自动代码生成工具
+ 基于node.js 的代码生成工具，理论上支持所有语言。
    采用模板机智，模板需要自己改写，建议把自己项目中的代码复制一份为模板，然后进行修改。
+ 数据库暂时只支持mysql系列。
+ 纯java版的[代码生成器](https://github.com/newpanjing/mybatis-generator)

## 模板引擎 art-template

+ 如果你知道基于JavaScript的模板引擎，那么入手会相当容易。art-template 是一个渲染速度极快的JavaScript模板引擎。
具体语法请看官方的教程:[中文语法教程](https://aui.github.io/art-template/zh-cn/docs/)
+ 几个[语法的例子](#模板示例)  

## 运行
+ 在第一次下载本项目后，运行命令 
```shell
npm install
```
+ 启动生成
```shell
npm start
```

## 文件说明
|文件名|说明|
|---|---|
|builder.js|模板生成入口|
|config.js|配置文件|

## 字段取名规则
> 数据库中大写字段均会转为小写赋值到fieldName中 columnName 还是原样输出

模板中的字段取名规则参考驼峰命名例如：
+ user_id取值为userId
+ USERID 取值为userid，
+ user_id_name_abc 取值为userIdNameAbc

## 模板内变量
+ 全局字段
    
    |字段名|说明|
    |---|---|
    |packageName|包名，例如：com.88cto.xxx|
    |modelRemark|模块注释|
    |author|作者|
    |now|当前时间，例如：2018-12-11 18:08:48|
    |url|访问地址|
    |modelName|模块名|
    |idColumn|id列，数据库中的id列，取第一个id字段，多个id字段请自行处理|
    |idField|id字段名，名字根据idColumn生成，生成规则参考[字段取名规则](#字段取名规则)|
    |columns|列字段[columns字段]()|

+ columns字段

    |字段名|说明|
    |---|---|
    |columnName|列名|
    |fieldName|字段名，[字段取名规则](#字段取名规则)|
    |typeName|类型名，Java类型名称，通过配置文件的映射配置|
    |remark|数据库中的注释|
    |type|数据库中的类型|
    
## 模板示例
+ 变量定义
```html
    <% var date=new Date(); %>
```
+ 取值
```html
    <% var date=new Date(); %>
   <div>今天的日期是：${date}</div>
```
+ if语句
```html
    <%
    var aa=123; 
    if (aa==123){
    
    %>
    
    <div>aa等于123</div>
    
    <%}%>
```

+ for循环
```html
    <%for(var i=0;i<100;i++){%>
    <div>${i}</div>
    <%}%>
```

+ 内置过滤器

    过滤器使用{{}}两个括号，加|，语法参考ejs，或者art-template[官方文档](https://aui.github.io/art-template/zh-cn/docs/syntax.html#%E8%BF%87%E6%BB%A4%E5%99%A8)
    + 首字母大写 up_first
        ```html
            <% var aa="china" %>
            {{aa | up_first}}
        ```
        输出 China
    + 首字母小写 low_first
        ```html
            <% var aa="China" %>
            {{aa | up_first}}
        ```
        输出 china