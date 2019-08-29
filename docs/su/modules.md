# 读ES6 modules有感

::: tip 引言
ES6模块想必大家都不陌生，在我们日常的工作学习中一直在用。在ES6之前，前端社区最主要的是CommonJS和AMD两种模块加载方案。相比较而言，前者常被用于服务器，后者常用于浏览器。ES6自草案阶段，就在语言规格层面上实现了模块功能，直至ES6发布。并且实现的相当简单，完全具备取代之前一统江湖的CommonJS和AMD规范，也感谢node的流行，使其成为浏览器和服务器通用的模块解决方案。
:::

## 基本概念

### 1、命令

ES6模块的命令主要由2个命令构成：export(导出)和import(导入)。这个我们都很熟悉，export命令用于规定模块的对外接口，import命令用于输入其他模块提供的功能。

#### export命令

我们知道，于ES6而言，在某个文件内部的变量，外部是无法获取的。如果希望外部能够读取文件内部的某个变量，就必须使用export关键字输出该变量,下面简要介绍下export命令的几种常见写法

* 导出单个常量

```javascript
// demo.js
export const SYSTEM_TYPE = 'LEADS'
export const USER_TYPE = 'administrator'
```

* 批量导出常量

```javascript
// demo.js
const SYSTEM_TYPE = 'LEADS'
const USER_TYPE = 'administrator'

export {SYSTEM_TYPE, USER_TYPE }
```

* 导出函数

```javascript
// demo.js
export function fullName (firstName, lastName) {
  return firstName + lastName
}
```

* 导出别名 用as关键字重命名
```javascript
// demo.js
function fullName (firstName, lastName) {
  return firstName + lastName
}
function getAge (user) {
  return user.age
}

// 用as导出别名
export {
  fullName as name,
  getAge as age,
  // 也可以重复导出同一方法多次
  getAge as userAge
}
```

> 注意：export命令只能出现在模块的顶层，也就是通常所说的文件的最外层，否则，会报错

```javascript
// demo.js
function fullName () {
  // 在此导出，会报错
  export default 'flowSu'
}
```
#### import命令

相反的，当我们用export命令定义了模块对外的接口后，在其他js文件中，我们可以使用import命令很便捷的加载这个模块

* 基础用法

```javascript
// test.js
import {SYSTEM_TYPE, USER_TYPE} from './demo'

// 可以直接使用
function doSomething () {
  if (SYSTEM_TYPE === 'LEADS') {
    // code here
  }
  if (USER_TYPE === 'administrator') {
    // do something
  }
}
```

* 导入别名 用as重命名

```javascript
// test.js
import {SYSTEM_TYPE as type, USER_TYPE as userType } from './demo'

// 可以直接使用
function doSomething () {
  // code here when you use type and userType
}
```

* import可与export同时使用

```javascript
// test.js
export {SYSTEM_TYPE as default } from './demo'

// 等价于
import {SYSTEM_TYPE} from './demo'
export default SYSTEM_TYPE
```

> 注意：<br>1、上述写法虽然会简化代码，考虑到可读性比较差，我们不建议大量使用这种写法。<br>2、import类似var定义的变量，具有提升的效果

```javascript
// test.js
fullName('flow', 'Su')

import {fullName} from './demo'

// 仍能得到正常结果
> flowSu
```

### 2、模块整体加载

正如我们前面也提到过一样，不仅可以输出某个指定的值，还可以整体加载某个模块。即用*号特指一个导出对象，该对象上包含所有输出的值

```javascript
// test.js
// 逐一加载写法，在上面有提及
import {SYSTEM_TYPE, USER_TYPE} from './demo'

// 整体加载写法
import * as demo from './demo'

console.log('系统类型为: ', demo.SYSTEM_TYPE)
console.log('用户类型为: ', demo.USER_TYPE)
```

### 3、export default命令

说了这么久，说了这么多，一直没有提及到我们常用的export default命令，那export default到底代表什么呢，下面听我娓娓道来

我们知道，使用import命令时需要知道我们想要加载的变量名或函数名，除此以外就无法加载。但是，我们肯定想偷懒，我们不想关心该模块有多少变量，不用去逐一对应每一个api文档就能让我们很方便的加载模块，所以此时，我们就要用到export default命令，表示`为该模块指定默认输出`

```javascript
// default.js
export default function () {
  alert('默认输出')
}
```

* 当我们想要在其他模块加载该模块时，import命令可以为上述默认输出指定任意名字

