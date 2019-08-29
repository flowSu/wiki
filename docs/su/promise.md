## 手写promise的实现

::: tip Tips
在目前的前端开发中，我们对于异步方法的使用越来越频繁，那么如何处理异步方法的返回结果，如何优雅的进行异步处理对于一个合格的前端开发者而言就显得尤为重要，所以，对于promise的掌握程度，很能体现一个程序员的开发水平。我们中的大部分人每天忙于业务，应该没有闲暇时间去看下实现的源码，结合日常的工作实践及自己的一些理解，故而整理出此文，希望能用浅显的语言，让你掌握promise的代码实现。
:::

## promise的声明

首先，按照ES6的规范我们知道，promise肯定是一个类，而且promise的初始状态为pending

* 由于new Promise((resolve, reject) => {})，所以传入一个参数（函数），此处我们叫他exectuor，传入就执行

* exectuor里面有2个参数，一个叫resolve（成功），一个叫reject(拒绝)

* 由于resolve和reject可执行，所以都是函数，我们用let声明

```javascript
function Promise (exectuor) {
  // 成功
  function resolve () {}
  // 失败
  function reject () {}
  // 立即执行
  exectuor(resolve, reject)
}
```

## promise的基本状态

* Promise有三个状态（state）pending、fulfilled、rejected

* pending(初始状态)可以转化为fulfilled（完成）或rejected（拒绝）

* 完成后，状态不可逆，且有一个不可变的值（即返回的结果）value

* 拒绝后，状态也不可逆，且有一个不可变的原因（失败的原因）reason

* new Promise((resolve, reject) => {resolve(value)}),resolve为完成，接收参数value，状态变为fulfilled，不可再次改变

* new Promise((resolve, reject) => {reject(reason)}),reject为拒绝，接收参数reason，状态变为rejected，不可再次改变

* executor函数有可能报错，需要抛出异常报错信息，直接调用reject

```javascript
function Promise (exectuor) {
  // 保存this的指向，防止后面出现this的指向不明
  let self = this
  // 初始状态为pending
  self.state = 'pending'
  // 接受成功的值
  self.value = undefined
  // 接受失败的原因
  self.reason = undefined
  // 成功
  function resolve (value) {
    // 调用成功之后，修改状态为完成
    if (self.state === 'pending') {
      self.state = 'fulfilled'
      // 将成功的结果保存
      self.value = value
    }
  }
  // 失败
  function reject (reason) {
    // 调用失败之后，修改状态为拒绝
    if (self.state === 'pending') {
      self.state = 'rejected'
      // 将失败的原因保存
      self.reason = reason
    }
  }
  // 立即执行 如果只选出错，抛出异常
  try {
    exectuor(resolve, reject)
  } catch (reason) {
    // 将失败的结果保存
    reject(reason)
  }
}
```

## then方法

我们都知道，promise最重要的方法就是then方法了，name为了能够在实例之后调用这个方法，我们必须将这个方法写在它的原型链上。并且接受两个参数，一个是成功的回调onFulfilled，一个是失败的回调onRejected

* 当状态state为fulfilled时，就会执行成功的回调onFulfilled，传入value

* 当状态state为rejected时，就会执行失败的回调onRejected，传入reason

```javascript
Promise.prototype.then = function (onFulfilled, onRejected) {
  let self = this
  // 如果成功，执行成功的回调
  if (self.state === 'fulfilled') {
    onFulfilled(self.value)
  }
  // 如果失败，执行失败的回调
  if (self.state === 'rejected') {
    onRejected(self.reason)
  }
} 
```

这是否和你的理解有偏差？ 我们都知道promise是异步的，在上述代码中，我们看到的都是同步的代码，那么promise是如何实现异步的呢？

不急，先看下面一个小例子

```javascript
let p = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('hahaha')
  }, 1000)
  
})
p.then((value) => {
  console.log(value)
}, (reason) => {
  console.log('err', reason)
})
```

执行上面的代码，你会发现结果是在1秒后打印出来的，我们可以理解为then方法中的回调，是在promise的异步执行完成之后触发的。所以你在调用then方法的时候promise的状态一开始并不是成功或者失败，而是将成功和失败的回调函数保存起来。等待异步完成之后再执行相对应的成功或者失败的回调。

