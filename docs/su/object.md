---
meta:
  - name: referrer
    content: no-referrer
---


## 面向对象编程

一直很疑惑，面向对象编程和面向过程编程，到底有什么不同？感觉现阶段大部分的开发都是在面向过程编程，那么到底什么是面向对象编程，面向对象编程又给我们的日常开发带来了什么遍历？

## 什么是面向对象编程

网上有一张很经典的图，大家可以参考下：

![面向对象经典图](https://user-gold-cdn.xitu.io/2017/6/8/99f977fcc9ad71ee0c197cbdaecd52b8?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

如上图所示，我们大概知道了什么是面向对象。记得当初学java的时候，老师说：在java中，万物皆是对象。面向对象的思想主要是以对象为主，将一个问题抽象出具体的对象，并且将抽象出来的对象和对象的方法封装成一个类。

> 面向对象是把构成问题事务分解成各个对象，建立对象的目的不是为了完成一个步骤，而是为了描述某个事务在整个解决问题的步骤中的行为

## 面向对象和面向过程的区别

面向对象和面向过程是两种不同的编程思想，我们经常会听到两者的比较，刚开始编程的时候，大部分应该都是使用的面向过程编程，但是随着我们的成长，还是面向对象的编程思想更符合我们的成长

其实，面向对象和面向过程并不是完全相对的，也不是完全独立的。

我认为面向对象和面向过程的主要区别是面向过程主要以动词为主，解决问题的方式是按照顺序一步一步调用不同的函数

但是面向对象主要是以名词为主，将问题抽象出具体的对象，而这个对象有自己的属性和方法，在解决问题的时候是将不同的对象组合在一起使用。

之所以上面说面向对象的编程思想更符合我们的成长的原因是面向对象编程的可扩展性更强，使得我们的代码能重复使用。

* 面向过程就是分析出解决问题所需要的步骤，然后用函数把这些步骤一步一步实现 ，使用的时候一个一个一次调用就可以了。

* 面向对象是把构成问题事物分解成各个对象，建立对象的目的不是为了完成一个步骤，而是为了描述某个事物在整个解决为的步骤中的行为。

知乎上有一个高票的回答很有意思：

> 面向过程：吃.(人, 饭)<br/>
  面向对象：人.吃(饭)

忽然想到了本山大叔的一个小品，感觉放在这还是比较贴切的，问把一个大象放冰箱要几步（此处不接受任何反驳）

### 面向过程的解决方法

在面向过程的编程方式中实现该问题答案如下，这也是高秀敏老师说给范伟老师的：（看来面向对象的思维还是程序员专属啊），大概需要三步：

1. 开门（冰箱）
2. 装进（冰箱， 大象）
3. 关门（冰箱）

### 面向对象的解决方法

1. 冰箱.开门()
2. 冰箱.装进(大象)
3. 冰箱.关门()

可以看出来面向对象和面向过程的侧重点是不同的，面向过程是以动词为主，完成一个事件就是将不同的动作函数按顺序调用。

面向对象是以主谓为主，将主谓看成一个一个的对象，然后对象有自己的属性和方法。比如说冰箱，有自己的id属性，有开门、关门的方法。然后就可以直接调用冰箱的开门方法给其传入一个参数（可以是大象，也可以是老虎）就可以了。

这个例子虽然特别简单，但是确实能让我们从实际生活的例子理解了晦涩难懂的学术定义。

## 五子棋的例子

五子棋的例子，也是一个比较能清楚说明两者区别的一个例子

面向过程的设计思路就是首先分析问题的步骤：

1. 开始游戏
2. 黑子先走
3. 绘制画面
4. 判断输赢
5. 轮到白子
6. 绘制画面
7. 判断输赢
8. 返回步骤2

把上面每个步骤用分别的函数来实现，问题就解决了。这就是我们当中的大部分人在日常开发做的。

而面向对象的设计则是从另外的思路来解决问题，真格五子棋可以分为：

1. 黑白双方，这两方的行为是一模一样的
2. 棋盘系统，负责绘制画面

第一类对象（玩家对象）负责接收用户输入，并告知第二类对象（棋盘对象）棋子布局的变化，棋盘对象接收到了棋子的i变化就要负责在屏幕上面显示出这种变化，同事利用第三类对象（规则系统）来对棋局进行判定。

可以很明显的看出，面向对象是以功能来划分问题，而不是步骤。同样是绘制棋局，这样的行为在面向过程的设计中分散在了众多步骤中，很可能出现不同的绘制版本。因为通常涉及人员会考虑到实际情况进行各种各样的简化。而面向对象的设计中，绘图只能在棋盘对象中出现，从而保证了绘图的统一。

功能上的统一保证了面向对象设计的可扩展性。比如我要加入悔棋的功能，如果要改动面向过程的设计，那么从输入到判断到显示着一连串的步骤都要改动，甚至步骤之间的顺序都要进行大规模调整。如果是面向对象的化，志勇改动棋盘对象就可以了。棋盘系统保存了黑白双方的棋谱。简单回溯就可以了，而现实和规则判断则不同估计，同时，珍格格对对象功能的调用顺序都没有变化，改动只是局部的。

再比如我要把这个五子棋游戏改为围棋游戏，如果你是面向过程设计，那么五子棋的规则就分布在了你的程序的每一个角落，要改动还不如重写。但是如果你当初就是面向对象的设计，那么你只用改动规则对象就可以了。五子棋和围棋（象棋也类似）不就是规则不同么。

当然，在个人工作年限有限或者平时不注重代码优雅性的人，使用对象不能保证你的程序就是面向对象的。许多初学者恨着蹩脚的程序很可能以面向对象之虚行面向过程之实，这样设计出来的所谓面向对象的程序很难有良好的可移植性和可扩展性。但是，即便如此，还是希望你能从现在开始就着手使用，并且养成良好的注释和review代码的习惯。

<hr/>

面向对象有三大特性：封装、继承、多台。对于ES5来说，没有class的概念，并且由于js的函数级作用域（在函数内部的变量在函数外访问不到），所有我们就可以模拟class的概念，在es5中，类其实就是保存了一个函数的变量，这个函数有自己的属性和方法，将属性和方法组成一个类的过程封装。

> 封装： 把客观事物封装成抽象的类，隐藏属性和方法的实现细节，仅对外公开接口。

## 通过构造函数添加

JS提供了一个构造函数（constructor）模式，用来在创建对象的时候初始化对象。构造函数其实就是普通的函数，只不过有以下的特点

* 首字母要大写
* 内部使用this
* 使用new生成实例

通过构造函数添加属性和方法实际上也就是通过this添加的属性和方法。因为this总是指向当前对象的。所以通过this添加的属性和方法只在当前对象上添加，是该对象自身拥有的。所以我们实例化一个新对象的时候，this指向的属性和方法都会得到相应的创建，也就是会在内存中复制一份。这样就造成了内存的浪费。

```javascript
function Cat (name, color) {
  this.name = name
  this.color = color
  this.eat = function () {
    console.log('eat')
  }
}
```

生成实例：

```javascript
var cat1 = new Cat('Tom', 'black')
```

**通过this定义的属性和方法，我们实例化对象的时候都会重新复制一份**

### 通过原型prototype

在类上通过this的方式添加属性和对象会导致内存浪费的问题，我们就考虑，有深恶方法可以让实例化的类所使用的方法直接使用指针指向同一个方法。于是，我就想到了原型的方式。

> js规定，每一个构造函数都有一个Prototype属性，指向另一个对象。这个对象的所有属性和方法，都会被构造函数的实例继承。也就是说，对于那些不变的属性和方法啊，我们可以直接将其添加在类的prototype对象上。

```javascript
function Cat(name, color) {
  this.name = name
  this.color = color
}
Cat.prototype.type = '猫科'
Cat.prototype.eat = function () {console.log('eat')}
```

然后生成实例

```javascript
var cat1 = new Cat('Tom', 'red')
var cat2 = new Cat('Jerry', 'black')
console.log(cat1.type)
console.log(cat2.eat())
```

这时，所有实例的type属性和eat()方法，其实都是同一个内存地址，指向prototype对象，提高了运行效率。

### 在类的外部通过.语法添加

我们还可以在类的外部通过.语法进行添加，因为在实例化对象的时候，并不会执行到在类外部通过.语法添加的属性，所以实例化之后的对象是不能访问到.语法所添加的对象和属性的，只能通过该类访问

## 三者的区别

通过构造函数、原型和.语法三者都可以在类上添加属性和方法。但是三者是有一定的区别的

**构造函数：**通过this添加的属性和方法总是指向当前对象，所以在实例化的时候，通过this添加的属性和方法都会在内存中复制一份，这样就会造成内存的浪费。但是这样创建的好处是计时改变了某一个对象的属性和方法，不会影响其他的对象（因为每个对象都是复制一份的）

**原型：**通过原型继承的方法并不是自身的，我们要在原型链上一层一层的查找，这样创建的好处是指在内存中创建一次，实例化的对象都会指向这个prototype对象，但是这样做也有弊端，因为实例化的对象的原型都是指向同一内存地址，改动其中的一个对象的属性可能会影响到其他的对象

**.语法：**在类的外部通过.语法创建的属性和方法只会创建一次，但是这样创建的实例化的对象是访问不到的，只能通过类的自身访问。

## JS也有private、public、protected

学过java的小伙伴们对private、public、protected这三个关键字应该是很熟悉的，但是在js中，并没有类似的关键字。同时我们又希望我们定义的属性和方法有一定的访问限制，于是我们就可以模拟private、public、protected这些访问权限

对于那些没有使用过java的小伙伴们来说：

* public：表明该数据成员、成员函数是对所有用户开放的，所有用户都可以直接进行调用

* private: private表示私有，私有的意思是除了class自己之外，任何人都不可以直接使用，私有财产神圣不可侵犯，即便是子女、朋友也不可以。

* protected: 对于子女、朋友来说，protected就是public的，可以自由使用没有限制。但是对于其他外部的class来说，就是private

### js中的private

这个很好理解，js的函数级作用域的概念（在函数中定义的属性和方法外界访问不到），所以我们在函数内部直接定义的属性和方法都是私有的

### js中的public

通过new关键字实例化时，this定义的属性和变量都会被复制一遍，所以通过this定义的属性和方法就是公有的。

通过prototype创建的属性在类的实例化之后，类的实例化对象也是可以访问到的，所以也是公有的

### js中的protected

在函数的内部，我们可以通过this定义的方法访问到一些类的私有属性和方法，在实例化的时候就可以初始化对象的一些属性了。

### new的实质

虽然很多人都已经了解了new的实质，在这里还是需要再啰嗦下

var o = new Object()

1. 新建一个对象o
2. o.__proto__ = Object.prototype 将新创建的对象的__proto__属性指向构造函数的prototype
3. 将this指向新创建的对象
4. 返回新对象，但是这里需要看构造函数有没有返回值，如果构造函数的返回值为基本数据类型string、boolean、number、null、undefined那么久返回新对象，如果构造函数的返回值为对象类型，那么久返回这个对象类型

## 栗子

```javascript
var Book = function (id, name, price) {
  // private(在函数内部定义，函数外部访问不到，实例化之后实例化的对象访问不到)
  var num = 1
  var id = id
  function testId () {
    console.log('private')
  }

  // protected(可以访问到函数内部的私有输出和私有方法，在实例化之后就可以对实例化的类进行初始化拿到函数的私有属性)
  this.getName = function () {
    console.log(name)
  }
  this.getPrice = function () {
    console.log(price)
  }

  // public(实例化的之后，实例化的对象就可以访问到了)
  this.name = name
  this.copy = function () {
    console.log('public')
  }
}

// 在Book的原型上添加的方法实例化之后可以被实例化对象继承
Book.prototype.proFunction = function () {
  console.log('proFunction')
}

// 在函数外部，通过.语法创建的属性和方法，只能通过该类访问，实例化对象访问不到
Book.setTime = function () {
  console.log('setTime')
}

// 实例化新对象
var book1 = new Book('acv', '百年孤独', '20')
book1.getName() // 百年孤独
book1.testId() // 报错
console.log(book1.id) // undefined id在函数内部重新定义的
console.log(book1.name) // 百年孤独  name是通过this创建的，在实例化时会复制一份
book1.copy() // public
book1.proFunction() // proFunction
book1.setTime() // 报错 通过.语法添加的属性和方法只能通过该类访问，实例化对象访问不到
Book.setTime() // setTime
```

## 继承

> 继承： 子类可以使用父类的所有功能，并且对这些功能进行扩展。继承的过程，就是从一般到特殊的过程。

其实，继承都是基于以上封装方法的是哪个特性来实现的。

### 类式继承

<hr/>

所谓的类式继承就是使用的原型的方式，将方法添加在父类的原型上，然后子类的原型是父类的一个实例化对象。

```javascript
// 声明父类
var SuperClass = function () {
  var id = 1
  this.name = ['js']
  this.superValue = function () {
    console.log('superValue')
    console.log(id)
  }
}

// 为父类添加共有方法
SuperClass.prototype.getSuperValue = function () {
  return this.superValue()
}

// 声明子类
var SubClass = function () {
  this.subValue = function () {
    console.log('this is subValue')
  }
}

// 继承父类
SubClass.prototype = new SuperClass()

// 为子类添加共有方法
SubClass.prototype.getSubValue = function () {
  return this.subValue()
}

// 实例化
var sub = new SubClass()
var sub2 = new SubClass()

sub.getSuperValue() // superValue
sub.getSubValue() // subValue

console.log(sub.id) // undefined
console.log(sub.name) // js

sub.name.push('java') // ['js']
console.log(sub2.name) // ['js', java]
```

这里面，最最最重要的代码是：<font color="#c7254e">SubClass.prototype = new SuperClass()</font>
类的原型对象prototype对象的作用就是为类的原型添加共有方法的，但是类不能直接访问这些方法，只有将类实例化之后，新创建的对象复制了父类构造函数中的属性和方法，并将原型__proto__指向了父类的原型对象，这样子类就可以访问父类的public和protected的属性和方法，同时，父类中的private的属性和方法不会被子类继承

在上述代码中，使用类继承的方法，如果父类的构造函数中有引用类型，就会在子类中被所有实例共享，因此一个子类的实例如果更改了这个引用类型，就会影响到其他子类的实例。

那么留个小问题：为什么一个子类的实例如果更改了这个引用类型，就会影响到其他子类的实例呢？

### 构造函数继承

正是因为类式继承的这种缺陷，才有了构造函数继承，构造函数继承的核心思想就是SuperClass.call(this, id),直接改变了this的指向，使通过this创建的属性和方法在子类中复制一份，因为是单独复制的，所以各个实例化的子类互不影响。但是会造成内存的浪费。

```javascript
// 构造函数继承
// 声明父类
function SuperClass (id) {
  var name = 'js'
  this.books = ['js', 'html', 'css']
  this.id = id
}

// 声明父类原型方法
SuperClass.prototype.showBooks = function () {
  console.log(this.books)
}

// 声明子类
function SubClass (id) {
  SuperClass.call(this, id)
}

// 创建第一个子类实现
var subclass1 = new SubClass(10)
var subclass2 = new SubClass(11)
console.log(subclass1.books)
console.log(subclass2.id)
console.log(subclass1.name) // undefined
subclass2.showBooks
```

### 组合式继承

组合式继承，说白了就是类式继承和构造函数继承的组合，那么我们先看一下类继承和构造函数继承的有缺点

|               | 类继承          | 构造函数继承    |
| ------------- | :--------------: | -------------: |
| 核心思想       | 子类的原型是父类实例化的对象  | SuperClass.call(this, args)  |
| 优点 | 子类实例化对象的属性和方法都指向父类的原型  | 每个实例化的子类互不影响 |
| 缺点 | 子类之间可能会互相影响 | 内存浪费 |

```javascript
// 组合式继承
// 声明父类
var SuperClass = function (name) {
  this.name = name
  this.books = ['js', 'html', 'css']
}
// 声明父类原型上的方法
SuperClass.prototype.showBooks = function () {
  console.log(this.books)
}

// 声明子类
var SubClass = function (name) {
  SuperClass.call(this, name)
}

// 子类继承父类（链式继承）
SubClass.prototype = new SuperClass()

// 实例化子类
var subclass1 = new SubClass('java')
var subclass2 = new SubClass('php')
subclass2.showBooks()
subclass1.books.push('ios') // ['js', 'html', 'css']
console.log(subclass1.books) // ['js', 'html', 'css', 'ios']
console.log(subclass2.books) // ['js', 'html', 'css']
```

### 寄生组合继承

仔细看过上述代码且有心的同学会发现，父类的构造函数会被创建2次（call时一次，new时又一次）。作为一个有着Geek精神的前辈大神们 是不能忍受这种情况的，故而出现了寄生组合继承

出现这种继承的方式的关键在于父类的构造函数在类继承和构造函数继承的组合形式中被创建了两遍，但是在类继承中我们并不需要创建父类的构造函数，我们只是要子类继承父类的原型即可。所以我们可以先给父类的原型创建一个副本，然后修改子类constructor属性，最后在设置子类的原型就可以了

```javascript
// 原型式继承
// 原型式继承就是类式继承的封装，实现功能是返回一个实例，该实例的原型继承了传入的o对象
function inheritObject (o) {
  // 声明一个过渡函数对象
  function F () {}
  // 过渡对象的原型继承父对象
  F.prototype = o
  // 返回一个过渡对象的实例，该实例的原型继承了父对象
  return new F()
}
// 寄生式继承
// 寄生式继承就是对原型继承的二次封装，使得子类的原型等于父类的原型。并且在第二次封装的过程中对继承的对象进行了扩展
function inheritPrototype (subClass, superClass) {
  // 复制一份父类的原型保存在变量中，使得P的原型等于父类的原型
  var p = inheriObject(superClass.prototype)
  // 修正因为重写子类原型导致子类constructor属性被修改
  p.constructor = subClass
  // 设置子类的原型
  subClass.prototype = p
}

// 定义父类
var SuperClass = function (name) {
  this.name = name
  this.books = ['js', 'html', 'css']
}

// 定义父类原型方法
SuperClass.prototype.getBooks = function () {
  console.log(this.books)
}

// 定义子类
var SubClass = function (name) {
  SuperClass.call(this, name)
}

inheritPrototype(SubClass, SuperClass)
var subclass1 = new SubClass('php')
```