```javascript
// util.js
import getDefault from './default'

getDefault()

> alert('默认输出')
```

> 注意： 不知道大家发现没有，当导出的是默认输出时，import时不需要加大括号

* 但是为什么default命令对应的语句就可以不用使用大括号呢？

因为一个模块只能有一个默认输出，default命令只能用一次。可以这么理解，在导出时，相当于输出了一个叫做default的变量或者方法，结合上面所说的，ES6允许我们在import时命名别名，故下述写法是有效的

```javascript
// default.js
function setName () {
  return 'flowSu'
}

// 将default当做setName方法导出
export {setName as default}

// util.js
import {default as changeName} from './default'
```

* 同时输入默认的方法和其他变量

```javascript
// util.js
import setName, {otherVariable} from './default'
```

* 输出类

```javascript
// const.js
export default class {
  name: 'flowSu',
  age: '18',
  say: function () {
    console.log('Hello World')
  }
}

// basicTools.js
import temp from './const'
let tempClass = new temp()
```

## 进阶必知

以上所述，都是我们在日常开发学习中经常用到但是又有一些不去细究的点。接下来所要讲述的就是一些模块的高阶用法。

### 1、模块可以继承

假设，我们有一个testDemo模块继承了demo模块

```javascript
// testDemo.js
export * from 'demo'
export const user = {
  name: 'flowSu',
  age: 18
}
export default function (x, y) {
  return x + y
}
```

上述 `export *` 表示输出demo模块的所有属性和方法

> 注意： export * 命令会忽略demo模块的default方法

当然，我们也可以将demo的属性或者方法改名后输出

```javascript
// testDemo.js
export {fullName as allName} from './demo'
```
上面的代码表示，我们只输出了demo模块的fullName方法，并且将其重新命名为allName

### 2、模块加载的实质

ES6为什么要引入模块的概念呢？这又和我们之前所了解的CommonJS模块有何不同，经过多方查阅大概有了轮廓。

CommonJS模块输出的仅仅只是一个值的复制，但是ES6模块输出的确是值的引用

通俗点讲，就是CommonJS模块一旦输出一个值后，模块内部不管再如何变化，都不会影响到这个值

```javascript
// count.js
let counter = 1
function add () {
  counter++
}
export {
  counter,
  add
}

// testCount.js
let counter = require('./count').counter
let add = require('./count').add

// 测试输出结果
console.log('counter第一次打印的结果为： ', counter)
> 1
add()
console.log('counter第二次打印的结果为： ', counter)
> 1
```

我们惊讶的发现，两次打印的值是一样的。造成这种现象的原因就是在counter输出后，count内部的变化已经影响不到counter了

但是，ES6的模块完全与之相反，当其遇到import命令时，并没有立即去执行这个模块，而是相当于生成了一个动态的只读引用，等到在真正使用的地方，它才会真正执行该模块中的对应方法或取出变量对应的值。这就相当于一个简单的函数，根据不同的输入值会得到不同的输入结果。

```javascript
// count.js
let counter = 1
function add () {
  counter++
}
export {
  counter,
  add
}

// testCount.js
import {counter, add} from './count'

// 测试输出结果
console.log('counter在ES6下的第一次打印的结果为： ', counter)
> 1
add()
console.log('counter在ES6下的第二次打印的结果为： ', counter)
> 2
```

根据上述代码的执行结果，我们不难发现，ES6模块输入的变量counter的值，和其模块count内部的变化息息相关。最直观的例子就是我们用延迟来模拟同一个值在不同时间段的变化所引起的结果是什么

```javascript
// time1.js
export let time = '123'
setTimeout(() => {
  time = '456'
}, 1000)

// time2.js
import {time} from './time1'
console.log('此时，time2中第一次打印time的值为： ', time)
> 此时，time2中第一次打印time的值为： 123
setTimeout(() => {
  console.log('此时，time2中延时一秒后第二次打印time的值为： ', time)
}, 1000)
> 此时，time2中延时一秒后第二次打印time的值为： 456
```

上述代码说明了ES6的模块不会缓存执行结果，每次都是动态的去向被加载的模块中取值，并且变量总是绑定其所在的模块。

这里有一个点我们一定要注意：

ES6输入的模块变量是只读的，不能对其重新赋值

```javascript
// testEs.js
export let es = {}

// reslutEs.js
import {es} from './testEs'
es.canAdd = true
> 控制台没有报错，打印后有结果说明可以添加属性

es = []
> TypeError
```

