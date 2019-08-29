## 从一道题浅说javascript的事件循环

> 注：最近在网上看到这样一道有关事件循环的前端面试题：

```javascript
async function async1 () {
  console.log('async1 start')
  await async2()
  console.log('async1 end')
}
async function async2 () {
  console.log('async2')
}
console.log('script start')
setTimeout(function () {
  console.log('setTimeout')
}, 0)
async1()
new Promise(function (resolve) {
  console.log('promise1')
  resolve()
}).then(function () {
  console.log('promise2')
})
console.log('script end')

// 输出结果为：
script start
async1 start
async2
promise1
script end
async1 end
promise2
setTimeout
```
这道题主要考察的是事件循环中函数执行顺序的问题，其中包含async、await、setTimeout、Promise函数，下面来梳理下本题中涉及到的知识点。

### 任务队列

<hr/>

首先，我们需要明白以下几件事情：

  * js分为同步任务和异步任务
  * 同步任务都在主线程上执行，形成一个执行栈
  * 主线程之外，事件触发线程管理者一个任务队列，只要异步任务有了运行结果，就在任务队列之中放置一个事件。
  * 一旦执行栈中的所有同步任务执行完毕（此时js引擎空闲），系统就会读取任务队列，将可运行的异步任务添加到可执行栈中，开始执行。

根据规范，事件循环是通过任务队列的机制来进行协调的。一个 Event Loop中，可以有一个或者多个任务队列（task queue），一个任务队列辨识一系列有序任务（task）的集合；每个任务都有一个任务源（task source），源自同一个任务源的task必须放到同一个任务队列，从不同源来的则被添加到不同队列。setTimeout/Promise等API便是任务源，而进入任务队列的是他们指定的具体执行任务。

