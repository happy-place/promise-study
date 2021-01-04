// util.promisify 接收一个异常优先风格回调函数，返回一个Promise对象
const util = require('util');
const fs = require('fs')
const mineReadFile2 = util.promisify(fs.readFile);

mineReadFile2('../resources/1.txt').then(
    data =>{
        console.log(data.toString());
    },
    err =>{
        console.log(err)
    }
)