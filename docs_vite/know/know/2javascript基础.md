# 2.JavaScript基础

[[TOC]]



```
发现一个网站可以搭建简单的node服务，https://runkit.com/ 。去到里面注册账号后输入类似

export.endpoint =function(res,req){
	response.end("test")
}

exports.endpoint = function(request, response) {
    let result = [{
        id:1,
        name:"electrolux1"
    },{
        id:2,
        name:"electrolux2"
    }]
    response.end(JSON.stringify(result));
}
然后点击publish就可以生成node服务，接下来点击endpoint就可以访问网址。下面这个网址是我生成的结果https://hello-world-dpuj0ue0mv55.runkit.sh/ 
```






## 2.1基础知识

### 2.1.0 canvas | video | image | blob

```js
--1.canvas 画板
querySelector 获取dom 元素 
然后getcontext
但后添加mousedown 和 mousemove 和mouseup事件
--2.canvas 撤销
todataurl 缓存住。然后就可以进行回退
--3.canvas变成base64
canvasElement.toDataURL();

--4.功能
--4.1 文字blob

let blobInit = new Blob(["helloworld"],{type:"text/plain"})
let blobHandle = blobInit.slice(0,5)
let res = new FileReader() //这里后面跟着res.onload(()=>{}) 也可以
res.readAsText(blobHandle)
// 输出
setTimeout(()=>{
    console.log(res.result)
},5)

--4.2 image 变成 canvas（ctx.drawImage） 和 base64数据(canvas.toDataURL)
// 上面的是图片跨域的错误，可以添加crossOrigin来进行避免
// 功能点2：图像输出.图片加载完，再draw 和 toDataURL
const canvas = document.createElement('canvas')
canvas.width = 200
canvas.height = 200
const ctx = canvas.getContext('2d')
let img = new Image()//创建新的图片对象
img.src = 'https://lf3-cdn-tos.bytescm.com/obj/static/xitu_juejin_web/e08da34488b114bd4c665ba2fa520a31.svg';
img.setAttribute("crossOrigin",'Anonymous')
img.onload = function(){//
    ctx.drawImage(img, 0, 0)
    document.body.appendChild(canvas)
    console.log(canvas.toDataURL('image/png'))
};



--4.3 video 加 滤镜
直接document.querySelector("#video").style.filter = "contrast(200%)"

--4.4 video 截图
//step1:通过canvas 然后ctx.drawImage
//step2:然后通过todataurl就可以了

--4.5 下载
function downloadBlob(blob) {
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${new Date().getTime()}.${blob.type.split('/')[1]}`
    a.click()
    // 释放 URL 地址
    URL.revokeObjectURL(url)
}



//-------------------------转化-------------------------

--5.file | blob 变成 dataurl 和 base64（这个阶段是最好用的，可以下载） a.href .download就可以了

5.1.file->base64（dataurl）：createObjectURL  
console.log("1：",URL.createObjectURL(file))

5.2.file->base64：FileReader readAsDataURL
const fr = new FileReader(file)
fr.readAsDataURL(file)
fr.onload = function () {
    console.log("2：",fr.result)
}

--6.img video变成 canvas
// img.onload(()=>{console.log(img)})  
// ctx.drawImage(video)


--7.canvas 变成 dataurl 和 base64
console.log("canvas->base64格式：",canvas.toDataURL('image/png'))
//2.canvas->base64格式：toBlob
canvas.toBlob((res)=>{
    console.log("canvas->blob格式：",res)
})


--8.下载
function downloadImg () {
    let aLink = document.createElement('a')
    // 文件名后缀需要和dataurl表示的相同，否则可能乱码
    aLink.download = 'fileName.png' 
    aLink.href = canvas.toDataURL('image/png')
    aLink.click()
    URL.revokeObjectURL(aLink)
}

```





### 2.1.1 blob | file | fileReader |  base64 | todataurl

```js
关系：
--1.blob:是一切的源头// 可以 new blob对象创造 text | blob 对象可以slice
--2.fileReader:可以 new 一个出来，然后可以用readAsText和readAsDataURL后面跟着blob或者文件对象 // 就可以reader.result拿到值  如果是图片就可以点进去
--3.file:是比blob多了一个lastmodify和name // 这是只能通过input是file对象拿到的
--4.base64:btoa('javascript') 和 atoa("xxxx")
--5.todataurl可以变成bases64的值


new FileReader().readAsDataURL(blob)  // new blob对象
createObjectURL(e.target.files[0]) 

--1.blob 对象
branary large object 二进制大数据，可以读取，不能修改。

像是分块上传分块我们可以用slice进行分块
let blobInit = new Blob(["helloworld"],{type:"text/plain"})
let blobHandle = blobInit.slice(0,5)
let res = new FileReader() //这里后面跟着res.onload(()=>{}) 也可以

res.readAsText(blobHandle)
res.result  //输出hello
console.log(new FileReader().readAsDataURL(blobHandle))

--2. file 对象
是一个特殊的blob.比blob多了一个lastmodify和name(上传文件的名字)。还有可能是fileList

<input type="file" id="type">
document.querySelector("#type").onChange((e)=>{
  console.log(e.target.files)
})

--3 fileReader 对象
readAsText/DataURL/ArrayBuffer/binaryString

let reader= new fileReader()
//四个方法
//3.1.reader.readAsText
let blob = new Blob("helloworld",{type:"text/plain"})
reader.readAsText(blob)
输出reader.result

//3.2.reader.readAsDataURL
<input type = “file”/>

//3.3 读成base64格式的字符串，后面读了之后我们要
let object = document.querySelector(“.test”).onChange((e)=>{
	let render = new fileReader()
	render.readAsDataURL(e.target.files[0])
	reader.onload((e)=>{
  		e.target.result
	})
})

使用方法。url中直接输入可以显示。但是可能会不全。最好是img标签中直接输入src，然后里面直接是这个src地址

