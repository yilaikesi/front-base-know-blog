

# 5.组件库构建 | 脚手架建设

[[toc]]




这里是我们的一个打包示例，通过npm install + npm run build可以打包代码

https://gitee.com/Electrolux/front-zip-ts-package

```
npm install -D terser-webpack-plugin@4.2.3
这个东西可以进行压缩js代码，示例看config下面的配置还是比较齐全的

```



## 11.1.打包js函数

看 https://gitee.com/Electrolux/front-zip-package 和 

https://gitee.com/Electrolux/front-zip-ts-package



## 11.2.打包css

### 11.2.1 安装

```shell
npm install style-loader@0.23.1
npm install css-loader@2.0.2   
npm install mini-css-extract-plugin@0.5.0
```



### 11.2.2 webpack.prod.js

```js
 webpack.prod.js中还需要 mini-css-extract-plugin
 
 /*
* webpack 配置
*/
var webpack = require("webpack");
var path = require('path');
// var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
var fileVersion = new Date().getTime();
const TerserPlugin = require('terser-webpack-plugin');
module.exports = {   
    mode : 'production',
    entry:{
        ts:['./src/ts.ts'],
        // css:['./src/css.css']
    },
    output: {
        publicPath:"",
        path: path.resolve(__dirname, '../dist'), //打包后的文件存放的地方
        filename: '[name].min.js', //打包后输出文件的文件名
        chunkFilename: "[name].min.js",
        library:"monitorjs",  //类库名称
        libraryTarget:"umd",  //指定输出格式 ejs commonjs umd amd
        umdNamedDefine:true //会对UMD的构建过程中的AMD模块进行命名，否则就使用匿名的define
    },
    resolve: {
        extensions: ['.ts','tsx','.js','css']
    },
    module: {        
        rules: [
            {
                test: /\.js$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['es2015','stage-0'],
                        plugins: ['transform-runtime']
                    }
                },
                exclude: /node_modules/
            },
            {
                test:/\.ts?$/,
                use:'ts-loader',
                exclude: /node_modules/
            },
            {  

                test: /\.css$/,  
                use: ['style-loader', MiniCssExtractPlugin.loader,'css-loader']

            } 
        ]
    },

    plugins: [

        // new CleanWebpackPlugin(),
        
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV':  JSON.stringify(process.env.NODE_ENV),
            },
            fileVersion:fileVersion //文件版本
        }),
        
        //压缩配置  用Terser代替
        new TerserPlugin({
            cache: true,
            parallel: true,
            sourceMap: false,
          }),
          new webpack.ProvidePlugin({
            ab: [path.resolve(__dirname,"src/index.ts"), 'default'],
        }),
        new MiniCssExtractPlugin({
            filename: "../dist/[name]-buddle.css"
         })
    ]   

}

```







### 11.2.3 通过css和js来实现组件

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<style>
    body {
        background-color: #ebecf0;
    }

    ev-button[type=primary] {
        display: block;
        width: 100px;
        height: 50px;
        /* color: white; */
        /* background-color: red; */
        text-align: center;
        line-height: 50px;
        box-shadow: 6px 6px 12px #bec3c9, -6px -6px 12px #fff;
        font-size: 18px;
        font-weight: 200;
        color: #6D7587;

    }

    ev-button[type=other] {
        display: block;
        width: 100px;
        height: 50px;

        text-align: center;
        line-height: 50px;
        box-shadow: inset 5px 5px 10px #bec3c9, inset -5px -5px 10px #fff;
        font-size: 18px;
        font-weight: 200;
        color: #6d7587;
    }
</style>

<body>
    1
    <div>1</div>
    <ev-button type="primary">按钮点击</ev-button>
    <script>
        document.querySelector("ev-button").addEventListener("click", () => {
            document.querySelector("ev-button").style.cssText = "color:red"
        })
    </script>
</body>

</html>
```



### 11.2.4 ts.ts

mini-css-extract-plugin 会自动对这玩意进行解析

```js
import dataChart from "./dataChart"

// export { dataChart }

(window as any).dataChart =dataChart
import './css/button/button.css'
export { dataChart }

```





## 11.3.组件库规范



### 11.3.1.monorepo（代码文件结构）

三个独立的子项目可以共有request

有点像一种思想

```
第一种方式，每一个组件都是一个单独仓库，虽然有利于组件开发，但是组件维护起来比较麻烦。组件越多，需要维护的仓库也就越多，当其中部分组件依赖的如lodash需要升级时，我们需要一个个进行升级，比较麻烦。

第二种方式，将所有的组件作为一个包发布，虽然维护比较方便，但是发布后，别人只想使用其中的一个组件时，会需要把整个组件库引入，如果不提供按需加载，那么会造成项目中引入很多不必要的代码。

第三种方式可参考下文。

