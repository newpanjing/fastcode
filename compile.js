/**
 * 预处理变量
 * @param model
 * @param obj
 * @returns {*}
 */
exports.processResult = function (model, result) {

    var rs = 'void';
    if (result) {
        console.log(isArray(result))
        if (isArray(result)) {
            return `List<${getSelf(result[0],model)}>`
        } else {

            rs = getSelf(ms, model);
        }
    }

    return rs;
}

function getSelf(val, model) {
    console.log(val)
    console.log(JSON.parse(val+""))
    var regex = /\$(\w+|\d+)/;
    var group = val.match(regex);
    if (group && group.length > 1) {
        if(group[1]=="this"){
            return model.modelName;
        }
    }
}
function isArray(obj) {

    return /\[[^\}]+\]/.test(obj.toString());
}
