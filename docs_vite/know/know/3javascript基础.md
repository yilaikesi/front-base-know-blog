# 2.1 JavaScript基础  | v8

[[toc]]

## 2.1 后续



### 2.1.39 DOM0 | DOM2 | DOM3

```
DOM0 : 行内元素
DOM2 :addeventlistener 的 click事件
DOM3 : 滚动 鼠标 焦点事件 合成事件（这玩意是输入耶）之类的
```



### 2.1.40 lut 引入 | canvas 的学习

```js
--1.基本概念
lut 是 look up table 的缩写
canvas 是 用rgba 来进行描述 图像处理 的
因此 lut 其实 是一种 颜色的映射关系(255,255,255,100)

 一般会对[0,255]的取值进行采样, 得到一份采样之后的数据. 常见的采样一般是64 * 64 * 64或者33 * 33 * 33.cube 文件中就有一个size字段描述采样。里面的参数都从255 压缩到 1之内


// size  size 是 64，table 是 64 *64 *3 

 
// cube文件通过得到我们想要的数据（聚类，合成64 * 64 *3）
 gettable 得到 table先
 const [r, g, b] = lut3d([vr, vg, vb], table, size);
注意：在canvas drawImage 之后，canvas.data 就有了4个值分别是rgba，然后我们通过遍历canvas 的length 将r g a b 分离，然后执行工具方法
 
// lub3d 中 首先 找blue，然后是 red 最后是 green 的索引.这里是高位查表 用 最大索引值 * r/g/b ，分别用floor 和 min 来承载.最后的最后 低位插值，用下面的函数分别对r/g/b的最大 最小 进行处理

function mix(small,high,b){
   const ？ = b - Math.floor(b);
 	return Math.floor((small * (1 - ？) + high * ？) * 255); 
}

最后canvas.data[0] = r
canvas.data[1] = g
类似这样子就行了，替换成功
 
 
第一步：高位查表
首先根据blue 通道的颜色，确定我们需要的色值在哪一个方块
例如将某一个通道除以255得到一个0-1之间的数字。例如0.08*(size-1) 得出 大小拿到整数.拿到整数之后计算索引
Index = red + green * 65 + blue * 65 * 65。 跟我上面的构成table 其实是一样的，第一步查找blue 然后是green 最后是 red

第二步：低位插值
采用三线性插值的方法

// 这里的 x,y,z 都是最小点
var p1 = [x,y,z];
// a，b，c是最大点
var p2 = [a,b,c];

sama

 
2.pr 中可以 效果中查找lumetri 颜色 然后 导入 cube 文件
也可以在这里 不导入 调整好后 直接导出
```



```html
// 示例
<!DOCTYPE html>
<html>

<head>
    <title>LUT</title>
    <script type="text/javascript" src="https://cdn.bootcss.com/axios/0.18.0/axios.min.js"></script>
    <style type="text/css">
        canvas {
            width: 600px;
        }
    </style>
</head>

<body>
    <video src="" style="width:200px;height:200px"></video>
    <script>

// function cameraStart() {
//             let isFront = false;

//             let config = {
//                 audio: false, video: true, video: {
//                     width: 700,
//                     height: 500,
//                     // 前后置摄像头
//                     facingMode: isFront ? "user" : "environment",
//                     // 帧率设置. 字面意思，一个是理想的状态下面，一个是最大的帧率
//                     frameRate: { ideal: 30, max: 30 }
//                 },
//             };
//             let video = document.querySelector("video");
//             function successCallback(stream) {
//                 // 将返回的流提供给控制台进行检查
//                 window.stream = stream;
//                 console.log(stream)
//                 video.srcObject = stream;
//                 // 播放
//                 video.play();
//             }
//             function errorCallback(error) {
//                 console.log("navigator.getUserMedia error: ", error);
//             }
//             // 传入3个参数，第一个是配置，第二个是成功的回调
//             // 这个更加规范了，多加了一个mediaDevices。window.navigator.getUserMedia(config, successCallback, errorCallback);
//             navigator.mediaDevices.getUserMedia(config)
//                 .then(function (stream) {
//                     successCallback(stream)
//                 })
//                 .catch(function (err) {
//                     errorCallback(err)
//                 });

//         }
//         // 调用
//         cameraStart()

        function getTable(url) {
            return axios(url, {
                method: 'GET',
            })
                .then(res => {
                    const tableString = res.data;
                    // 按行分割字符串
                    const tempArr = tableString.split('\n');
                    let lut_3d_size = 0;
                    let start = -1;

                    const table = [], resTable = []

                    for (let i = 0; i < tempArr.length; i++) {
                        const str = tempArr[i];
                        // 获取采样数量
                        if (str.includes('LUT_3D_SIZE')) {
                            lut_3d_size = +str.replace('LUT_3D_SIZE', '');
                            continue;
                        }

                        // 将空节点与文件头过滤掉
                        if (!str || /[a-z]/i.test(str)) continue;

                        // 得到色彩数据开始的索引
                        if (start === -1) {
                            start = i;
                        }

                        // 计算色彩数据真实的索引  重要：这里难理解但是还好，就是说没有索引是注释的序号的
                        const idx = i - start;

                        // 分割rgb的值
                        const pixel = str.split(' ').map(s => Number(s)); //[ 3个值 ]
                        console.log("idx / lut_3d_size",idx , lut_3d_size) 
                        // 根据table的排列规律，创建二维数组(65 * 65 * 65),这里我们根据从文件中实际获取到的采样数来计算
                        if (!table[Math.floor(idx / lut_3d_size)]) table[Math.floor(idx / lut_3d_size)] = [];
                        // 重要：第一次拿到值
                        table[Math.floor(idx / lut_3d_size)].push(pixel);
                    }

                    for (let idx = 0; idx < table.length; idx++) {
                        const piece = table[idx]; // [ 65个值 ]
                        // console.log("piece",piece)
                        if (!resTable[Math.floor(idx / lut_3d_size)]) resTable[Math.floor(idx / lut_3d_size)] = [];
                        resTable[Math.floor(idx / lut_3d_size)].push(piece);
                    }
                    console.log("result:", {
                        table: resTable, //64 * 63 *3
                        size: lut_3d_size
                    })
                    return {
                        table: resTable,
                        size: lut_3d_size
                    }

                })
                .catch(err => {
                    console.error(err)
                })
        }



        function mix(x, y, b) {
  const a = b - Math.floor(b);
  return Math.floor((x * (1 - a) + y * a) * 255);
}
        



function lut3d(targetColor, table, lut3dSize) {
  const [r, g, b] = targetColor || [];

  const tr = r / 255;
  const tg = g / 255;
  const tb = b / 255;

  // 计算最大索引值
  const n = lut3dSize - 1;
  // 计算blue索引
  const b_index = tb * n;
  // 计算red索引
  const r_index = Math.floor(tr * n);
  // 计算green索引
  const g_index = Math.floor(tg * n);

  // 计算blue的离散索引
  const b_floor_idx = Math.floor(b_index);
  const b_ceil_idx = Math.ceil(b_index);

  // 找到blue所在的数据
  const b_ceil = table[b_ceil_idx];
  const b_floor = table[b_floor_idx];

  // 找到green所在的数据
  const g_ceil = b_ceil[g_index];
  const g_floor = b_floor[g_index];

  // 找到red所在的数据， red对应的点，为将要替换的rgb目标数据
  const r_ceil = g_ceil[r_index];
  const r_floor = g_floor[r_index];

  return [
    mix(r_ceil[0], r_floor[0], tb),
    mix(r_ceil[1], r_floor[1], tb),
    mix(r_ceil[2], r_floor[2], tb),
  ]
}




// 重要：上面的是工具方法，下面的才是主要逻辑

        const video_url = 'origin.mp4';

        const test_cube_file = 'Cinematic 04__OXYGENART.cube';


    getTable(test_cube_file).then((res) => {
      const { table, size } = res;
      console.log(res)
      const canvas = document.createElement("canvas");
      const video = document.createElement("video");
      const play_button = document.createElement("button");

      play_button.innerHTML = '播放';

      canvas.style.cssText = `
      position:absolute;
      top:50%;
      left:50%;
      transform:translate(-110%,-50%);
      border:1px solid #333;
      z-index:9999999;
    `;

      video.style.cssText = `
      position:absolute;
      top:50%;
      left:50%;
      transform:translate(10%,-50%);
      border:1px solid #333;
      z-index:9999999;
    `
      play_button.style.cssText = `
      position:absolute;
      top:50%;
      left:50%;
      transform:translate(-50%,-50%);
      border:1px solid #333;
      z-index:9999999;
    `
      const ctx = canvas.getContext("2d");

      video.crossOrigin = 'anonymous';
      video.src = video_url;
        // video.autoplay = true
      video.oncanplaythrough = () => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        video.loop = true;

        checkVideo();
      }
      
      function checkVideo() {
        
        ctx?.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        const video_image_data = ctx?.getImageData(0, 0, canvas.width, canvas.height);
        const imageData = new ImageData(video_image_data.width, video_image_data.height)
        const video_pixel_data = video_image_data.data;

        for (let i = 0; i < imageData.data.length; i += 4) {
          // 基底素材的pixel
          const vr = video_pixel_data[i];
          const vg = video_pixel_data[i + 1];
          const vb = video_pixel_data[i + 2];
          const va = video_pixel_data[i + 3];

        //   当前
          const [r, g, b] = lut3d([vr, vg, vb], table, size);

          imageData.data[i] = r
          imageData.data[i + 1] = g
          imageData.data[i + 2] = b
          imageData.data[i + 3] = va;
        }

        ctx?.putImageData(imageData, 0, 0);
        window.requestAnimationFrame(checkVideo)
      }



      play_button.onclick = () => {
        video.play();
      }


      document.body.appendChild(canvas);
      document.body.appendChild(video);
      document.body.appendChild(play_button);

    });






    </script>
</body>

</html>
```





