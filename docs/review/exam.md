# 招聘管理模块 review



## 项目背景

> 开发目标

将公司从各个渠道收集到的候选人信息，进行统一的信息化管理。在未来即将推出的小程序功能中，方便将候选人的面试结果推送给候选人微信。可视化HR的工作量，从各个维度统计招聘数据。



> 需求整理

与以往开发“CRUD”需求不同的是，所有的create和update操作都需要在table-column中完成。并且交互复杂，字段多，需要使用的组件也各不相同，还有很多排序和过滤的需求。



## 技术难点

#### 1. 不同组件的event函数绑定

>cell内渲染的组件

* input
* select单选，select多选
* datePicker，dateTimePicker
* button
* span

>交互背景介绍

* enter， blur，changed时，都要根据实际情情况，调用api更新数据

* 对于不符合预期的操作，要提供友好的提示

不同的组件默认的event都不同，怎么样控制组件在正确的时候调用接口呢？

解决思路是用父组件把event name 传进来，子组件根据不同的event name 执行不同的event handler。select的默认事件是change，但是因为涉及到多选的select，change无法实现多选。故使用了“visible-change” event。当下拉框隐藏的时候，触发函数，完成更新cell。

而解决友好提示的问题，就是需要在各种情况下判断了。

checkedList，为选中的rowData，编辑时就可以根据checkedList判断

对于新增的情况，因为新增时候的rowData默认出现在list的第一个，所以取list的第一个就是好了。



#### 2. 动态组件

因为编辑时涉及到不同类型的组件，我们采用了vue的动态组件。根据父组件传入的formType，动态渲染。

```vue
<component :is="formType" size="mini" :class=formClass
  v-if="editMode || canEdit"
  :placeholder="formPlaceholder"
  :filterable="filterable"
  :clearable="clearable"
  :multiple="multiple"
  :type="type"
  ref="input"
  @focus="onEdit"
  @keyup.enter.native="onSave"
  v-on="listeners"
  v-bind="$attrs"
  v-model="model">
    <slot name="form"></slot>
</component>
```