//3.4 reader.readAsArrayBuffer
arrayBuffer也是一个黑盒对象，跟blob很像。然后有两种类型，一种是dataView，还有一个是typeBuffer(里面有9个内容)。前者有点像ts的record类型(里面可以混合一堆东西），后者是单一类型

用于对二进制文件进行操作。然后blob代表的是一个整体的文件，适合用来进行传输

let temp = ArrayBuffer(8). //8个字节
new Int8Array(temp) //然后这玩意是一个数组可以直接改

let test  = new ArrayBuffer(8)
new dataView(test)  //然后用set /get 来进行数组的添加和查询

//3.5 binaryString

--4.object Url
这是一种表示file object 和 blob object的url


<input type = “file”/>

//读成base64格式的字符串，后面读了之后我们要
let object = document.querySelector(“.test”).onChange((e)=>{
	let render = new fileReader()
	let temp = URL.createObjectURL(e.target.files[0]) 
	//输出的格式类似于 localhost：8080/9f9f9f9f
	
})


--5.base64
js中有两个函数用来加密和解密base64的数据。

btoa('javascript'). //加密：输出 amF2Yxxxx
atoa('amF2Yxxxx') //解密：输出javascript。
一般来说用来 将canvas 变成 base64的照片（canvas元素.toDataUrl() ） 或者是 把图片变成base64图片（readAsDataURL） 

```





### 2.1.2.var,let,const | 函数和变量变量提升 | vo ao 上下文

   var函数作用域，let块作用域，const也是块作用域，但定义后不可重新赋地址

```js

注意const比较特殊
var 变量提升。只有声明没有赋值 。 并且声明优先级，函数大于变量（即使变量处于后面的位置）。变量声明会被函数声明覆盖。越后的同名函数优先级越大

暂时性死区:let const没有声明变量却引入。实例化到被创造的过程。因为只要有let const就会优先实例化。根本原因:变量的生命先于使用。（块级作用域）

function test(arg) {
  console.log(arg);
  var arg = 10;
  function arg() {
    console.log('函数')
  }
  console.log(arg)
}
test('LinDaiDai');  // 输出 函数和 10


---------------------------------
上下文是一个执行环境。
1.我们的window就是一个答的执行上下文呢，
2.我们的函数就是一个小的执行上下文
3.eval函数也是一个上下文


vo：创建执行上下文的一个变量对象，不能访问
ao：进入到一个执行上下文时，此执行上下文的变量和函数都可以访问


全局上下文的执行
1. 全局上下文压入栈顶
2. 执行某一函数就为其创建一个EC，并压入栈顶
3. 栈顶的函数执行完之后它的EC就会从ECS中弹出，并且变量对象(VO  varity)随之销毁
4. 所有函数执行完之后ECS中只剩下全局上下文，在应用关闭时销毁

function foo(i) {  
    if(i  == 3) {  
        return;  //这里就弹出了
    }  
    foo(i+1);  
    console.log(i);  
}  
foo(0);  // 输出3 2 1



一个上下文（ec）的执行

function fn (a) {
  var b = 2;
  function c () {};
  b = 20
}
fn(1)


1.创建变量、参数、函数arguments对象; vo是更加之前一点的对象（初始化）
这里的ao是
AO = {
	arguments: {
		0: 1,
		length: 1
	},
	a: 1,
	b: undefined,
	c: reference to function c() {},
}

2.建立作用域链;
3.确定this
4.变量赋值，执行函数
执行后
AO = {
  arguments: {
  0: 1,
  length: 1
  },
  a: 1,
  b: 20,
  c: reference to function c() {},
}







var会变成window的值。
"use strict" 
var a=2

---------------------------
var num = 8;

var display = function () {
  console.log(num);
  var number = 20;
};

display();  //输出undefined

-----------------------------

const只保证变量名指向的地址不变，并不保证该地址的数据不变，所以将一个复合类型的变量声明为常量必须非常小心。
例如以下：
const arr = [];
// 报错，[1,2,3]与[]不是同一个地址
arr = [1,2,3];
const arr = [];
// 不报错，变量名arr指向的地址不变，只是数据改变
arr[0] = 1;

// 块级作用域的东西
var a = 20 ;
{
    console.log(a)  // 输出 function
    // 重要 块级作用域中 function 之后的就只能在这个块级作用域了，出不了外面
    a = 30
    function a(){
        console.log("aaaa")
    }
    console.log(a)  // 输出 30
    a = 40
    console.log(a)  // 输出 40
}
console.log(a)  // 输出30 。如果是 let a = 20 那么这里
//safari 是 40
//google 和 firefox 是 30


//---------------------------------------------
var a = 20 ;
{
    a = 30
    console.log(a)  // 输出30
    a = 40
    console.log(a)  // 输出40
}
console.log(a)  // 输出40



```



### 2.1.3.null | undefined  |  true | false | nan | 判空  | 易错

```js
布尔值都是false，都是基础类型，

undefined代表未定义的值，null表示被认为设置为空的值，例如释放一个对象的内存用null，或者获取一个不存在的dom对象。

{} 不是空对象

if 里面我以为只有false的才会跳，结果现在发现了undefined，null，false都会跳

1.nan是number的特殊类型。不等于任何值，即使nan==nan返回值也是一个false，判断是否nan要调用isnan（）原理是会尝试转化number类型，能转化的返回true，否则返回false

2.false的情况
let a ; if(a){console.log("true")}else{console.log("no")}  //输出false
let a = 0  ; if(a){console.log("true")}else{console.log("no")}  //输出false
let a = NaN  ; if(a){console.log("true")}else{console.log("no")}  //输出false
let a = null  ; if(a){console.log("true")}else{console.log("no")}  //输出false
let a = ''  ; if(a){console.log("true")}else{console.log("no")}  //输出false

3.true的情况

let a = []  ; if(a){console.log("true")}else{console.log("no")}  //输出true
let a = {}  ; if(a){console.log("true")}else{console.log("no")}  //输出true
let a = -30  ; if(a){console.log("true")}else{console.log("no")}  //输出true
let a = '0'  ; if(a){console.log("true")}else{console.log("no")}  //输出true

4.object判空
JSON.stringify({})=='{}' == false
JSON.stringify([])=='[]' == false

let a={};a.length // a.length 这个玩意输出是undefine 
let a=[];a.length  // a.length 这个的输出是0


```



### 2.1.4 setInterval | setTimeout | 误差 

```js
--1.出现原因：
setInterval、setTimeout实现都会出现误差，这源于js的单线程。
他们的回调函数并不是到时后立即执行，而是等系统计算资源空闲下来后才会执行。
setInterval、setTimeout都属于宏任务。

--2.解决方法：
在定时器开始前和运行时动态获取当前时间，用settimeout来替代setinterval


var start = new Date().getTime(), count = 0,interval = 1000;
var offset = 0;//误差时间
var nextTime = interval - offset;//原本间隔时间 - 误差时间
var timer = setTimeout(doFunc,nextTime);
function doFunc(){
    count++
    console.log(new Date().getTime() - (start + count * interval) + 'ms');
     offset = new Date().getTime() - (start + count * interval);
    nextTime = interval - offset;
    if (nextTime < 0) { nextTime = 0; }
  if(count < 10){
	    timer = setTimeout(doFunc,nextTime);
    }
}

```



### 2.1.5 响应头 | 请求头 | cookies |  加密  |  token  | cookies | session | oauth 

```js
1.1 cors
--1.1.1 请求头 
Content-Type（需要注意额外的限制）  : url-form之类的
method ：get post 
--1.1.2 响应头
Access-Control-Allow-Origin | Method | Headers | Credentials: *

1.2 websocket  `
    这个只能是http1.1可以用，
   
`
--1.2.1  请求头 
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Accept: server-random-string

--1.2.2   响应头
代码101标识http协议即将更换

1.3 网络安全

--1.3.2  响应头
Content-Security-Policy：内容安全
HSTS：强制https
X-Frame-Options：禁止嵌入iframe
X-XSS-Protection ： 禁止xss攻击

--2  cookie | token（Json Web Token） |

document.cookie = "yummy_cookie=choco"; 可以一直这样赋值

cookie 是 服务端用来保持状态的。存储在客户端，可随意篡改，不安全（4kb）。二级域名共享cookie但是可以设置`domain`来进行sso（单点登录->一处登录，可以访问其他信任的系统）。之前chatGPT也常常用，不过现在不用了。会增加网络开销

jwt一般来说时签名算法(门禁卡).过期时间（7天）.我(用户信息)    Token并不能防止CSRF攻击，相反，更容易了。cookie好歹还能设个Httponly，token真是js随便用

--3.OAuth2
OAuth2 就是一种授权机制。类似于我给外卖小哥一个临时的门禁卡.这个思想广泛用在sso上面.
例如前后端的授权码，例如a跳转到b请求b授权用户数据（现在的微信登陆和支付宝登陆就是这样），跳转时会返回一个授权码。令牌的使用一般是header加上一个Authorization。一般我们会有两个令牌，一个用来正常使用，一个用来更新令牌

--4.非对称加密
非对称加密就是加密和解密使用的不是相同的密钥：只有同一个公钥-私钥对才能正常加解密。
```



### 2.1.6 WebSocket  |  EventSource(sse) | HTTP长连接

```js
--1.HTTP长连接和WebSocket长连接的区别?
    HTTP长连接本质上还是客户端主动发起-服务端应答的模式。依然是一问一答的模式，只是省略了每次的关闭和打开操作
	WebSocket  是类似 TCP 长连接的通讯模式，一旦 WebSocket 连接建立后，后续数据都以帧序列的形式传输。

--2.建立连接的过程



keep alive怎么实现
消除真实dom，然后缓存虚拟dom
` 
	http1.1 最大的好处就是多了pipeline | 管线。最大的坏处就是 每次都要重新建立连接。传输都是明文和 keep alive 
	需要Upgrade: websocket ; Connection: Upgrade Sec-WebSocket-Key

    http2对应的是websockets - rfc 8441
    websockets 不允许 101 和 upgrade  
    而要用新字段 protocol 还有用新字段 method：connect 和 sec-websocket-protocol 和
    http2 推荐用 spdy.spdy也是基于http1.1的东西
	
`
--1. 定义
websocket无限制的全双工通信，基于tcp连接，
EventSource是单向通信，基于http连接，需要跨域。使用起来就直接createreadstream('xx').pipe(res)
--2. 为什么WebSocket连接可以实现全双工通信而HTTP连接不行呢？

实际上HTTP协议是建立在`TCP`协议之上的，TCP协议本身就实现了全双工通信，但是HTTP协议的请求－应答机制限制了全双工通信。WebSocket连接建立以后，其实只是简单规定了一下：接下来，咱们通信就不使用HTTP协议了，直接互相发数据吧。

--3. ws 和 wss
ws 就是 http ，然后 wss 就是 https

--4.socketio3已经兼容了http1.1和http2
```













### 2.1.7.this | function里面  | "use strict" |











```js

1.默认绑定-(非严格模式下this指向window, 严格模式下this会绑定到undefined。这里的只是针对于function里面的东西)
1.1 函数里面的var 由于作用域的影响，因此遍历不会影响到全局
1.2 在外面的this.xx 永远绑定在 window对象上面
1.3 如果函数里面还有函数用this也都是默认绑定

2.隐式绑定-(当函数引用有上下文对象时, 如 obj.foo()的调用方式, foo内的this指向obj)
2.1谁最后调用函数，this指向就是谁
2.2 隐式丢失的问题
3.显示绑定-(通过call()或者apply()方法直接指定this的绑定对象, 如foo.call(obj))。`call，bind，apply 虽然可以改变指向，但是在settimeout中改变不了指向`
4.new绑定
5.箭头函数绑定(this的指向由外层作用域决定的)

this 永远指向最后调用它的那个对象
其中use strict 影响的是 call(null) 和 函数里面的this
----------------------------------

// 1.函数里面的this和直接的this 


普通状态下的this，定时器的


通过bind，call，apply来改变this

```

   全局作用域中指向window，箭头函数没有自己的this（所以不能用作构造函数）
   优先级：new绑定>显式绑定>隐式绑定。



this有四种

函数时默认绑定，函数里的函数也是默认绑定。对象里的函数是隐式绑定。对象里面return 一个 函数 是隐式绑定指向this

#### 第一种 默认绑定

```
运行在非严格模式的独立空间里面,this指向全局对象。
运行在严格模式下，this会绑定到undefined
```

#### 第二种：隐式绑定（租房子）

```js
就是函数引用 有 `上下文对象` 时。调用函数，函数内的 this 就指向谁（无论是普通对象、还是全局对象），this 永远指向最后调用它的那个对象（不考虑箭头函数）
var obj = {
  a: 1,
  foo: function () {
    console.log(this.a)
  }
}
var a = 2
obj.foo() //输出1 隐式绑定。如果是箭头函数那么指向上一个作用域


主要留意 隐式丢失问题
1.使用另一个变量来给函数赋值的时候会隐式丢失。则使用上一层 this 替代丢失的 this（可能是 window，可能是 obj）


function foo () {
  console.log(this.a)
};
var obj = { a: 1, foo };
var a = 2;
var foo2 = obj.foo;
var obj2 = { a: 3, foo2: obj.foo }
 
obj.foo(); // 1 隐式调用
foo2(); // 2
obj2.foo2(); // 3


2.把 一个函数 当成参数 传递到 另一个函数 中时，会发生 隐式丢失 的问题

在非严格模式下，隐式丢失后，会把函数的 this 绑定到 window 上；
在严格模式下，会把函数的 this 绑定到 undefined 上；

一是function传参，二是settimeout，把函数当作参数

```



#### 第三种:显式绑定（买房子）

```js
通过call(..) 或者 apply(..)方法。第一个参数是一个对象，在调用函数时将这个对象绑定到this。因为直接指定this的绑定对象，称之为显示绑定。除了 call apply bind  。。。。forEach、map、filter`函数的第二个参数也是能显式绑定`this的

function foo () {
  console.log(this.a)
}
var obj = { a: 1 }
var a = 2

foo().call(obj)
//2
//Uncaught TypeError: Cannot read property 'call' of undefined
```

#### 第四种：new绑定

```js
第一步:创造空对象    第二步：赋值__proto__   第三步：赋值this
注意function变成this的这种写法
var name = 'window'
function Person (name) {
  this.name = name
  this.foo = function () {
    console.log(this.name)
    return function () {
      console.log(this.name)
    }
  }
}
var person1 = new Person('person1')
var person2 = new Person('person2')

person1.foo.call(person2)()
person1.foo().call(person2)

就会变成

var person1 = {
	name: 'person1',
	foo: function () {
		console.log(this.name)
		return function () {
			console.log(this.name)
		}
	}
}

输出
'person2'
'window'
'person1'
'person2'
```



#### 注意匿名函数，箭头函数

```js
function foo(){
	return function (){
        console.log(23)
    }
}
只能这样用
并且foo()() //才能输出

function foo () {
  console.log(this.a)
  return function () {
    console.log(this.a)
  }
}
var obj = { a: 1 }
var a = 2

foo() // 2
foo.call(obj) // 1
foo().call(obj) // 2 1  最后一个是call改变了匿名函数的this
foo.call(obj)() // 1 2  最后一个匿名函数是window调用的






var obj = {
  name: 'obj',
  foo2: function () {
    console.log(this.name) // 输出obj
    return () => {
      console.log(this.name) // 输出 obj
    }
  }
}
var name = 'window'

obj.foo2()()

var obj2 = {
  name: 'obj2',
  foo: function () {
    console.log(this.name) //obj2
    return () => {
      console.log(this.name) //obj2
    }
  }
}
obj2.foo()()


var obj3 = {
  name: 'obj3',
  foo: () => {
    console.log(this.name) //window.name 未定义
    return function () {
      console.log(this.name) //window
    }
  }
}
obj3.foo()()
var obj4 = {
  name: 'obj4',
  foo: () => {
    console.log(this.name) //没定义
    return () => {
      console.log(this.name) //没定义
    }
  }
}







```







### 2.1.8.深浅拷贝

   解决深拷贝循环引用的方法可以是 new 一个map

```javascript

// 该方法简单但有bug，因为JSON.stringify会忽略值为undefined、symbol的属性
function deepClone2(obj) {
  return JSON.parse(JSON.stringify(obj))
}


```



### 2.1.9 无状态组件 | 受控组件 |  合成事件 | 父子组件渲染

```js
0.没有state是无状态组件，有state是有状态组件

1.不受控组件 | 受控组件
一个input输入框，有一个数据。input我们什么都不做，它内部有一套维护他自己状态的方法所以叫做不受控组件
一个input输入框，有一个数据。我们定义一个update方法来同步UI，我们定义一个proxy方法。使得外部变量和这个变量能够重合，这叫做受控组件

2.合成事件是react的方法，是对各个浏览器提供统一的api进行差异抹平的东西
3.父子组件渲染

--3.1 vue是先 父 create    最后父destory。但是由于子组件的mount 要比父的mount要快，因此会显得子组件渲染要比父组件快。react。

--3.2 react 基础跟vue是一样的 

--3.2.1 class组件中的是无论父组件 输入啥 子组件 都会让 子组件 更新 因此可以在 子组件的shouldComponentUpdate 中 取消渲染（return false就可以了）

--3.2.2 hook组件

case1：hook 是 函数中的 和 render（就是 return <div>{xxx}</div>）/ 里面的会先执行。  (这一部分 父子孙 组件 按照顺序执行)

case2：然后是 useEffect （这一部分是 孙组件 子组件 父组件的顺序）

case3：复杂一点的 例如 top父 left子  right 子 left孙。这样就是  
top父  left子   left孙 right 子 递归类似深度搜索一样的遍历他

```





### 2.1.10.原型 | 原型链



```js
class A.prototype == new A().__proto__
原型是prototype`显式原型`（只能没有实例的时候用）、__proto__`隐式原型`与constructor（只能class）。原型链是把各个原型__proto__连接起来，一直到null

我们需要牢记两点：

--区别主要是 
new之前：prototype的属性会得到继承。__proto__的属性不会得到继承
new之后：prototype的属性设置不了（会报错）。__proto__的属性随便设置，设置的也是改变目前的prototype

// a.__proto__.__proto__.__proto__ 可能会报错 在报错的最后一次返回的是null
原型链的尽头是object的隐式原型null
//a.constructor.constructor.constructor 永远不报错。最后返回的是native code

let test1 = function(){
    this.name = 'function'
}
let protest=new test1()
protest.__proto__.name = 'function1';

class test2 {
  constructor() {
      this.name="class"
  }
}
let ex2 = new test2()
ex2.__proto__.name="ss" //这个没有问题
```

   每个对象都有一个原型对象，当访问一个对象的属性时，不仅会在该对象上搜寻，还会去该对象的原型上搜索。在我们new 对象的时候，第一步是创造内存空间，接下来是原型挂载。最后是

```javascript
function Person() {
    this.name = 'tom'
}
Person.prototype.name = 'Kevin';
var person = new Person();
person.name = 'Daisy';
console.log(person.name) // Daisy
delete person.name;
console.log(person.name) // Kevin

// 同样的基于原型链的属性查找还有constructor,funciotn原型对象Person是有constructor属性的，但是实例对象person没有，但是可以打印出person.constructor


```



```js
//只有函数才有prototype原型属性，protype是一个对象。实例可以共享函数的原型。当前实例对象找不到属性就回去原型里面去找属性。默认有一个construct

//JavaScript的prototype是仅函数拥有, 而对象也拥有prototype是源于其constructor属性所拥有的prototype.
```





### 2.1.11.继承

   一般基于原型链或者构造函数继承，用的最多的是综合前两者的组合继承，最优的是寄生组合继承

```js
--1.原型链继承（但无法多继承-prototype已经给别人了，也不能向构造函数传参）-将子类的原型对象指向父类的实例-Student.prototype = new People()
function People(name) {
    this.name = name || 'Annie'
   
}
function Student() {
}
Student.prototype = new People()
console.log(new Student().name)
--2.构造函数继承（父类原型链（xx.prototype.xx）上的参数和方法不能访问，但可以多继承，无法复用）
function Parent (name) {
  this.name = name
}
function Child () {
  this.sex = 'boy'
  Parent.call(this, 'child') //绑上去了
}
var child1 = new Child()
console.log(child1)

--3.组合继承（call/apply+prototype）-父类构造函数会被调用两次,会有覆盖。增加了不必要的内存
原型链继承+构造继承
// 原型链继承
Child.prototype = new Parent()
// 构造继承
function Child () {
  Parent.call(this, ...arguments)
}

--4.寄生组合继承
//会更加干净
Child.prototype = Object.create(Parent.prototype)
function Child () {
  Parent.call(this, ...arguments)
}
--5.寄生继承
//在原型式继承的基础上再封装一层，来增强对象，之后将这个对象返回。
function createAnother (original) {
    var clone = Object.create(original);; // 通过调用 Object.create() 函数创建一个新对象
    clone.fn = function () {}; // 以某种方式来增强对象
    return clone; // 返回这个对象
}




--3.ES6 class extends 继承

```


2.instanceof
   用法：object instanceof constructor

```js
function f(obj) {console.log(Object.prototype.toString.call(obj))}
// [object xxxxx]是string类型
f(1) 							// [object Number]
f('1') 						// [object String]
f(false) 					// [object Boolean]
f(undefined) 			// [object Undefined]
f(null) 					// [object Null]
f(Symbol()) 			// [object Symbol]
f({name: 'jack'}) // [object Object]
f([1,2,3]) 				// [object Array]
f(new Date()) 		// [object Date]
f(/a/) 						// [object RegExp]
```



```javascript

--1.概念
Map对一个对象是强引用
weakmap  是一个弱引用

--2.for in - for of
for in （可以枚举 enumerable）：string，array，object  （set map 不会报错） | 判断 object.getOwnPropertyDescriptors
for of （可迭代 iterable）：tring，array，set ，map  （注意这里object会报错）  | 判断 arr[Symbol.iterator]
for await ... of  类似于 promise.all（这个返回一个数据）

(
    async function(){
        for await (let res of list){
            console.log(res)
        }
    }
)()

--3.场景题：顺序promise的封装
(async function (){
    const data = [10, 20, 30 ]
    for(let val of data){
        await getPromise(val)
    }
})


```

### 2.1.13.new操作符 | 手写


```js
new用来创建一个给定构造函数的实例对象
   流程： 
   1.声明空对象 
   2.如果是数组，那么就挂载原型（将空对象的__proto__指向构造函数的prototype）。如果是方法，那么调用apply方法 
   3.赋值给this
function myNew(Funct, ...args) {
    let obj = {}
    obj.__proto__ = Funct.prototype
    let res = Funct.apply(obj, args)
    return res instanceof Object ? res : obj
}
```



### 2.1.14.编程思想 |  命令式 | 状态机 | 柯里化 | 优雅降级

```js
1.了解一下react是命令式编程就可以了
2.状态机就是 将不同的状态封装到一个函数里面去
3. 指一个函数接收函数A并且返回一个函数B，函数B来处理A的剩余参数。例如f(x,y)=x^y，固定x=2就得到f(y)=2^y这样的新的函数。具体的代码放在 4.javascript-手写题.md里面
4.优雅降级是从复杂的现状开始的。渐进增强从弱的开始
```





### 2.1.15 缓存 | 强制重新加载 | worker

```js
//1.通常浏览器缓存策略分为两种：强缓存和协商缓存
离线缓存 主要有 manifest缓存 和 service worker
1.根据请求头的expires和cache-control,判断是否命中强缓存（后者优先级高）
2.如果没有命中，那么会发送一个请求到服务器。通过last-modified和etag验证资源是否命中协商缓存。如果命中，服务器会将这个请求返回，（后者优先级高）
3.如果又没有命中，直接从服务器读取资源


//2.不建议随意授予 no-store，因为你失去了 HTTP 和浏览器所拥有的许多优势，包括浏览器的后退/前进缓存。

//3.重新加载 request
mdn上 给出的方法如下
1. Cache-Control: max-age=0
2. Pragma: no-cache
3. 添加版本号
不让他重新加载
Cache-Control: max-age=31536000, immutable（避免了发请求验证，可以看作是更加牛皮的优化）


//4.入口 html 文件是绝对不能强缓存的，不然就更新不了了。
`这种入口 html 文件设置 no-cache，其他资源文件设置 max-age` 的缓存方式算是最佳实践了，你随便找一个网站看看都是这种方式。业务资源文件名字里是有 hash 的，新的 html 引用不同 hash 的资源即可：

//5.command + shift + R 的原理 requret
`Cache-Control 变成了 no-cache`，也就是和服务端协商是否要更新本地缓存，这就是强制刷新的实现原理！
但你现在在 Chrome DevTools 里看到的依然是之前的 Cache-Control：
说明 Chrome DevTools 隐藏了这个行为，就像它隐藏了 sourcemap 文件的请求一样。
sourcemap 文件的请求和cache-control在 charles 里看到：
```





### 2.1.16.  Event Loop | 事件循环(4个概念) | 调用栈清空之后触发Event loop

```js
event loop
1.调用栈清空，触发下一步
2.执行微任务
3.dom渲染
4.宏任务
```

**调用栈(call stack)、消息队列(Message Queue)和微任务队列(Microtask Queue)和宏任务队列**

**1.**Event Loop 开始时，从上到下，遇到函数调用时，会把函数压入调用栈中（被压入的函数叫做`帧(frame)`，当函数返回后，会从调用栈中弹出。直到被清空

**2. **微任务队列（Microtask Queue）：使用 Promise、Async/Await 创建的异步操作会入队到微任务队列中，

 **3. **   接下来就是尝试dom渲染和执行宏任务队列

4.调用栈被清空清空执行。异步操作进入消息队列（settimeout，setinterval）

```js
//1.事件循环定义：我们先把代码分成同步代码（console.log）和异步代码(setimeout，promise的then)。同步代码我们交给js（执行栈）去执行（因为这玩意是单线程的），异步环境我们交给宿主环境去执行。异步环境条件满足之后我们从宿主环境推送到任务队列。执行栈里面的任务执行完了，我们就会把任务队列（里面有宏任务队列和微任务队列）的任务推进执行栈。执行栈执行完就去任务队列看看，这个就叫做事件循环

//2.异步任务分成宏任务和微任务。宏任务由宿主环境组成(浏览器，node)。微任务由js引擎组成。优先级：同步代码-》微任务异步promise.then，await，nexttick也是。后面的也是-》宏任务异步.

//3.我看的疑问：为什么宏任务微任务是微任务优先：其实上面的说法忽略了一个条件。所有的任务都是在一个大的script里面产生的

//4.promise本身是同步的但是里面的.then是异步的
new Promise(resolve => {
        console.log(1);
        resolve(console.log(4)); //下面代码不会被阻止。会调用.then函数，先进先出原则
    	console.log("我")
        Promise.resolve(console.log("是")).then(()=> {
            console.log(3);
            Promise.resolve(console.log("s")).then(()=> {
            	console.log("b");
            })
        })
    }).then(num => {
        console.log(num);
        setTimeout(()=>{console.log(5)},0);
});
console.log(2); // 1 我 是 2 （第一个同步）| 3（第一个异步，then先进先出）|  s（第二个同步）  | 4 （这里是由于resolve只能一个then，不继续惯着了）| b 5
//先同步，resolve中的也是同步（resolve作为参数不阻塞）。 
//先到then的


new Promise(resolve => {
        console.log(1);
        resolve(3); //下面代码不会被阻止。会调用.then函数，先进先出原则
        Promise.resolve().then(()=> console.log(4))
    }).then(num => {
        console.log(num);
        setTimeout(()=>{console.log(6)},0);
});
console.log(2); // 1 2 4 3 6  注意一下 1是最先执行的


var p = new Promise((resolve) => {
  console.log(4);
  resolve(5);
});

function func1() {
  console.log(1);
}

function func2() {
  setTimeout(() => {
    console.log(2);
  });
  func1();
  console.log(3);
  p.then((resolved) => console.log(resolved));
}
func2();  // 4 1 3 5 2 这里主要是 一开始的 p 是会执行的



//----------------------------------------------------------
// 最后加上await 总结一下,
step1:先是 
同步任务 | 
resolve | 
resolve 的任务同时执行例如 resolve(console.log(66))。如果说resolve(4),那么就先执行后面的如果后面是resolve().then(log(55)) 那么就先输出55，接下来执行resolve(4)的.then | 
await 的处理
v8引擎之前 执行 await 后，会把后面的代码注册到微任务队列。
v8引擎之后 执行await 后，直接跳出函数，在本轮循环的最后被执行 |
注意，这些一些遇到微任务直接丢进去 微任务队列。然后遵循 先进先出的 原则
step2: 异步的微任务 （先进先出）
step3：宏任务
```











### 2.1.17 && |  ||

```
&&返回第二个有效值，||返回第一个有效值
```



### 2.1.18  bind  | apply |  call

bind是绑定（用于click）

call后面+单个

apply是+list（块）



### 2.1.19 类型判断 |  类型转化

```js
类型判断
let a=[1,5,6]
1.Object.prototype.toString.call(a)：装箱操作
会对非null 或 undefined的数据类型进行装箱操作（不然会直接报错），然后去找出对象【Symbol.toStringTag】 属性值，还有可能要遍历原型链，取到的值作为 tag, 然后返回 "【object " + tag + "】" 形式的字符串

2. instanceof
返回true

3.typeof
返回用来说明变量的数据类型（但是array，null等复杂对象一律返回object），但是null并不是object格式的

4.isArray

5.nan！=nan结果是true

类型转化
--1.boolean
布尔值转化-用boolean直接转换：这里注意一下如果object={}，那么这个object的给boolean判断的话是true的。真正的空对象会用null来表示。所以空对象返回的是true。

--2.toString
字符串转化:tostring，String直接转化。tostring不支持null和undefined（会报错），string这个构造函数可以直接返回null和undefined的字面量

注意 
145.toString()会报错
但是(145).toString不会报错

--3.number
数值转化：number这个构造函数也是宽容，原理是用valueof先试一下，得不到在调用tostring类型。parseint parsefloat就没有那么宽容了。如果失败会用nan兜底。一个奇怪的点是如果number（空对象）结果是nan

typeof typeof typeof null 的结果是什么
从右边到左边执行：typeof typeof typeof null 结果是 typeof null 先变成'object'然后再变成'string'.答案也是 'string'
```







### 2.1.20  class | super | 面向对象

```js
--1.super可以传参给父类的constructor 方法
class Person {
    constructor(name,age){
        this.name = name;
        this.age = age;
    }
    
}

class Student extends Person {
    constructor(name,age,sex){
        super(name,age)
        this.sex = sex
    }
}
console.log(new Student("测试",12,1))



```



### 2.1.21  前端竟态问题 | AbortController | abort | promise的取消

```js
1. 如果是XMLHttpRequest我们new open send之后可以xhr.abort();
2. AbortController

const ac = new AbortController();
const { signal } = ac;
//得到signal，只要第二个参数传入了signal。我们就可以搞定了

fetch(resourceUrl, { signal }).then((res)=>{})
ac.abort({
  type: 'USER_ABORT_ACTION',
  msg: '用户终止了操作'
});

3.实现一个可以取消的promise
--3.1 eventbus可以解决
--3.2 abortcontroller也可以做到(好处是一次取消多个请求非常方便)

/**
 * 自定义的可以主动取消的 Promise
 */

function myCoolPromise ({ signal }) {
  return new Promise((resolve, reject) => {
    // 如果这个时候 signal 对象的状态是终止的，那么就会抛出一个异常
    signal?.throwIfAborted();

    // 异步的操作，这里使用 setTimeout 模拟
    //resolve('ok')

    // 添加 abort 事件监听，一旦 signal 状态改变就将 Promise 的状态改变为 rejected
    signal?.addEventListener('abort', () => reject(signal?.reason));
  });
}

/**
 * 使用自定义可取消的 Promise
 */

const ac = new AbortController();
const { signal } = ac;

myCoolPromise({ signal }).then((res) => console.log(res), err => console.warn(err));
ac.abort({
  type: 'USER_ABORT_ACTION',
  msg: '用户终止了操作'
});
```



### 2.1.22 栈 | 堆 | 队列 | 内存溢出解决方案

```js
1.栈 ：方法
它的存储分为访问地址和实际存放的地方; 访问地址是存储在栈中的, 当查询引用类型变量的时候, 会先从栈中读取内存地址(也就是访问地址), 然后再通过地址找到堆中的值.因此, 这种我们也把它叫为引用访问.
2.堆：object
闭包中的变量 就并不是保存在栈中, 而是保存于堆中.
它的存储分为访问地址和实际存放的地方; 访问地址是存储在栈中的, 当查询引用类型变量的时候, 会先从栈中读取内存地址(也就是访问地址), 然后再通过地址找到堆中的值.因此, 这种我们也把它叫为引用访问.

v8的堆有这两个：
新生代 就是临时分配的内存，存活时间短, 如临时变量、字符串等
from_space_：正在使用的放到to。然后对调，循环
to_space_：闲置的内存

老生代 是常驻内存，存活的时间长, 如主控制器、服务器对象等;
这就是标记清除了

3.队列：事件循环 Event Loop

4.内存溢出解决方案：node --max_old_space_size=8000 build/build.js
```



### 2.1.23.线程与进程(开销和内存空间) |  单线程好处

```js
线程=火车  进程=车厢
火车间很难共享    同一火车的不同车厢容易共享

为避免频繁操作DOM带来的同步问题，设计成单线程。后来为了利用多核CPU计算能力，HTML5提出Web Worker标准，允许js脚本创建多个线程，但是子线程由主线程控制且不得操作DOM，所以JS单线程的本质没有改变。
```



   



### 2.1.24 html元素 | Attribute

```js
document.getElementById('content_views').setAttribute('age', 25);
document.getElementById('content_views').getAttribute('class')
```

### 2.1.25  事件委托 | addEventListener

```js
事件委托主要用来1.减少内存消耗，2.动态绑定事件。减少重复工作
我们一般说的事件委托其实是addEventListener
第一个是我们的事件：比如click，mouseover
第二个是方法
第三个是模式。true是事件在捕获阶段执行。事件在冒泡阶段执行，默认是false,就是默认在冒泡的时候执行
//默认冒泡是 标签的onclick事件->document.onclick->addEventListener
//为true的时候 addEventListener->标签的onclick事件->document.onclick 　
```

 事件传播的三个阶段

```
1、捕获阶段：事件从window对象自上而下向目标节点传播的阶段；
2、目标阶段：真正的目标节点正在处理事件的阶段；
3、冒泡阶段：事件从目标节点自下而上向window对象传播的阶段。
```

示例

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
    <div onclick="parent()">
        <ul class="list" >
            <a href="www.baidu.com">百度</a>
            <a href="www.baidu.com">搜狐</a>
        </ul>
    </div>
    <script>
        function parent(){
            console.log("dsadas")
        }
        document.querySelector('.list').addEventListener('click',(e)=>{
            // alert((e || window).event.target.innerHTML)
            // 阻止冒泡方法  不让事件向documen上蔓延。
            // 只激活内部函数,顶部的onclick就不会执行力
            e.stopPropagation()
            // 阻止默认行为
            e.preventDefault()
        })

    </script>
</body>
</html>
```



事件大全

```js
--1.鼠标事件
click 当用户点击某个对象时调用的事件句柄。
contextmenu 在用户点击鼠标右键打开上下文菜单时触发
dblclick 当用户双击某个对象时调用的事件句柄。
mousedown 鼠标按钮被按下。
mouseenter 当鼠标指针移动到元素上时触发。
mouseleave 当鼠标指针移出元素时触发
mousemove 鼠标被移动。
mouseover 鼠标移到某元素之上。
mouseout 鼠标从某元素移开。
mouseup 鼠标按键被松开。

--2.键盘事件
属性 描述 DOM
keydown 某个键盘按键被按下。
keypress 某个键盘按键被按下并松开。
keyup 某个键盘按键被松开。

--3.键盘事件
框架/对象（Frame/Object）事件
abort 图像的加载被中断。 ( )
beforeunload 该事件在即将离开页面（刷新或关闭）时触发
error 在加载文档或图像时发生错误。 ( , 和 )
hashchange 该事件在当前 URL 的锚部分发生修改时触发。
load 一张页面或一幅图像完成加载。
pageshow 该事件在用户访问页面时触发
pagehide 该事件在用户离开当前网页跳转到另外一个页面时触发
resize 窗口或框架被重新调整大小。
scroll 当文档被滚动时发生的事件。
unload 用户退出页面。 ( 和 )

--4.表单事件
表单事件
blur 元素失去焦点时触发
change 该事件在表单元素的内容改变时触发( , , , 和 )
focus 元素获取焦点时触发
focusin 元素即将获取焦点是触发
focusout 元素即将失去焦点是触发
input 元素获取用户输入是触发
reset 表单重置时触发
search 用户向搜索域输入文本时触发 (

--5.剪贴板事件
剪贴板事件
copy 该事件在用户拷贝元素内容时触发
cut 该事件在用户剪切元素内容时触发
paste 该事件在用户粘贴元素内容时触发

--6.打印事件
打印事件
afterprint 该事件在页面已经开始打印，或者打印窗口已经关闭时触发
beforeprint 该事件在页面即将开始打印时触发

--7.拖动事件
拖动事件
drag 该事件在元素正在拖动时触发
dragend 该事件在用户完成元素的拖动时触发
dragenter 该事件在拖动的元素进入放置目标时触发
dragleave 该事件在拖动元素离开放置目标时触发
dragover 该事件在拖动元素在放置目标上时触发
dragstart 该事件在用户开始拖动元素时触发
drop 该事件在拖动元素放置在目标区域时触发


--8.拖动事件
动画事件
animationend 该事件在 CSS 动画结束播放时触发
animationiteration 该事件在 CSS 动画重复播放时触发
animationstart 该事件在 CSS 动画开始播放时触发


--9.拖动事件
message 该事件通过或者从对象(WebSocket, Web Worker, Event Source 或者子 frame 或父窗口)接收到消息时触发
online 该事件在浏览器开始在线工作时触发。
offline 该事件在浏览器开始离线工作时触发。
popstate 该事件在窗口的浏览历史（history 对象）发生改变时触发。 event occurs when the window’s history changes

--10.元素在上下文菜单显示时触发
storage 该事件在 Web Storage(HTML 5 Web 存储)更新时触发
toggle 该事件在用户打开或关闭 元素时触发
wheel 该事件在鼠标滚轮在元素上下滚动时触发
```



### 2.1.26.作用域链   | 执行上下文

```js
变量提升把变量或者是function的声明提升到开头的行为。所以我们会用 块级作用域，let 和 const来防止变量提升

原理是 预编译 和 执行
--1.作用域一共有三个 全局作用域、函数作用域，块级作用域。函数的 { }，才能形成作用域，比如
// 比如这个对象的 { } 就不是作用域
var xiaoming = { 
  name: 'xiao ming' // 对象中的属性，也不是局部变量
}
一些特殊例子
if (false) {
  var a = 10
}
console.log(a) // 会输出 undefined
{
  var b = 1
}
console.log(b) // 会输出 undefined

--2.块级作用域和{} 合并 示例
{
  let x = 0
}
console.log(x) // Uncaught ReferenceError: x is not defined

--2.作用域链：作用域链是如果在当前作用域下找不到该变量，那就去上层作用域去寻找，直到全局作用域，如果还找不到会报错

为什么在对象内部访问自己的属性不能直接用xxx，为什么 this 指向的不是 window
const xiaoming = {
  name: '小明',
  getName: function () {
    console.log(name)
  }
}
xiaoming.getName() // undefined

因为只有函数的大括号{}才能形成作用域，

--3 说明会先在内部找，接下来回到外部找
--3.1
let a = 56
function b(){
    console.log(a)
    //var a =12
}
b()  //输出56

--3.2
let a = 56
function b(){
    console.log(a)
    var a =12
}
b()  //输出 undefined
```



   作用域是变量和函数生效的区域，分为全局作用域、函数作用域和块级作用域
   ，如果在非严格模式下会在全局隐式地声明该变量









### 2.1.27 babel |  polyfill | core.js

```js
Babel 能为你做的事情：
1.语法转换
2.通过 Polyfill 方式在目标环境中添加缺失的特性 (通过 @babel/polyfill 模块)
那么他是咋做到的呢？这就不得不提大名鼎鼎的AST了-parsing(解析)、transforming（转化）、printing（生成）-黑海谈判。日本和美国谈判。但是只有荷兰翻译


polyfill(补丁/垫片) 的定义， 他就是把当前浏览器不支持的方法通过用支持的方法重写来获得支持。

core.js 和polyfill类似。每年会出现新的qpi，像：es6的Promise，Set或者es7数组新提供的方法includes，这些新加入的api，就引出一个词“”polyfill“”(垫片/补丁)，就是社区上提供的一段代码，让我们在不兼容某些新特性的浏览器上，使用该新特性。新功能转换为大部分现代浏览器都可以支持运行的api补丁包集合。


```





###   2.1.28 加密算法

```js
--1.非对称加密就是同一个公钥-私钥对才能正常加解密。(rsa) ，用快递员的密钥加密，然后把把快递给他，只有快递员的密钥才可以解密。

我通过RSA算法生成公钥私钥，快递员通过我的公钥加密数据，我通过自己的私钥解密

--2.对应的就是 对称加密算法（类似于zip的解压缩）
```







### 2.1.30 async | await | promise| 版本差异 | node 的事件循环比较

用同步的方法实现异步操作（指的是.then）。async返回一个promise，await后面接promise那么就是等待返回结果。async只能和await合并使用。但是浏览器调试await可以单独使用

```js
--1.原理
async/await：原理是包裹一层生成器调用next方法+promise。
注意script中，async 和 defer都是异步加载，但是defer 是有顺序的。，而async 是乱序的，这个东西会阻塞 整个线程
--2.版本差异
v8引擎之前 执行 await 后，会把后面的代码注册到微任务队列。
v8引擎之后 执行await 后，直接跳出函数，在本轮循环的最后被执行。紧跟着await后面的语句相当于放到了new Promise中，下一行及之后的语句相当于放在Promise.then中(而且是比较后面的那一种，不会受到影响)

console.log('script start') // 1
async function async1() {
    await async2() //2
    console.log('async1 end')//7
}
async function async2() {
    console.log('async2 end') //2
    return Promise.resolve().then(()=>{
        console.log('async2 end1') //5
    })
}
async1()//2

setTimeout(function() {
    console.log('setTimeout') //8
}, 0)

new Promise(resolve => {
    console.log('Promise') //3
    resolve()
})
.then(function() {
    console.log('promise1') //6
})
console.log('script end') //4
// script start  (这里容易，就是普通输出)
// async2 end  (这里容易，就是普通await 的 值，这里promise.then是微任务跳过)
// Promise	（resolve 是同步任务执行）
// script end （同步任务的最后一步）
// async2 end1 （异步任务 的 第一个微任务）
// promise1 （异步任务 的 第二个微任务）
// async1 end （？？？ await 後面的会在本轮循环的最后进行执行，但是再慢也比settimeout快）
// setTimeout




加深理解的一题

async function async1 () {
  console.log('async1 start');
  await new Promise(resolve => {
    console.log('promise1')
  })
  console.log('async1 success'); //相当于.then 但是不会执行。因为上面的promise没有then
  return 'async1 end'
}
console.log('srcipt start')
async1().then(res => console.log(res))
console.log('script end')
// srcipt start
// async1 start
// promise1
// script end




```



```
两者最主要的区别在于浏览器中的微任务是在每个相应的宏任务中执行的，而nodejs中的微任务是在不同阶段之间执行的。
```





### 2.1.31 scolltop | clientheight | offsetheight  | IntersectionObserver |  clientx是可视坐标，pagex是绝对坐标

```js
1.document.documentElement.clientHeight获取屏幕可视窗口高度。
2. ele.offsetTop  元素相对于文档顶部的距离  //document.querySelector('#user-content').offsetTop  
3.document.documentElement.scrollTop 滚动条滚动的距离  通过上面三个能够知道我们我们是否能够看到视图.但是这样子监听会照成回流。（判断元素位置我们可以通过3+1>2）
document.documentElement.clientHeight(可见区域高）+document.documentElement.scrollTop(用户滑动的距离)  > 观测元素.offsetTop(元素距离顶部的距离)

4.IntersectionObserver 



const io = new IntersectionObserver(ioes => {
  ioes.forEach(ioe => {
    const el = ioe.target;
    const intersectionRatio = ioe.intersectionRatio;
    if (intersectionRatio > 0 && intersectionRatio <= 1) {
      console.log("能看见元素")
    }else{
        console.log("看不见")
    }
    el.onload = el.onerror = () => io.unobserve(el);
  });
});
const imgs = Array.from(document.querySelectorAll('#user-content--getboundingclientrect'));
imgs.forEach(item => io.observe(item))


```



利用offsetTop和scrollTop和浏览器高度做比较
getBoundingClientRect返回相关位置属性





总结一共2个：scrollTop（字面意思） clientTop（局部正常基础少一点东西或者不正常，大局正常） offsetTop（正常）

```js
--1.固定（dom上常用属性）
clientWidth  //1.1屏幕（不固定）的宽高
width  //1.2屏幕（固定）宽高
scrollTop // 1.3滚动宽高

border-box下面，这三个一样， //1.3元素宽高
offsetHeight(元素本身的宽) | scrollHeight（元素高度-border*2+溢出来的元素高） | clientHeight（元素高度-border*2）

如果要是是content-box//1.3元素宽高
offsetHeight(元素+padding*2+border*2) | scrollHeight（元素高度+padding*2+溢出来的元素高-overflow-y: auto） | clientHeight（元素+padding*2）

//1.4元素距离顶部的距离
offsetTop（正常大全）
clientTop//顶部边框值
scrollTop:内部的滚动效果//document.querySelector(".box").scrollTop=100。（可以用来做页面滚动效果）

--2.事件：
clientX // 2.1以可见区域的左上角为原点
pageX // 2.2以页面本身的body为原点
offsetX（左内边框） | windowX （相对于屏幕）//2.3

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>

<body>
    <style>
        * {
            margin: 0;
            padding: 0;
        }
        .container {
            column-count: 2;
            margin-top: 800px;
        }

        .box {
            /* position: absolute; */
            top: 10px;
            margin: 10px;
            background: red;
            width: 100px;
            height: 100px;
            padding: 20px;
            box-sizing: border-box;
            word-wrap: break-word;
            border: 1px solid black;
            padding: 10px;
            overflow-y: auto;
        }

    </style>
    <div class="container">
        <div class="box"> aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
        </div>
        <div class="box"></div>
        <div class="box"></div>

        <div class="box"></div>

    </div>
    <script>

    </script>
</body>

</html>
```







```js
--0.基础知识

document.documentElement：可返回存在于 XML 以及 HTML 文档中的文档根节点（对应的是html标签）
document.body：提供了对 <body> 标签的直接访问（对应的是body标签）
在DTD已声明的情况下用documentElement，未声明的情况下用body



--1.可见区域宽高
document.documentElement.clientWidth;  //height + padding + 水平滚动条高度
window.screen.width//屏幕宽度（不受窗口resize事件影响）

document.documentElement.clientHeight;  //height + padding + 水平滚动条高度（doc为严格模式下面document.body失效，原因不明） | 考虑用document.documentElement.clientHeight
window.screen.height//屏幕高度（不受窗口resize事件影响）


2.滚动长度：
document.documentElement.scrollTop //严格模式下面用这个
document.body.scrollTop //兼容模式用这个

3.元素宽高
document.querySelector(".box").offsetWidth//获取元素的宽，这里需要注意我们的box-size:box还是content差距是很大的。

4.元素距离顶部距离
document.querySelector(".box").offsetTop//绝对数值

document.documentElement.scrollTop+document.documentElement.clientHeight,document.querySelector(".box").offsetTop
```









### 2.1.32 监听dom元素 | MutationObserver

```js
function callback(mutationList, observer) {
  mutationList.forEach((mutation) => {
    switch(mutation.type) {
      case 'childList':
        /* 从树上添加或移除一个或更多的子节点；参见 mutation.addedNodes 与
           mutation.removedNodes */
        break;
      case 'attributes':
        /* mutation.target 中某节点的一个属性值被更改；该属性名称在 mutation.attributeName 中，
           该属性之前的值为 mutation.oldValue */
        break;
    }
  });
}
var targetNode = document.querySelector("#someElement");
var observerOptions = {
  // 观察目标子节点的变化，是否有添加或者删除
  childList: true,  
  // 观察属性变动
  attributes: true, 
  // 观察后代节点，默认为 false
  subtree: true     
}

var observer = new MutationObserver(callback);
observer.observe(targetNode, observerOptions);

```



### 2.1.33 arguments

```js
arguments默认获取剩下的参数

function fun(age, className) {
    console.log(`${this.name}的年龄是${age}岁，是${className}班学生`)
}
```



### 2.1.35  postmessage

#### 子组件

```js
let data="data1111111111"
window.postMessage(data,"*")  //parent.postmessage vue里面
```



#### 父组件

```js
function parent(param){
	console.log("测试:",param)
}
window.addEventListener("message",parent)

```





### 2.1.37  innerText |  textContent |  nodeValue

```js
--1.innerText获取可以显示的文本:display:none的不会输出，opacticy为0就是可以被输出。

--2.textContent能够获取所有子节点的文本内容。包括html和script。注意注释获取不到

--3.nodeValue只能是作用于文本节点或者注释节点本点。不然会是null

--4.innertext作用于html element后两个作用于node。

--5.注意一下html中换行和和注释节点也被算做了一个子节点
```



### 2.1.38  geo | speech | api

```js
window.navigator.geolocation (http的定位可能会不准，因此最好是https-ios10)
//翻墙才能用
navigator.geolocation.getCurrentPosition(position => {
    console.log('当前位置信息：', position)
})

------------------------------
//定位数据获取成功响应  
function  onSuccess(position){  
      alert('纬度: '          + position.coords.latitude          + '\n' +  
      '经度: '         + position.coords.longitude         + '\n' +  
      '海拔: '          + position.coords.altitude          + '\n' +  
      '水平精度: '          + position.coords.accuracy          + '\n' +  
      '垂直精度: ' + position.coords.altitudeAccura)  
}  
//定位数据获取失败响应  
function onError(error) {  
  switch(error.code)  
  {  
    case error.PERMISSION_DENIED:  
    alert("您拒绝对获取地理位置的请求");  
    break;
    case error.POSITION_UNAVAILABLE:  
    alert("位置信息是不可用的");  
    break;
    case error.TIMEOUT:
    alert("请求您的地理位置超时");  
    break;
    case error.UNKNOWN_ERROR:  
    alert("未知错误");  
    break;
  }  
}  

if(navigator.geolocation){  
  navigator.geolocation.getCurrentPosition(onSuccess , onError);  
}else{  
  alert("您的浏览器不支持使用HTML 5来获取地理位置服务");  
}  
```



### 2.1.39  正则

```js
//(.)匹配任意一个 (？)匹配0-1个  *匹配1个以上 \d 匹配单个数字=[0-9]

//手机号 | 1开头+除了1之外的东西+中间9个结尾 
const reg = /^[1][3,4,5,6.7,8,9][0-9]{9}$/g;
const reg = /[1][3,4,5,6.7,8,9][0-9]{9}/g;
let text ="我的手机号是19120636253，因此xxxxx/但是他的手机号码是18928125079"
--1.match | 输出匹配的  这玩意和 replace是好用的 text.replace(reg,"替换的内容")
console.log(text.match(reg)) //['19120636253','18928125079']
--2.search | 返回第一个元素位置
console.log(text.match(reg)) //6
--3. test | 看一下有没有符合要求的元素..表单校验的时候可以用
console.log(reg.test(text)) // true
--4.零宽先行 断言 (?=p)  要求与p匹配	
//(?=a) 表示我们需要匹配某样东西的前面。  会带着?=一起输出出来，实操体验很差
//(?!a) 表示我们需要不匹配某样东西。
//(?<=a) 表示我们需要匹配某样东西的后面。
//(?<!a) 表示我们需要不匹配某样东西，与(?!a)方向相反。
var reg1 = /(?<=机号是)[0-9]{11}(?=,因)/g
let text ="我的手机号是19120636253,因此xxxxx但是他的手机号是18928125079,因但是,"
console.log(text.match(reg1))
console.log(reg1.exec(text))


var consoleName=["console","window.console"];
var consoleType= ["log", "info", "warn", "error" ,"assert" ,"count" ,"clear"];
//let rConsole = new RegExp("(" + consoleName.join("|") + ")" + ".(?:" + consoleType.join("|") + ")\\s{0,}\\([^;]*\\)(?!\\s*[;,]?\\s*\\/\\*\\s*NotClearConsole\\s*\\*\\/)\\s{0,};?", "gi");
let rConsole = /console.log\(.*?\)/g
let text ="console.log('ddddd');let a= 1;console.log('ddd')"
console.log(text.match(rConsole))
```



```js
	// 正则表达式
        function getQueryObject(url) {
            //假如不传值，默认也会有值
            url = url == null ? window.location.href : url
            //这一套组合技就是取到最后？后面的值
            // url.lastIndexOf('?')找到位置
            const search = url.substring(url.lastIndexOf('?') + 1)
            const obj = {}
            // 3.1 正则表达式 基本形式 /正则表达式主体/修饰符(可选)
            // i 大小不那啥  g 全局匹配 不会在匹配一个后就停止
            // JavaScript 中，正则表达式通常用于两个字符串方法 : 
            // search()-并返回子串的起始位置 和 replace()-替换 和 exec也常用
            const reg = /([^?&=]+)=/g       
// 先行断言 后行：后面的内容应匹配表达式 exp
        var reg1 = /(?=三).*(?=b)/
        console.log('123一二三abc'.match(reg1))
        // 返回三a

        console.log(reg1.exec(search))
        // reg.exec(search,(rs, $1, $2) => {
        //         console.log($1, "$1")
        //         console.log($2, "$2")
        //         console.log(rs, "rs")
        //         const name = decodeURIComponent($1)
        //         let val = decodeURIComponent($2)
        //         val = String(val)
        //         obj[name] = val
        //         return rs
        // })

        //这样子写可以得到第一个参数匹配的内容
        // replace的第一个参数是正则表达式，第二个参数有两种形式，第一种是string，那就是替换了
        // 第二种就是传入函数，rs是匹配的内容，$1是第一个括号匹配的内容，$2是第二个括号匹配的内容
        // 如果除了这两个参数外还有的话，那么就是offset（匹配到的索引）,str（原始字符串）
        // reg是正则表达式，传入
        search.replace(reg, (rs, $1, $2) => {
            console.log($1, "$1")
            console.log($2, "$2")

            const name = decodeURIComponent($1)
            let val = decodeURIComponent($2)
            val = String(val)
            obj[name] = val
            return rs
        })

        return obj
    }
	console.log("window.location", getQueryObject())
```

```js
2.1.40 正则中使用变量 
function count(str,all){
        let reg =new RegExp(`${str}`,"g")
        let temp = all.match(reg)
        return temp
    }
```



### 2.1.40 一些坑 | try catch  | settimeout | async |  赋值

```js
1.try catch的坑
1.1 setTimeout回调抛出的异常不能被try catch。 因为调用他的catch的settimeout入栈的时候，调用它的函数就是已经出栈了。简单地说setTimeout里的错误被异步抛出的

1.2 async函数里await发生的异常却可以try catch，

1.3 promise 第一层的错误不会冒泡出来，而是被 promise 吃掉了，只有通过 promise.catch 才可以捕获

然后在第二层也就是then里面可以
在第一层 return e 然后在第二层进行拿到值。根据这个东西我们可以解决 1.1的bug。包一层promise来捕获promise的错误

const p3 = () =>  new Promise((reslove, reject) => {
  setTimeout(() => {
    reject('async error');
  })
});

function main3() {
  p3().catch(e => console.log(e));
}
main3();

1.4 async 和 await 的捕获
这玩意能够直接直接捕获

2.从右到左
function display() {
  var a = b = 10;
}

display();  
/*
	function display() {
      a = 10  //严格模式下面会报错
      var a = 10 
    }
*/



```



### 2.1.41 json.stringify的三个参数

```js
第一个参数是 对象
第二个参数 的 要序列化的属性
第三个参数 是 缩进 字符数

删除对象属性最佳实践 |  delete 会让线性快属性变成慢属性的
let obj = {a:1,b:3,c:5}
let res = JSON.stringify(obj,(key,value)=>{
	if(key == 'b'){
		return undefined
	}
	return value
},2)
console.log(res)  // 这样子就是分两个格子输出

```










## 2.2 快问快答

```js
1.从哪里学习
开源项目排名，mdn，codepen
```



## 2.3 项目中js高级



### 2.3.1 js引入 css js

```js
//1.引入script
    const scriptInfo = document.createElement("script")
    scriptInfo.type = "text/javascript"
    // scriptInfo.setAttribute("data-callType","callScript")
    scriptInfo.src = "/js/1.js"
    document.head.appendChild(scriptInfo)

    //2.引入css
    setTimeout(() => {
        const cssInfo = document.createElement("link")
        cssInfo.rel = "stylesheet"
        cssInfo.type="text/css"
        cssInfo.href="/css/1.css"
        document.head.appendChild(cssInfo)
    }, 10);

    //删除
let callScript = document.querySelector("script[data-callType='callScript']")
document.head.removeChild(callScript)
```





### 2.3.2 禁止自动滑动

```js
 document.body.addEventListener('touchmove', function(e){
     e.preventDefault();
 }, { passive: false });  //passive 参数不能省略，用来兼容ios和android
```



### 2.3.3 canvas成图片

```js
//blob允许我们可以通过js直接操作二进制数据
      document.querySelector('.test').toBlob(function(blob) {
        var a = document.createElement("a");
        var body = document.getElementsByTagName("body");
        document.body.appendChild(a);
        a.download = "img" + ".jpg";
        a.href = window.URL.createObjectURL(blob);

        a.click();
        body.removeChild("a");
      });
```



### 2.3.4 iframe | postmessage

#### 2.3.4.1 利用iframe进行通讯



这里对src进行了一个参数的传参

```html
<h3>postmessage的协议测试：发送端</h3>
<iframe :src="'http://localhost:8082?getparam='+getparam" width="300px" height="300px" frameborder="0"></iframe>

```



```html
<h3>postmessage的协议测试：接收端</h3>
    {{receive}}
 this.receive=this.$route.query.getparam
```



#### 2.3.4.2 postMessage进行通讯



##### 子传父

例如子组件的按钮点击后传递给父组件

用vue用post有一个坑就是，他的webpack初始化的时候会先给自己发一个数据。导致data会是webpack报错。
如果说我们要实现postMessage只发一次，我们就要监听指定的窗口

子：

```js
//可以在method中，也可以在mount中
//最后一个是可以传过去的网址
parent.postMessage({msg:"这是发送过去的数据"}, '*')
```



父：

```js
//可以在method中，也可以在mount中
//http://localhost:8082是iframe的内容
// const publisher=window.open("http://localhost:8082/")
//父目前的情况
<iframe :src="'http://localhost:8082?getparam='+getparam" width="300px" height="300px" frameborder="0"></iframe>

//子传父的情况
window.addEventListener("message", (event)=>{
    var origin = event.origin;
    console.log(origin)
    // 通常，onmessage()事件处理程序应当首先检测其中的origin属性，忽略来自未知源的消息
    // 不然的话webpack会先给他发一个包
    if (origin !== "http://localhost:8082"){
       return;
    }
	console.log(event,"postmessage")
    //false就是冒泡事件，从里到外
}, false);

```







##### 父传子

父：

```js
 //html中的东西
<iframe
      :src="'http://localhost:8082?getparam=' + getparam"
      width="300px"
      height="300px"
      frameborder="0"
      id="iframeViewer"
    ></iframe>


const _iframe = document.getElementById("iframeViewer").contentWindow;
    const iframeViewer = document.getElementById("iframeViewer");
    let _obj = "父传子的数据";
    // _obj.type = "view";
    // _obj.currentProcessInstanceId =1;

    iframeViewer.onload = () => {
      console.log("iframeViewer已加载");
      _iframe.postMessage((_obj), "*");
    };



```



子：

```js
window.addEventListener("message", function (event) {
      if(event.origin=='http://localhost:8081'){
        console.log(event)
      }
});
```













## 2.4 webgl

### 2.4.1 webgl基础

```js
类型数据和array的联系:类型数组不等于array。类型数组提升了数组的性能。array的内部实现是链表，因此元素多的话性能会比较差(这里主要指的是访问)。类型数组是连续的内存实现的数据类型，通过加法可以实现访问，array则是一个个查找

类型数组:实现是缓冲(arraybuffer 内存中的二进制数据。可以简单地理解为数据)+视图(int8array u的意思是有符号的正数范围增大，没有负数 uint8array uint16array float32array将缓冲中的数据读取和访问出来，可以简单地理解为数据转化器)。缓存包括视图

类型数组常用方法:get(index) set(index，value) length 不支持push pop。唯一的创造方法是
let a=new int8array([1，1，1])
```



### 2.4.2 实操

总结起来四个步骤：

```js
1，initwebgl（初始化webgl） 
2，initshader(初始化着色器)
3，initbuffer（创造buffer对象）
4，draw
```



主要api：

webgl的移动主要是向量的知识
1，shadersource的第二个参数的字符串定义一下angle旋转角度
2，在initbuffer中对angle进行赋值。通过webgl.uniformif(angle，pi/180)

```js
1。初始化
第一步：查找元素
第二步:这个元素getcontext("canvas")，获取上下文 
第三步:初始化画布，xx.viewport(左上角的x坐标，y坐标，clientwidth，clientheight)


2.着色器(顶点着色器(计算坐标+一部分颜色)。片元着色器(最终颜色，纹理))
#创造shader
createshader
#链接shader。这里的第二个参数是void main开头的源码，还挺难的。有点像c的代码
shadersource
#编译shader
compileshader
#创造程序
createprogram
#shader绑定到程序里面
attachprogram
#webgl跟program链接
linkprogram
#使用program
useprogram




3，创造buffer(圈一块地)
#顶点数据
let a=new int8array([1，1，1])
然后这个画布.createbuffer()
#绑定缓冲区对象
这个画布.bindbuffer
#绑定缓冲区数据
这个画布.binddata
#允许传递，允许传递给shader(cpu渲染管线)。之后调用显卡
enableverrexattrbarray
#传递给位置变量 shader和js做通信
这个画布.vertexattribpointer


4，最后绘制就可以了
drawarray


```







接口：/wechat_api/auth/getOpenidStatus 

猜测原因：边界处理异常

```json
这个接口返回结果如下
let res = {
    WeiVi: "XJW ♥ ZJY 2021.10.27 - Forever.", 
 	code: 0, 
 	data: {}, 
 	msg: "尚未完善手机号注册"
}

前端在这个接口后面执行
if (res.code == 0){
        this.setData({
        openid: res.data.openid,
        newuser: true,
        token: res.data.token
	})
}

这导致后续/wechat_api/auth/openidRegister接口的openid和token参数传参为空。才报错参数有误后跳转回主界面

solution：
手机号注册没有完善的时候正常返回openid和token
或者
在openidRegister增加对于openid和token为空的处理
```





## 2.5 js工程化概述

```js
--1 工程化工具.js,rollup gulp
--2.模块化：es6 
--3.兼容：
--3.1 polyfill：
@babel/preset-env + corejs@3
--3.2 runtime：
@babel/preset-env + @babel/runtime-corejs3 + @babel/plugin-transform-runtime
```





### 2.5.1 polyfill 实操

#### 2.5.1.1 jsconfig.json

```js
{
    "target": "es2015", // 指定要使用的默认库，值为"es3","es5","es2015"...
    "compilerOptions": {
        "module": "commonjs", // 在生成模块代码时指定模块系统
        "experimentalDecorators": true,
        "compilerOptions": {
            "incremental": true, // TS编译器在第一次编译之后会生成一个存储编译信息的文件，第二次编译会在第一次的基础上进行增量编译，可以提高编译的速度
            "tsBuildInfoFile": "./buildFile", // 增量编译文件的存储位置
            "diagnostics": true, // 打印诊断信息 
            "target": "ES5", // 目标语言的版本
            "module": "CommonJS", // 生成代码的模板标准
            "outFile": "./app.js", // 将多个相互依赖的文件生成一个文件，可以用在AMD模块中，即开启时应设置"module": "AMD",
            "lib": ["DOM", "ES2015", "ScriptHost", "ES2019.Array"], // TS需要引用的库，即声明文件，es5 默认引用dom、es5、scripthost,如需要使用es的高级版本特性，通常都需要配置，如es8的数组新特性需要引入"ES2019.Array",
            "allowJS": true, // 允许编译器编译JS，JSX文件
            "checkJs": true, // 允许在JS文件中报错，通常与allowJS一起使用
            "outDir": "./dist", // 指定输出目录
            "rootDir": "./", // 指定输出文件目录(用于输出)，用于控制输出目录结构
            "declaration": true, // 生成声明文件，开启后会自动生成声明文件
            "declarationDir": "./file", // 指定生成声明文件存放目录
            "emitDeclarationOnly": true, // 只生成声明文件，而不会生成js文件
            "sourceMap": true, // 生成目标文件的sourceMap文件
            "inlineSourceMap": true, // 生成目标文件的inline SourceMap，inline SourceMap会包含在生成的js文件中
            "declarationMap": true, // 为声明文件生成sourceMap
            "typeRoots": [], // 声明文件目录，默认时node_modules/@types
            "types": [], // 加载的声明文件包
            "removeComments":true, // 删除注释 
            "noEmit": true, // 不输出文件,即编译后不会生成任何js文件
            "noEmitOnError": true, // 发送错误时不输出任何文件
            "noEmitHelpers": true, // 不生成helper函数，减小体积，需要额外安装，常配合importHelpers一起使用
            "importHelpers": true, // 通过tslib引入helper函数，文件必须是模块
            "downlevelIteration": true, // 降级遍历器实现，如果目标源是es3/5，那么遍历器会有降级的实现
            "strict": true, // 开启所有严格的类型检查
            "alwaysStrict": true, // 在代码中注入'use strict'
            "noImplicitAny": true, // 不允许隐式的any类型
            "strictNullChecks": true, // 不允许把null、undefined赋值给其他类型的变量
            "strictFunctionTypes": true, // 不允许函数参数双向协变
            "strictPropertyInitialization": true, // 类的实例属性必须初始化
            "strictBindCallApply": true, // 严格的bind/call/apply检查
            "noImplicitThis": true, // 不允许this有隐式的any类型
            "noUnusedLocals": true, // 检查只声明、未使用的局部变量(只提示不报错)
            "noUnusedParameters": true, // 检查未使用的函数参数(只提示不报错)
            "noFallthroughCasesInSwitch": true, // 防止switch语句贯穿(即如果没有break语句后面不会执行)
            "noImplicitReturns": true, //每个分支都会有返回值
            "esModuleInterop": true, // 允许export=导出，由import from 导入
            "allowUmdGlobalAccess": true, // 允许在模块中全局变量的方式访问umd模块
            "moduleResolution": "node", // 模块解析策略，ts默认用node的解析策略，即相对的方式导入
            "baseUrl": "./", // 解析非相对模块的基地址，默认是当前目录
            "paths": { // 路径映射，相对于baseUrl
              // 如使用jq时不想使用默认版本，而需要手动指定版本，可进行如下配置
              "jquery": ["node_modules/jquery/dist/jquery.min.js"]
            },
            "rootDirs": ["src","out"], // 将多个目录放在一个虚拟目录下，用于运行时，即编译后引入文件的位置可能发生变化，这也设置可以虚拟src和out在同一个目录下，不用再去改变路径也不会报错
            "listEmittedFiles": true, // 打印输出文件
            "listFiles": true// 打印编译的文件(包括引用的声明文件)
          }
     
    },
    "exclude": [ // 要排除的文件
        "node_modules",
        "**/node_modules/*"
    ],
    "checkJs": false, // 启用javascript文件的类型检查
    "baseUrl": "*", // 解析非相关模块名称的基础目录
    "paths": {
        "utils": [
            "src/utils/*"
        ] // 指定相对于baseUrl选项计算的路径映射，使用webpack别名，智能感知路径
    },
}
```









## 2.6 加载字体







## 2.7 tc39 会议

```js
--0.
ECMA：一个组织
TC39:ECMA下面的技术委员会
stage0（strawman）:任何TC39的成员都可以提交。
stage1（proposal），进入此阶段就意味着这一提案被认为是正式的了，需要对此提案的场景与API进行详尽的描述。
一共是0-4 . 5个阶段。 到达最后一个阶段就进行发布了
常用的 
--0.1 Top-level await（stage 4）：支持最顶层使用await
--0.2 Temporal（stage 3）：时间处理函数标准化 函数
--0.3（stage3） at ： 负索引
--0.4 Record & Tuple（stage2） ：Record类似于对象，Tuple类似于数组
--0.5 Decorators (stage 2)：装饰器
--0.6 Set Methods (stage 2)：基于交集/并集/差集创建新的Set的方法
--0.7 orient-error编程的一系列接口
--0.8 Pipeline Operator：管道操作符（|>） 如doubleNumber(number)会变为number |> doubleNumber的形式

1.作用域又叫做执行上下文，全局上下文就是window对象
2.6个基础数据类型:undefine number string boolean symbol  null。

2023/1
1.temporal时区的国际化支持
2.原型怎么用symbol防止污染
3.weakmap的key将支持用symbol表示
4.await置于顶层的推进，await将引入promise的一些特性方案的推进

2023/1之前

--0.1 Top-level await（stage 4）：支持最顶层使用await
--0.2 Temporal（stage 3）：时间处理函数标准化 函数
--0.3（stage3） at ： 负索引
--0.4 Record & Tuple（stage2） ：Record类似于对象，Tuple类似于数组
--0.5 Decorators (stage 2)：装饰器
--0.6 Set Methods (stage 2)：基于交集/并集/差集创建新的Set的方法
--0.7 orient-error编程的一系列接口
--0.8 Pipeline Operator：管道操作符（|>） 如doubleNumber(number)会变为number |> doubleNumber的形式

--0.9.throw Expressions (stage 2)
let x = throw new Error("Unsupported encoding");

--0.10.Promise.try  可以更加精确的捕获同步错误。
里面抛出的错误能够被捕获
function getUserNameById(id) {
    return Promise.try(function() {
        if (typeof id !== "number") {
            throw new Error("id must be a number");
        }
        return db.getUserById(id);
    }).then((user)=>{
        return user.name
});
}
--0.11.Error Cause

就是throw new Error('Upload job result failed', { cause: err });
然后 是使用 。相当于他会帮你自定义一个类型出来
try {
  await doJob();
} catch (e) {
  console.log(e);
  console.log('Caused by', e.cause);
}
// Error: Upload job result failed
// Caused by TypeError: Failed to fetch
```



## 2.8 项目中的

### 2.8.1  v-for

```js
var str1 = '';//自定义字符串,用于拼接标签
var data = {
    "textArr":[
        {"grade":'一等品',"mix":'20%',"number":'200'},
        {"grade":'准一等品',"mix":'20%',"number":'200'},
    ],
};
for(let i=0;i<data.textArr.length; i++){
    str1 += `<h1>${data.textArr[i].grade}</h1>`
}
document.getElementById("container").innerHTML = str1
```



### 2.8.2 懒加载  | IntersectionObserver

```js
insertsectionobsserver：减少reflow

const io = new IntersectionObserver(ioes => {
  ioes.forEach(ioe => {
    const el = ioe.target;
    const intersectionRatio = ioe.intersectionRatio;
    if (intersectionRatio > 0 && intersectionRatio <= 1) {
      console.log("能看见元素")
    }else{
        console.log("看不见")
    }
    el.onload = el.onerror = () => io.unobserve(el);
  });
});
const imgs = Array.from(document.querySelectorAll('#user-content--getboundingclientrect'));
imgs.forEach(item => io.observe(item))

```