### 2.1.41 数组分块

```js
let chunk = (arr,count) =>{
    let res =[]
    while(arr.length){
        res.push(arr.splice(0,count))
    }
    return res
}

let test = [ 1,5,6,9,7,5,2]
console.log(chunk(test,2))
```



### 2.1.42 Beacon API(异步发送数据)

```js
过去，许多网站使用 unload 或 beforeunload 事件以在会话结束时发送统计数据。然而这是不可靠的，在许多情况下（尤其是移动设备）浏览器不会产生 unload、beforeunload 或 pagehide 事件

//数据埋点接收数据后端示例：https://gitee.com/Electrolux/mock-receive-server
--1.只能post请求
--2.最大  65536 字符。
let data ={id:1,name:"ceshi"}
//window.navigator.sendBeacon('http://localhost:8088/post', data);
document.addEventListener('visibilitychange', function logData() {
  if (document.visibilityState === 'hidden') {
    navigator.sendBeacon('http://localhost:8088/post', data);
  }
});
// 
var data = JSON.stringify({
  name: 'Berwin'
});

window.navigator.sendBeacon('http://localhost:8088/post',data);
```



```
let formData = new FormData();
formData.append('text', '测试');
navigator.sendBeacon("", formData);
```











### 2.1.46  esc  | 上下文  |  作用域链（scope），AO/VO，this 

this有**默认**，**隐式**，显式（bind，call），new

```js
--0.上下文和作用域链的主要区别是 
--0.1 作用域是静态的，上下文是js开始执行创造的（有栈的操作）
--0.2 上下文是作用域的有作用域的差别




--1.上下文：执行环境
--1.1 全局执行上下文 ： 不在任何函数中的代码都位于全局执行上下文中
--1.2 函数执行上下文
--1.3 eval
1.3 生命周期：
--1.3.1 创建阶段 （三件事）
创建变量对象：首先初始化函数的参数 arguments（VO的开始 value还没有赋值。 然后进入执行阶段会变成AO-活动对象），提升函数声明和变量声明
创造作用域链：找到最近变量就停止
确定this
--1.3.2 执行阶段（三件事）
 变量赋值
 函数引用
 执行代码
--1.3.3回收阶段
函数执行完毕后出栈，对应的执行上下文也出栈

1.4 注意：
--1.4.1 全局执行上下文在代码开始执行时就创建，有且只有一个，永远在执行上下文栈的栈底，浏览器窗口关闭时它才出栈
--1.4.2 函数调用的时候入栈出栈



--2.作用域：
--2.1 全局作用域
--2.2 函数作用域
--2.3 块级作用域


--3.VO过程
--3.1 创造arguments对象
--3.2 检查function
--3.3 检查 var ：如果 var 定义变量的时候发现已有同名函数定义则跳过变量定义

function a(){};function a(){}  这样不会报错，并且执行会执行最后一个
function a(){};let a = 56 会报错
function a(){}


“算了我以一个函数来说把，主要是创建和执行。假设有一个A函数，过程是这样的创建全局执行上下文、压入esc、全局上下文初始化、执行A函数、创建A函数执行上下文，压入esc，A函数上下文初始化，这个初始化过程是这样的：创建作用域链、emm我上面提漏了一个A函数被创建全局上下文被保存到scope中的过程，是复制scpoe创建作用域链,用arguments创建活动对象，初始化活动对于，将活动对象压入链顶，执行完毕，上下文弹出。”

“但是全局上下文一直在栈底，而VO和AO的确认，我感觉是取决是是否可访问的。”

“而闭包就是上下文链中上下文scope被销毁了，但因为保持了对scope中某个变量的引用，这应该就是你上面说的回收原理的根节点实现的这个东西把，导致没销毁干净，留存在了内存中，完成了闭包”


--4. 题目（vo声明，执行上下文）
注意：函数声明提升更加靠前
--4.1 let 不能变量提升
foo();
let foo = function foo() {
    console.log('foo1');
}
function foo() {
    console.log('foo2');
}
foo();  //直接报错

--4.2 如果 var 定义变量的时候发现已有同名函数定义则跳过变量定义，不做变量提升
foo();
var foo = function foo() {
    console.log('foo1');
}
function foo() {
    console.log('foo2');
}
foo();  //foo2 foo1


--4.3 跟上面一样
foo();
function foo() {
    console.log('foo2');
}
var foo = function foo() {
    console.log('foo1');
}

foo();  //foo2 foo1



--4.3  只有var 的变量提升
var foo2 = 10;
function foo() {
    console.log(foo2);
    var foo2 = 10;
    console.log(foo2);
}
foo() // undefine,10

--4.4  变量没有提升，这里是考察作用域
var foo = 1;
function bar () {
    console.log(foo);
    foo = 2;
}
bar();
console.log(foo);

```



### 2.1.46 递归 和 栈溢出优化 | 尾递归优化（淦）

```js
尾递归优化：防止全局上下文的爆栈，函数的最后一步是返回一个函数的运行结果

function recursion (num) {
 if (num === 0) return num;
 return recursion(num - 1) + num;
}   
优化后
function recursion (num, sum = 0) {
 if (num === 0) return sum;
 return recursion(num - 1, sum + num);
}  //也是报错
recursion(10000) // => 50005000

尾调用由于是函数的最后一步操作，所以不需要保留外层函数的相关信息，因为调用位置、内部变量等信息都不会再用到了，只要直接用内层函数的调用记录，取代外层函数的调用记录就可以了，这样一来，运行尾递归函数时，执行栈永远只会新增一个上下文。

其实，尾递归优化这种东西，现在没有任何一个浏览器是支持的（据说 Safari 13 是支持的）
```





