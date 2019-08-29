## this、apply、call、apply

![标题图片](https://user-gold-cdn.xitu.io/2017/9/19/54a85be5d884cf40ef12c15be4c3d885?imageView2/1/w/1304/h/734/q/85/format/webp/interlace/1)

这好像又是一个经典面试题，不可避免的，也是让人踩坑比较多的一个，在ES6中我们为了避免this产生的错误，会被要求尽量使用箭头函数。但是在维护一些老代码及公司服务政务官网等相对技术要求要落后一些的公司工作时，最好还是了解一下this的指向和call、apply、bind三者的区别。

### js史上最迷惑问题---this的指向

在ES5中，this的指向有一个特别简单并且有效的判断依据：**this指向最后调用它的那个对象**，当你真正记住这句话的时候，this其实你已经了解了一半了。

Don't speak， show me the code！

1.

```javascript
var str = 'hello'
function demo () {
  var str = 'world'
  console.log(this.str)
  console.log('inner ====>>>>>', this)
}
demo()
console.log('outer ====>>>>>', this)
```

上述代码的答案如果你还记得那句话：**this指向最后调用它的那个对象**，那么你就不难理解log打印的是hello。因为调用demo的前面没有对象，那也就是默认指向了window，这句话可以理解为：window.demo(),当然，我们要排除严格模式。如果是严格模式的话，全局对象就是undefined，那么就会保存。

then，next

2.

```javascript
var str = 'hello'
var demo = {
  str: 'world'
  test: function () {
    console.log(this.str)
  }
}
demo.test()
```

在上面的例子中，函数test是对象demo调用的。所以打印的值就是demo中的str的值。

Let's go on

3.

```javascript
var str = 'hello'
var demo = {
  str: 'world'
  test: function () {
    console.log(this.str)
  }
}
window.demo.test()
```

根据第一题联想得到，如果在前面加个window，调用会有影响么？

其实 ，这里还是最后调用test的还是demo，和第二题中的代码一样。而且js的调用逻辑本来就是从左向右，所以，还是那句话：
**this总是指向最后调用它的那个对象**

还有呢，别慌

4.

```javascript
var str = 'hello'
var demo = {
  test: function () {
    console.log(this.str)
  }
}
window.demo.test()
```

这里的结果是undefined，为什么是undefined呢，很好理解。调用顺序依次是window调用demo，再调用test，所以this指向的是demo，但是this内没有str，所以打印出undefined

这也反向说明了当在js的调用逻辑内，如果test内没有str这个属性，它是不会向上查找的。

接着往下说：

5.

```javascript
var str = 'hello'
var demo = {
  str: null,
  test: function () {
    console.log(this.str)
  }
}
var t = demo.test
t()
```

这里就很有意思了，你是不是以为这里输出的是null，按照之前的逻辑，最后调用它的是demo。但是很遗憾，并不是。这是因为虽然将demo对象的test方法赋值给t了，但是它并没有调用。还是刚才那句话，就是如此有魔性：this总是指向最后调用它的那个对象。由于刚刚的t并没有调用，所以t()最后仍然是被window调用的。所以，this指向的也就是window。打印的结果就是hello

看吧，当你熟悉了魔性的声音，天空中依然回荡着：this总是指向最后调用它的那个对象。

然后，我们看一个不一样的例子：

6.

```javascript
var str = 'hello'
function demo () {
  var str = 'world'
  otherDemo()
  function otherDemo () {
    console.log(this.str)
  }
}
demo()
```

这里应该输出什么，曾经让我也很困惑，但是天空又想起了魔性的。。。

所以答案是： hello

demo被window调用，此时demo内的this就是指向window。即便又调了otherDemo，this仍是指向window

### 改变this的指向

结合几年的工作总结，改变this的方法无外乎如下：

* 箭头函数

* 在函数内部使用var that = this

* 使用apply、call、bind

* new实例化一个对象

下面，针对这几种方法，我们一一举例说明

7.

```javascript
var str = 'hello'
var demo = {
  str: 'world',
  test1: function () {
    console.log(this.str)
  }
  test2: function () {
    setTimeout(function () {
      this.test1()
    }, 100)
  }
}
demo.test2()
```

很显然，这样写代码会导致报错。因为setTimeout是全局函数，被window最后调用，所以this指向的是window，但是window中又没有test1, 是undefined，运行undefined导致报错

### 箭头函数

这点我们都很了解，ES6的箭头函数使我们从ES5的this的坑中解脱出来，但是，你所不知道的可能是**箭头函数的this始终执行函数定义时的this，而非执行时（调用时）**。另外，我们还要知道，箭头函数中没有this的绑定，必须通过查找作用域链来决定this到底指向谁。**如果箭头函数被非箭头函数包裹，则this指向的一定是最靠近箭头函数那一层的非箭头函数。如果被多层箭头函数包裹，那么this为undefined**

8.

```javascript
var str = 'hello'
var demo = {
  str: 'world',
  test1: function () {
    console.log(this.str)
  },
  test2: function () {
    setTimeout(() => {
      this.test1()
    }, 100)
  }
}
demo.test2()
```

此时，肯定可正确打印出hello

但是如果写为下面这样：

9.

```javascript
var str = 'hello'
var demo = {
  str: 'world',
  test1: function () {
    console.log(this.str)
  },
  test3: function () {
    return () => {
      console.log(this.str)
    }
  }
}
demo.test3()()
```

为什么要写的是demo.test3()()这样呢，上面test3返回的是一个函数，如果不执行，调用test3后返回的是return后面的内容。所以如果想知道打印出的结果是什么，就需要调用一下返回值。但是，此时最后一次调用test3的是this。紧挨箭头函数的非箭头函数为test3，又被demo调用，故此时结果为world

### 在函数内部使用var that = this

在ES6出现之前，这种写法是主流写法。这种做法的用途就是将调用这个函数的对象保存在变量that中，然后在函数中都使用that

10.

```javascript
var str = 'hello'
var demo = {
  str: 'world',
  test1: function () {
    console.log(this.str)
  },
  test2: function () {
    var that = this
    setTimeout(function () {
      that.test1()
    }, 100)
  }
}
demo.test2()
```

在上述代码中，在函数test2中，首先设置<font color="#c7254e">var that = this</font>,这里的this是指调用test2的demo,
为了防止在test2中的setTimeout被window调用而导致setTimeout中的this指向window。我们将this指向变量demo赋值给一个变量_this。这样，在test2中我们使用that就是指向对象demo了

### 使用apply、call、bind

<hr/>

使用apply、call、bind函数也是可以改变this的指向的。speak less， show code

#### 使用apply

11.

```javascript
var demo = {
  str: 'world',
  test1: function () {
    console.log(this.str)
  },
  test2: function () {
    setTimeout(function () {
      this.test1()
    }.apply(test1), 100)
  }
}
demo.test2()
```

#### 使用call

12.

```javascript
var demo = {
  str: 'world',
  test1: function () {
    console.log(this.str)
  },
  test2: function () {
    setTimeout(function () {
      this.test1()
    }.call(test1), 100)
  }
}
demo.test2()
```

#### 使用bind

13.

```javascript
var demo = {
  str: 'world',
  test1: function () {
    console.log(this.str)
  },
  test2: function () {
    setTimeout(function () {
      this.test1()
    }.bind(test1)(), 100)
  }
}
demo.test2()
```

#### apply、call、bind的区别

细心的你不知道发现没发现，apply和call在书写的时候几乎一样。但是bind处有个小彩蛋，bind之后立即执行了这个函数。

具体为何我们先按下不表，先按照顺序来一一解释

MDN中对apply的解释如下：

> apply()方法调用一个函数，其具有一个指定的this值，以及作为一个数组（或类似数组的对象）提供的参数

> 语法： demo.apply(thisFunc, [argArray])

* thisFunc：在demo函数运行时指定的this值。需要注意的是，指定的this值并不一定是该函数执行时的真正this值。如果这个函数处于非严格模式下，则指定的为null或undefined时会自动指向全局对象（在浏览器端就是window），同时值为原始值（数字、字符串、布尔值）的this会执行该原始值的自动包装对象。

* argsArray：一个数组或者类数组对象，其中的数组元素将作为单独的参数传给demo函数。如果该参数的值为null或undefined，则表示不需要传入任何参数。从ES5开始可以使用类数组对象。

#### apply和call的区别

<hr/>

apply和call的语法基本类似，唯一的不同就是传入的参数不同

```javascript
demo.call(thisFunc, arg1, arg2, ...)
```

所以很明显的可以得出，apply和call的区别就是call方法接受的是若干个参数列表。但是apply接受的是一个包含对个参数的数组。

14.

```javascript
var demo = {
  str: 'world',
  test: function (a, b) {
    console.log(a + b)
  }
}
var b = demo.test()
b.apply(a, [1, 2])
```

15.

```javascript
var demo = {
  str: 'world',
  test: function (a, b) {
    console.log(a + b)
  }
}
var b = demo.test()
b.call(a, 1, 2)
```

#### bind和apply、call的区别

我们先来将刚刚的例子使用bind试一下

16.

```javascript
var demo = {
  str: 'world',
  test: function (a, b) {
    console.log(a + b)
  }
}
var b = demo.test()
b.bind(a, 1, 2)
```

我们会发现并没有输出，这是为什么呢，我们来看一下MDN上的文档说明：

> bind()方法创建一个新的函数，当被调用时，将其this关键字设置为提供的值，在调用新函数时，在任何提供之前提供一个给定的参数序列。

所以，我们不难看出，bind是创建一个新的函数，我们必须要手动去调用：

17.

```javascript
var demo = {
  str: 'world',
  test: function (a, b) {
    console.log(a + b)
  }
}
var b = demo.test()
b.bind(a, 1, 2)()
```

### JS中的函数调用

为什么要写这一段呢？因为我在当时想到这样的题的时候，发现6和7和现实输出有差别，本来我也没放心上，以为可能自己记错了，但是在看到别人的总结时，还是想当然的错了，引起了我的注意。

这也就是很多人不理解为什么6和7中的this指向的是window，所以下面要介绍一下函数调用的相关知识（也是在网上查阅得知）

我们知道，函数调用的方法一共有4种：

* 作为一个函数调用
* 函数作为方法调用
* 使用构造函数调用函数
* 作为函数方法调用函数（call、apply）

#### 作为一个函数调用

<hr/>

比如1中的代码示例，还是把代码贴出来吧

```javascript
var str = 'hello'
function demo () {
  var str = 'world'
  console.log(this.str)
  console.log('inner ====>>>>>', this)
}
demo()
console.log('outer ====>>>>>', this)
```

如上面分析一样，在不考虑严格模式的情况下，this指向window，这是一个最简单的函数，不属于任何一个对象，就是一个很纯粹的函数，但是这样的一个函数是挂载在window上的，也就是说它是一个全局函数，和全局变量一样，很容易引起一个命名冲突。

#### 函数作为方法调用

<hr/>

我们很多种情况下，都在使用这种方式来使用。

```javascript
var str = 'hello'
var demo = {
  str: 'world'
  test: function () {
    console.log(this.str)
  }
}
demo.test()
```

我们在这里定义了一个demo对象，对象demo有一个属性str和方法test，然后demo对象通过.方法调用了其中的test方法。然后我们耳畔响起了**this总是指向最后调用它的那个对象**，所以test在此时指向了demo

#### 使用构造函数调用函数

> 如果函数调用前使用了new关键字，则是调用了构造函数。这在看起来像是创建了新的函数，但实际上js函数是新创建的对象。

```javascript
function demo (a, b) {
  this.name = a
  this.age = b
}
var a = new demo('su', 28)
a.age
```

这就要说另一个比较经典的面试题: new的过程了

当时在信美面试的时候，一个北大的物理学硕士研究生就问了我这个问题（估计是网上搜来的）

部分代码如下：

```javascript
var test = new demo('su', 28)

new demo {
  var obj = {}
  obj.__proto__ = demo.prototype
  var result = demo.call(obj, 'su', 28)
  return typeof result === 'obj' ? result : obj
}
```

1. 创建一个空对象obj
2. 将新创建的空对象的隐式原型指向其构造函数的显示原型
3. 使用call改变this的指向
4. 如果无返回值或者返回一个非对象值，则将obj返回作为新对象
   如果返回值是一个新对象，那么直接返回该对象

所以，我们可以看到，在new的过程中，我们是使用了call来改变了this的指向。

#### 作为函数方法调用函数

> 在js中，函数是对象。js函数有它的属性和方法。call()和apply()是预定义的函数方法。两个方法都可用于调用函数，两个方法的第一个参数必须是对象本身。

说了这么多，这时再来看让我们迷惑不解的6

```javascript
var str = 'hello'
function demo () {
  var str = 'world'
  otherDemo()
  function otherDemo () {
    console.log(this.str)
  }
}
demo()
```

这里的 otherDemo() 的调用是不是属于第一种调用方式：作为一个函数调用（它就是作为一个函数调用的，没有挂载在任何对象上，所以对于没有挂载在任何对象上的函数，在非严格模式下 this 就是指向 window 的）

然后，我们再看看7

```javascript
var str = 'hello'
var demo = {
  str: 'world',
  test1: function () {
    console.log(this.str)
  }
  test2: function () {
    setTimeout(function () {
      this.test1()
    }, 100)
  }
}
demo.test2()
```

这个简单一点的理解就是**匿名函数的this一直指向window**

还是那句话，**this总是指向最后一个调用它的对象。**那么不妨我们先淡定的来找找，最后调用匿名函数的对象。WTF, 匿名函数命名没有名字啊，怎么找？所以我们是没有办法呗其他对象调用匿名函数的。因此匿名函数的this总是指向window

这时，你可能又会问，如何定义匿名函数的？

首先，我们通常写的匿名函数都是自执行的，也就是在匿名函数后面()让其自执行。其次就是虽然匿名函数不能被其他对象调用，但是可以被其他函数调用啊。 比如7中的setTimeout
