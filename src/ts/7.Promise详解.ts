import {XMLHttpRequest} from "xmlhttprequest-ts";

/**
 * * Promise对象属性
 * Promise状态（PromiseState）：
 *   1.有且仅有三种状态：pending、resolved\fullfilled、rejected；
 *   2.状态只能转变一次，且只能从pending-> resolved 或 pending -> rejected；
 *   3.成功返回值为value，失败返回值为reson；
 *
 * Promise结果（PromiseResult）：
 *   1.成功返回value 交由resolve函数处理；
 *   2.失败返回reason，交由reject函数处理。
 *
 * Promise工作流
 *   初始化 -> 执行异步调用 -> 调用成功，回调 onResolved()，状态从pending切换为resolved
 *                       -> 调用失败，回调 onRejected()，状态从pending切换为rejected
 *
 * Promise构造函数 执行器函数 executor:(resolve,reject) = > {
 *
 * }
 * onResolveed() -> resolve 处理成功
 * onRejected() -> reject处理失败 可以使用 carch 捕获
 *
 * catch()是Primose实例的方法，传入一个函数，处理reject逻辑
 *
 * resolve()是Promise类的方法，传入一个非Promise对象，使用resolve处理，传入一个Promise对象，对象的处理结果就是resolve的结果
 *
 * reject()是Promise类的方法，用于快速返回一个失败的Promise对象，无论传入何值，都按失败处理
 *
 * all()是Promise类的方法，用于对一组Promise对象进行处理全部成功是返回各promise结果数组，若其中有一个Promise对象失败，则只返回失败的这个Promise
 *
 * race()是Promise类的方法，用于对一组Promise对象进行处理，返回另一个Promise对象，结果是谁先改变状态，就是谁
 *
 * 改变Promise 状态三种方式:
 *  resolve: 从 pending变为 resolved
 *  rejected：从pending变为rejected
 *  throw err：从pending变为rejected
 *
 * 状态改变函数与回调函数执行先后顺序
 * executor 执行器函数中，调用resolve() 或 reject() 改变promise状态，称为状态改变函数；
 * then()中，先后注册的两个lamda函数，分别对应resolve(),reject()，为具体回调函数；
 * 对于同步任务(无需等待，立即返回)，先执行状态改变函数，然后执行回调函数，进而对具体数据进行处理；
 * 对应异步任务(需要一定时间等待)，先执行回调函数，然后执行状态改变函数，同样也能对数据进行处理。
 * 先执行谁都行，取决于谁响应更快。
 *
 * then() promise 对象函数，用于映射具体回调，返回的也是一个promise对象，状态取决于内部匹配的是回调状态
 * 回调抛出异常，then-promise为rejected状态;
 * 回调返回非Promise对象，then-promise为resolved状态;
 * 回到返回Promise对象，then-promise为promise对象状态
 *
 * 同一个Promise 多次执行then()，可以构建并行处理链
 *
 * then链式调用，每次调用返回一个新promise对象，然后继续调用then,构成promise调用链，后面then 捕获前面then返回的回调结果
 *
 * Promise异常穿透：对于then链式调用，可以只注册resolve方法，然后在末尾使用catch捕获所有阶段的异常
 *
 * 中断Promise链式调用：某个then中返回 pending状态Promise： new Promise(()=>{})
 *
 * async 自身是一个函数，用来标记 另外一个函数，得到一个promise对象，返回值有被标记函数返回值决定
 *
 * await 只能出现在asynx 标记的函数中，当await 标记普通对象时，返回值就是此普通对象，当标记的是Promise对象时，返回的值是Promise对象成功结果，如果出现异常需要使用try-catch捕获
 */

