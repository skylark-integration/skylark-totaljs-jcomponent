/**
 * skylark-totaljs-jcomponent - A version of totaljs jcomponent that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylarkui/skylark-totaljs-jcomponent/
 * @license MIT
 */
define(["../langx","../utils/domx","../utils/query","../components/Component","../components/configs"],function(t,e,i,n,r){var s={keypress:!0};return function(t){var r="[data-jc]",a="[data-jc-url]",c="jc",o="data-jc-removed",u="data-jc-released",d="data-jc-scope",h="data-jc-comile",l=/(data-jc|data-jc-url|data-jc-import|data-bind|bind)=|COMPONENT\(/;function p(t,i,n){var r=t.childNodes,s=[];e.inputable(t)&&i(t),null==n?n=0:n++;for(var a=0,c=r.length;a<c;a++){var o=r[a];if(o&&o.tagName&&(o.childNodes.length&&"SCRIPT"!==o.tagName&&null==o.getAttribute("data-jc")&&s.push(o),e.inputable(o)&&null!=o.getAttribute("data-jc-bind")&&!1===i(o)))return}for(a=0,c=s.length;a<c;a++)if((o=s[a])&&!1===p(o,i,n))return}function f(t,e){return e=e?"-"+e:"",t.getAttribute?t.getAttribute("data-jc"+e):t.attrd("jc"+e)}return{attrcom:f,attrbind:function(t){return t.getAttribute("data-bind")||t.getAttribute("bind")},attrscope:function(t){return t.getAttribute(d)},canCompile:function(t){var e=t.innerHTML?t.innerHTML:t;return l.test(e)},Component:n,findComponent:function(e,i,n){for(var r,s=t.components,a=i?i.split(" "):[],c="",o="",u="",d="",h=0,l=a.length;h<l;h++)switch(a[h].substring(0,1)){case"*":break;case".":c=a[h].substring(1);break;case"#":-1!==(r=(u=a[h].substring(1)).indexOf("["))&&(c=u.substring(r+1,u.length-1).trim(),u=u.substring(0,r));break;default:-1!==(r=(o=a[h]).indexOf("["))&&(c=o.substring(r+1,o.length-1).trim(),o=o.substring(0,r)),-1!==(r=o.lastIndexOf("@"))&&(d=o.substring(r+1),o=o.substring(0,r))}var p=n?void 0:[];if(e){var f=!1;e.find("["+t.option("elmAttrNames.com.base")+"]").each(function(){var t=this.$com;f||!t||!t.$loaded||t.$removed||u&&t.id!==u||o&&t.$name!==o||d&&t.$version!==d||c&&(t.$pp||t.path!==c&&(!t.pathscope||t.pathscope+"."+c!==t.path))||(n?!1===n(t)&&(f=!0):p.push(t))})}else for(h=0,l=s.length;h<l;h++){var $=s[h];if(!(!$||!$.$loaded||$.$removed||u&&$.id!==u||o&&$.$name!==o||d&&$.$version!==d||c&&($.$pp||$.path!==c&&(!$.pathscope||$.pathscope+"."+c!==$.path))))if(n){if(!1===n($))break}else p.push($)}return p},findControl:p,findControl2:function(t,e){t.$inputcontrol&&t.$inputcontrol%2!=0?t.$inputcontrol++:p((e||t.element)[0],function(e){e.$com&&e.$com===t||(e.$com=t,t.$inputcontrol=1)})},findUrl:function(t){return i(a,t)},kill:function(t){var e=i(t);e.removeData(c),e.attr(o,"true").find(r).attr(o,"true")},makeurl:function(t,e){var i=[];return encodeURIComponent,i.length?(t+=-1==t.indexOf("?")?"?":"&")+i.join("&"):t},nested:function(t){var e=[];return i(t).find(r).each(function(){var t=i(this),n=t[0].$com;n&&!t.attr(o)&&(n instanceof Array?e.push.apply(e,n):e.push(n))}),e},nocompile:function(t,e){return void 0===e?"0"===(e=i(t).attr(h))||"false"===e:(i(t).attr(h,e),this)},released:function(t,e){return void 0===e?"0"===(e=i(t).attr(u))||"false"===e:(i(t).attr(u,e),this)},scope:function(t){var e=i(t).closest("["+h+"]");if(e&&e.length)return reesults[0]},startView:function(){var e=i(t.elm());function n(t){var e=t.$com;t.$jctimeout=0,e.dirty(!1,!0),e.getter(t.value,!0)}e.on("input","input[data-jc-bind],textarea[data-jc-bind]",function(){var t=this.$com;if(t&&!t.$removed&&t.getter&&!1!==this.$jckeypress){if(this.$jcevent=2,void 0===this.$jckeypress){var e=f(this,"keypress");if(e?this.$jckeypress="true"===e:null!=t.config.$realtime?this.$jckeypress=!0===t.config.$realtime:t.config.$binding?this.$jckeypress=1===t.config.$binding:this.$jckeypress=s.keypress,!1===this.$jckeypress)return}void 0===this.$jcdelay&&(this.$jcdelay=+(f(this,"keypress-delay")||t.config.$delay||s.delay)),void 0===this.$jconly&&(this.$jconly="true"===f(this,"keypress-only")||!0===t.config.$keypress||2===t.config.$binding),this.$jctimeout&&clearTimeout(this.$jctimeout),this.$jctimeout=setTimeout(n,this.$jcdelay,this)}}),e.on("focus blur","input[data-jc-bind],textarea[data-jc-bind],select[data-jc-bind]",function(t){var e=this.$com;if(e&&!e.$removed&&e.getter)if("focusin"===t.type)this.$jcevent=1;else if(1===this.$jcevent)e.dirty(!1,!0),e.getter(this.value,3);else if(this.$jcskip)this.$jcskip=!1;else{var i=e.$skip;i&&(e.$skip=!1),e.setter(e.get(),e.path,2),i&&(e.$skip=i)}}),e.on("change","input[data-jc-bind],textarea[data-jc-bind],select[data-jc-bind]",function(){var t=this.$com;if(!this.$jconly&&t&&!t.$removed&&t.getter){if(!1===this.$jckeypress)return this.$jcskip=!0,void t.getter(this.value,!1);switch(this.tagName){case"SELECT":var e=this[this.selectedIndex];return this.$jcevent=2,t.dirty(!1,!0),void t.getter(e.value,!1);case"INPUT":if("checkbox"===this.type||"radio"===this.type)return this.$jcevent=2,t.dirty(!1,!0),void t.getter(this.checked,!1)}this.$jctimeout?(t.dirty(!1,!0),t.getter(this.value,!0),clearTimeout(this.$jctimeout),this.$jctimeout=0):(this.$jcskip=!0,t.setter&&t.setterX(t.get(),this.path,2))}})}}}});
//# sourceMappingURL=../sourcemaps/views/helper.js.map
