## async/await执行顺序详解

::: tip Tips
随着async/await正式纳入ES7的标准，越来越多的人开始研究据说是异步编程终极解决方案的async/await。但是很多人对这个方法中内部怎么执行的还不是很了解，本文是继上篇文章理解Javascript的async/await后的补充拓展，再次整理了await之后的js的执行顺序，希望可以给别人解疑答惑，然后简单交待下async/await的背景：

1. async/await是一种编写异步代码的新方法，之前异步代码的方案是回调和promise。
2. async/await是建立在promise的基础上。
3. async/await像promise一样，也是非阻塞的。
4. async/await让异步代码看起来、表现起来更像同步代码。
:::

### async怎么处理返回值

<hr/>

同上篇文章所述，

```javascript
async function testAsync() {
  return "hello async";
}
let result = testAsync();
console.log(result)
```

输出结果：
```javascript
Promise {[[PromiseStatus]]: "resolved", [[PromiseValue]]: "hello async"}
```

从结果中可以看出async函数返回的是一个promise对象，如果在函数中return一个直接量，async会把这个直接量通过Promise.resolve()封装成Promise对象。

如果async函数没有返回值， 如下所示
```javascript
async function testAsync() {
  console.log("hello async");
}
let result = testAsync();
console.log(result)
```

结果：

```javascript
hello async
Promise {[[PromiseStatus]]: "resolved", [[PromiseValue]]: undefined}
```

结果返回Promise.resolve(undefined)。

### await到底做了什么处理

<hr/>

从字面意思上看await就是等待，await 等待的是一个表达式(的值)，这个表达式的返回值可以是一个promise对象也可以是其他值。

::: tip Tips
很多人以为await会一直等待之后的表达式执行完之后才会继续执行后面的代码，实际上await是一个让出线程的标志。<font color="red">await后面的函数会先执行一遍。然后就会跳出整个async函数来执行后面js栈（后面会详述）的代码。（参看下面代码）</font>等本轮事件循环执行完了之后又会跳回到async函数中等待await后面表达式的返回值，如果返回值为非promise则继续执行async函数后面的代码，否则将返回的promise放入promise队列（Promise的Job Queue）
:::

```javascript
async function test1 () {
  console.log('test1')
  return 'test1 res'
}

async function test2 () {
  console.log('test2')
  let res = await test1()
  console.log('res的结果为：', res)
}

function test3 () {
  console.log('test3')
}

test2()
test3()
```

结果为: 

```javascript
// 先执行test2函数
test2
// 执行到await test1后，立即执行test1函数 
test1
// 然后跳出async函数 执行test3
test3
// test3执行完，等待test1的返回结果
res的结果为： test1 res
```

### await到底做了什么处理

<hr/>

先看一个例子

```javascript
function testSomething () {
  console.log('执行testSomething')
  return 'testSomething'
}

async function testAsync () {
  console.log('执行testAsync')
  return Promise.resolve('hello async')
}

async function test () {
  console.log('test start')
  const v1 = await testSomething()
  console.log(v1)
  const v2 = await testAsync()
  console.log(v2)
  console.log(v1, v2)
}
test()
var promise = new Promise(resolve => {
  console.log('promise start') 
  resolve('promise')
})
promise.then(val => console.log(val))
console.log("test end...")
```

下面先来看下结果是什么？

```javascript
test start
执行testSomething
promise start
test end...
testSomething
执行testAsync
promise
hello async
testSomething hello async
```

当test函数执行到

```javascript
const v1 = await testSometing()
```

的时候，会执行testSomething这个函数打印出‘执行testSometing’的字符串，然后因为await会让出线程（跳出当前async函数）就会去执行后面的

```javascript
var promise = new Promise(resolve => { 
  console.log("promise start..")
  resolve("promise")
})
```

然后打印出"promise start"，接下来会把返回的这promise放入promise队列，继续执行打印'test end...'，等本轮事件循环执行结束后，又会跳回到async函数的await中断处，取到testSomething的返回值，因为此时的testSomething函数不是一个async函数，所以返回的是一个字符串testSomething，test函数继续执行，执行到

```javascript
const v2 = await testAsync()
```

和之前一样，又会跳出当前async函数，执行后面的函数，此时当前事件就进入到上一步await之后的promise队列，执行promise.then(val => console.log(val)) then后面的语句，之后和前面的一样又跳回到test函数继续执行。

这个就是在async/await函数之后js的执行顺序。

假设此时我把testSomething函数前面加上async：

```javascript
async function testSomething () {
  console.log('执行testSometing')
  return 'testSomething'
}

async function testAsync () {
  console.log('执行testAsync')
  return Promise.resolve('hello async')
}

async function test () {
  console.log("test start...")
  const v1 = await testSometing()
  console.log(v1)
  const v2 = await testAsync()
  console.log(v2)
  console.log(v1, v2)
}

test()

var promise = new Promise(resolve => {
  console.log('promise start...')
  resolve('promise')
})
promise.then(res => console.log(res))

console.log('test end')
```

那么，先来看看此时的输出结果：

```javascript
test start...
执行testSometing
promise start...
test end
promise
testSomething
执行testAsync
hello async
testSomething hello async
```

和上面的一个例子对比发现，

```javascript
promise.then(res => console.log(res))
```

先于

```javascript
console.log(v1)
```

执行了，原因是因为现在testSomething函数加了async，返回的是一个Promise对象，需要等它resolve，在此处发生了阻塞，所以将当前testSomething的返回结果放进Promise队列，继续跳出test函数后执行后续代码，执行就开始执行promise的任务队列了，所以先执行了promise.then(res => {console.log(res)}), 因为这个promise队列（即new Promise那一行对应的Promise）先进入队列的。

