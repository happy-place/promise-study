import {XMLHttpRequest} from 'xmlhttprequest-ts'

(function(){

    const fs = require('fs');
    const util = require('util');
    let readFile = util.promisify(fs.readFile) // util.promisify 将异常优先风格函数转换为promise函数
    /**
     * 连续读取3个文件，拼接输出
     */
    function concat_file_by_jquery(){
        fs.readFile('../resources/1.txt',(err1,data1)=>{
            if(err1) throw err1;
            fs.readFile('../resources/2.txt',(err2,data2)=>{
                if(err2) throw err2;
                fs.readFile('../resources/3.txt',(err3,data3)=>{
                    if(err3) throw err3;
                    console.log(data1+data2+data3)
                });
            });
        })
    }

    async function concat_file_by_await(){
        // 借助async + await 将 异步嵌套执行代码，转换为类似于同于执行代码,而且出现异常时，排查非常方便
        try{
            let data1 = await readFile('../resources/1x.txt')
            let data2 = await readFile('../resources/2.txt')
            let data3 = await readFile('../resources/3.txt')
            console.log(data1+data2+data3)
        }catch (e){
            console.error(e);
        }

    }

    function send_ajax(url){
        return new Promise((resolve,reject)=>{
            let xhr = new XMLHttpRequest();
            xhr.open('get',url,true);
            xhr.send()
            xhr.onreadystatechange = function (){
                if(xhr.readyState === 4){
                    if(xhr.status>=200 && xhr.status<300){
                        resolve(xhr.responseText);
                    }else{
                        reject(xhr.status);
                    }
                }
            }
        });
    }

    function test_ajax_await(){
        let btn = document.getElementById('btn');
        btn.addEventListener('click',
            async function send_ajax_by_await(url){
                try{
                    let res = await send_ajax(url);
                    console.log(res)
                }catch (e){
                    console.error(e);
                }
            }
        );
    }


    // concat_file_by_jquery();
    concat_file_by_await()

})();