### 2.1.48 拖拽事件

```js
拖动的元素事件：(drag ， dragstart  ，和dragend)
拖动的目标事件（容器）：ondrop，ondropenter/over/leave/。

拖动元素的属性要用dataTransfer对象来获取值。


1.拖拽单文件事件
 <div draggable="true" id="box"></div> 
box.ondragend = function (e) {
    //拖拽到哪里就放到哪里
    box.style.cssText = 'top:' + (e.clientY) + 'px;left:' + (e.clientX) + 'px'
}

————————————————————————————
2.拖拽多文件事件
 <div draggable="true" id="box"></div> 
box.ondragend((e)=>{
	let dataFiles = e.dataTransfer.files
	dataFiles.forEach((file)=>{
		let fileR = new FileReader()
		fileR.readAsDataURL(file)
		fileR.onload((value)=>{
			//这里就可以自由发挥了
			console.log(value)
		})
		console.log()
	})
})

<input type="file" id="type">
document.querySelector("#type").onChange((e)=>{
  console.log(e.target.files) //e.files也是有可能的
})


————————————————————————

3. 拖拽div区域

<div id="type">
//经过，只有是设置了阻止默认事件才能够解锁松开鼠标ondrop
document.querySelector("#type").ondragover((e)=>{
  e.preventDefault()
})

//放下
document.querySelector("#type").ondrag((e)=>{
  e.preventDefault()
  console.log(e.dataTransfer.files)
})

//设定拖动影子的样式
e. dataTransfer.setDragImage(img,100,100)
```



### 2.1.49 js 逆向

```
防护系统：一抓包就闪退+白屏+通过用户证书直接可以用

小黄鸟不可用的原因
用户证书（安卓7之前手机相信这个） ｜ 手机只相信系统证书（ca机构）。所以我们如果没有root，那么小黄鸟就不能抓包了

解决方法：套一层虚拟机，然后用小黄鸟去监听虚拟机
```



#### 2.1.49.1 网页工具



```js
1.2.0 element

element的event listener中 。勾上 ancestor all 就可以看到全局的事件，反之只能够看到当前的事件

1.2.1 network

大界面打开一个preserve 和 disable cache

preserve log （打开的：界面打开一个新界面不会清除调试输出）
disable cache（打开的：就不会执行304，全部会重新进行请求。返回的都会变成200）
逆向中全部勾上就可以了

里面的表头 initator 可以查看调用栈 ｜ 有的是浏览器自己开启的
里面表头 的waterfall 是可以查看 调用的顺序

1.2.2 source  

资源面板：右上角三个小点打开，有一个搜索界面，点击这个在下方能够添加别的一些界面（console 之类的）。中间下面会有一段小小的格式化，中间偏右 那里

1.2.2.1左边的小面板：


1.page：所有的资源文件都在里面-（平常我们不会去用它）

2.fileSystem：关联子目录

3.overrides：重写（可以对当前网站的js进行替换）。勾选上允许重写后（关联子目录后）。我们可以找到network的js里面，右键然后open in source panel 或者是 save for overrides-有的网站兼容模式下面运行，那么overrides就不会执行。所以我们会用到极速模式来进行执行

4.content script：上下文的脚本

5.snippets 
默认是都会执行的脚本（任何事件，任何网址）


1.2.2.2右边的小面板：

勾上最后一个的pause on caught exceptioj

第一个是 奔向下一个断点
第二个是 一个一个方法的进行执行 （可以找出其中方法逻辑）
第三个是 在这个语句里面一条条 代码块运行（）
第四个是 返回到这个方法调用的位置
第五个是 跟第三个一样的，只是会在文件的开头开始运行
第六个是 可以让所有断点都失效
最后一个 don‘t pause on excetion 变蓝。把pause on caught exception 勾上。这样就可以避免try catch 进入catch而会直接报错。（要勾上）
下面的watch 可以监听，类似于console这个变量

断点可以右键移除和添加

1.2.2.3 console面板

左上角可以show console sidebar：可以区分重要性
然后fliter输入框可以写正则。然后可以。用类似于url:www.Baird.com来进行过滤


勾上preserve log 和group similar 和 log xmlhttprequests
evaluate triggers users activation, autocomplete from history, eagar evalution

hide network ：隐藏404之类的东西
preserve log ： 是否清除缓存。（勾上就不清除缓存了）
group similar：分组（相同的会放在一起，不会展开）
eagar evalution：可以预览结果
autocomplete from history ：自动补全
evaluate triggers users activation ：一些api无法靠js触发。例如有声影片自动播放开启popup（弹窗），下载档案。这里我们之所以能够用window.open打开是因为这个选项打开从而保持user activation。如果我们延迟5s弹出，那么就会弹出user activation警告
log xmlhttpprerequest ： 打印http请求（promise例如 fetch(“xx”)）


1.2.3 application

这里面其实存储和缓存会比较多。简单
但是要注意这里我们说的清除缓存只是清除浏览器的缓存，但是变量的缓存是清除不掉的。例如 window.a 清除不掉


```





#### 2.1.49.2  网页工具断点

```js
本地进行js 请求，对js请求进行修改，能修改
批量监听
更智能的监听

1.3.1 断点

DOM 断点：什么时候渲染的数据（渲染页面改变出来某一个数据）-无法根据栈快速定位-我们可以通过element 的鼠标 右键 直接在 element上面 直接添加breakpoint

DOM事件断点：什么时候进行的事件（点击事件的断点）-跟上一个差不多。我们可以在element中 eventlistener 中不选择 ancestor all 然后就可以定位到代码的位置 然后就可以手动下断

XHR 断点 ： 进行事件请求的断点 （）- 距离加密（逆向的目标）函数比较近，可以直接看到栈调用-具体来说是我们从后往前复制公用的部分。然后我们在source中的xhr中 add url我们 添加  公用的部分就可以打断点了（数字广东的朋友问过我这个问题）

代码行断点 ：手动断点-代码前点一下就会变成绿色

代码断点 ：debugger

全局事件断点：浏览器事件断点（source的 最右边进行断点操作）

异常捕获断点：source的最右边点击蓝色 然后 pause on caught exception勾上。不想断的地方右键选择这个断点然后edit 填入false

debugger

1.3.2 方法栈 ｜ 跟值

这里是基于xhr ，我们在 source中 找到xhr 事件，然后我们找到request url，找到xhr

首先的跟值就是 点一下ctrl 我们就可以找到这个函数的结构（直到没有智能提示我们就可以确定这个是函数的开始）。找到xhr中的open函数


```



### 2.1.50 错误处理

```js
--1.throw Expressions (stage 2)
let x = throw new Error("Unsupported encoding");

--2.Promise.try  可以更加精确的捕获同步错误。
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
--3.Error Cause

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





### 2.1.51 keep alive 原理

不会生成真正的DOM节点，并且能够缓存组件

最简单就是使用display:none来将 这个dom隐藏。但是这种方法并没有做到dom真正的移除，又让组件没有被销毁

```js
要实现这个我们必须要依赖虚拟dom，也就是说我们要手写框架？

document.createElement 在内存中创建一个元素，然后再通过 React.createPoral 把 React 子节点渲染到这个元素上。如果不满足的我们会用ref来移除这个元素

在react中 我们可以用 portal 和ref 来进行控制，具体代码如下

export const Conditional = props => {
  const [targetElement] = useState(() => document.createElement('div'))
  const containerRef = useRef()
  useLayoutEffect(() => {
    if (props.active) {
      containerRef.current.appendChild(targetElement)
    } else {
      try {
        containerRef.current.removeChild(targetElement)
      } catch (e) {}
    }
  }, [props.active])
  return (
    <>
      <div ref={containerRef} />
      {ReactDOM.createPortal(props.children, targetElement)}
    </>
  )
}

