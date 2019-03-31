/**
 * skylark-totaljs-jcomponent - A version of totaljs jcomponent that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylarkui/skylark-totaljs-jcomponent/
 * @license MIT
 */
define(["../utils/query","../jc","../langx"],function(l,e,n){var t={value:null};function a(){}return a.prototype.exec=function(l,e,a,i,c){var r=this,s=r.el;if(null!=a){if(null==r.child)return;if(null==(r=r.child[a]))return}if((!r.notnull||null!=l)&&(r.selector&&(r.cache?s=r.cache:(s=s.find(r.selector)).length&&(r.cache=s)),s.length)){if(!i&&r.delay)return r.$delay&&clearTimeout(r.$delay),void(r.$delay=setTimeout(function(l,e,n,t,a){l.$delay=null,l.exec(e,n,t,!0,a)},r.delay,r,l,e,a,c));if(r.init){if(r.strict&&r.path!==e)return;if(r.track&&r.path!==e){c=!1;for(var d=0;d<r.track.length;d++)if(r.track[d]===e){c=!0;break}if(!c)return}}else r.init=1;r.def&&null==l&&(l=r.def),r.format&&(l=r.format(l,e));var h=null;if(c=!1!==c,!r.show||null==l&&r.show.$nn||(h=r.show.call(r.el,l,e,r.el),s.tclass("hidden",!h),h||(c=!1)),!r.hide||null==l&&r.hide.$nn||(h=r.hide.call(s,l,e,s),s.tclass("hidden",h),h&&(c=!1)),!r.invisible||null==l&&r.invisible.$nn||(h=r.invisible.call(r.el,l,e,r.el),s.tclass("invisible",h),h||(c=!1)),!r.visible||null==l&&r.visible.$nn||(h=r.visible.call(r.el,l,e,r.el),s.tclass("invisible",!h),h||(c=!1)),r.classes)for(d=0;d<r.classes.length;d++){var u=r.classes[d];u.fn.$nn&&null==l||s.tclass(u.name,!!u.fn.call(s,l,e,s))}if(c&&r.import&&(n.isFunction(r.import)?l&&(!r.$ic&&(r.$ic={}),!r.$ic[l]&&IMPORT("ONCE "+l,s),r.$ic[l]=1):(IMPORT(r.import,s),delete r.import)),r.config&&(c||r.config.$nv)&&(null!=l||!r.config.$nn)&&(h=r.config.call(s,l,e,s)))for(d=0;d<s.length;d++){var f=s[d].$com;f&&f.$ready&&f.reconfigure(h)}if(r.html&&(c||r.html.$nv)&&(null==l&&r.html.$nn?s.html(r.htmlbk||""):(h=r.html.call(s,l,e,s),s.html(null==h?r.htmlbk||"":h))),r.text&&(c||r.text.$nv)&&(null==l&&r.text.$nn?s.html(r.htmlbk||""):(h=r.text.call(s,l,e,s),s.text(null==h?r.htmlbk||"":h))),r.val&&(c||r.val.$nv)&&(null==l&&r.val.$nn?s.val(r.valbk||""):(h=r.val.call(s,l,e,s),s.val(null==h?r.valbk||"":h))),!r.template||!c&&!r.template.$nv||null==l&&r.template.$nn||(t.value=l,t.path=e,s.html(r.template(t))),r.disabled&&(c||r.disabled.$nv)&&(null==l&&r.disabled.$nn?s.prop("disabled",1==r.disabledbk):(h=r.disabled.call(s,l,e,s),s.prop("disabled",1==h))),r.enabled&&(c||r.enabled.$nv)&&(null==l&&r.enabled.$nn?s.prop("disabled",0==r.enabledbk):(h=r.enabled.call(s,l,e,s),s.prop("disabled",!h))),r.checked&&(c||r.checked.$nv)&&(null==l&&r.checked.$nn?s.prop("checked",1==r.checkedbk):(h=r.checked.call(s,l,e,s),s.prop("checked",1==h))),r.title&&(c||r.title.$nv)&&(null==l&&r.title.$nn?s.attr("title",r.titlebk||""):(h=r.title.call(s,l,e,s),s.attr("title",null==h?r.titlebk||"":h))),r.href&&(c||r.href.$nv)&&(null==l&&r.href.$nn?s.attr(r.hrefbk||""):(h=r.href.call(s,l,e,s),s.attr("href",null==h?r.hrefbk||"":h))),r.src&&(c||r.src.$nv)&&(null==l&&r.src.$nn?s.attr("src",r.srcbk||""):(h=r.src.call(s,l,e,s),s.attr("src",null==h?r.srcbk||"":h))),!r.setter||!c&&!r.setter.$nv||null==l&&r.setter.$nn||r.setter.call(s,l,e,s),!r.change||null==l&&r.change.$nn||r.change.call(s,l,e,s),c&&null==a&&r.child)for(d=0;d<r.child.length;d++)r.exec(l,e,d,void 0,c);r.tclass&&(s.tclass(r.tclass),delete r.tclass)}},a});
//# sourceMappingURL=../sourcemaps/binding/Binder.js.map
