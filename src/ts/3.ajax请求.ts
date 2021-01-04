// npm i xmlhttprequest-ts
// @ts-ignore
import {XMLHttpRequest} from 'xmlhttprequest-ts'

interface Config {
    type: string;
    url: string;
    data?: string;
    dataType: string;
}

//原生js封装的ajax
function ajax(config: Config) {
    let xhr = new XMLHttpRequest();
    xhr.open(config.type, config.url, true);
    xhr.send(config.data);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            console.log('success!!!');
            if (config.dataType == 'json') {
                console.log(JSON.parse(xhr.responseText));
            } else {
                console.log(xhr.responseText)
            }
        }
    }
}

function query_by_ajax(){
    let config = {
        type: 'get',
        data: 'name=zhangsan',
        url: 'http://a.itying.com/api/productlist', //api
        dataType: 'json'
    }
    ajax(config)
}

export function query_by_jquery(){
    let btn = document.getElementById('btn')!;
    btn.addEventListener('click',()=>{
        // @ts-ignore
        let xhr = new XMLHttpRequest();
        xhr.open('get', 'http://a.itying.com/api/productlist', true);
        xhr.send('name=zhangsan');
        xhr.onreadystatechange = function () {
            if(xhr.readyState === 4){
                if(xhr.status>=200 && xhr.status < 300){
                    console.log(JSON.parse(xhr.responseText));
                }else{
                    console.warn(xhr.status);
                }
            }
        }
    });
}

export function query_by_promise(){
    //@ts-ignore
    let btn = document.getElementById('btn')!;
    btn.addEventListener('click',()=>{
        // @ts-ignore
        let promise = new Promise<void>((resolve,reject)=>{
            let xhr = new XMLHttpRequest();
            xhr.open('get', 'http://a.itying.com/api/productlist',true);
            xhr.send('name=zhangsan');
            xhr.onreadystatechange = function () {
                if(xhr.readyState === 4){
                    if(xhr.status>=200 && xhr.status<300){
                        // @ts-ignore
                        resolve(xhr.responseText)
                    }else{
                        reject(xhr.status)
                    }
                }
            }
        });
        promise.then(
            responseText => {
                console.log(responseText);
            },
            status => {
                console.log(status);
            }
        );
    });
}

// query_by_ajax();
// query_by_jquery();
// query_by_promise();







