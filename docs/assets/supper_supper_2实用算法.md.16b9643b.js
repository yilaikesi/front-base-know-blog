import{_ as a,o as e,c as t,R as s}from"./chunks/framework.408c4d71.js";const m=JSON.parse('{"title":"7.实用算法","description":"","frontmatter":{},"headers":[],"relativePath":"supper/supper/2实用算法.md","filePath":"supper/supper/2实用算法.md","lastUpdated":null}'),l={name:"supper/supper/2实用算法.md"},o=s(`<h1 id="_7-实用算法" tabindex="-1">7.实用算法 <a class="header-anchor" href="#_7-实用算法" aria-label="Permalink to &quot;7.实用算法&quot;">​</a></h1><h2 id="_7-1-快排" tabindex="-1">7.1 快排 <a class="header-anchor" href="#_7-1-快排" aria-label="Permalink to &quot;7.1  快排&quot;">​</a></h2><h2 id="_7-2-sku" tabindex="-1">7.2 sku <a class="header-anchor" href="#_7-2-sku" aria-label="Permalink to &quot;7.2 sku&quot;">​</a></h2><p>用来判断库存的东西，基础知识要知道。具体的可以看：<a href="https://gitee.com/Electrolux/front-util-package/blob/master/html/sku.html" target="_blank" rel="noreferrer">https://gitee.com/Electrolux/front-util-package/blob/master/html/sku.html</a></p><p>图，无向图是由顶点集{1，2，3}，边集{(1,2),(1,3),(2,3)}和线段构成</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#A6ACCD;">我们选用的是无向图且是无权图。因为用户在选择规格的时候，并没有先后顺序之分，并且只关注两个顶点是否连通，边与边没有区别。将每种规格看作是无向图的一个顶点，就可以根据 attribute 相互之间的关系画出一个无向图.</span></span>
<span class="line"><span style="color:#A6ACCD;">邻接矩阵表示点和点有没有连接（0是连接？）</span></span></code></pre></div><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#A6ACCD;"></span></span></code></pre></div>`,7),r=[o];function n(p,c,i,_,u,d){return e(),t("div",null,r)}const b=a(l,[["render",n]]);export{m as __pageData,b as default};
