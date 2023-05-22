# 3.JavaScript-es6

[[toc]]

## 3.0 var  let const

```js
var 变量提升。只有声明没有赋值

暂时性死区:let const没有声明变量却引入。实例化到被创造的过程。因为只要有let const就会优先实例化。根本原因:变量的生命先于使用。（块级作用域）。暂时性死区：在let const声明前使用 can assess xx before init

var会变成window的值。

const只保证变量名指向的地址不变，并不保证该地址的数据不变，所以将一个复合类型的变量声明为常量必须非常小心。
例如以下：
const arr = [];
// 报错，[1,2,3]与[]不是同一个地址
arr = [1,2,3];
const arr = [];
// 不报错，变量名arr指向的地址不变，只是数据改变
arr[0] = 1;
```



## 3.1.BigInt类型是一种内置对象

可以表示大于2^53-1的整数，这是number能表示的最大数字

```text
const BigNumber = 2838489273498793847982374n
const BigNumber2 = BigInt(298374982374938)
const BigNumber3 = BigInt('2398749829823474982')
const BigNumber4 = BigInt('0x1ffffffffffffffffffffffffff')
```

## 3.2.扩展运算符

   扩展运算符...将数组变成参数序列
   Array.from()将类似数组的对象和可遍历的对象（比如ES6新增数据结构Set和Map）转为真正的数组，还可以接受第二个参数用来对每个元素进行处理
   Array.of()将一组值转换为数组，注意当只有一个参数时，实际上是指定了数组的长度

```js
Array.from([1,2,3], x => x*x) // [1,4,9]

Array.of(2,11,4) // [2,11,4]

Array() // []
Array(3) // [, , ,]
Array(2,11,4) // [2,11,4]

[1,5,10,15].find((value, index, arr) => {return value > 9}) // 10
[1,5,10,15].findIndex((value, index, arr) => {return value > 9}) // 2

['a', 'b', 'c'].fill(7) // [7,7,7]
new Array(3).fill(7) // [7,7,7]

for(let index of ['a', 'b'].keys()) console.log(index)
// 0
// 1
for(let value of ['a', 'b'].values()) cosole.log(value)
// a
// b
for(let [index, value] of ['a', 'b'].entries()) console.log(index, value)
// 0 a
// 1 b

[1,2,3].includes(2) //true
[1,2,[3,[4,5]]].flat(2) // [1,2,3,4,5]
[1,2,[3,[4,5]]].flat(1) // [1,2,3,[4,5]]

arr.sort(cmp) // 排序
```

## 3.3.ES6对象新增扩展

```js
// 属性的简写
let obj = {foo:foo}
等同于
let obj = {foo}

// 方法的简写
let obj = {
	funct: function() {return 1}
}
等同于
let obj = {
	funct() {rturn 1}
}

// 字面量定义对象
let arr = 'name'
let obj = {[arr]: 'Tom', ['fun'+'ct'](){return 'hello'}}

// super关键字
const proto = {foo: 'proto-foo'}
const obj = {foo: 'obj-foo', funct(){ return super.foo }}
Object.setPrototypeOf(obj, proto) //为obj设置原型对象
obj.funct() // 'proto-foo'

// 属性的遍历，注意for in和Object.keys()都得不到symbol属性
let obj = {name: 'tom', age: 2}
let student = {school: 'dhu'}
Object.setPrototypeOf(student, obj)
for(let x in student) console.log(x) // school, name, age 继承的属性也打印出来
console.log(Object.keys(student)) // school 访问不到继承的属性

// Object类的新增方法
let target = {a: 1, b: 1}
let source1 = {b: 2, c: 2}
let source2 = {c: 3}
Object.assign(target, source1, source2}
console.log(target) // {a:1, b:2, c:3}
```

## 3.4 函数新增扩展

```js
// 参数设置默认值
// 函数的length属性返回没有指定默认值的参数个数
// 函数的name属性返回原函数的名字或者是anonymous
// 严格模式下，函数参数不能使用默认值、解构赋值、扩展运算符
// 箭头函数
```

## 3.4.Set和Map

```js
let s = new Set()
s.add(1).add(2) // {1,2}
s.delete(1) // true
s.has(1) //false
s.clear()

let m = new Map()
m.set('foo', 2)
m.set('bar', 'hello')
console.log(m) //Map(2) { 'foo' => 2, 'bar' => 'hello' }
console.log(m.has('foo')) // true
console.log(m.get('foo')) // 2
console.log(m.delete('foo')) // true
m.clear()
console.log(m.size) // 0
```

