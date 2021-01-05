// class 风格Promise
class Promise{

    // 声明构造函数
    constructor(executor) {
        this.PromiseState = 'pending';
        this.PromiseResult = undefined;
        // 使用数组保持每次then，注册的回调函数
        this.callbacks = [];

        let self = this; // 预先保持promise对象本身, that 、self、_this
        // resolve函数
        function resolve(data){
            // 确保状态和结果只修改一次
            if(self.PromiseState !== 'pending') return;
            // 此处this 是window,因此需要再外面提前保存this
            // console.log(this);
            // 修改 Promise 对象状态
            self.PromiseState = 'fulfilled';
            // 修改 Promise 对象结果
            self.PromiseResult = data;

            // 异步操作接收，立刻执行回调,且每次then注册的回调都需要执行
            self.callbacks.forEach(item =>{
                // then 中回调按异步方式执行，即等同步代码执行完毕，在执行异步操作
                // 此处setTimeout不带时间，就能起到上述效果
                setTimeout(()=> {
                    item.onResolved(data);
                });
            });
        }

        // reject 函数 (在<script>标签中直接调用，隐含调用者是window,慎用this.)
        function reject(data){
            // 确保状态和结果只修改一次
            if(self.PromiseState !== 'pending') return;
            // 修改 Promise 对象状态
            self.PromiseState = 'rejected';
            // 修改 Promise 对象结果
            self.PromiseResult = data;

            // 异步操作接收，立刻执行回调，且每次then注册的回调都需要执行
            self.callbacks.forEach(item =>{
                // then 中回调按异步方式执行，即等同步代码执行完毕，在执行异步操作
                // 此处setTimeout不带时间，就能起到上述效果
                setTimeout(()=> {
                    item.onRejected(data);
                });
            });
        }

        try{
            // 执行器函数在构造器内是同步调用的，window 调用 Promise构造器，进而同步调用executor
            // resolve 和 reject 是直接调用，即隐式调用者是window，因此在二者中不能直接使用 this
            executor(resolve,reject);
        }catch (e){
            // 出现异常时，修改Primise对象状态为 rejected，且结果为异常对象
            reject(e);
        }
    }

    // 添加then方法
    then(onResolved,onRejected){
        let self = this;

        // then中回调函数如果不传，则给一个默认的，实现异常穿透和值传递
        if (typeof onResolved !=='function'){
            onResolved = value => value;
        }

        if (typeof onRejected !== 'function'){
            onRejected = reason => {
                throw reason;
            }
        }

        // 具体执行哪个回调取决于状态,使用过程中是 promise对象调用then，因此this直接就是promise对象
        return new Promise((resolve,reject)=>{ // 需要返回Promise类型对象
            function callback(func){
                try {
                    // 获取回调执行结果
                    let result = func(self.PromiseResult);
                    if (result instanceof Promise) { // 回调结果如果是Promise类型对象，则外面返回Promise的状态和结果与此Priomise一致
                        result.then(
                            v => {
                                resolve(v);
                            },
                            r => {
                                reject(r);
                            }
                        );
                    } else {
                        resolve(result); // 回调结果如果是非Promise类型对象，则结果就是其自身
                    }
                } catch (e) {
                    reject(e);
                }
            }

            if(this.PromiseState === 'fulfilled') {
                // then 中回调按异步方式执行，即等同步代码执行完毕，在执行异步操作
                // 此处setTimeout不带时间，就能起到上述效果
                setTimeout(()=>{
                    callback(onResolved);
                });

            }
            if(this.PromiseState === 'rejected'){
                // then 中回调按异步方式执行，即等同步代码执行完毕，在执行异步操作
                // 此处setTimeout不带时间，就能起到上述效果
                setTimeout(()=> {
                    callback(onRejected);
                });
            }
            if(this.PromiseState === 'pending'){
                // 异步任务处理完毕，遍历 this.callbacks 执行回调，然后修改Promise状态
                this.callbacks.push({
                    onResolved:function(){
                        callback(onResolved);
                    },
                    onRejected:function(){
                        callback(onRejected);
                    },
                });
            }
        });
    }

