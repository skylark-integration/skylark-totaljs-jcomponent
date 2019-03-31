/**
 * skylark-totaljs-jcomponent - A version of totaljs jcomponent that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylarkui/skylark-totaljs-jcomponent/
 * @license MIT
 */
define(["skylark-langx/skylark","skylark-langx/langx","skylark-utils-dom/query"],function(a,e,n){var t=(a.totaljs={}).jc={isPRIVATEMODE:!1,isMOBILE:/Mobi/.test(navigator.userAgent),isROBOT:!navigator.userAgent||/search|agent|bot|crawler|spider/i.test(navigator.userAgent),isSTANDALONE:navigator.standalone||window.matchMedia("(display-mode: standalone)").matches,isTOUCH:!!("ontouchstart"in window||navigator.maxTouchPoints)};return t.months="January,February,March,April,May,June,July,August,September,October,November,December".split(","),t.days="Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday".split(","),t.loaded=!1,t.version=16.044,t.$version="",t.$language="",t.environment=function(a,e,n,r){return t.$localstorage=a,t.$version=e||"",t.$language=n||"",r&&ENV(r),t},t.prototypes=function(a){var e={};return e.Component=PPC,e.Usage=USAGE.prototype,e.Plugin=Plugin.prototype,a.call(e,e),t},t});
//# sourceMappingURL=sourcemaps/jc.js.map