<Conditional active={!shouldHide}>
  <Foo/>
</Conditional>

缺点：需要手动控制 active ，不能直接基于子组件销毁/创建的生命周期事件

缺少失活/激活的生命周期时间，子组件无法感知自己是不是被缓存起来了

依赖了 ReactDOM ，对 SSR 不够友好
```

### 2.1.52  并发 | idle

```js
js并发：
1.nginx里面合并前端请求 nginx-http-concat。或者阿里的tengine，它也能够合并前端请求
2.缓存 
3.请求数，资源供给，请求分流 
4.压缩传输 
5.读写分离
6.promise.all([两个或者三个请求],[两个或者三个请求])
7. createDocumentFragment | async 和 defer | temple
8. requestIdleCallback：
16ms之后requestIdleCallback 里注册的任务。
```

### 2.1.53 有DTD document.documentElement | 无document.body



### 2.1.54 栈(容器)  | 堆(房间) |  闭包原理 | 最大堆 | 最小堆

https://www.zhihu.com/question/482433315/answer/2083349992

```js

堆类似于树，最大堆就是顶点是最大的。最小堆就是顶点是最小的

--1.定义
v8默认的栈区大小为984KB
注意：在不同时期，不同操作系统中V8对于字符串大小的限制并不相同。大概有个范围是256MiB ～ 1GiB

栈像个容器，容量小速度快(基本类型)
堆像个房间，容量较大(引用类型),但是引用类型的引用（变量）还是存在栈内存中的

通过引用到堆中查找实际对象

--2.为什么 引用对象放在堆里面。基本数据类型放在栈里面？
栈是占用固定空间，先进后出。在变量使用完成后就可以将其释放，内存回收容易实现。
堆是动态分配内存。先进先出。只有引用他的变量不存在的时候才会被垃圾机制回收

--3.既然引用对象放在堆里面。基本数据类型放在栈里面？那么针对于太大的基本字符串，js引擎会怎么做？

在栈内存不下，只能存在字符串常量池中，如果是 let a = "78" 的形式.那么就是在栈中 的变量进行引用。如果是 let a =new String("78") 那么就会在堆中进行引用

注意一下特例：字符串的缓存：v8内部有一个名为stringTable的hashmap会缓存所有字符串。会根据其特征换算为一个hash值，通过hash的key比对来实现缓存。如果不存在我们才会存到长两次然后把地址付给变量。这也是V8中的字符串都是不可变的原因

字符串拼接做了哪些操作？
这里如果内容相同，地址就会不一样。这一点注意一下

--4.数字的分配和内存改变的机制：
42 会被当成Smi
数字在V8中分为 smi 和 heapNumber：heapNumber 类似字符串 不可变

--5.总结
数字： 小整数存在栈中，其他类型存在堆中。
字符串： 存在堆里，栈中为引用地址，如果存在相同字符串，则引用地址相同。
boolean 在栈中


js engine 是c 开发的。栈区（stack） 由编译器自动分配释放。堆区（heap）一般由程序员分配释放，使用 malloc 或 new 等。偏偏 不再经过 C/C++ 编译器编译，具体 JS 变量类型，也被拆分为具体实现 Engine 的Native Code 变量类型


```







```js
闭包原理
--1.外层函数作用于对象能保留下来是因为被内层函数对象的作用域引用者，无法释放。

--2.能访问上级函数作用域中的变量（哪怕上级函数上下文已经销毁）
```





















### 2.1.57 fragment

```js
可以把他当作一个虚拟dom。
const fragment = document.createDocumentFragment()
let temp  = document.createElement("div").innrtHTML = 56
fragment.appendChild(fragment)
document.body.append(fragment)

```



### 2.1.58 浏览器一帧内做了什么

```js
input events(click 之类的)
js
begin frame
RAF（RequestAnimationFrame）
layout
paint
RIC (RequestIdelCallback)：这一个只有一帧小于16ms 才会执行

```





### 2.1.59 settimeout 和 setinterval的第三个参数



```js
//第三个以后的参数是作为第一个func()的参数传进去。
for ( var i=1; i<=5; i++) {
	    setTimeout((j)=> {
	        console.log( j );
	    }, i*1000 ,i);
}

这样写就错了
```





### 2.1.60 锚点导航 | scrollIntoView



```js
document.querySelector("#comment > div > div.comment > div > div.comment-list > div:nth-child(2) > div.con > p").scrollIntoView({
    behavior:"smooth",// 平滑过渡
    block:"start", //垂直方向的对齐
    inline:"start"
})
```



### 2.1.61 控制光标位置 |  setSelectionRange

```js
<input type="text" name="" id="text" placeholder="请输入">
    <script>
        document.querySelector("#text").focus()
        document.querySelector("#text").setSelectionRange(0,0)
    </script>
```





### 2.1.62 画中画  |   PictureInPicture

```js
document.querySelector(".xx").addEventListener('enterpirtureinpirture',()=>{
    
})

document.querySelector(".xx").addEventListener('leavepirtureinpirture',()=>{
    
})

if(document.querySelector(".xx")!==pictureInPictureElement){
    await  document.querySelector(".xx").requestPictureInPicture((res)=>{})
}
```





### 2.1.63 xhr 发送 | new open send onreadystatechange

```js
let ajax = (data,url)=>{
    //step1 : 设置请求头
    let xhr = new XMLHttpRequest(); 
    //step2：设置请求方式和请求头 //true表示异步
	xhr.open("POST", url, true);   
    xhr.setRequestHeader("Content-type", "application/json");
    //step3：请求数据
    xhr.send(data);
     // step4：readyState是xhr的请求状态
     //状态4表示已发送请求，服务器已完成返回响应，浏览器已完成了下载响应内容。0-4都有值的
    xhr.onreadystatechange = function() {
     
      if (xhr.readyState === 4 && xhr.status === 200) {
          console.log(xhr.responseText);
      }
  };
}



```



### 2.1.64 prototype | 函数扩展 | 可以扩展字符串

```js
let arr = [ 9,3,11,6]
Array.prototype.max =function (param){
    console.log(this) //[ 9,3,11,6]
    return this.sort()[0]
}
arr.max()
```



### 2.1.65 数据埋点 | 用户 | 性能(白屏 渲染时间)

```js
--1.数据监控
--1.1 PV
--1.2 监听页面进入（load） 和 页面离开（pagehide 和 hashchange）。window.addEventListener('hashchange')
--1.3 用户行为

--2.性能监控
--2.1 首屏加载时间
--2.2 白屏时间
--2.3 页面渲染时间
--2.4 页面交互动画完成时间
--2.5 静态资源整体下载时间
--2.6 http 请求

--3.异常监控
--3.1 Javascript的异常监控
--3.2 样式丢失的异常监控
```

### 2.1.66 剪切板

```js
--1.
navigator.clipboard.writeText("dsa")
    .then(() => alert("复制成功！"));
    //如果我们想直接使用会报错
--2.
创造一个文本域
oInput.select();
    //对选择对象的值进行复制到浏览器中
    document.execCommand("Copy");
```







### 2.1.67 事件冒泡

指的是在设置了事件监听器时候，会顺着dom树的结构，向上执行

```html
<div id="div1">
  div1
  <div id="div2">
    div2
    <div id="div3">div3</div>
  </div>
</div>;

// javascript:
<body>
function handleClick(event) {
  console.log(event.currentTarget.id);
}
for (let i = 1; i <= 3; i++) {
  let div = document.getElementById(`div${i}`);
  div.addEventListener("click", handleClick);
}
</body>
    
<!-- 我们再点击在里面的div3的时候，会输出div3 div2 div1-->
 <!-- 如果说要避免这一个情况可以


function handleClick(event) {
  event.stopPropagation();
  console.log(event.currentTarget.id);
}