    // 实现Promise的catch函数功能
    catch(onRejected){
        return this.then(undefined,onRejected);
    }

    // 实现 Promise.resolve 方法(注意是 Promise的方法，不是Promise对象方法，因此不需要注册到prototype上)
    static resolve(value){
        // 返回Promise对象
        return new Promise((resolve,reject)=>{
            if(value instanceof Promise){
                // 传入Promise对象，则返回对象状态和结果与value一致
                value.then(v=>{
                    resolve(v);
                },r=>{
                    reject(r);
                });
            }else{
                // 传入非Promise对象，状态为成功，结果为value
                resolve(value);
            }
        });
    }

    // 实现 Promise的reject方法
    static reject(reason){
        // 无论传入什么，都是rejected状态，结果为reason
        return new Promise((resolve,reject)=>{
            reject(reason);
        });
    }

    // 实现Promise的all方法
    static all(promises){
        // 传入 promises数组，返回一个Promise对象
        return new Promise((resolve,reject)=>{
            let count = 0; // 计数器，记录成功promise个数
            let arr = []; // 盛放成功promise结果
            for(let i=0;i<promises.length;i++){ // 会使用下标存储结构，因此使用普通for循环
                promises[i].then(v=>{
                    count ++; // 计数器 +1
                    arr[i] = v; // 使用push时，对于异步任务，返回结果数组会乱序，必须执行下标存结果
                    if(count === promises.length){ // 全部成功，在改变当前promise状态
                        resolve(arr);
                    }
                },r=>{
                    reject(r); // 如果其中出现失败，就标记为失败，返回值为失败promise返回值
                });
            }
        });
    }

    // 添加race方法，返回首个导致状态改变的promise的状态和结果
    static race(promises){
        return new Promise((resolve,reject)=>{
            for(let i=0;i<promises.length;i++){
                // 直接调用 resolve 和 reject，谁先改变当前promise状态，就返回谁
                promises[i].then(v=>{
                    resolve(v);
                },r=>{
                    reject(r);
                });
            }
        });
    }
    
}









// 1.创建 Promise 构造器函数(添加resolve,reject,executor方法，并在executor中完成对前面两个调用)，注册then原型方法;
// 2.绑定PromiseState、PromiseResult两个属性，并实现resolve和reject中相应修改状态和结果逻辑;
// 3.对执行器函数添加try-catch机制，捕获异常，实现异常时，修改状态和结果功能
// 4.执行resolve和reject函数中修改状态和结果之前，判断状态是否已经改变过，实现仅能改变一次效果
// 5.then中执行回调函数，通过状态判断具体谁执行
// 6.执行函数中，执行异步任务时，保证异步任务一旦结束，立刻执行回调，在then中反向注入callback函数
// 7.同一个Promise对象，多次调用then时，每个then都生效
// 8.then 方法执行回调，返回新promise对象，
//    如果无return返回 undefined-Promise，
//    如果return-value，返回promise对象状态为fulfilled，结果为value
//    如果return-promise，则返回promise对象，与内部promose对象状态，结果一致；
//    如果执行回调抛出异常，则按rejected处理，结果为err
// 9.异步任务，返回Promise状态也得跟着改变
// 10.then中关于回调改变Promise状态 代码块抽取
// 11.catch异常穿透(不写reject函数，依旧能够触发catch)、值传递(不写resolve,后面依旧能够正常执行)
// 12.实现 Promise.resolve(value)方法
// 13.实现Promise.reject(reason)方法
// 14.实现Promise.all([p1...pn])方法
// 15.实现Promise.race([p1...pn])方法
// 16.实现then按异步方式执行回调，，即需要等所有同步代码执行完毕，在执行then,放入setTimeout()中,不设置时间，就是等同步代码执行完毕，立即异步执行