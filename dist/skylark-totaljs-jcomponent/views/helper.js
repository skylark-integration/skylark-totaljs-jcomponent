/**
 * skylark-totaljs-jcomponent - A version of totaljs jcomponent that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylarkui/skylark-totaljs-jcomponent/
 * @license MIT
 */
define(["../langx","../components/Component"],function(t,e){return function(t){var n="[data-jc]",r="jc",o="data-jc-removed";function i(t,e,n){var r=t.childNodes,o=[];domx.inputable(t)&&e(t),null==n?n=0:n++;for(var a=0,s=r.length;a<s;a++){var u=r[a];if(u&&u.tagName&&(u.childNodes.length&&"SCRIPT"!==u.tagName&&null==u.getAttribute("data-jc")&&o.push(u),domx.inputable(u)&&null!=u.getAttribute("data-jc-bind")&&!1===e(u)))return}for(a=0,s=o.length;a<s;a++)if((u=o[a])&&!1===i(u,e,n))return}return{Component:e,findComponent:function(e,n,r){for(var o,i=t.components,a=n?n.split(" "):[],s="",u="",c="",l="",p=0,d=a.length;p<d;p++)switch(a[p].substring(0,1)){case"*":break;case".":s=a[p].substring(1);break;case"#":-1!==(o=(c=a[p].substring(1)).indexOf("["))&&(s=c.substring(o+1,c.length-1).trim(),c=c.substring(0,o));break;default:-1!==(o=(u=a[p]).indexOf("["))&&(s=u.substring(o+1,u.length-1).trim(),u=u.substring(0,o)),-1!==(o=u.lastIndexOf("@"))&&(l=u.substring(o+1),u=u.substring(0,o))}var m=r?void 0:[];if(e){var f=!1;e.find("["+t.option("elmAttrNames.com.base")+"]").each(function(){var t=this.$com;f||!t||!t.$loaded||t.$removed||c&&t.id!==c||u&&t.$name!==u||l&&t.$version!==l||s&&(t.$pp||t.path!==s&&(!t.pathscope||t.pathscope+"."+s!==t.path))||(r?!1===r(t)&&(f=!0):m.push(t))})}else for(p=0,d=i.length;p<d;p++){var h=i[p];if(!(!h||!h.$loaded||h.$removed||c&&h.id!==c||u&&h.$name!==u||l&&h.$version!==l||s&&(h.$pp||h.path!==s&&(!h.pathscope||h.pathscope+"."+s!==h.path))))if(r){if(!1===r(h))break}else m.push(h)}return m},findControl:i,findControl2:function(t,e){t.$inputcontrol&&t.$inputcontrol%2!=0?t.$inputcontrol++:i((e||t.element)[0],function(e){e.$com&&e.$com===t||(e.$com=t,t.$inputcontrol=1)})},attrcom:function(t,e){return e=e?"-"+e:"",t.getAttribute?t.getAttribute("data-jc"+e):t.attrd("jc"+e)},attrbind:function(t){return t.getAttribute("data-bind")||t.getAttribute("bind")},attrscope:attrscope,kill:function(t){var e=$(t);e.removeData(r),e.attr(o,"true").find(n).attr(o,"true")},makeurl:function(t,e){var n=[];return encodeURIComponent,n.length?(t+=-1==t.indexOf("?")?"?":"&")+n.join("&"):t},scope:function(t){var e=$(t).closest("["+this.option("elmAttrNames.scope")+"]");if(e&&e.length)return reesults[0]},nocompile:function(e,n){return void 0===n?"0"===(n=$(e).attr(t.option("elmAttrNames.compile")))||"false"===comp:($(e).attr(t.option("elmAttrNames.compile"),n),this)},released:function(e,n){return void 0===n?"0"===(n=$(e).attr(t.option("elmAttrNames.released")))||"false"===comp:($(e).attr(t.option("elmAttrNames.released"),n),this)}}}});
//# sourceMappingURL=../sourcemaps/views/helper.js.map