-->
event.stopPropagation(); 
```









### 2.1.69 length  | bug | 码元是小一点 | substring bug

```js
一些 emoji 的东西的length 可能会有一点不一样

原因在于 length 的 码点 和 码元

我们将一个16/32位的二进制编码 叫做一个码元，一个码点 可以是 一个码元 也可以是两个码元. length 属性 返回的是 码元（小）

正确的方式是Array.from("xx").length
```



### 2.1.70 class 内 | 私有字段 | 静态变量 | 类静态初始化

```js
--1.私有字段
以前是加一个_
_myName(){

}

现在可以命名成
#myName(){

}
在外面就不可以直接调用


--2.static 的 作用
class Person {
  /* 1.1、实例属性，直接定义的属性，要new实例后，实例去访问的*/
  name= "tom";
  /* 1.2、静态属性（类属性），通过static开头的属性，Person类可以访问,
    不需要创建实例，实例访问不到static */
  static height = 180;
  /* 1.3、只读属性，readonly开头的属性，只可读，不可改 ts才能用 */ 
  //readonly money= 1000;
  /* 1.4、方法，readonly开头的属性，只可读，不可改*/
  say(){
      console.log('hello world');    
  }
  static work(){
      console.log('我能挣钱');    
  }
}

console.log(new Person().height)
--3.类静态初始化

例如
class person {
    static age =1.2
}
可以变成
class person {
    static{
        this.age = 1.2
    }
}
```



### 2.1.71 worker | 优化

```js
worker.js中 
接收 worker 并且进行 事件逻辑处理

onmessage = function (e) {
    let sortData = e.data.sort((a,b)=>{
        return a-b
    })
    postMessage(sortData)
}

index.html 中
let worker = new Worker("worker.js")
let arr = [1,3,4,34,2]

worker.postMessage(arr)
worker.onmessage= function (e){
    console.log(e.data)
}


```



## 2.2 express 转发请求 解决跨域



## 2.3  v8

### 2.3.1   垃圾回收

```js
--1.简单说一下原理
首先js因为是单线程，垃圾回收会占用主线程，导致页面卡顿，所以需要一个算法或者说策略

而v8采用的是分代式回收，回收主要表现在新老生代上，新生代就活得短一点的对象，老生代就活得长一点的对象。
“在新生代里有一个算法，将新生代分成了两个区，一个form,一个to，每次经过Scavenge会将form区中的没引用的销毁，然后活着的to区调换到form，反复如此，当经过一次acavange后就会晋升的老生代还有个条件就是TO区的内存超过25也会晋升。”
“而老生代，采用标记清除和标记整理，但标记清除会造成内存不连续，所以会有标记整理取解决掉内存碎片，就是清理掉边界碎片”

--2.为什么TO超过25%要晋升老生代？
为了不影响后续FORM空间的分配.

--3.标记清除是怎么清除的？
垃圾回收会构建一个根列表，从根节点去访问那些变量，可访问到位活动，不可就是垃圾


栈内存和堆内存垃圾回收方式不同。

--1.栈内存的回收：调用栈上下文切换后回收栈内存，比较简单
--2.堆内存回收：V8的堆内存分为新生代内存和老年代内存。
--2.1新生代内存是临时分配的内存，存在时间短
有两个部分 from 和 to， 
Scavenge先扫描 from ，清理一次非存活对象。 存活的复制到to
然后 交换 from 和 to。to超过25%要晋升老生代

--2.2老年代内存存在时间长
--2.2.1Promotion：新生代比较长命的回到老生代，
--2.2.2回收主要是标记清除

有一个方法，里面有一个基础数据类型 a，还有用 const 定义的 b 对象，怎么回收?（删除引用）
知识点：const定义的引用类型只要指针不发生改变，其他的不论如何改变都是可以的

function a() {
    setTimeout(() => {
        var b = 5;
        const c = {
            data: [{ "id": 55 },]
        }
        //这样会报错 c={}，因为这样就改变了他的引用类型了
        c["data"]=[]
        console.log(c)
    },3000)

}
a()
```



### 2.3.2  进程  线程

```js
后新开一个页面至少需要：
--1.浏览器进程（brower）：地址栏、书签、前进后退按钮
--2.GPU进程：3D CSS，进程渲染
--3.网络进程（http）：发起和接受网络请求
--4.渲染进程（render）：将HTML、CSS、JS转为用户可以与之交互的网页
--4.1   GUI 渲染线程
--4.2   JavaScript 引擎线程
--4.3   事件触发线程
--4.4   定时器触发线程
--4.5   异步http请求线程
--5.插件进程（可以有，可以没有）：防止崩溃
```



### 2.3.3

## 2.4 web component



### 2.4.0 最基本的webcomponent

```js
// removeNode(button);

import styles from "../css/normal.css" assert {type : 'css'};
class myDiv extends HTMLElement {
    // 监听
    static get observedAttributes(){
        return ["option","name"]
    }
    constructor() {
        super();
        this.shadowRoot!
        // 这样我们才能够去追加元素
        this.attachShadow({ mode: 'open' })
      
    }

    // 重要：生命周期方法 开始
    connectedCallback() {
        console.log("connectedCallback生命周期")

    }
    attributeChangedCallback(attr:string,oldValue:string,newValue:string){
    }

    render() {
        let nodeTemplate = document.createElement("template")
        nodeTemplate.innerHTML = `
            <div class="content" >
                <div class="title">组件 </div> 
                <slot name="container"></slot>
            </div>
        `
        this.shadowRoot!.appendChild(nodeTemplate.content)
        this.shadowRoot!.adoptedStyleSheets =[styles]
    }
}
// 名字必须小写 必须有横线
customElements.define("my-div", myDiv)


```







### 2.4.0 生命周期



```js
1.shadow dom 
专门操作自定义元素
2.自定义元素
js中 继承 HTMLElement 获得的
有四个生命周期：
connectedCallback() // 挂载的时候
disconnectedCallback() // 卸载的时候
adoptedCallback() // 移动的时候
attributeChangeCallback() // 属性变化时
3.temple
方便定义插槽
```



### 2.4.1  helloworld  |  生命周期  | shadow dom  |  host选择器(这个非常重要) | 样式继承

w3c中 有一些 东西可以继承，有一些东西继承不了。如果需要不继承所有属性

可以设置

```css
:host {
    all:initial;
}

<!-- 什么需要设置全局 就写在:host里面 -->
:host {
   xx
    
}

<!-- 属性中包含primary 就会生效 -->
:host([theme~='primary']) {
   
}
```





```html
html 中
  <!-- 重要，最好给自定义元素一个display为block 不然没有宽高 -->
<script src="main.js"></script>

<my-div  option="你好">
    啊啊啊
</my-div>
```



```js
//  1.自定义标签都是用class 的形式去继承

class myDiv extends HTMLElement {
    constructor() {
        super();
        // 这样我们才能够去追加元素
        this.attachShadow({ mode: 'open' })

    }

    // 重要：生命周期方法 开始
    connectedCallback() {
        console.log("connectedCallback生命周期")

       this.render({
            option:this.getAttribute("option")
       })
    }
    render(data) {
        let { option } = data
        let nodeTemplate = document.createElement("template")
        nodeTemplate.innerHTML = `
            <div class="content" >
                <div class="title">${option} </div> 
                <slot></slot>
            </div>
        `
        let nodeStyles = document.createElement("style")
        // shadow dom 的样式绝对隔离
        // 重要： :host选择器可以选中根也就是my-div的样式。外面的选择器样式要高于这个
        // :host(.active) .content 这一行代码指的是 这个最外层时 active 样式 ，然后得到其中的 .content 的样式 
        nodeStyles.innerHTML = `
            :host(.active) .content{
                
                margin-top:20px;
                background:rgba(0,0,0,30%);
            }
            :host{
                display:block
            }
            .content{
                width:100px;
                height:100px;
                background:rgba(0,0,0,20%)
            }
           
        `
        this.shadowRoot.appendChild(nodeTemplate.content)
        this.shadowRoot.appendChild(nodeStyles)
    }
}

