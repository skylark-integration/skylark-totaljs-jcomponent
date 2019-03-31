/**
 * skylark-totaljs-jcomponent - A version of totaljs jcomponent that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylarkui/skylark-totaljs-jcomponent/
 * @license MIT
 */
define(["skylark-utils-dom/query","./jc","./langx","./plugins","./binding/Binder","./binding/bind","./binding/VirtualBinder","./binding/vbind","./binding/vbindArray"],function(n,i,r,e,a,t,d,s,l){var u=/,/g;return paths.parser(function(n,i,e){switch(e){case"number":case"currency":case"float":var a=+(r.isString(i)?i.trimAll().replace(u,"."):i);return isNaN(a)?null:a;case"date":case"datetime":return i?i instanceof Date?i:(i=i.parseDate())&&i.getTime()?i:null:null}return i}),i.binding={parser:parser,Binder:a,bind:t,VirtualBinder:d,vbind:s,vbindArray:l}});
//# sourceMappingURL=sourcemaps/binding.js.map
