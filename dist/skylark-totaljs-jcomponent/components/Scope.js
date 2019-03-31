/**
 * skylark-totaljs-jcomponent - A version of totaljs jcomponent that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylarkui/skylark-totaljs-jcomponent/
 * @license MIT
 */
define(["../langx","../topic"],function(t,e){function n(){}var i=n.prototype;return i.unwatch=function(t,n){return e.off("scope"+this._id+"#watch",this.path+(t?"."+t:""),n),this},i.watch=function(t,n,i){return e.on("scope"+this._id+"#watch",this.path+(t?"."+t:""),n,i,this),this},i.reset=function(t,e){return t>0&&(e=t,t=""),RESET(this.path+"."+(t?+t:"*"),e)},i.default=function(t,e){return t>0&&(e=t,t=""),DEFAULT(this.path+"."+(t||"*"),e)},i.set=function(t,e,n,i){return setx(this.path+(t?"."+t:""),e,n,i)},i.push=function(t,e,n,i){return push(this.path+(t?"."+t:""),e,n,i)},i.update=function(t,e,n){return update(this.path+(t?"."+t:""),e,n)},i.get=function(t){return getx(this.path+(t?"."+t:""))},i.can=function(t){return CAN(this.path+".*",t)},i.errors=function(t,e){return errors(this.path+".*",t,e)},i.remove=function(){for(var n=M.components.all,i=0;i<n.length;i++){(r=n[i]).scope&&r.scope.path===this.path&&r.remove(!0)}if(this.isolated){n=Object.keys(proxy);for(i=0;i<n.length;i++){var r;(r=n[i]).substring(0,this.path.length)===this.path&&delete proxy[r]}}e.off("scope"+this._id+"#watch");var h=this.element;h.find("*").off(),h.off(),h.remove(),t.setTimeout2("$cleaner",cleaner2,100)},i.FIND=function(t,e,n,i){return this.element.FIND(t,e,n,i)},i.SETTER=function(t,e,n,i,r,h,o){return this.element.SETTER(t,e,n,i,r,h,o)},i.RECONFIGURE=function(t,e){return this.element.RECONFIGURE(t,e)},n});
//# sourceMappingURL=../sourcemaps/components/Scope.js.map
