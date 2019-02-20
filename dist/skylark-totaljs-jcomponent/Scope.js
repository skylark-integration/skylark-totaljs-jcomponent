/**
 * skylark-totaljs-jcomponent - A version of totaljs jcomponent that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylarkui/skylark-totaljs-jcomponent/
 * @license MIT
 */
define(["./jc","./langx","./topic"],function(t,e,n){function i(){}var r=i.prototype;return r.unwatch=function(t,e){return n.off("scope"+this._id+"#watch",this.path+(t?"."+t:""),e),this},r.watch=function(t,e,i){return n.on("scope"+this._id+"#watch",this.path+(t?"."+t:""),e,i,this),this},r.reset=function(t,e){return t>0&&(e=t,t=""),RESET(this.path+"."+(t?+t:"*"),e)},r.default=function(t,e){return t>0&&(e=t,t=""),DEFAULT(this.path+"."+(t||"*"),e)},r.set=function(t,e,n,i){return setx(this.path+(t?"."+t:""),e,n,i)},r.push=function(t,e,n,i){return push(this.path+(t?"."+t:""),e,n,i)},r.update=function(t,e,n){return update(this.path+(t?"."+t:""),e,n)},r.get=function(t){return getx(this.path+(t?"."+t:""))},r.can=function(t){return CAN(this.path+".*",t)},r.errors=function(t,e){return errors(this.path+".*",t,e)},r.remove=function(){for(var t=M.components.all,i=0;i<t.length;i++){(r=t[i]).scope&&r.scope.path===this.path&&r.remove(!0)}if(this.isolated){t=Object.keys(proxy);for(i=0;i<t.length;i++){var r;(r=t[i]).substring(0,this.path.length)===this.path&&delete proxy[r]}}n.off("scope"+this._id+"#watch");var h=this.element;h.find("*").off(),h.off(),h.remove(),e.setTimeout2("$cleaner",cleaner2,100)},r.FIND=function(t,e,n,i){return this.element.FIND(t,e,n,i)},r.SETTER=function(t,e,n,i,r,h,o){return this.element.SETTER(t,e,n,i,r,h,o)},r.RECONFIGURE=function(t,e){return this.element.RECONFIGURE(t,e)},t.Scope=i});
//# sourceMappingURL=sourcemaps/Scope.js.map