目录结构类似于
packages
├── compiler-core
    ├──_tests_ #单元测试
    ├──src #源文件目录
    ├──package.json
├── compiler-dom
    ├──_tests_ #单元测试
    ├──src #源文件目录
    ├──package.json
package.json
指在一个仓库中管理多个模块/包。
```



### 11.3.2.verdaccio（代码安全）

```
step1:服务器上安装verdaccio  npm install -g verdaccio
step2:执行verdaccio，启动服务 启动成功后，直接在浏览器输入服务器的ip地址 + 最后一行打印出的端口号
step:3:https://hostingcanada.org/htpasswd-generator/中生成账号密码 然后添加到htpasswd文件中去
```

## 11.4.编写文档

主要用到的是vuepress这个库

具体的用法可以看到https://gitee.com/Electrolux/front-base-know-blog。主要是打包的时候替换base的路径还有一些patch-package的设置

简单讲一下怎么把组件展示到界面中去

首先我们需要在.vuepress下面新建一个components文件夹

下面是这个文件下面的ev-button.vue示例

注意一下命名，不然会报递归的错误

```vue
<template>
  <div>
    <ev-button type="primary">按钮点击</ev-button>
    <ev-button type="other">按钮点击</ev-button>
  </div>
</template>

<script>
export default {
  name: "ev-Button",
  mounted() {
    document.querySelector("ev-button").addEventListener("click", () => {
      document.querySelector("ev-button").style.cssText = "color:red";
    });
  },
};
</script>

<style scoped>
body {
  background-color: #ebecf0 !important;
}
ev-button[type="primary"] {
  display: inline-block;
  width: 100px;
  height: 50px;

  text-align: center;
  line-height: 50px;
  box-shadow: 6px 6px 12px #bec3c9, -6px -6px 12px #fff;
  font-size: 16px;
  font-weight: 200;
  color: #6d7587;
  /* background-color: aqua; */
}

ev-button[type="other"] {
  display: inline-block;
  width: 100px;
  height: 50px;
  margin: 30px;
  text-align: center;
  line-height: 50px;
  box-shadow: inset 5px 5px 10px #bec3c9, inset -5px -5px 10px #fff;
  font-size: 16px;
  font-weight: 200;
  color: #6d7587;
}
</style>

```

调用就直接
```
<ev-Button></ev-Button>
```

## 11.5.浅聊编译设计

在一个框架设计之初，通常有三种选择：纯运行时的、纯编译时的或运行时+编译时的。如Svelte框架就是纯编译时的，而Vue.js则被设计为运行时+编译时



### 11.5.1  纯运行

```js
--1.这类东西提供给你一个函数。你只要按照他的设计和与他的约定传值进去就可以了
--2.有点像命令式编程.例如
const obj = {
    tag:'div',
    children:[{tag:'div',children:'hello'}]
}
然后传入一个类似render函数的东西就可以了
```



### 11.5.2 纯编译

```js
--1.在程序代码编译时期，编译器会将用户输入的模板字符串编译转换为命令式的代码，例如：
我们输入 <div></div>  
会变成
const div = document.createElement('div')
```



### 11.5.3  运行+编译

```
可以通过不同的方式进行传入
```





















## 11.6 自己的npm 包



```js
参考一下别人的设计：husky 原理就是加上了 hooksPath = .husky。然后里面就可以加上。uninstall 复原.git 和 install 操作 .git 的操作

npm run script执行脚本的时候都会创建一个shell，然后在shell中执行指定的脚本

----------------------------------

'&' 并行执行顺序，同时执行
"dev":"node test.js & webpack"

'&&'继发顺序，执行前面之后才可以执行后面
"dev":"node test.js && webpack"


前后加上pre 和post 
```

### 11.6.1 关于bin

```js
// bin 字段 会在 会建立 node_module/.bin 中命令的映射，当我们 输入一个包的名字的时候，我们就会执行 node 映射的方法.js

// 直接在 package.json 写三方依赖的命令可以被 npm 成功识别并调用的原理就是 去到了 bin 字段 


注意一下 在这个地方的 文件头部需要加上
#!/usr/bin/env node
```



### 11.6.2 npm link

```shell
频繁的发包 贼麻烦
使用 在 你 包的 根目录 添加 
npm link  #命令 就可以添加 软链
npm unlink 你的包名# 添加上你的包名 
npm ls --global --depth 0 # 查看所有创建的全局链接名称

注意 在 npm link 之后 ，你的 package.json 里面的 package name 就是 你的 包名。

这个时候 添加的 bin 也会同步 更新






```





### 11.6.3 完整

```js
1.修改 package.json 的 bin 文件 
2.修改 package.json 的 name 字段
3.添加 父级文件的 script 的 prepare 类似于 

"dev": "frontengineerplugin"
```



 