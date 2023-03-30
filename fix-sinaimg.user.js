// ==UserScript==
// @name              修复微博图片跨域展示
// @namespace         https://github.com/itorr/fix-sinaimg.user.js
// @version           0.11
// @description       修复微博图片在第三方网站上无法正常显示的问题
// @author            itorr
// @license           MIT
// @match             *://*/*
// @exclude           *://weibo.com/*
// @exclude           *://*.weibo.com/*
// @exclude           *://t.cn/*
// @icon              https://weibo.com/favicon.ico
// @run-at            document-end
// @grant             GM_xmlhttpRequest
// @supportURL        https://github.com/itorr/fix-sinaimg.user.js/issues
// ==/UserScript==


const isSinaImageRegex = /sinaimg\.cn\//;
const fixSinaImages = ()=>{
    [...document.images].filter(el=>isSinaImageRegex.test(el.src)).forEach(el=>{
        GM_xmlhttpRequest({
            method:'GET',
            url: el.src,
            responseType: 'blob',
            headers: {
                'referer': 'https://weibo.com/mygroups'
            },
            onload(res){
                el.src = URL.createObjectURL(res.response);
            }
        });
        el.removeAttribute('src');
    });
};

if(window.MutationObserver){
    (new MutationObserver(fixSinaImages)).observe(document.body,{
        childList: true,
        subtree: true,
        attributes: true,
    });
}else{
    document.addEventListener('DOMNodeInserted',fixSinaImages);
}

window.addEventListener('load',fixSinaImages);
