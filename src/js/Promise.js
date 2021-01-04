// 声明构造函数
function Promise(executor){
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
            item.onResolved(data);
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
            item.onRejected(data);
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
Promise.prototype.then = function(onResolved,onRejected){
    // 具体执行哪个回调取决于状态,使用过程中是 promise对象调用then，因此this直接就是promise对象
    return new Promise((resolve,reject)=>{ // 需要返回Promise类型对象
        try{
            if(this.PromiseState === 'fulfilled'){
                // 获取回调执行结果
                let result = onResolved(this.PromiseResult);
                if(result instanceof Promise){ // 回调结果如果是Promise类型对象，则外面返回Promise的状态和结果与此Priomise一致
                    result.then(
                        v=>{
                            resolve(v);
                        },
                        r=>{
                            reject(v);
                        }
                    );
                }else{
                    resolve(result); // 回调结果如果是非Promise类型对象，则结果就是其自身
                }

            }
            if(this.PromiseState === 'rejected'){
                let result = onRejected(this.PromiseResult);
                if(result instanceof Promise){
                    result.then(
                        v=>{
                            resolve(v);
                        },
                        r=>{
                            reject(v);
                        }
                    );
                }else{
                    reject(result);
                }
            }
            if(this.PromiseState === 'pending'){
                this.callbacks.push({
                    onResolved:onResolved,
                    onRejected:onRejected,
                });
            }
        }catch (e){
            reject(e);
        }
    });
}

// 1.创建 Promise 构造器函数(添加resolve,reject,executor方法，并在executor中完成对前面两个调用)，注册then原型方法;
// 2.绑定PromiseState、PromiseResult两个属性，并实现resolve和reject中相应修改状态和结果逻辑;
// 3.对执行器函数添加try-catch机制，捕获异常，实现异常时，修改状态和结果功能
// 4.执行resolve和reject函数中修改状态和结果之前，判断状态是否已经改变过，实现仅能改变一次效果
// 5.then中执行回调函数，通过状态判断具体谁执行
// 6.执行函数中，执行异步任务时，保证异步任务一旦结束，立刻执行回调，在then中反向注入callback函数
// 7.同一个Promise对象，多次调用then时，每个then都生效
// 8.then 方法执行回调，返回新promise对象，
// 如果无return返回 undefined-Promise，
// 如果return-value，返回promise对象状态为fulfilled，结果为value
// 如果return-promise，则返回promise对象，与内部promose对象状态，结果一致；
// 如果执行回调抛出异常，则按rejected处理，结果为err