// ==UserScript==
// @name              修复微博图片跨域展示
// @namespace         https://github.com/itorr/fix-sinaimg.user.js
// @version           0.1
// @description       修复微博图片跨域展示
// @author            itorr
// @license           MIT
// @match             *://*/*
// @match             *://*.weibo.com/*
// @match             *://t.cn/*
// @include           *://weibo.com/*
// @include           *://*.weibo.com/*
// @include           *://t.cn/*
// @exclude           *://weibo.com/a/bind/*
// @exclude           *://account.weibo.com/*
// @exclude           *://kefu.weibo.com/*
// @exclude           *://photo.weibo.com/*
// @exclude           *://security.weibo.com/*
// @exclude           *://verified.weibo.com/*
// @exclude           *://vip.weibo.com/*
// @exclude           *://open.weibo.com/*
// @exclude           *://passport.weibo.com/*
// @icon              https://weibo.com/favicon.ico
// @run-at            document-end
// @grant             GM_xmlhttpRequest
// @supportURL        https://github.com/itorr/fix-sinaimg.user.js/issues
// ==/UserScript==


const isSinaImageRegex = /sinaimg\.cn\//;
const fixSinaImages = ()=>{
    [...document.images].filter(el=>isSinaImageRegex.test(el.src)).forEach(el=>{
        if(el._srcReplaced) return;

        const url = el.src;
        el.removeAttribute('src');
        el._srcReplaced = true;
        GM_xmlhttpRequest({
            method:'GET',
            url,
            responseType: 'blob',
            headers: {
                'referer': 'https://weibo.com/mygroups'
            },
            onload(res){
                const blob = res.response;
                const url = URL.createObjectURL(blob);
                el.src = url;
            }
        })
    });
};



const lazy = (func,ms = 15)=> _=>{
    clearTimeout(func.T)
    func.T = setTimeout(func,ms)
};

const listenerFunc = lazy( _ => fixSinaImages() );

if(window.MutationObserver){
    (new MutationObserver(fixSinaImages)).observe(document.body,{
        childList: true,
        subtree: true,
        attributes: true,
    });
}else{
    const {open,send} = XMLHttpRequest.prototype;
    XMLHttpRequest.prototype.open = function(){
        this.addEventListener('load',listenerFunc);
        return open.apply(this,arguments);
    };
    document.addEventListener('DOMContentLoaded',listenerFunc);
    document.addEventListener('DOMNodeInserted',listenerFunc);
}



window.addEventListener('load',fixSinaImages);