![任务队列](https://camo.githubusercontent.com/dd47eccb5d9f224f911f0a1cbdf3fb5c9f3fa24a/68747470733a2f2f692e6c6f6c692e6e65742f323031392f30322f30382f356335643764383530353663372e706e67)

### 宏任务

<hr/>

(marco) task （也即宏任务），可以理解是每次执行栈执行的代码就是一个宏任务（包括每次从事件队列中获取一个事件回调并放到执行栈中执行）。

浏览器为了能够使得JS内部（macro）task与DIM任务能够有序的执行，会在一个（marco）task执行结束后，在下一个（macro）task执行开始前，对页面进行重新渲染，流程如下：

```javascript
（macro）task -> 渲染 -> （macro）task -> ...
```

(macro) task主要包含： script（整体代码）、setTimeout、setInterval、I/O、UI交互事件、postMessage、MessageChannel、setImmediate(Node.js 环境)

### 微任务

<hr/>

micro task（即微任务），可以理解是在当前task（个人理解是：宏任务）执行结束后立即执行的任务。也就是说，在当前task任务后，下一个task之前，在渲染之前。

所以它的响应速度相比setTimeout(setTimeout是task)会更快，因为无需等待渲染。也就是说，<font color="red">在某一个macro task执行完后，就会将在它执行期间产生的所有micro task都执行完（在渲染前）</font>

micro task 主要包含: Promise.then、MUtaionObserver、process.nextTick(Node.js环境)

### 运行机制

<hr/>

在事件循环中，每进行一次循环操作成为tick，每一次tick的任务处理模型是比较复杂的。但关键步骤如下：

  * 执行一个宏任务（栈中没有就从事件队列中获取）
  * 执行过程中如果遇到微任务，就将他添加到微任务的任务队列中
  * 宏任务执行完毕后，立即执行当前微任务队列中的所有微任务（依次执行）
  * 当前宏任务执行完毕，开始检查渲染，然后GUI线程接管渲染。
  * 渲染完毕后，JS线程继续接管，开始下一个宏任务（从事件队列中获取）

流程图如下：

![运行机制](https://camo.githubusercontent.com/47479c8773d91e8eef4a359eca57bb1361183b9e/68747470733a2f2f692e6c6f6c692e6e65742f323031392f30322f30382f356335643661353238626461662e6a7067)

### Promise和async中的立即执行

<hr/>

我们知道Promise中的异步体现在then和catch中，所以写在Promise中的代码是被当做同步任务立即执行的。而在async/await中，在出现await之前，其中的代码也是立即执行的。那么出现了await时候发生了什么呢？

### await做了什么

<hr/>

从字面意思上看await就是等待，await等待的是一个表达式，这个表达式的返回值可以是一个promise对象，也可以是一个其他值。

很多人以为await会一直等待之后的表达式执行完之后才会继续执行后面的代码，实际上await是一个让出线程的标志。await后面的表达式会先执行一遍，将await后面的代码加入到micro task中，然后就会跳出整个async函数来执行后面的代码。

但是鉴于async await本身就是promise+generator的语法糖，所以await后面的代码就是microtask。

```javascript
async function async1() {
	console.log('async1 start');
	await async2();
	console.log('async1 end');
}
```

等价于

```javascript
async function async1() {
  console.log('async1 start');
  // resolve内的async2立即执行，但是then放到微任务中
	Promise.resolve(async2()).then(() => {
    console.log('async1 end');
  })
}
```

回到本题

<hr/>

以上就是本道题涉及到的所有相关知识点了，下面我们再回到这道题来一步一步看看怎么回事儿。

  1. 首先，事件循环从宏任务（macro task）队列开始，这个时候，宏任务队列中，只有一个script（整体代码）任务，当遇到任务源（task source）时，则会先分发任务到对应的任务队列中区。所以，上面例子的第一部执行如下图所示：

  ![第一步执行](https://camo.githubusercontent.com/15b3ae9733b0b5b6a144f519396ff88eaeca40fb/68747470733a2f2f692e6c6f6c692e6e65742f323031392f30322f30382f356335643639623432316166332e706e67)

  2. 然后我们看到首先定义两个async函数，接着往下看，然后运行到了console语句，直接输出script start。输出之后，script任务继续往下执行，遇到setTimeout，其作为一个宏任务员，则会先将其任务分发到对应的队列中：

  ![第二步执行](https://camo.githubusercontent.com/0a6e6cd2cc52d18a0f97ec01659058e830305a45/68747470733a2f2f692e6c6f6c692e6e65742f323031392f30322f30382f356335643639623432353530612e706e67)

  3. script任务继续往下执行，执行了async1()函数，前面讲过async函数中在await之前的代码是立即执行的，所以会立即输出async1 start。

  遇到了await时，会将await后面的表达式执行一遍，所以就紧接着输出按async2，然后将await后面的代码也就是console.log('async1 end')koaridapmicrotask中的Promise队列中，接着跳出async1函数来执行后面的代码。

  ![第三步执行](https://camo.githubusercontent.com/93ec5469b0846f0f161641fc718005dbe994d190/68747470733a2f2f692e6c6f6c692e6e65742f323031392f30322f31382f356336616435383333376165642e706e67)

  4. script任务继续往下执行，遇到Promise示例。由于Promise中的函数是立即执行的，而后续的.then则会被分发到micro task的Promise队列中去，所以会先输出promise1，然后执行resolve，将promise2分配到对应队列。

  ![第四步执行](https://camo.githubusercontent.com/6f617a237607ce7a71fabcab61d2952a8b412205/68747470733a2f2f692e6c6f6c692e6e65742f323031392f30322f31382f356336616435383334376135652e706e67)

  5. script任务继续往下执行，最后只有一句输出了script end，至此，全局任务就执行完毕了。

    根据上述，每次执行完一个宏任务后，回去检查是否存在 微任务，如果有，则执行微任务，直至情况微任务队列。

    因而在script任务执行完毕之后，开始查找情况微任务队列。此时，微任务中，Promise队列有的两个任务async1 end 和 promise2 按先后顺序输出。当所有的微任务执行完毕后，表示第一轮的循环就此结束了。

  6. 第二轮循环依旧从宏任务队列开始，此时宏任务中只有一个setTimeout，取出直接输出即可，至此真格流程结束。

下面，我们来改变一下代码来加深印象。

### 变式一

<hr/>

在第一个变式中，将async2中的函数也变成了Promise函数，代码如下：

```javascript
async function async1() {
    console.log('async1 start');
    // 此时async2等待返回执行结果，肯定是promise2 在前
    await async2();
    console.log('async1 end');
}
async function async2() {
    //async2做出如下更改：
    new Promise(function(resolve) {
      console.log('promise1');
      resolve();
    }).then(function() {
      console.log('promise2');
    });
}
console.log('script start');

setTimeout(function() {
    console.log('setTimeout');
}, 0)
async1();

new Promise(function(resolve) {
    console.log('promise3');
    resolve();
}).then(function() {
    console.log('promise4');
});

console.log('script end');

// 输出结果为：
script start
async1 start
promise1
promise3
script end
promise2
async1 end
promise4
setTimeout
```

在第一次macro task执行完之后，也就是输出script end之后，会去清理所有 micro task。所以会相继输出promise2、async1 end、 promise4

### 变式二

<hr/>

在第二个变式中，我将async1中await后面的代码和async2的代码都改为异步的，代码如下：

```javascript
async function async1() {
    console.log('async1 start');
    await async2();
    //更改如下：
    setTimeout(function() {
        console.log('setTimeout1')
    },0)
}
async function async2() {
    //更改如下：
	setTimeout(function() {
		console.log('setTimeout2')
	},0)
}
console.log('script start');

setTimeout(function() {
    console.log('setTimeout3');
}, 0)
async1();

new Promise(function(resolve) {
    console.log('promise1');
    resolve();
}).then(function() {
    console.log('promise2');
});
console.log('script end');

// 输出结果为：
script start
async1 start
promise1
script end
// 第一次macro task执行完后， 回去清理micro task队列 此时里面只有promise2
promise2
// 为什么setTimeout3最先输出，因为第一次script执行完之后，当前macro task该执行任务队列的setTimeout3 然后此次执行完后，再去执行依次遇到的setTimeout2和1
setTimeout3
setTimeout2
setTimeout1
```

### 变式三

<hr/>

变式三是我在一篇面经中看到的原题，整体来说大同小异，代码如下：

```javascript
async function a1 () {
    console.log('a1 start')
    await a2()
    console.log('a1 end')
}
async function a2 () {
    console.log('a2')
}

console.log('script start')

setTimeout(() => {
    console.log('setTimeout')
}, 0)

Promise.resolve().then(() => {
    console.log('promise1')
})

a1()

let promise2 = new Promise((resolve) => {
    resolve('promise2.then')
    console.log('promise2')
})

promise2.then((res) => {
    console.log(res)
    Promise.resolve().then(() => {
        console.log('promise3')
    })
})
console.log('script end')

// 输出结果为：
// 1、js是同步的 先执行console.log('script start') 然后接着执行setTimeout 加入macro task中 为第一位 接着遇到Promise.resolve.then promise1 放入micro任务中
script start
// 2、执行到a1()
a1 start
// 3、执行到a1内的await a2 立即执行a2里面的内容, 同时将await之后的console加入到微任务promise对象
a2
// 4、打印完a2后，此时里面跳出a1函数，继续往下执行 到let promise2 立即执行里面的函数 先执行resolve 但是then给异步等待了
promise2
// 5、顺序执行到script end
script end
// 6、第一次macro task 执行完毕，接着清理第一次执行的micro task  先放进去的是promise1 
promise1
// 7、micro task的任务队列的关系为1、promise 2、console.log(a1 end) 3、promise2.then 4、promise3
a1 end
promise2.then
promise3
// 8、micro task 执行完毕后，继续执行macro task 执行setTimeout
setTimeout
```




