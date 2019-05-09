/**
 * skylark-totaljs-jcomponent - A version of totaljs jcomponent that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-totaljs-jcomponent/
 * @license MIT
 */
define(["./regexp","./statics"],function(e,t){var r=null;window.$jcdatempam=function(e){return e>=12?e-12:e};var s=Date.prototype;s.toNumber=function(e){return+this.format(e||"yyyyMMdd")},s.parseDate=function(){return this},s.add=function(e,t){if(void 0===t){var r=e.split(" ");e=r[1],t=parseInt(r[0])}langx.isString(t)&&(t=t.env());var s=new Date(this.getTime());switch(e.substring(0,3)){case"s":case"ss":case"sec":return s.setSeconds(s.getSeconds()+t),s;case"m":case"mm":case"min":return s.setMinutes(s.getMinutes()+t),s;case"h":case"hh":case"hou":return s.setHours(s.getHours()+t),s;case"d":case"dd":case"day":return s.setDate(s.getDate()+t),s;case"w":case"ww":case"wee":return s.setDate(s.getDate()+7*t),s;case"M":case"MM":case"mon":return s.setMonth(s.getMonth()+t),s;case"y":case"yy":case"yyy":case"yea":return s.setFullYear(s.getFullYear()+t),s}return s},s.toUTC=function(e){var t=this.getTime()+6e4*this.getTimezoneOffset();return e?t:new Date(t)},s.format=function(s,a){var n=a?this.toUTC():this;if(null==s&&(s=r),!s)return n.getFullYear()+"-"+(n.getMonth()+1).toString().padLeft(2,"0")+"-"+n.getDate().toString().padLeft(2,"0")+"T"+n.getHours().toString().padLeft(2,"0")+":"+n.getMinutes().toString().padLeft(2,"0")+":"+n.getSeconds().toString().padLeft(2,"0")+"."+n.getMilliseconds().toString().padLeft(3,"0")+"Z";var u="dt_"+s;if(t[u])return t[u](n);var d=!1;(s=s.env())&&"!"===s.substring(0,1)&&(d=!0,s=s.substring(1));var c="'+",i="+'",o=[],g=!1,w=!1,M=!1;return s=s.replace(e.date,function(e){switch(e){case"yyyy":return"'+d.getFullYear()+'";case"yy":return"'+d.getFullYear().toString().substring(2)+'";case"MMM":return g=!0,"'+mm.substring(0, 3)+'";case"MMMM":return g=!0,"'+mm+'";case"MM":return"'+(d.getMonth() + 1).padLeft(2, '0')+'";case"M":return"'+(d.getMonth() + 1)+'";case"ddd":return w=!0,"'+dd.substring(0, 2).toUpperCase()+'";case"dddd":return w=!0,"'+dd+'";case"dd":return"'+d.getDate().padLeft(2, '0')+'";case"d":return"'+d.getDate()+'";case"HH":case"hh":return c+(d?"window.$jcdatempam(d.getHours()).padLeft(2, '0')":"d.getHours().padLeft(2, '0')")+i;case"H":case"h":return c+(d?"window.$jcdatempam(d.getHours())":"d.getHours()")+i;case"mm":return"'+d.getMinutes().padLeft(2, '0')+'";case"m":return"'+d.getMinutes()+'";case"ss":return"'+d.getSeconds().padLeft(2, '0')+'";case"s":return"'+d.getSeconds()+'";case"w":case"ww":return M=!0,c+("ww"===e?"ww.padLeft(2, '0')":"ww")+i;case"a":return"'+(d.getHours() >= 12 ? 'PM':'AM')+'"}}),g&&o.push("var mm = M.months[d.getMonth()];"),w&&o.push("var dd = M.days[d.getDay()];"),M&&o.push("var ww = new Date(+d);ww.setHours(0, 0, 0);ww.setDate(ww.getDate() + 4 - (ww.getDay() || 7));ww = Math.ceil((((ww - new Date(ww.getFullYear(), 0, 1)) / 8.64e7) + 1) / 7);"),t[u]=new Function("d",o.join("\n")+"return '"+s+"';"),t[u](n)}});
//# sourceMappingURL=../sourcemaps/langx/DateEx.js.map