## 3.5 symbol  | set | map | weakmap  | for in of

```ts
--1.symbol
symbol 常用来创建唯一不变的属性名，`Symbol()`用来创建symbol类型的变量，注意不是`new Symbol()`，传入的参数没啥用只能用来标识提醒程序员。使用`getOwnPropertySymbols()`可获得Symbol属性。

工具类中比较常见

const symbol1 = Symbol('my symbol');
const symbol2 = Symbol('my symbol');


也可以用来实现私有属性

function getObj() {
  const symbol = Symbol('test');
  const obj = {};
  obj[symbol] = 'test';
  return obj;
}

let temp = getObj();
Object.getOwnPropertySymbols(temp);
temp[Symbol('test')]; // undefined


--2.Set 

--3. map | weakmap

Map的键可以是任意类型，WeakMap只能是对象。WeakMap的键是弱引用，键指向的对象可以被垃圾回收的。WeakMap不可遍历。

WeakMap的使用场景包括解决引用DOM节点可能带来的内存泄露问题

Map 常用方法 
const map = new Map()
map.set('a','testA')
map.set('b','testB')
console.log(map.size)


--4.for in / of

for in （可以枚举 enumerable）：string，array，object  （set map 不会报错） | 判断 object.getOwnPropertyDescriptors
for of （可迭代 iterable）：tring，array，set ，map  （注意这里object会报错）  | 判断 arr[Symbol.iterator]
for await ... of  类似于 promise.all（这个返回一个数据）
```





## 3.6.Generator函数

   一种异步编程解决方案，非常适合将异步任务同步化，async实质上是Generator的语法糖，相当于自动执行Generator函数。

```text
// next可以带一个参数，会被当做上一个yield表达式的返回值，否则上一个yield返回值是undefined
function* foo(x) {
  var y = 2 * (yield (x + 1));
  var z = yield (y / 3);
  return (x + y + z);
}

var a = foo(5);
a.next() // Object{value:6, done:false}
a.next() // Object{value:NaN, done:false}
a.next() // Object{value:NaN, done:true}

var b = foo(5);
b.next() // { value:6, done:false }
b.next(12) // { value:8, done:false }
b.next(13) // { value:42, done:true }

const gen = function* () {
    const f1 = yield (() => 'f1')()
    const f2 = yield (() => 'f2')()
    console.log(f1.toString())
    console.log(f3.toString())
};
let func = gen()
func.next(func.next(func.next().value).value)
```

## 3.7.promise

### 3.7.1 定义

```js
promise:
1.回调地狱 
2.同步的，但是then是异步的 
3.三种状态 pending fulfillng reject 
4.状态不可逆 。resolve和reject是主线程的，.then是异步的
.then的原理：then返回一个promise对象。保证了可以链式调用
```



### 3.7.2 api

#### 3.7.2.1 allsettle

无论成功还是失败都会返回回来

```
promise.allsettle([promise])
```



   而race和all的语法一样，但是返回最先执行完毕的那个promise的resolve的返回值finally则是无论状态如何，都会执行的操作。
2 如何中断Promise的链式调用？
   throw抛出异常、使用reject

4 Proxy代理用于实现一些基本操作的拦截和自定义（例如set和get等），Proxy拦截set, get, has, defineProperty, deleteProperty等13个操作

5.ES6 Module







## 3.8 双向绑定

### defineProperty


```HTML
双向绑定
Object.defineProperty(obj, prop, desc)
obj：需要定义属性的当前对象。
prop：当前需要定义的属性名。
desc：具体的改变方法

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>

<body >
    <input type="text" id="inputComponent">
    <div id="view"></div>
    <script>

        var inputC = document.querySelector("#inputComponent")
        let bindObiect = {}
        var data = {val:""}
        // 值发生改变 会调用data.val绑定bindObiect.message
        Object.defineProperty(data, 'val', {
            //要调用data.val的时候会返回bindObiect
            //而bindObiect已经在set中进行改变了
            get: function () {       
                return bindObiect
            },
            //发生改变会用这个
            set: function (newVal) {
                console.log("set：",newVal)
                document.querySelector("#view").innerHTML=newVal
                bindObiect.message=newVal

            }
        })

        //input onkeyup 
        document.getElementById('inputComponent'), addEventListener('input', function (e) {
            // 把input标签里的值赋值给vm.msg 让他调用Objet.defineProperty方法
            data.val = e.target.value // 把试图赋值给vue的变量
            //对比于document.querySelector("#view").innerHTML的好处是可以清晰的绑定好几个对象
            // 有get 有 set
            // 这个值可能会在多个地方被调用
            console.log(data.val)
        })
      

    </script>
</body>

</html>





```

