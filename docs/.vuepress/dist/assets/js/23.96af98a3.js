(window.webpackJsonp=window.webpackJsonp||[]).push([[23],{433:function(s,a,t){"use strict";t.r(a);var e=t(2),n=Object(e.a)({},(function(){var s=this,a=s._self._c;return a("ContentSlotsDistributor",{attrs:{"slot-key":s.$parent.slotKey}},[a("h1",{attrs:{id:"_4-性能优化"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_4-性能优化"}},[s._v("#")]),s._v(" 4.性能优化")]),s._v(" "),a("p"),a("div",{staticClass:"table-of-contents"},[a("ul",[a("li",[a("a",{attrs:{href:"#_10-0-代码分析"}},[s._v("10.0 代码分析")])]),a("li",[a("a",{attrs:{href:"#_10-1-编译速度"}},[s._v("10.1 编译速度")])]),a("li",[a("a",{attrs:{href:"#_10-2-加载速度"}},[s._v("10.2  加载速度")]),a("ul",[a("li",[a("a",{attrs:{href:"#_10-2-1-体积压缩"}},[s._v("10.2.1  体积压缩")])]),a("li",[a("a",{attrs:{href:"#_10-2-2-网络请求"}},[s._v("10.2.2 网络请求")])])])]),a("li",[a("a",{attrs:{href:"#_10-3-渲染速度"}},[s._v("10.3 渲染速度")]),a("ul",[a("li",[a("a",{attrs:{href:"#"}})])])]),a("li",[a("a",{attrs:{href:"#_10-4-学到的东西"}},[s._v("10.4 学到的东西")])])])]),a("p"),s._v(" "),a("p",[s._v("渲染前的性能优化可以了解一下。前端性能优化分为两类：一类是文件加载更快、另一类是文件渲染更快")]),s._v(" "),a("h2",{attrs:{id:"_10-0-代码分析"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_10-0-代码分析"}},[s._v("#")]),s._v(" 10.0 代码分析")]),s._v(" "),a("div",{staticClass:"language-js line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-js"}},[a("code",[a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("//1.BundleAnalyzer 分析打包大小")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("//2.speedmeasure：分析加载速度")]),s._v("\n\n")])]),s._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[s._v("1")]),a("br"),a("span",{staticClass:"line-number"},[s._v("2")]),a("br"),a("span",{staticClass:"line-number"},[s._v("3")]),a("br")])]),a("h2",{attrs:{id:"_10-1-编译速度"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_10-1-编译速度"}},[s._v("#")]),s._v(" 10.1 编译速度")]),s._v(" "),a("p",[s._v("webpack编译的时候加速")]),s._v(" "),a("div",{staticClass:"language-js line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-js"}},[a("code",[a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("//1.threadloader-第一次编译的时候慢一点。后面贼快")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("//2.Terser 也可以在编译的时候")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("//3.swc loader增加ast 解析速度")]),s._v("\n")])]),s._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[s._v("1")]),a("br"),a("span",{staticClass:"line-number"},[s._v("2")]),a("br"),a("span",{staticClass:"line-number"},[s._v("3")]),a("br")])]),a("h2",{attrs:{id:"_10-2-加载速度"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_10-2-加载速度"}},[s._v("#")]),s._v(" 10.2  加载速度")]),s._v(" "),a("h3",{attrs:{id:"_10-2-1-体积压缩"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_10-2-1-体积压缩"}},[s._v("#")]),s._v(" 10.2.1  体积压缩")]),s._v(" "),a("div",{staticClass:"language-js line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-js"}},[a("code",[a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("//1.js压缩：terser压缩-原理-1.删除注释，空格，换行符 2.变量名压缩 3.提前计算4.console.log 去除")]),s._v("\n\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("//2.image压缩：imagemin-原理-1.例如png会把24位的图片信息压缩成8位的信息 ")]),s._v("\n\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("//3.css压缩：cssnano+postcss-原理-1.删除注释，空格 2.变量名压缩")]),s._v("\n\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("//4.js压缩：还有一个压缩是利用webpack的压缩optimization（优化器）进行代码分包。")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("//常用的是chunkIds（算法：可以选择named-短期缓存和detaerministic-长期缓存）和splitChunks（主要是里面的cacheGroups verndor的test-正则匹配名字和minChunk-最小引用数 一般来说呢.多引用的会专门分包）")]),s._v("\n\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("//5.")]),s._v("\n")])]),s._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[s._v("1")]),a("br"),a("span",{staticClass:"line-number"},[s._v("2")]),a("br"),a("span",{staticClass:"line-number"},[s._v("3")]),a("br"),a("span",{staticClass:"line-number"},[s._v("4")]),a("br"),a("span",{staticClass:"line-number"},[s._v("5")]),a("br"),a("span",{staticClass:"line-number"},[s._v("6")]),a("br"),a("span",{staticClass:"line-number"},[s._v("7")]),a("br"),a("span",{staticClass:"line-number"},[s._v("8")]),a("br"),a("span",{staticClass:"line-number"},[s._v("9")]),a("br"),a("span",{staticClass:"line-number"},[s._v("10")]),a("br")])]),a("h3",{attrs:{id:"_10-2-2-网络请求"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_10-2-2-网络请求"}},[s._v("#")]),s._v(" 10.2.2 网络请求")]),s._v(" "),a("div",{staticClass:"language-js line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-js"}},[a("code",[a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("//1.使用长连接")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("//2.雪碧图/精灵图")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("//3.节流防抖")]),s._v("\n")])]),s._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[s._v("1")]),a("br"),a("span",{staticClass:"line-number"},[s._v("2")]),a("br"),a("span",{staticClass:"line-number"},[s._v("3")]),a("br")])]),a("p",[s._v("包 后套套，包 前 cp，中间gls。最后acg\n包后压缩ttcnb treeshaking terser  cache nano（css体积）imagemin-webpack browlist\n中间性能：glspf  prefetch     gzip split跟cachegroup一起用 loader\n包前tscpd cache swc thread pnpm dllplugin\n分析 speedmeasure bundleanalyse")]),s._v(" "),a("h2",{attrs:{id:"_10-3-渲染速度"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_10-3-渲染速度"}},[s._v("#")]),s._v(" 10.3 渲染速度")]),s._v(" "),a("h3",{attrs:{id:""}},[a("a",{staticClass:"header-anchor",attrs:{href:"#"}},[s._v("#")])]),s._v(" "),a("div",{staticClass:"language-js line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-js"}},[a("code",[a("span",{pre:!0,attrs:{class:"token number"}},[s._v("1.")]),s._v("缓存（"),a("span",{pre:!0,attrs:{class:"token constant"}},[s._v("HTTP")]),s._v("缓存、本地缓存、Vue的keep"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("-")]),s._v("alive缓存等）\n"),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("2.")]),s._v("提前渲染：ssr服务器端渲染\n"),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("3.")]),s._v(" 避免渲染阻塞："),a("span",{pre:!0,attrs:{class:"token constant"}},[s._v("CSS")]),s._v("放在"),a("span",{pre:!0,attrs:{class:"token constant"}},[s._v("HTML")]),s._v("的head中 "),a("span",{pre:!0,attrs:{class:"token constant"}},[s._v("JS")]),s._v("放在"),a("span",{pre:!0,attrs:{class:"token constant"}},[s._v("HTML")]),s._v("的body底部 \n"),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("4.")]),s._v("懒加载\n"),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("5.")]),s._v("对dom查询进行缓存、将dom操作合并、使用减少重排的标签\n")])]),s._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[s._v("1")]),a("br"),a("span",{staticClass:"line-number"},[s._v("2")]),a("br"),a("span",{staticClass:"line-number"},[s._v("3")]),a("br"),a("span",{staticClass:"line-number"},[s._v("4")]),a("br"),a("span",{staticClass:"line-number"},[s._v("5")]),a("br")])]),a("h2",{attrs:{id:"_10-4-学到的东西"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_10-4-学到的东西"}},[s._v("#")]),s._v(" 10.4 学到的东西")])])}),[],!1,null,null,null);a.default=n.exports}}]);