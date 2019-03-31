/**
 * skylark-totaljs-jcomponent - A version of totaljs jcomponent that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylarkui/skylark-totaljs-jcomponent/
 * @license MIT
 */
define(["../utils/query","../components/helper","../binding/parsebinder"],function(e,t,i){var n=t.attrcom;return function t(l,r,u,a){if(l=l?e(l)[0]:document.body){var d=n(l,"compile");if("0"!==d&&"false"!==d){if((null==u||0===u)&&(a=[],l!==document.body)){var o=e(l).closest("["+ATTRSCOPE+"]");o&&o.length&&a.push(o[0])}var c=null,b=!!l&&"true"===n(l,"released"),s=null;n(l,"scope")&&a.push(l),l.$jcbind||(c=l.getAttribute("data-bind")||l.getAttribute("bind"))&&(s||(s=[]),s.push({el:l,b:c}));var f=n(l);l.$com||null==f||r(f,l,0,a);var g=l.childNodes,h=[];void 0===u?u=0:u++;for(var p=0,m=g.length;p<m;p++){var v=g[p];if(v){if(!v.tagName)continue;if("0"===(d=v.getAttribute("data-jc-compile"))||"false"===d)continue;void 0===v.$com&&null!=(f=n(v))&&(b&&v.setAttribute(ATTRREL,"true"),r(f||"",v,u,a)),v.$jcbind||(c=v.getAttribute("data-bind")||v.getAttribute("bind"))&&(v.$jcbind=1,!s&&(s=[]),s.push({el:v,b:c})),"0"!==(d=v.getAttribute("data-jc-compile"))&&"false"!==d&&v.childNodes.length&&"SCRIPT"!==v.tagName&&REGCOM.test(v.innerHTML)&&-1===h.indexOf(v)&&h.push(v)}}for(p=0,m=h.length;p<m;p++)(v=h[p])&&t(v,r,u,a&&a.length?a:[]);if(s)for(p=0;p<s.length;p++){var A=s[p];A.el.$jcbind=i(A.el,A.b,a)}}}}});
//# sourceMappingURL=../sourcemaps/views/crawler.js.map