由上我们也可以得知，当我们从testEs中输出变量es时，在resultEs中，我们可以对es添加属性，但是不能重新赋值。因为es指向的地址是只读的，我们没有重写的权限，所以不能赋值。可以理解为在resultEs中创建了一个const类型的es，当然不能对其再重新赋值

### 循环加载

看字面意思，我们就能猜出，循环加载就是a中引入了b模块，b中又引入了a模块，ES6既然引入了模块的概念，那就说明和原来的CommonJS处理循环加载的方法是不同的，那么返回的结果有何差别呢？为了探究这个问题，我们首先从两者的实现原理上加以区分

* CommonJS模块的加载原理

CommonJS在require引入一个文件时，该命令第一次加载该脚本时，就要执行整个脚本，然后在内存中生成一个对象.其最显著的一个特性是加载时就执行。当一个模块出现`循环加载`时，其只输出已经执行的部分，尚未执行的部分不会输出

```javascript
// testCommon1.js 先输出done变量，然后加载另一个文件，此时testCommon1执行中断，去执行testCommon2，等其执行完毕后，再回头继续执行testCommon1
exports.done = false
let testCommon2 = require('./testCommon2')
console.log('testCommon1中， testCommon2.done = ', testCommon2.done)
exports.done = true
console.log('testCommon1, 执行结束')

// testCommon2.js
exports.done = false
let testCommon1 = require('./testCommon1')
console.log('testCommon2中， testCommon1.done = ', testCommon1.done)
exports.done = true
console.log('testCommon2, 执行结束')
```

最后，我们看到运行结果

```bash
> testCommon2中， testCommon1.done = false
> testCommon2, 执行结束
> testCommon1中， testCommon2.done = true
> testCommon1, 执行结束
```

由上，我们很容易的得出，在执行testCommon1时，引入testCommon2后，testCommon1执行就会暂停，去立即执行testCommon2，但在testCommon2中，又引入testCommon1，在此发生`循环加载`，系统此时会毫不犹豫的去testCommon1中取值，但是，不像我们所想的那样再从头执行一遍testCommon1，因为上次的testCommon1还没执行完，但是已经执行了，就会在内存中生成testCommon1对应的对象，从testCommon1中，我们只能取到已经执行完的部分的值，而不能取出testCommon1全部执行结束后的值

* ES6模块的加载原理

ES6在import引入一个文件时，只是引入了该文件，并没有立即执行，它只在用到引入的值的地方才会去原模块中找对应的引用

```javascript
// testEs1.js
import {testEs2} from './testEs2'
export function testEs1 () {
  testEs2()
  console.log('testEs1中，执行结束')
}

// testEs2.js
import {testEs1} from './testEs1'
let i = 1
export function testEs2 () {
	// 正常写法
	console.log('testEs2 中第' + i + '次进入testEs2')
	i++
	if (Math.random() > 0.1) {
		i--
		console.log('testEs2 中第' + i + '次进入if条件')
		i++
		testEs1()
	}
	
	// 循环调 无法跳出
	// testEs1()
}
```

最后，在index.js中，我们引入testEs1后执行，会看到ES6下的运行结果(每次执行的结果都不一样)

```javascript
import {testEs1} from './es6/testEs1.js'
import {testEs2} from './es6/testEs2.js'
testEs1()
}
```

```bash
> testEs2 中第1次进入testEs2
> testEs2 中第1次进入if条件
> testEs2 中第2次进入testEs2
> testEs2 中第2次进入if条件
> testEs2 中第3次进入testEs2
> testEs1中，执行结束
> testEs1中，执行结束
> testEs1中，执行结束
```

从上面我们可以看出，执行testEs1后，在testEs2中，每当满足条件时，就会再执行一次testEs1，然后再调testEs2，接着如果再满足条件，重复上述操作，直至不满足条件后，打印输出结果。这与CommonJS等待执行完全不同

写在最后：

module模块我们经常使用，但其中一些细微的点我们不甚关注。比如在某个文件中export某个方法或者export default某个类或者对象时到底有什么不同？在import时两者又有什么不同？在阅读别人的源码时，为什么明明模块中没有导出的对应方法，但是在导入的文件内却用了该方法？ES6的module模块给我们带来了哪些便利，为什么现在基本不使用CommonJS的require命令方式的引入，两者有什么异同？
