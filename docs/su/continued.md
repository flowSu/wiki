## 持续更新

## 1. 图片懒加载的实现原理

::: tip Tips
实现原理： 先把img的src指向空或者一个小图片，图片真实的地址存储在img一个自定义的属性data-src里面，等到此图片出现在视野范围内了，获取img元素，把data-src的值赋给src。
:::

代码实现：

```javascript
var aImg = document.querySelectorAll('img')
var len = aImg.length
// 存储图片加载到的位置，避免每次都从第一张图片开始遍历
var n = 0
window.onscroll = function() {
  // 可视区域高度
  var seeHeight = document.documentElement.clientHeight
  // 滚动的高度
  var scrollTop = document.body.scrollTop || document.documentElement.scrollTop
  for (var i = n; i < len; i++) {
    // 目标标签img相对于document顶部的位置
    if (aImg[i].offsetTop < seeHeight + scrollTop) {
      // 如果图片的src为空，说明没有加载过
      if (aImg[i].getAttribute('src') == '') {
        aImg[i].src = aImg[i].getAttribute('data-src')
      }
      n = i + 1
      console.log('n = ' + n)
    }
  }
}
```

## 2. 如何提高图片懒加载的效率

* 我们知道类似scroll或者resize这样的事件浏览器可能在很短的时间内触发很多次，为了提高网页的性能，我们需要一个节流函数来控制函数的多次触发，在一段时间内（如500ms只执行一次回调）

```javascript
/**
 * 持续触发事件，每隔一段时间，只执行一次事件。
 * @param fun 要执行的函数
 * @param delay 延迟时间
 * @param time 在 time 时间内必须执行一次
 */
function throttle(fun, delay, time) {
  var timeout
  var previous = +new Date()
  return function () {
      var now = +new Date()
      var context = this
      var args = arguments
      clearTimeout(timeout)
      if (now - previous >= time) {
        fun.apply(context, args)
        previous = now
      } else {
        timeout = setTimeout(function () {
          fun.apply(context, args)
        }, delay)
      }
  }
}
window.addEventListener('scroll', throttle(checkImgs, 200, 1000), false);
```

* H5有个新增的API，IntersectionObserver API，可以自动观察元素是否可见

```javascript
var observer = new IntersectionObserver(callback, option);

// 开始观察
observer.observe(document.getElementById('first'))

// 停止观察
observer.unobserve(document.getElementById('first'))

// 关闭观察器
observer.disconnect()
```

目标的可见性发生变化时就会调用观察器的callback

```javacript
function callback(changes: IntersectionObserverEntry[]) {
    console.log(changes[0])
}

// IntersectionObserverEntry
{
    time: 29.499999713152647,
    intersectionRatio: 1,
    boundingClientRect: DOMRectReadOnly {
        bottom: 144,
        height: 4,
        left: 289,
        right: 293,
        top: 140,
        width: 4,
        x: 289,
        y: 140
    },
    intersectionRect: DOMRectReadOnly,
    isIntersecting: true,
    rootBounds: DOMRectReadOnly,
    target: img#first
}
```

详细解释：

  * time: 可见性发生变化的时间，是一个高精度时间戳，单位为毫秒
  * intersectionRatio: 目标元素的可见比例，即intersectionRect占boundingClientRect的比例，完全可见时为1，完全不可见时小于等于0
  * boundingClientRect: 目标元素的矩形区域的信息
  * intersectionRect: 目标元素与视口（或根元素）的交叉区域的信息
  * rootBounds: 根元素的局限区域的信息，getBoundingClientRect()方法的返回值，如果没有根元素（即直接相对于视口滚动），则返回null
  * isIntersecting: 是否进入了视口，boolean值
  * target: 被观察的目标元素，是一个DOM节点对象

使用IntersectionObserver实现突破懒加载：

```javascript
function query(tag) {
    return Array.from(document.getElementsByTagName(tag));
}
var observer = new IntersectionObserver(
    (changes) => {
        changes.forEach((change) => {
            if (change.intersectionRatio > 0) {
                var img = change.target;
                img.src = img.dataset.src;
                observer.unobserve(img);
            }
        })
    }
)
query('img').forEach((item) => {
    observer.observe(item);
})
```

## 3. PWA原理

[点击这里](https://juejin.im/post/5a9e8ad5f265da23a40456d4)

## 4. 如何写一个 PWA

[点击这里](https://zhuanlan.zhihu.com/p/25459319)

## 5. getBoundingClientRect 方法的弊端

[点击这里](https://juejin.im/entry/59c1fd23f265da06594316a9)

![返回对象介绍](https://link.juejin.im/?target=https%3A%2F%2Fgithub.com%2Fzuopf769%2Fnotebook%2Fblob%2Fmaster%2Ffe%2F%25E4%25BD%25A0%25E7%259C%259F%25E7%259A%2584%25E4%25BC%259A%25E7%2594%25A8getBoundingClientRect%25E5%2590%2597%2F2008100603035335.gif)

总结:
  * 其返回的对象的right和bottom与css的right和bottom意义不一样，而top、left及width height均一致
  * 有兼容性问题，IE只返回top left right bottom，其他浏览器均返回，但是可以通过计算得到

## 6. 静态资源加载和更新的策略

## 7. CDN 服务器的了解和使用、缓存静态资源的注意事项

## 8. history 路由和 hash 路由的区别, 在浏览器有什么影响

[history 路由和 hash 路由](https://segmentfault.com/a/1190000007238999)


