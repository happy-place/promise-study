import {XMLHttpRequest} from 'xmlhttprequest-ts'

interface AjaxParam {
    method:string
    url:string
    body:any
    responseType:string
}

/*
* 对传统ajax封装，返回Primise对象
*
* */
function promiseAjax(param:AjaxParam){
    let promise = new Promise<void>((resolve,reject) => {
        let xhr = new XMLHttpRequest();
        // @ts-ignore
        xhr.responseType = param.responseType
        xhr.open(param.method,param.url,true);
        xhr.send(param.body)
        xhr.onreadystatechange = function (){
          if(xhr.readyState===4){
              if(xhr.status>=200 && xhr.status < 300){
                  // @ts-ignore
                  resolve(JSON.parse(xhr.responseText));
              }else{
                  reject(xhr.status);
              }
          }
        };
    });
    return promise;
}

let param:AjaxParam = {
    method:'get',
    url:'http://a.itying.com/api/productlist',
    body:'name=zhangsan',
    responseType:'json'
}

promiseAjax(param).then(
    data => {
        console.log(data);
    },
    err => {
        console.error(err);
    }
)