所以我们对于定义Promise函数实现的地方：

```javascript
function Promise (executor) {
  let self = this
  self.state = 'pending'
  self.value = undefined
  self.reason = undefined
  // 专门存放成功的回调 为什么是数组 下面有介绍 此处的你想想
  self.onResolvedArr = []
  // 专门存放失败的回调
  self.onRejectedArr = []

  ...
} 
```

在then函数的实现中，

```javascript
Promise.prototype.then = function (onFulfilled, onRejected) {
  let self = this
  if (self.state === 'fulfilled') {
    onFulfilled(self.value)
  }
  if (self.state === 'rejected') {
    onRejected(self.reason)
  }
  // 当state状态为等待pending的时候，将成功和失败的回调存入Promise定义的数组内
  // 之所以用数组是因为then方法可以调用多次，也就是说成功或者失败的回调不止一个
  if (self.state === 'pending') {
    self.onResolvedArr.push(fucnction () {
      onFulfilled(self.value)
    })
  }
  if (self.state === 'pending') {
    self.onRejectedArr.push(fucnction () {
      onRejected(self.reason)
    })
  }
}
```

在Promise的定义实现中，对resolve和reject的实现里

```javascript
function resolve (value) {
  if (self.state === 'pending') {
    self.value = value
    self.status = 'fulfilled'
    // 然后在成和失败的方法中利用数组的forEach依次调用保存的函数
    self.onResolvedArr.forEach(fn => fn())
  }
}
function reject (reason) {
  if (self.state === 'pending') {
    self.reason = reason
    self.state = 'rejected'
    self.onRejectedArr.forEach(fn => fn())
  }
}
```

## 解决链式调用

众所周知，promise的出现的一大好处是解决了传统解决异步问题的回调地狱，但是，promise是如何解决链式调用的呢？

* 为了达成链式调用，我们通常在第一个then里返回一个promise，将这个新返回的promise传递到下一个then中

* 新返回的promise如果成功，就会走下一次then的成功。

* 新返回的promise如果失败，就会走下一次then的失败。

当然，这里要注意的是then方法中返回的回调函数不能是自己本身。



then方法的实现：

```javascript
Promise.prototype.then = function (onFulfilled, onRejected) {
  let self = this
  let promise2
  // 每一个then都会返回一个promise，因为之后又promise才可以继续执行then方法（即链式调用）
  promise2 = new Promise((resolve, reject) => {
    if (self.state === 'fulfilled') {
      let x = onFulfilled(self.value)
      resolvePromise(promise2, x, resolve, reject)
    }
    if (self.state === 'rejected') {
      let x = onRejected(self.reason)
      // 这个函数可能是一个值，也可能是一个函数或者也会是promise
      // 即我们需要对onFulfilled或者onRejected函数的返回结果进行判断
      // 又因为返回的结果不能是promise本身，所以不能是promise2，需要我们额外写一个方法来处理几者之间的关系
      resolvePromise(promise, x, resolve, reject)
    }
    if (self.state === 'pending') {
      self.onResolved.push(function () {
        let x = onFulfilled(self.value)
        resolvePromise(promise2, x, resolve, reject)
      })
      self.onRejected.push(function () {
        let x = onRejected(self.reason)
        resolvePromise(promise2, x, resolve, reject)
      })
    }
  })
}
```

函数resolvePromise的实现

```javascript
function resolvePromise (promise2, x, resolve, reject) {
  // 此处是为了防止形成回调地狱 我们必须判断一下promise2和当前结果之间的关系，如果他们相等，那就说明已经出现了回调地狱
  // 此时需要抛出一个错误
  if (promise === x) {
    return reject(newTypeError('循环引用'))
  }
  if (x !=null && (typeof x === 'object' || typeof x === 'function')) {
    // 此处稍后再表
  } else {
    // 如果当前的值既不是一个函数也不是一个object，那就是说是一个普通值，直接进入完成后的回到函数
    resolve(x)
  }
}
```

然后，让我们继续看在返回值不为空且是一个函数或者对象的情况下应该如何处理