```js
object 监听实例 自己监听自己  这里有一个大问题就是输出person的时候只会输出 person的name和sex，别的并不会输出
let number = 18
let person = {
	name:'张三',
	sex:'男',
}

Object.defineProperty(person,'age',{
	
	
	//当有人读取person的age属性时，get函数(getter)就会被调用，且返回值就是age的值
	get(){
		console.log('有人读取age属性了')
		return number
	},
	//当有人修改person的age属性时，set函数(setter)就会被调用，且会收到修改的具体值
	set(value){
		console.log('有人修改了age属性，且值是',value)
		number = value
	}
})


```







```js
object 监听实例 数据代理


//监听的数组会消失
var obj = { "val": 1,"val2":2 }
var target = {  }
Object.defineProperty(target, "val",
    {
        //如已设置 set 或 get, 就不能设置 writable 和 value 中的任何一个
        // writable: true,  
        get: function () {
            console.log("get里面的值：", obj["val"])
            return obj["val"]
        },
        //发生改变会用这个
        set: function (newVal) {
            console.log("set里面的值：", newVal)
            return obj["val"]=newVal
        },
      
    });

//对target操作就是对obj进行操作
console.log(target.val)
```











### proxy

```
ES6 原生提供 Proxy 构造函数，用来生成 Proxy 实例。

var proxy = new Proxy(target, handler);

第一个target是要拦截的目标对象，handler处理程序对象是对拦截后要完成的操作


```



`get` 方法用于拦截某个属性的读取操作，可以接受三个参数，依次为目标对象、属性名和 proxy 实例本身（严格地说，是操作行为所针对的对象），其中最后一个参数可选。



取值get -console.log()  会进行拦截

赋值`set` 方法用来拦截某个属性的赋值操作，可以接受四个参数，依次为**目标对象、属性名、属性值和 `Proxy` 实例本身，其中最后一个参数可选。 **     -xxxxxxxxx=xxxxxxxxxxx  会进行拦截

```javascript
 //代码表示，如果访问目标对象不存在的属性，会抛出一个错误。如果没有这个拦截函数，访问不存在的属性，只会返回 undefined。
        let person = {
            name: 'webchang'
        }

        let proxy = new Proxy(person, {
            get(target, key) {
                if (key in target) {
                    return target[key]
                }
                return new Error('属性不存在')
            },
            set: function (target, key, value) {
                if (key === 'name') {
                    throw new Error('数据不合法')
                }
                // 对于满足条件的 age 属性以及其他属性，直接保存
                target[key] = value;
            }
        })

        console.log(proxy.name);
        console.log(proxy.age); // 报错属性不存在
        proxy.name = 1  //报错 数据不合法
```

双向绑定

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>

<body>
    <input type="text" id="inputComponent">
    <div id="view"></div>
    <script>


        //代码表示，如果访问目标对象不存在的属性，会抛出一个错误。如果没有这个拦截函数，访问不存在的属性，只会返回 undefined。
        let bindObject = {}

        let proxy = new Proxy(bindObject, {
            //第一个参数是默认是 bindObject 第二个参数是key
            get(target,property) {
                console.log(target,property)
                return bindObject.val
            },
            //赋值
            set: function (target, key, value) {
                document.querySelector('#inputComponent').innerHTML=value;
                bindObject.val = value
                console.log(value)
                // Reflect.set(bindObject, property, value);
            }
        })

        document.getElementById('inputComponent'), addEventListener('input', function (e) {
            // 把input标签里的值赋值给vm.msg 让他调用Objet.defineProperty方法
            proxy.val = e.target.value // 把试图赋值给vue的变量
            
            //这里触发get方法
            console.log(proxy.val," 1")
        })
    </script>
</body>

</html>
```



面试中可能问到的知识点

```
1.Object.defineProperty只能监听到对象属性的读取或者是写入，而Proxy除读写外还可以监听对象中属性的删除，对对象当中方法的调用等等。----具体的就是在new Proxy的第二个参数中传入deleteProperty，setProperty等13个属性


