function aaa(p) {
    console.log(p)
    console.log(this)
    return 123
}

var rs=aaa.call({a:123},1);
console.log("返回："+rs)