// 名字必须小写 必须有横线
customElements.define("my-div", myDiv)
```



### 2.4.2  shadowRoot | 选择shadowdom里面元素 

```js
 // 重要：选择shadow 的 元素 ：二次selector+shadowRoot
// console.log(document.querySelector("my-div").shadowRoot.querySelector(".content"))


// 重要：向着下面找。调用父方法 selector.方法
// 子方法就 二次selector+shadowRoot.方法
// 往回找 方法 可以 在子元素上 子元素.getRootNode().host.方法. 单单子元素.getRootNode() 那么就是拿到了shadow 元素
console.log(document.querySelector("my-div").borderAdd())
document.querySelector("my-div").setAttribute("option","改编")
```



### 2.4.3 调用方法 | 元素.方法

```js
class myDiv extends HTMLElement  里面添加这个方法，然后只要选中这个元素就可以调用这个方法  
类似 docuemnt.query("").borderAdd()
类似 docuemnt.query("").shadowdom.querySelector().borderAdd()

borderAdd(){
     console.log("borderadd")
     this.shadowRoot.querySelector(".content").style.border="3px solid green"
 }
```



### 2.4.4 attributeChangedCallback |  observedAttributes| 监听属性变化  

```js
 class myDiv extends HTMLElement  里面

 static get observedAttributes(){
     return ["option"]
 }

 
 
attributeChangedCallback(attr,oldValue,newValue){
        
    if(oldValue){
        switch (attr){
            case "option":
                this.shadowRoot.querySelector(".title").textContent = newValue
        }
    }
    console.log("arrributeChangeCallback",attr,oldValue,newValue)
}

然后在html上面
 <my-div  option="你好">

     啊啊啊
</my-div>
```

### 2.4.4 slot 插槽 | ::slotted 选择器  | assignedElements

这玩意外部样式能够影响里面

```html
--1.html 调用
<my-div  option="你好">

     <div slot="tab">
         tab
    </div>
</my-div>	

```

```js
--2.js里面
this.shadowRoot.innerHTML =`
	<div>
            <slot name="tab"></slot>
    </div>

`
```



```js
--3.如果要选择里面的元素 selectorAll 不起作用
那么 this.tabs = this.shadowRoot.querySelector(`slot[name="tab"]`).assignedElements({flatten:true})

 this.tabs = this.shadowRoot.querySelector(`slot[name="tab"]`).assignedElements({flatten:true})
--4. css 选择器可以 像这样 选择

 ::slotted([slot="container"]){
     display:none
 }

::slotted(.active){
    display:block
}



```



### 2.4.5  composedPath | 判断点击位置 

```js
document.addEventListener("click",(e)=>{
    // 重要：冒泡的顺序，通过这个可以判断有没有在鼠标内部进行点击
    if(e.composedPath().includes(this)){
        console.log("点击了里面")
    }
})
```



### 2.4.6 继承

```
一般来说影子属性的值是继承不到的，因此我们可以用
--border-color: #6C63FF
然后 var(--border-color)

不想基层
```







### 2.4.7   :not(:defined) | 防止闪烁

```css
 /* 直到影子dom的dom结构被添加之后才会出现，非常有用 */
 :not(:defined){
     display: block;
     opacity: 0;
     transition: all .3s ease;
 }

这个选择器确实不得了 js中 居然能够延后执行
setTimeout(()=>{
    this.shadowRoot.appendChild(nodeTemplate.content)
    this.shadowRoot.appendChild(nodeStyles)
},2000)

```







```js
完整示例

//  1.自定义标签都是用class 的形式去继承

class myDiv extends HTMLElement {
    // 监听
    static get observedAttributes(){
        return ["option"]
    }

    constructor() {
        super();
        // 这样我们才能够去追加元素
        this.attachShadow({ mode: 'open' })

    }

    // 重要：生命周期方法 开始
    connectedCallback() {

        console.log("connectedCallback生命周期")

        // 获取元素
        // console.log(this.shadowRoot.querySelector(".content"))
        // 获取属性
        // console.log( this.getAttribute("data-option"))
       this.render({
            option:this.getAttribute("option")
       })
        document.addEventListener("click",(e)=>{
            // 重要：冒泡的顺序，通过这个可以判断有没有在鼠标内部进行点击
            if(e.composedPath().includes(this)){
                console.log("点击了里面")
            }
        })
    }

    // 重要：生命周期方法 重新渲染 .甚至还是第一次进行渲染，比connect还快
    // 会重新渲染 connectCallback
    attributeChangedCallback(attr,oldValue,newValue){
        
        if(oldValue){
            switch (attr){
                case "option":
                    this.shadowRoot.querySelector(".title").textContent = newValue
            }
        }
        console.log("arrributeChangeCallback",attr,oldValue,newValue)
        
    }

    borderAdd(){
        console.log("borderadd")
        this.shadowRoot.querySelector(".content").style.border="3px solid green"
    }

    render(data) {
        let { option } = data
        
        // console.log()
        let nodeTemplate = document.createElement("template")
        nodeTemplate.innerHTML = `
            <div class="content" >
                <div class="title">${option} </div> 
                <slot name="container"></slot>
            </div>
        `

        let nodeStyles = document.createElement("style")
        // shadow dom 的样式绝对隔离
        // 重要： :host选择器可以选中根也就是my-div的样式。外面的选择器样式要高于这个

        nodeStyles.innerHTML = `
            :host(.active) .content{
                
                margin-top:20px;
                background:rgba(0,0,0,30%);
            }
            :host{
                display:block
            }
            .content{
                width:100px;
                height:100px;
                background:rgba(0,0,0,20%)
            }
           
            ::slotted([slot="container"]){
                display:none
            }

            ::slotted(.active){
                display:block
            }
        `
        
        setTimeout(()=>{
            this.shadowRoot.appendChild(nodeTemplate.content)
            this.shadowRoot.appendChild(nodeStyles)
        },1500)
        
    }
}


// 名字必须小写 必须有横线
customElements.define("my-div", myDiv)



```









### 2.4.8 组件传值

```js
目前最好的方法应该是通过customEvent 来做

window.addEventListener("test",(e)=>{
    console.log("出现吧",e.detail)
})

let event = new CustomEvent('test',{
    detail:{
        title:"我是标题哦"
    }
})
// 最后还跟着是否能够冒泡和是否阻止默认操作
window.dispatchEvent(
    event,true,false
)

```



### 2.4.9 组件化css示例

```html
html 中
<webzen-button theme="primary"></webzen-button>


~= 的意思是含有
css
:host([theme~='primary']) button{
	color:red
}
:host([theme~='primary'][theme~='small']) button{
	color:red
}
```







### 2.4.10 get | set | 修改监听属性值

```js
class ElfinTransition extends HTMLElement {
  get name() {
    return this.getAttribute('name');
  }
  set name(value) {
    if (value) {
      this.setAttribute('name', value);
    } else {
      this.removeAttribute('value');
    }
  }
}
getAttribute 和 setAttribute 触发
```



### 2.4.12  css modules



```2.js
slot.js 中
import styles from "./slot.css" assert {type : 'css'}
this.shadowRoot.adoptedStyleSheets =[styles]



```





### 2.4.13 元素动画和元素移除

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
    你好

    <script>
        console.log(top)
        let input = document.createElement("input")
        input.setAttribute("type", "text")
        document.body.after(input)


        function slide(elem, direction) {
            const keyframe = [
                { transform: 'translateX(-50%)', opacity: 0 },
                { transform: 'translateX(0%)', opacity: 1 }
            ]
            return elem.animate(keyframe,{
                fill:"forwards",
                duration:300,
                easing:"ease-in-out"
            })
        }
        let event= slide(input)

        // 这里可以移除掉这个元素
        event.onfinish=(e)=>{
            console.log(e,this)
        }
    </script>
</body>

</html>
```