具体用法请移步👉🏻  [vue动态组件]([https://cn.vuejs.org/v2/guide/components.html#%E5%8A%A8%E6%80%81%E7%BB%84%E4%BB%B6](https://cn.vuejs.org/v2/guide/components.html#动态组件))



参数详解

| 参数            | 说明                     | 数据类型      | 默认值   | 备注                                    |
| :-------------- | ------------------------ | ------------- | -------- | --------------------------------------- |
| keyType         | 当前编辑的key            | String        | ""       |                                         |
| rowIndex        | 当前行的索引             | Number,String | ""       |                                         |
| canEdit         | 是否展示编辑状态         | Boolean       | false    |                                         |
| formType        | Form组件类型             | String        | el-input |                                         |
| formClass       | Form组件的样式           | String        | ""       |                                         |
| formPlaceholder | form组件的placeholder    | String        | 请输入   |                                         |
| closeEvent      | 组件编辑状态下的关闭事件 | String        | blur     | input默认为blur，select为visible-change |
| stateType       | 当前模块定义的state      | String        | code     |                                         |
| clearable       | 是否可以清空             | Boolean       | false    |                                         |
| multipe         | 是否可以多选             | Boolean       | false    | 办公地点要求多选                        |
| type            | 用来区别时间选择器的类型 | String        | datetime | 部分字段需要精确到时分                  |



#### 3. 联动的select

> table中涉及到联动的select组合

* 申请职位 && 申请部门
* offer职位 && offer部门
* 渠道1 && 渠道2

​	前两个中，比较简单，前者不需要选择，根据后者的选择值，确定前者的值，这里不再赘述。值得一提的是前后端交互参数处理部分。后端返回“A&B”的value格式，保存时，前端将value传给后端，后端将A作为前者保存，B最为后者保存。

而“渠道1”和“渠道2”，则是相互关联的关系。一旦“渠道1”定下来以后，那么“渠道2”的option就确定了范围。在每一次修改中，将“渠道1”的value对应的option存到state中。

```javascript
state.linkedObj = {
	index: rowIndex,
	value: value['origin1']
}
```

```javascript
computed: {
	...mapState('exam', [
     'linkedObj'
  ])
}
```

这个时候“渠道2”的option由空数组变成了确定了的option。

如何在“渠道1”的value选中以后，更改“渠道2”的option呢？这个时候就需要vue的watch了。

```javascript
watch: {
   	linkedObj: {
      deep: true,
      handler: function () {
        this.$nextTick(() => {
          let linkKey = this.examList[this.linkedObj.index].origin1
          this.editOrigin2 = this.linkedOrigin2[linkKey]
        })
      }
    }
  }
```

将这个值再绑定给“渠道2”的select-option，就完成了“渠道1”和“渠道2”之间的联动选定。



#### 4.父子组件的传值及修改

​	table内单个的cell修改，就涉及到父子组件传值的问题了。在vue的实现思想中，所有的数据都是单向流动的，子组件不允许擅自修改由父组件传入的值。但是在我们这个需求中，涉及到父子组件频繁的传值以及绑定，若使用传统的prop传参方式是无法实现单个cell修改的。

​	为了解决这个问题，我们想到了一个讨巧的办法，由父组件将修改的cell的index和key传给子组件。在子组件中，通过index和key，就可以去state中遍历到被修改cell的value。子组件一直通过提交mutation和state交互修改数据，在监测到enter或blur事件以后，提交action，将该行数据的id，被修改的key和value传递给后端，修改成功以后，后端返回该行的最新的rowData，state中更新对应的rowData，从而实现了修改单一cell的功能。

```javascript
handleBlur() {
  if (this.examListCopy[this.rowIndex][this.keyType] === this.model) {
    this.editMode = false
    } else {
    this.onSave()
  }
}
```

> 注解：
>
> * examListCopy：如何要实现监测cell值没有发生变化时，不做任何处理的需求，就需要使用最初数据和现在绑定的数据进行一个对比。而examListCopy就是examList的副本。副本中的value和修改的value进行比较，如果相等，只是简单的把cell状态改回到不能编辑的状态，相反的，便要调用api更新数据库。





```javascript
async handleUpdate(params) {
  let res = await examUpdate(params) 
  if (res.code == 200) {
    this.updateRowdata({
      index: this.rowIndex,
      data: res.result
    })
  } else {
    this.editMode = true
  }
}
```

```javascript
updateRowdata (state, payload) {
  let {index, data} = payload
  state.examList.splice(index, 1 ,data)
  state.examListCopy.splice(index, 1 ,JSON.parse(JSON.stringify(data)))
}
```

> 注解：
>
> * handleUpdate(): 使用 async/await 异步请求。接口请求成功以后，会返回更新后的rowData。提交updateRowdata mutation。
>
> * updateRowData(): 是store中的方法。主要功能是在store中更新examList和examListCopy数据。
>
>   ***Tips：此处为什么要使用Json序列化后的数据更新examListCopy?***

**Notes： async/await 使用方法参考👉🏻 [ESMAScript 6 入门](http://es6.ruanyifeng.com/#docs/async)**

## 收获

1. css module
2. vuex的使用
3. 滚动态定位
4. dialog组件传值
5. 代码抽象
6. 多参数辅助实现需求
7. slot的使用

## 踩坑记录

1. 参数合理化传值，比如多选应该传数组，其他使用字符串。
2. 后端设计到另一张表的数据时，比如面试官候选人，应该将id作为必传字段。
3. 涉及到状态的一些option，开始由前端写死。但是后来改为后端提供。以后遇到这类问题，可以和后端约定，先出接口，对于接口的值可以前后端商量暂定。避免做无用功。
4. 后端没有前端对与用户界面的直观感受。很多细节的小功能，可以由前端规划，提出api的功能，以及返回值。

