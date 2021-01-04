const fs = require("fs")
const path = require("path")

export function read_file_by_jquery(){
    let file = path.resolve(__dirname,'../resources/1.txt');
    fs.readFile(file,(err,data) =>{
        if(err){
            throw err;
        }else{
            console.log(data.toString());
        }
    });
}

export function read_file_by_promise(){
    let file = path.resolve(__dirname,'../resources/1.txt');
    let promise = new Promise<void>((resolve,reject)=>{
       fs.readFile(file,(err,data)=>{
           if(err){
               reject(err);
           }else{
               resolve(data);
           }
       })
    });
    promise.then((data)=>{
        console.log((data as unknown as Buffer).toString());
    },(err:Error)=>{
        throw err;
    });
}

read_file_by_promise()



