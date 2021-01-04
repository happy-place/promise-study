function mineReadFile(filePath:string){
    return new Promise<void>((resolve,reject) => {
        // src 为 root
        if(!filePath.startsWith('/')){
            filePath = require('path').resolve(__dirname,`../${filePath}`)
        }
       require('fs').readFile(filePath,(err,data) => {
           if(err){
               reject(err);
           }else{
               resolve(data.toString());
           }
       })
    });
}

function testMineReadFile(){
    mineReadFile('./resources/1.txt').then(
        data =>{
            console.log(data)
        },
        err =>{
            console.error(err)
        }
    );
}

testMineReadFile()