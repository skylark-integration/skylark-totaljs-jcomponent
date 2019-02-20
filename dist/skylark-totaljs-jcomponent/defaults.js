/**
 * skylark-totaljs-jcomponent - A version of totaljs jcomponent that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylarkui/skylark-totaljs-jcomponent/
 * @license MIT
 */
define(["./jc"],function(e){var a={scope:Window,delay:555,delaywatcher:555,delaybinder:200,fallback:"https://cdn.componentator.com/j-{0}.html",fallbackcache:"",localstorage:!0,version:"",importcache:"session",root:"",keypress:!0,jsoncompress:!1,thousandsseparator:" ",decimalseparator:".",dateformat:null};try{var o="jc.test";Window.localStorage.setItem(o,"1"),a.isPRIVATEMODE="1"!==Window.localStorage.getItem(o),Window.localStorage.removeItem(o)}catch(e){a.isPRIVATEMODE=!0}return e.defaults=a});
//# sourceMappingURL=sourcemaps/defaults.js.map