function testPromise() {
    // @ts-ignore
    let promise = new Promise<void>((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.open('get', 'http://a.itying.com/api/productlist', true);
        xhr.send('name=zhangsan');
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status >= 200 && xhr.status < 300) {
                    // @ts-ignore
                    resolve(xhr.responseText)
                } else {
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
}

function testCatch(){ // 捕获Promise对象异常
    // @ts-ignore
    let promise = new Promise<void>((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.open('get', 'http://a.itying.com/api/productlist1', true);
        xhr.send('name=zhangsan');
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status >= 200 && xhr.status < 300) {
                    // @ts-ignore
                    resolve(xhr.responseText)
                } else {
                    reject(xhr.status)
                }
            }
        }
    });

    promise.catch(reason =>{ // 对接 reject 抛出的异常
        console.log(reason);
    });
}

function testResolve(){
    // resolve传入非Promise对象，返回另一个Promise对象，默认全部按成功处理（快速返回一个成功的promise对象）
    let promise = Promise.resolve('hello');
    promise.then(value=>{
        console.log(`value:${value}`)
    },reason => {
        console.error(`reason:${reason}`)
    })

    // resolve传入Promise对象，返回另一个Promise对象，处理结果，与内部Promise对象处理结果一致
    let p = Promise.resolve(
        new Promise<void>((resolve,reject)=>{
            // @ts-ignore
            // resolve('hello');
            reject('error');
        })
    );

    p.then(value=>{
        console.log(`value:${value}`)
    },reason => {
        console.error(`reason:${reason}`)
    })
}

function testReject(){
    // resolve传入非Promise对象，返回另一个Promise对象，默认全部按成功处理（快速返回一个成功的promise对象）
    let promise = Promise.reject('hello');
    promise.then(value=>{
        console.log(`value:${value}`)
    },reason => {
        console.error(`reason:${reason}`)
    })

    // resolve传入Promise对象，返回另一个Promise对象，处理结果，与内部Promise对象处理结果一致
    let p = Promise.reject(
        new Promise<void>((resolve,reject)=>{
            // @ts-ignore
            resolve('hello');
        })
    );

    p.then(value=>{
        console.log(`value:${value}`)
    },reason => {
        console.error(`reason:${reason}`)
    })
}

function testAll(){
    // resolve传入非Promise对象，返回另一个Promise对象，默认全部按成功处理（快速返回一个成功的promise对象）
    let p1 = Promise.resolve('hello');
    let p2 = Promise.resolve(123);
    let p3 = Promise.resolve(2);
    // let p3 = Promise.reject(2);
    let promise = Promise.all([p1,p2,p3]);
    promise.then(values=>{
        for(let i=0;i<values.length;i++){
            console.log(`value[${i}]: ${values[i]}`);
        }
    },reason => {
        console.error(`reason: ${reason}`)
    })
}


function testRace(){
    // race()是Promise类的方法，用于对一组Promise对象进行处理，返回另一个Promise对象，结果是首个成功的Promise对象结果
    // let p1 = Promise.resolve('123');
    let p1 = new Promise<void>((resolve,reject)=>{
       setTimeout(()=>{
           console.log('123');
       },1000);
    });
    let p2 = Promise.resolve(1);
    let p3 = Promise.reject(11);
    let promise = Promise.race([p1,p2,p3])
    promise.then(value => {
        console.log(`value: ${value}`)
    },reason => {
        console.error(`reason: ${reason}`)
    })
}

function testStateChange(){
    let promise = new Promise<void>((resolve,reject)=>{
        // @ts-ignore
        resolve('success'); // pending -> resolved
        // reject('fail') // pending -> rejected
        // throw new Error('throw error') // pending -> rejected
    });
    promise.then(
        value => {
            console.log(`value: ${value}`)
        },
        reason => {
            console.error(`reason:${reason}`)
        }
    )
}

function testAsyncJob(){
    let promise = new Promise<void>((resolve,reject) => {
        // setTimeout(()=>{
        // @ts-ignore
        resolve('hello');
        // },1000)
        console.log('state change');
    });
    promise.then(
        value => {
            console.log('callback');
            console.log(`value: ${value}`)
        },
        reason => {
            console.log('callback');
            console.error(`reason: ${reason}`)
        }
    )
}

