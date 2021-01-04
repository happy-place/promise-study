function randBetween(m: number, n: number) {
    // 返回介于 m ~ n 直接随机数
    return Math.ceil(Math.random() * (n - m + 1)) + m - 1;
}

export function choujiang_by_jquery() {
    const btn = document.getElementById("btn")!;
    btn.addEventListener('click', () => {
        setTimeout(() => {
            let num = randBetween(1, 100);
            if (num <= 30) {
                alert(`恭喜中奖${num}`);
            } else {
                alert(`谢谢惠顾${num}`);
            }
            ;
        }, 500);
    })
}

/**
 * Primse
 * 1.支持异步回调，回调函数先使用，后声明；
 * 2.支持链式调用
 */
export function choujiang_by_promise() {
    const btn = document.getElementById("btn")!;
    btn.addEventListener('click', () => {
        // 声明primise 对象，需要注入两个处理函数 resolve 和 reject 一个处理成功回调，一个负责处理失败回调
        // 注 html <script> 中哪些 new Promise 对象是，不需要使用void
        let promise = new Promise<void>(  (resolve, reject) => {
            setTimeout(() => {
                let num = randBetween(1, 100);
                if (num <= 30) {
                    // @ts-ignore
                    resolve(num);
                } else {
                    reject(num);
                }
            },200);

        });
        // 此处 对 resolve 和 reject进行具体实现，收个then 第一个函数是resolve，第二个时reject
        promise.then((num) => {
            alert(`恭喜中奖${num}`);
        },(num) => {
            alert(`谢谢惠顾${num}`);
        });
    });
}

