
// 模拟vue data 数据中心
let data = {
    username:'tom',
    age:21
}

// 模拟this对象
let _this = {
    hobby:'swimming'
}


// 遍历data 实现属性绑定给_this
for(let item in data){
    // console.log(item,data[item]);
    // 借助 Object defineProperty将目标属性绑定给指定对象，实质是以 a.b 方式实现对属性控制，背后映射的是getter setter方法
    Object.defineProperty(_this,item,{
        get(){ // 被劫持的属性以 {...}形式体现，控制台无法直接查看数值，需要点进去，发起调用，才能查看数值
            console.log('get()')
            return data[item];
        },
        set(value){ // a.b = v 的方式赋值，实质是对底层被劫持对象进行赋值
            console.log(`before: ${data[item]}`);
            data[item] = value;
            console.log(`after: ${data[item]}`);
        },
    })
}

console.log(_this);
console.log(_this.username)

_this.username='jerry'
console.log(_this.username)