function testThen(){
    // then 匹配具体回调函数，返回另一个promise对象，其状态与回调函数相关
    // 抛出异常时为 rejected 状态
    // 抛出非Promise对象时，为resolved状态
    // 抛出Promise对象时，then-promise状态取决于此抛出Promise状态
    let promise = new Promise<void>((resolve,reject)=>{
        // @ts-ignore
        // resolve('success');
        reject('fail')
    });
    let p = promise.then(
        value => {
            console.log(`value1: ${value}`);
        },
        reason => {
            console.error(`reason1:${reason}`)
        }
    )
}

function testMultiCallback(){
    // 同一个 promise多次调用then（非链式调用），可以构建并行处理链
    let promise = new Promise<void>((resolve,reject)=>{
        // @ts-ignore
        // resolve('success');
        reject('fail')
    });

    promise.then(
        value => {
            setTimeout(()=>{
                console.log(`value1: ${value}`);
            },1000)
        },
        reason => {
            console.error(`reason1:${reason}`)
        }
    )

    promise.then(
        value => {
            console.log(`value2: ${value}`)
        },
        reason => {
            console.error(`reason2:${reason}`)
        }
    )
}

function testChain(){
    //
    let promise = new Promise<void>((resolve,reject)=>{
        // @ts-ignore
        resolve('success1');
        // reject('fail')
    });
    promise.then(
        value => {
            console.log(`value1: ${value}`); // value1: success1
        },
        reason => {
            console.error(`reason1:${reason}`);
        }
    ).then(
        value => {
            console.log(`value2: ${value}`); // value2: undefined (前面then返回的是一个undefined对象，被后边then捕获)
        },
        reason => {
            console.error(`reason2:${reason}`)
        }
    );
    promise.then(
        value => {
            console.log(`value1: ${value}`); // value1: success1
            return Promise.resolve('success2')
        },
        reason => {
            console.error(`reason1:${reason}`);
        }
    ).then(
        value => {
            console.log(`value2: ${value}`); // value2: success2 (前面then返回的是一个fullfilled状态Promise对象)
        },
        reason => {
            console.error(`reason2:${reason}`)
        }
    );
}

function testCatch2(){
    // 对于then链式调用，可以只注册resolve方法，然后在末尾使用catch捕获所有阶段的异常
    let promise = new Promise<void>((resolve,reject)=>{
        // @ts-ignore
        resolve('success1');
        // reject('fail');
        // throw 'err1'
    });
    promise.then(
        value => {
            console.log(`value1: ${value}`); // value1: success1
            throw 'err1'
            return Promise.resolve('success2')
        }
    ).then(
        value => {
            console.log(`value2: ${value}`); // value2: undefined (前面then返回的是一个undefined对象，被后边then捕获)
        }
    ).catch(reason => { // 整个调用链，无异常时不执行
        console.error(`reason3:${reason}`);
    })
}

function testBreak(){
    new Promise<void>((resolve,reject)=>{
        // @ts-ignore
        resolve('success');
    }).then(
        value =>{
            console.log(`value1`)
            // 有且只有一个方法的Promise对象为pending状态promise对象
            return new Promise(()=>{})
        }
    ).then(
        value =>{
            console.log(`value2`)
        }
    ).then(
        value =>{
            console.log(`value3`)
        }
    )
}

function testAsync(){
    async function test(){
        return 1;
    }

    let p = test();
    console.log(typeof p);
    console.log(p);
}

function testAwait(){
    async function test(){
        let res1 = await 1;
        console.log(res1);
        try{
            let res2 = await new Promise((resolve,reject)=>{
                resolve('success');
                reject('fail');
                throw 'error';
            });
            console.log(res2);
        }catch (e){
            console.error(e);
        }
    }
}


// testPromise()
// testCatch()
// testResolve()
// testReject()
// testAll()
// testRace()
// testStateChange()
// testAsyncJob()
// testThen()
// testMultiCallback()
// testChain()
// testCatch2()
// testBreak()
// testAsync()
testAwait()