### 2.4.14 基类

```js
const randomID = () => {
  return Math.random().toString(36).substring(2, 8);
};

export default class wz_base extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.id = randomID();
    if (typeof globalThis.components !== 'object') {
      globalThis.components = {};
    }
    Object.defineProperty(globalThis.components, this.id, {
      value: this,
      configurable: true,
    });
  }

  disconnectedCallback() {
    delete globalThis.components[this.id];
  }
}

```



```js
使用	
// import events from "inquirer/lib/utils/events";

import base from '../base/index.js';
import styles from './index.css' assert { type: 'css' };

class TimePicker extends base {
  constructor() {
    super();
  }
  static get observedAttributes() {
    return ["onValue"];
  }
  attributeChangedCallback(name, oldValue, newValue) {
    console.log(name, oldValue, newValue);
    switch (name){
        case "onValue":
            console.log(new Function(newValue))
    }
        
  }

  connectedCallback() {
    console.log("组件id:",this.id,globalThis.components[this.id])
    console.log(this.getAttribute("onValue"))
    console.log(new Function(this.getAttribute("onValue"))())
    let nodeTemplate = document.createElement('template');
    nodeTemplate.innerHTML = `
        <label for="time-picker">选择时间:</label>
        <input type="time" id="time-picker">
        `;
    const template = nodeTemplate.content;
    this.shadowRoot.appendChild(template.cloneNode(true));
    this.input = this.shadowRoot.querySelector('#time-picker');

    this.input.addEventListener('change', this.handleChange.bind(this));
    //   this.input.addEventListener('change',  eval(this.getAttribute("onValue")(event)));
    this.shadowRoot.adoptedStyleSheets = [styles];
  }

  handleChange(event) {

    globalThis.eventbus.emit('测试', event.target.value);
    console.log(
        this.getAttribute('onValue')
      );
    this.dispatchEvent(
      new CustomEvent('timeChanged', { detail: event.target.value })
    );
  }
}

customElements.define('time-picker', TimePicker);

```





### 2.4.?? 完整示例

html

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <script src="slot.js"></script>

    <style>
        #test{
            background: red;
        }

        /* 直到影子dom的dom结构被添加之后才会出现，非常有用 */
        :not(:defined){
            display: block;
            opacity: 0;
            transition: all .3s ease;
        }
     
    </style>
</head>
<body>
    <my-div option="测试">
        <div slot="container" id="test" >
            hello
       </div>
       
       <div slot="container" id="test" class="active">
            tab1
        </div>

        <div slot="container" id="test" class="active">
            tab2
        </div>
        <div slot="container" id="test" class="active">
            tab3
        </div>
    </my-div>

    <script>
        


        

        customElements.whenDefined('my-div').then(() => {
            console.log("开始define")
        });
        setTimeout(() => {
            console.log(document.querySelector("my-div").shadowRoot.querySelector(`slot[name="container"]`).assignedElements({ flatten: true }))
        }, 3000);
    </script>
</body>
</html>
```



slot.js

```js
//  1.自定义标签都是用class 的形式去继承

class myDiv extends HTMLElement {
    // 监听
    static get observedAttributes(){
        return ["option"]
    }

    constructor() {
        super();
        // 这样我们才能够去追加元素
        this.attachShadow({ mode: 'open' })

    }

    // 重要：生命周期方法 开始
    connectedCallback() {

        console.log("connectedCallback生命周期")

        // 获取元素
        // console.log(this.shadowRoot.querySelector(".content"))
        // 获取属性
        // console.log( this.getAttribute("data-option"))
       this.render({
            option:this.getAttribute("option")
       })
        document.addEventListener("click",(e)=>{
            // 重要：冒泡的顺序，通过这个可以判断有没有在鼠标内部进行点击
            if(e.composedPath().includes(this)){
                console.log("点击了里面")
            }
        })

        // this.shadowRoot.querySelector(".content").addEventListener(("click"),()=>{
        //     // window.dispatchEvent
        // })
    }

    // 重要：生命周期方法 重新渲染 .甚至还是第一次进行渲染，比connect还快
    // 会重新渲染 connectCallback
    attributeChangedCallback(attr,oldValue,newValue){
        
        if(oldValue){
            switch (attr){
                case "option":
                    this.shadowRoot.querySelector(".title").textContent = newValue
            }
        }
        console.log("arrributeChangeCallback",attr,oldValue,newValue)
        
    }

    borderAdd(){
        console.log("borderadd")
        this.shadowRoot.querySelector(".content").style.border="3px solid green"
    }

    render(data) {
        let { option } = data
        
        // console.log()
        let nodeTemplate = document.createElement("template")
        nodeTemplate.innerHTML = `
            <div class="content" >
                <div class="title">${option} </div> 
                <slot name="container"></slot>
            </div>
        `

        let nodeStyles = document.createElement("style")
        // shadow dom 的样式绝对隔离
        // 重要： :host选择器可以选中根也就是my-div的样式。外面的选择器样式要高于这个

        nodeStyles.innerHTML = `
            :host(.active) .content{
                
                margin-top:20px;
                background:rgba(0,0,0,30%);
            }
            :host{
                display:block
            }
            .content{
                width:100px;
                height:100px;
                background:rgba(0,0,0,20%)
            }
           
            ::slotted([slot="container"]){
                display:none
            }

            ::slotted(.active){
                display:block
            }
        `
        
        setTimeout(()=>{
            this.shadowRoot.appendChild(nodeTemplate.content)
            this.shadowRoot.appendChild(nodeStyles)
        },1500)
        
    }
}


// 名字必须小写 必须有横线
customElements.define("my-div", myDiv)



```





### 









## 2.5 PWA |  service worker 

worker 是跨域的

```js
--1.定义：
fcm 不能启动意味着消息推送
移动端 安装 pwa应用需要 梯子（md。极大的心智负担）
本质安装这个就是 一个chrome_proxy。另外这个东西在手机端吃
渐进式 web 应用（Progressive Web App）
渐进式 web 应用 就是 实现了和原生应用相近的用户体验的网页应用

Service Worker 是浏览器和网络之间的虚拟代理。 运行在一个与 页面的 JavaScript 主线程 独立的线程上，它没有对 DOM 结构的访问权限，可以在不同上下文间 发送/接收 信息。因为强大，所以 Service Workers 只能在安全的上下文中执行（即 HTTPS ）

--2.示例：  
if ("serviceWorker" in navigator) {
    // 浏览器支持 Service Worker
    navigator.serviceWorker
      .register("serviceWorker.js") // 这里可以接受第二个参数，用于设置 scope 范围
      .then(function (registration) {
        // 如果存放在网站根路径下，将会收到该网站的所有 fetch 事件
        console.log("ServiceWorker注册成功: ", registration.scope);
      })
      .catch(function (err) {
        console.log("ServiceWorker注册失败: ", err);
      });
  }

--3.局限：
遇到的阻碍：
第一个是腾讯，微信/QQ——微信/QQ拥有最大的用户群，腾讯要推自家小程序，它不支持PWA就难搞，一个商业app很难无视腾讯背后的流量（除了阿里）。
第二个，国内浏览器对PWA支持很差，连百度查到的chrome下载，长久以来一直都是停留在很古老版本。
第三个阻碍，国内的GCM/FCM 基本无法用，其它厂商对web push实现很乱

Google为安卓准备了基于Google服务的GCM/FCM推送服务，APP不需要驻留后台，只需要接入到GCM/FCM中，APP就可以借助Google服务器直接向安卓机推送消息。

--4.链式启动是如何解决APP推送问题的?