```javascript
function resolvePromise (promise2, x, resolve, reject) {
  if (promise === x) {
    return reject(newTypeError('循环引用'))
  }
  if (x !=null && (typeof x === 'object' || typeof x === 'function')) {
    try {
      // 因为每一个promise都会有一个then方法，所以我们用变量then去保存
      let then = x.then
    } catch (error) {
      // 如果这里出现错误，直接指向reject方法
      reject(error)
    }
  } else {
    resolve(x)
  }
}
```

接下来，我们要判断then方法的类型

```javascript
function resolvePromise (promise2, x, resolve, reject) {
  if (promise === x) {
    return reject(newTypeError('循环引用'))
  }
  if (x !=null && (typeof x === 'object' || typeof x === 'function')) {
    try {
      let then = x.then
      // 判断then方法的类型，如果是一个函数，我们就认为返回的是一个promise 否则，就是一个普通值，可以直接调用resolve
      if (typeof then === 'function') {
        then.call(x, (y) => {
          resolve(y)
        }, err => {
          reject(err)
        })
      } else {
        resolve(x)
      }
    } catch (error) {
      reject(error)
    }
  } else {
    resolve(x)
  }
}
```

然后执行then，判断执行的结果

```javascript
function resolvePromise (promise2, x, resolve, reject) {
  if (promise === x) {
    return reject(newTypeError('循环引用'))
  }
  if (x !=null && (typeof x === 'object' || typeof x === 'function')) {
    try {
      let then = x.then
      if (typeof then === 'function') {
        // 执行then方法，判断执行的结果
        // 这里为什么用call，因为当前上下文的this指向并不是x，所以要使用call方法
        then.call(x, (y) => {
          // then方法执行成功 走resolve
          resolve(y)
        }, err => {
          // then方法失败，走reject
          reject(err)
        })
      } else {
        resolve(x)
      }
    } catch (error) {
      reject(error)
    }
  } else {
    resolve(x)
  }
}
```

写到这里，基本逻辑就写的差不多了。但是有的同学可能会问，我们只是列出了then调用了1次的情况，那如果存在多次调用，上面的逻辑仍然是走不通的。

那么，继续往下看，为了避免上述情况，我们就需要使用递归来执行：

```javascript
then.call(x, y => {
  // called 拦截器，保证成功和失败的回调只会执行一个
  if (called) return
  called = true
  // 递归调用 如果resolve是一个promise 就要不同的resolve的结果进行处理
  resolvePromise(promise2, y, resolve, reject)
}, e => {
  if (called) return
  called = true
  reject(e)
})
```

可以用下面这个测试用例测试下：

```javascript
let promise = new Promise((resolve,reject)=>{
   resolve(1)
})
promise.then((value) => {
   console.log(value)
}, (reason) => {
  console.log(reason)
})
console.log(2)
```

上面的代码，执行后发现执行结果是1 2， 按照我们对ES6的理解，应该是2 1 才对，为什么会出现这种情况呢？经过往上翻阅代码，发现我们在定义Promise的时候，立即执行函数executor这块是同步的，所以模拟异步的，将此处修改为：

```javascript
// 用setTimeout来模拟异步，不管是成功还是失败，都是异步的
setTimeout(() => {
  try {
    let x = onFulfilled(self.value)
    resolvePromise(promise2, x, resolve, reject)
  } catch (err) {
    reject(err)
  }
}, 0)
```

因为刚才分析then方法的两个回调函数是可选的参数，所以我们也要处理一下：

```javascript
Promise.prototype.then = function (onFulfilled, onRejected) {
  // 利用三目运算符，如果是函数，就让函数执行 如果不是或者没有传参，就让值直接向下穿透
  onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : val => val
  onRejected = typeOf onRejected === 'function' ? onRejected : err => {
    throw err
  }
}
```

## catch方法的实现

我们都知道，catch方法也是可以链式调用的，所以，catch方法也是Promise原型上的方法

```javascript
Promise.prototype.catch = function (onRejected) {
  return this.then(null, onRejected)
}
```

另外，promise也可以直接调用resolve和reject函数

```javascript
Promise.reject = function (reason) {
  return new Promise((resolve, reject) => {
    reject(reason)
  })
}

Promise.resolve = function (value) {
  return new Promise((resolve, reject) => {
    resolve(value)
  }
}
```










