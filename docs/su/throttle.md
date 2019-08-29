## 再谈函数防抖与节流

::: tip Tips
发现上次写了函数防抖与节流之后，写的仍是不明不白的，故这次用白话再来梳理一番。
:::

### 1. 函数防抖

> 触发高频事件后的n秒内，函数只会执行一次，如果n秒内再次触发该高频事件，则重新开始计算时间。

* #### 思路：

> 每次触发事件时都会取消之前的延时调用方法

``` javascript
function debounce(fn) {
  // 创建一个标记，用来存放定时器的返回值
  let timeout = null
  return function () {
    // 每当用户输入的时候把前一个setTimeout clear掉
    clearTimeout(timeout)
    // 然后又创建一个setTimeout 这样能保证输入字符后的间隔内 就不会再执行fn函数
    timeout = setTimeout(() => {
      fn.apply(this, arguments)
    }, 500)
  }
}
function sayHi () {
  console.log('防抖成功')
}
var inp = document.getElementById('inp')
// 防抖
inp.addEventListener('input', debounce(sayHi))
```

### 2. 函数节流

> 高频事件触发， 但在n秒内只会执行一次，所以节流会稀释函数的执行频率

* #### 思路

> 每次触发事件时都判断当前是否有等待执行的延时函数

```javascript
function throttle (fn) {
  // 判断是否有等待执行的延时函数
  let canRun = true
  return function () {
    // 在函数开头判断标记是否为true，不为true则return
    if (!canRun) return
    canRun = false
    // 将外部传入的函数的执行放在setTimeout中
    setTimeout(() => {
      fn.apply(this, arguments)
      // 最后在setTimeout执行完毕后再把标记设置为true(关键)表示可以执行下一次循环了。当定时器没有执行的时候标记永远是      false，在开头被return掉
      canRun = true
    }, 500)
  }
}
function sayHi (e) {
  console.log(e.target.innerWidth, e.target.innerHeight)
}

window.addEventListener('resize', throttle(sayHi))
```