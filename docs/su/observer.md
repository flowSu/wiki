## 用观察者模式编写一个可被其他对象拓展的可复用的自定义事件系统

::: tip Tips
### 观察者模式

定义对象间的一种一对多的依赖关系，当一个对象的状态发生改变时，所有依赖于它的对象都将得到通知

:::

### 什么是观察者模式？

发布-订阅模式姑且可被称为是观察者模式的一种简单体现，它定义对象间的一种一对多的依赖关系，<font color="#c7254e">当一个对象的状态发生改变时，所有依赖于它的对象都将得到通知。</font>在JS开发中，我们一般用事件魔心来替代传统的发布-订阅模式。

举个例子：

::: tip

卖水果的张老板和王老板都要进一批香蕉，他们的水果都是在一个叫钱多多（简称钱老板）的水果批发商哪里进的。当张老板和王老板到钱老板那里进水果的时候，钱老板告诉张老板和王老板，香蕉还没有到货，得过几天才到货。无奈之下，张老板和王老板都把他们的电话号码留在了钱老板那里，嘱咐钱老板，香蕉到货后，第一时间通知他们。

:::

上面的钱老板就扮演了发布者的角色，张老板和王老板则扮演的是订阅者角色。在香蕉到货后，钱老板会主动给张老板和王老板发消息，让两位老板来取香蕉。这样的好处是：香蕉还没到的这段时间，张老板和王老板可以做其他的事情，不用主动联系钱老板，只需等待钱老板的通知即可。这也就是逻辑代码中的时间上解耦，对象间解耦。

### 自定义事件

其实，观察者模式我们都使用过，就是我们熟悉的事件，但是内置的事件，很多时候不能满足我们的需求，所以我们需要自定义事件。

<hr/>

现在，我们想实现这一的功能，定义一个事件对象，它有一下功能

  * 监听事件（订阅事件）
  * 触发事件（事件发布）
  * 移除事件（取消订阅事件）

当然，我们不可能只订阅一个事件，可能会订阅很多事件，所以我们要针对不同的事件设置不同的“键”，所以，我们存储事件的结构应该是这样的：

```javascript
EventList = {
  evtName1: [回调函数1， 回调函数2，...],
  evtName2: [回调函数1，回调函数2，...],
  evtName3: [回调函数1，回调函数2，...]
}
```

代码如下

```javascript

var createEventSys = function () {
  return {
    // 通过on接口监听事件eventName
    // 如果事件eventName被触发，则执行callback回调函数
    on: function (eventName, callback) {
      // 如果Event对象没有handles属性，则给Event对象定义属性handles，初始值为{}
      // handles属性时用来存储事件和回调执行函数的（即存储订阅的事件和触发事件后执行的相应函数方法）
      if (!this.handles) {
        this.handles = {}
      }
      // 如果handles中不存在事件eventName，则将时间存储在handles中，同时初始化该事件对应的回调逻辑函数集合
      if (!this.handles[eventName]) {
        // 为什么是数组呢？因为可能存在多个订阅事件（即事件名一致，但是具体实现不一致）
        this.handles[eventName] = []
      }

      // 往handles中的eventName对应的回调逻辑函数集合push回调函数
      this.handles[eventName].push(callback)

      // 注： 这里可以解释为什么不能将上述代码放在判断是否存在事件eventName内，因为可能会存在多个相同的eventName但实现又不相同的事件
    },

    // emit接口触发事件
    emit: function (eventName) {
      // 如果事件eventName有订阅者，则依次执行事件eventName的订阅者相应的回调方法
      // 此处 arguments[0] 代表事件eventName
      if (this.handles[arguments[0]]) {
        // 这里也反向证明了可以发布多个事件名一致的事件
        // 此处就是遍历这些事件处理回调函数集合中的回调函数
        for (var i = 0; i < this.handles[arguments[0]].length; i++) {
          // 这里代码看着有点吓人，实际上仔细阅读不难发现
          // this.handles[arguments[0]]代表eventName事件处理回调函数集合
          // [i]代表是当前eventName回调集合中的某一个回调函数
          // arguments[1] 代表触发对应事件时回调函数的参数
          this.handles[arguments[0]][i](arguments[1])
        }
      }
    },

    // 移除事件 eventName
    remove: function (eventName, fn) {
      // 判断事件eventName是否存在fn这个观察者
      if (this.handles[eventName]) {
        for (var i = 0; i < this.handles[eventName].length; i++) {
          if (this.handles[eventName][i] === fn) {
            this.handles[eventName].splice(i, 1)
          }
        }
      }
    }
  }
}
var Event = new createEventSys()
// 注册监听时的callback 且如果想用移除remove 必须在on时传入函数的一个引用
var testEvent = function (res = 'test') {console.log(res)}
Event.on('test', testEvent)
Event.on('test1', testEvent)
Event.emit('test', 'haha') // 输出haha

// 对象person1和对象person2拓展复用自定义系统
var person1 = {}
var person2 = {}
Object.assign(person1, createEventSys())
Object.assign(person2, createEventSys())
person1.on('call1', function () {
  console.log('person1')
})
person2.on('call2', function () {
  console.log('person2')
})
person1.emit('call1')
person2.emit('call1')
person1.emit('call2')
person2.emit('call2')

分别输出：
person1
没有输出
没有输出
person2
```
如上所示，我们用观察者模式实现了一个基本完善的自定义事件系统。

### 总结

观察者模式有2个明显的有点：

  * 时间上解耦
  * 对象间解耦

> 耦合：是指模块之间的关联少，相互越独立，耦合度越低

> 内聚：是指模块中组成元素结合的越紧密，模块的内聚性就越高，模块的独立性也就越高

> 内聚和耦合是两个相互独立且又密切相关的概念