3.以往我们想要通过Object.defineProperty去监视数组的操作最常见的方式是重写数组的操作方法，这也是Vue.js中所使用的方式，大体的方式就是通过自定义的方法去覆盖掉数组原型对象上的push，shift之类的方法，以此来劫持对应的方法调用的过程。Object.defineProperty不能监听数组长度变化，proxy是一个类似于array的对象。所以，如果数组长度改变，key值就是length，调用push等方法，key就是push。也就是说，这玩意从一个监听（两个对象）改成了一个赋值（一个对象一个值）


3.Proxy是以非入侵的方式监管了对象的读写，那也就是说一个已经定义好的对象我们不需要对对象本身去做任何的操作，就可以监视到他内部成员的读写，而defineProperty的方式就要求我们必须按特定的方式单独去定义对象当中那些被监视的属性。





```





## 3.9 reflect 

```js
let obj = {"test":2}  
Reflect.has(obj,"name")    "name" in obj
Reflect.deleteProperty(obj,"name")    delete obj["name"]
Reflect.ownKeys(obj)    object.key(obj)
Reflect.get(obj,"test")  //获取对象的值
```



## 3.10 类

class静态属性只能通过构造函数去拿到。继承通过super和extend来进行实现





## 3.11 关于一些包前包后的问题

```
1.伪类是包前包后的。例如nth-child(n-2) 这就是说包括第二个之后的都是这个属性
2.silce是包前不包后的 如let a=[0,1,2,3,4];a.slice(1,2). 返回[1]
3.splice 包前页也包后
```

## 3.12 数组操作

```perl
--1.数组增删改查+reverse、 sort、 splice方法会对原来的数组进行修改。下面默认不会对原数组进行修改，如果修改会有标出
--2.push pop unshift shift
```

### 3.12.1  新建 | new 



```js
new Array(5).fill(3); //生成5个为3的
//fill(3)  fill传参可以 fill(value, start, end)。返回修改后的数据。数组本身会改变
Array.from([3]);
```



### 3.12.2 取值 | slice |  splice |  at

#### 3.12.2.1 传参

   ```js
--1.slice接收两个参数：start和end。返回值是被分割的object（浅复制）
--2.splice(starPosition,deleteCount,addItem1,addItem2).中间的是要剪掉的。返回被剪掉的值。赋值剩下的给左边
--3.at 就传入一个参数指明位置
   ```

#### 3.12.2.2 易错

```

```

#### 3.12.2.3 实操

slice方法从一个数组截取一段，

```js
--1.slice不改变原数组 ，slice接受2个参数。(start,end).返回由start和end决定的一个浅拷贝.包括前面
let a = [1,2,3,8]
a.slice(0,2)  //a

--2.splice改变原数组，可传入3个参数(start,deleteCount,...args):start-修改的开始位置（包括了），deleteCount-移除元素的个数，args-添加进数组的元素 多选。返回的是被删除的数组元素
let a = [1,2,3,8]
let arr= [0,1,2,3,4]
arr.splice(0,3,"dsada") //arr变成 ['dsada', 3, 4]

--3. at返回数组的索引，允许使用at语法
const array1 = [8, 130, 44];
console.log(array1.at(-2)); //130
```



### 3.12.3 连接 | concat

concat用于连接多个数组返回一个新数组

#### 3.12.3.1 传参

传对象或者是数组都没有问题,返回一个拼接好的数组，要接收



#### 3.12.3.2 易错

```js
--1.容易错的地方就是可能会忽略他的返回值是一个数组
--2.对于复杂数据类型来说，他是一个浅拷贝
--3.concat 默认情况下不会将类数组对象视作数组——仅在 Symbol.isConcatSpreadable 被设置为真值（例如，true）--原理是访问length属性然后访问每一个索引添加
let a =[]
let b ={0:2,length:1,[Symbol.isConcatSpreadable]: true}
let c = a.concat(b) //c输出  [2]

b ={0:2,length:3,[Symbol.isConcatSpreadable]: true}
c = a.concat(b) //c输出  [2, empty × 2]

b ={0:2,length:3}
c = a.concat(b) 
//c输出  
[
    {
        "0": 2,
        "length": 3
    }
]
```



#### 3.12.3.3 实操



```js
let param = {data:['name']}
param["data"]=45
const array = [1,2].concat(['a'],param );
console.log(param,array)
```







### 3.12.4 遍历  |  map |  forEach   |  entries

```
map |  forEach   |  entries 第二个参数能够传入this
```





#### 3.12.4.1 传参

   

#### 3.12.4.2 易错





#### 3.12.4.3 实操



```js
--1 for..in 遍历 对象 或 数组 时，实际上遍历的是对象中可枚举的 属性名 或 数组的下标 ，仍然需要手动获取 值。用于枚举对象中的可枚举属性名

