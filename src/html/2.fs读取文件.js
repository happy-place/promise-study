const fs = require('fs');
const path = require('path');
const file = path.resolve(__dirname,'../resources/11.txt')
fs.readFile(file,(err,data) => {
    if(err){
        throw err;
    }else{
        console.log(data.toString());
    }
});