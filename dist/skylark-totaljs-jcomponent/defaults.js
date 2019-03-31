/**
 * skylark-totaljs-jcomponent - A version of totaljs jcomponent that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylarkui/skylark-totaljs-jcomponent/
 * @license MIT
 */
define(["./jc"],function(e){var o={delay:555,delaywatcher:555,delaybinder:200,localstorage:!0,version:"",importcache:"session",root:"",keypress:!0,jsoncompress:!1,dateformat:null};try{var t="jc.test";Window.localStorage.setItem(t,"1"),o.isPRIVATEMODE="1"!==Window.localStorage.getItem(t),Window.localStorage.removeItem(t)}catch(e){o.isPRIVATEMODE=!0}return e.defaults=o});
//# sourceMappingURL=sourcemaps/defaults.js.map