--2 使用 for..of 遍历 数组 时，实际上就是在遍历数组的 值，而非 下标，for of用于object直接会报错，for of用于迭代器

--3.map/filter/reduce: 对所有元素执行入参函数，创建新数组

--4.
const array1 = ['a', 'b', 'c'];
//通过调用iterator1.next(),返回{value:xx,done:xx}.
//调用起来可以用解构赋值
const iterator1 = array1.entries(); 
```







### 3.12.5 检测 | every |  some |  indexOf  |  includes |  find  |  findIndex

#### 3.12.5.1 传参

```js
1. every |  some :可以接收三个参数：当前值，索引值，当前数组
2. indexOf | includes  字符串，数组都可以。传参。第一个参数传入查找的字符串，第二个参数传入开始查找的位置（开始查找的位置）。xx是大的元素
3.  find | findIndex 传3个参数 element, index, array
```



#### 3.12.5.2 易错

```js
--1.every | some返回一个boolean(这里没有什么坑)
--2.include 是 es6的语法，可以判断数组是否里面有没有NaN,indexof不行.字符串面对不能第二个参数不能传入负数，而数组可以。而且不是字符串的情况下默认会转换为字符串，数组也不会进行转化
['a', 'b', 'c', 'd'].includes('b', 2)      // false   include  第二个参数传入开始索引


--3.includes 找不到返回false，indexOf返回-1
```

#### 3.12.5.3 实操

```js
--1.every
let a = [1,4,6,8]
const status = a.every((value)=>{
    if(value>5){
        return false
    }else{
        return true
    }
})
--2.some
let a = [1,4,6,8]
const status = a.some((value)=>{
    if(value>5){
        return false
    }else{
        return true
    }
})
--3.include 
[1,2,3,4].includes(4)
[1,2,3,4].indexOf(5) // 找不到的返回-1

--找到所有的元素位置 利用while和indexof的第二个参数
let indices = []
const array = ['a', 'b', 'a', 'c', 'a', 'd'];
const element = 'a';
let idx = array.indexOf(element);
while (idx !== -1) {
  indices.push(idx);
  idx = array.indexOf(element, idx + 1);
}
```



### 3.12.6 筛选 | filter

#### 3.12.6.1 传参

  可以接收三个参数：当前值，索引值，当前数组

#### 3.12.6.2 易错

```js
--1.返回值创造数组的一部分浅拷贝,不会改变原数组。
```

#### 3.12.6.3 实操

```js
--1.every
const words = ['less', 'bigthan6'];
const result = words.filter(word => word.length > 6);
console.log(result);

[].filter(word => word.length > 6);
```







### 3.12.7 flat  | flatmap

```js
//flat(),可以传入一个参数，指定要提取的结构深度,返回组转后的数组
const arr1 = [0, 1, 2, [3, 4]];
console.log(arr1.flat());

flatmap //相当于深度一层的map
```



### 3.12.8 entires | fromEntries

将一个对象中可枚举属性的键名和键值按照二维数组的方式返回

```js
Object.entries({ one: 1, two: 2 })    //[['one', 1], ['two', 2]]
Object.fromEntries([['one', 1], ['two', 2]]) //{ one: 1, two: 2 }


map转成object非常好用

const map = new Map()
map.set('name', 'jimmy')
map.set('age', 18)
const obj = Object.fromEntries(map)
console.log(obj)

还有过滤
const course = {
    math: 80,
    english: 85,
    chinese: 90
}
const res = Object.entries(course).filter(([key, val]) => val > 80)




```





axios

### 3.12.8 ??  |  ?.

```
空值合并符 ： ??
可选链： ?.
```



### 3.12.9 globalThis | 全局的this

```
globalThis
```





## 3.13 字符串操作

### 3.13.1 padstart,padend 

```js
'9'.padStart(2,0)   //输出09   用0去填补前面
```





### 3.13.1  正则 





## 3.14 数据类型

### 3.14.1

```
Generator
```



## 3.15 异步

```js
 import('./dialogBox.js').then((res)=>{
 	console.log(res)
 })
```