APP驻留后台很容易被系统挂城墙
此景此境下，APP们只能抱团取暖了——既然单个APP很难停留在后台，那么APP之间相互唤起，那就容易多了！开启一个APP后，就拉起另一个抱团的APP，那大家的进程都激活了，推送服务也就顺理成章。(大部分的链式唤醒，都是由于APP们接入了同样的推送SDK。那么为什么会有这个apk呢？
国内APP们想要实现推送功能，需要借助第三方的推送SDK例如开发者熟知的友盟、极光、个推等等)

--4.开发过程可以在application 中的service workers 和 cache storage去查看
生命周期 
install
activate（清理比较key）
fetch （自定义缓存）
更新我们要用 cacheName

--5. 什么是CacheStorage？
CacheStorage是浏览器中的一种存储机制，用于存储和检索网络请求和响应。它以Request 为key，Response为value去存储请求和响应对象

CacheStorage不是Service Worker API，但它使SW能够缓存网络响应，以便在用户断开与网络的连接时提供脱机功能。

--6.有哪些Service Worker能做但是web worker不能的？

Web Workers——为Web内容提供在后台线程中运行脚本的简单方法。工作线程可以在不干扰用户界面的情况下执行任务。此外，它们还可以使用XMLHttpRequest执行I/O（尽管responseXML和channel属性始终为空）。创建后，工作人员可以通过将消息发布到该代码指定的事件处理程序中来向创建该代码的JavaScript代码发送消息（反之亦然）。
Service Worker——本质上是充当位于Web app与浏览器和网络（如果可用）之间的代理服务器。它们旨在（除其他外）创建有效的脱机体验，拦截网络请求并根据网络是否可用以及服务器上是否存在更新的资产(assets)来采取适当的操作。它们还允许访问推送通知和后台同步API。


```





serveice worker 生命周期

<img src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d26737a3c0754b4da1e068432657306b~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp">



#### 2.5.1 manifest.json

```js
使用PWA很简单，只需要在HTML中的head中使用link标签引用一个manifest.json文件即可.点击底部工具栏的JSON 选择 json with comments
{
  // 应用的名称
  "name": "Electrolux_pwa_demo",
  // 简称
  "short_name": "demo",
  // 显示模式 fullscreen（全屏） | standalone(独立) | standalone（最小化） | browser（浏览器）
  "display": "standalone",
  // 启动页
  "start_url": "/",  
  // 主题颜色
  "theme_color": "#313131",
  // 背景颜色
  "background_color": "#313131",
  "icons": [
    {
      "src": "e.png",
      "sizes": "256x256",
      "type": "image/png"
    }
  ]
}
<link rel="manifest" href="manifest.json" />


```



#### 2.5.2 sw.js 方法

```js
html 的 script标签 中写入.Add to Home Screen，即添加到主屏幕


console.log('Script loaded!')
/**
 * self: 表示 Service Worker 作用域, 也是全局变量
 * caches: 表示缓存
 * skipWaiting: 表示强制当前处在 waiting 状态的脚本进入 activate 状态
 * clients: 表示 Service Worker 接管的页面
 * 
 */



//重要：这里定义一个key，如果变化了 那么也会变
var cacheStorageKey = 'min'

var cacheList = [
  "/pwa_demo/main.css",
  "/pwa_demo/e.png",
  "/pwa_demo/pwa-fonts.png",
]
//重点：可以在注册完成安装 Service Worker 时, 抓取静态资源写入缓存:
self.addEventListener('install', function(e) {
  console.log('Cache event!')
  e.waitUntil(
    caches.open(cacheStorageKey).then(function(cache) {
      //写入内存 
      console.log('Adding to Cache:', cacheList)
      return cache.addAll(cacheList)
    }).then(function() {
      console.log('Skip waiting!')
      //skipwaiting为了在页面更新的过程当中,
      // 新的 Service Worker 脚本能立即激活和生效。
      return self.skipWaiting()
    })
  )
})

//重要：更新静态资源 可以遍历所有的缓存名称逐一判断决决定是否清除
self.addEventListener('activate', function(e) {
  console.log('Activate event')
  e.waitUntil(
    console.log("sdsd")
    // Promise.all(
    //   caches.keys().then(cacheNames => {
    //     return cacheNames.map(name => {
    //       if (name !== cacheStorageKey) {
    //         return caches.delete(name)
    //       }
    //     })
    //   })
    // ).then(() => {
    //   console.log('Clients claims.')
    //   //在新安装的 Service Worker 中通过调用 self.clients.claim() 
    //   //取得页面的控制权, 这样之后打开页面都会使用版本更新的缓存。
    //   //旧的 Service Worker 脚本不再控制着页面之后会被停止
    //   return self.clients.claim()
    // })
  )
})

//重要：处理动态缓存
self.addEventListener('fetch', function(e) {
  // console.log('Fetch event:', e.request.url)
  e.respondWith(
    caches.match(e.request).then(function(response) {
      if (response != null) {
        console.log('Using cache for:', e.request.url)
        return response
      }
      console.log('Fallback to fetch:', e.request.url)
      return fetch(e.request.url)
    })
  )
})


//重要：消息推送

// self.showNotification('Hello World!', {
//   body: 'This is a notification!',
//   icon: 'https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/703a0cee8b0b494eadd27adc61883956~tplv-k3u1fbpfcp-watermark.image?',
//   actions: [{
//       action: 'yes',
//       title: 'Yes'
//   }, {
//       action: 'no',
//       title: 'No'
//   }]
// });

// self.addEventListener('notificationclick', (event) => {
//   // 判断点击的是哪个按钮
//   if (event.action === 'yes') {
//       console.log('yes');
//   } else if (event.action === 'no') {
//       console.log('no');
//   }
// });




```





#### 2.5.3 html方法

```html
在安装Service Worker且用户转至其他页面或刷新当前页面后，Service Worker将开始接收fetch事件


<head>
  <title>Electrolux demo</title>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
  <meta name="viewport" content="width=device-width, user-scalable=no" />
  <link rel="manifest" href="/pwa_demo/manifest.json" />
  <link rel="stylesheet" type="text/css" href="/pwa_demo/main.css">
  <link rel="icon" href="/pwa_demo/e.png" type="image/png" />
</head>

<body>
  <div class="revision">测试</div>
  <img src="/pwa_demo/pwa-fonts.png">
  <div class="main-text">
    Electrolux demo 示例
  </div>
  <div class="network-message">
    Network:
    <span id="network-status" class="">Good</span>
    <button id="notifications" onclick="addToDesktop()">安装</button>
  </div>




  <script>
    //这里是进行sw.js 离线缓存的设置，注册service worker
    if (navigator.serviceWorker != null) {
      navigator.serviceWorker.register('/pwa_demo/sw.js')
        .then(function (registration) {
          console.log('Registered events at scope: ', registration.scope);
        });
    }

    fetch('./data.json')

    var statusEl = document.querySelector('#network-status')
    if (!navigator.onLine) {
      statusEl.classList = ['is-offline']
      statusEl.innerText = 'Offline'
    }
  </script>

  <script>

    //首先进行授权
    Notification.requestPermission().then(function (result) {
      if (result === 'granted') {
        console.log("已经授权")
      }
    });

    
    var deferredPrompt = null;

    // 监听beforeinstallprompt事件，该事件在网站满足PWA安装条件时触发，保存安装事件
    window.addEventListener("beforeinstallprompt", e => {
        e.preventDefault();
        deferredPrompt = e;
    });

    // 监听appinstalled事件，该事件在用户同意安装后触发，清空安装事件
    window.addEventListener("appinstalled", () => {
        deferredPrompt = null;
    });

    // 手动触发PWA安装
    function addToDesktop() {
      
        deferredPrompt.prompt();
    }


    
  </script>
</body>
```





