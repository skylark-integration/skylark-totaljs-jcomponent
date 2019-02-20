/**
 * skylark-totaljs-jcomponent - A version of totaljs jcomponent that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylarkui/skylark-totaljs-jcomponent/
 * @license MIT
 */
define(["./regexp"],function(e){window.$jcdatempam=function(e){return e>=12?e-12:e};var t=Date.prototype;t.toNumber=function(e){return+this.format(e||"yyyyMMdd")},t.parseDate=function(){return this},t.add=function(e,t){if(void 0===t){var s=e.split(" ");e=s[1],t=parseInt(s[0])}typeof t===TYPE_S&&(t=t.env());var r=new Date(this.getTime());switch(e.substring(0,3)){case"s":case"ss":case"sec":return r.setSeconds(r.getSeconds()+t),r;case"m":case"mm":case"min":return r.setMinutes(r.getMinutes()+t),r;case"h":case"hh":case"hou":return r.setHours(r.getHours()+t),r;case"d":case"dd":case"day":return r.setDate(r.getDate()+t),r;case"w":case"ww":case"wee":return r.setDate(r.getDate()+7*t),r;case"M":case"MM":case"mon":return r.setMonth(r.getMonth()+t),r;case"y":case"yy":case"yyy":case"yea":return r.setFullYear(r.getFullYear()+t),r}return r},t.toUTC=function(e){var t=this.getTime()+6e4*this.getTimezoneOffset();return e?t:new Date(t)},t.format=function(t,s){var r=s?this.toUTC():this;if(null==t&&(t=MD.dateformat),!t)return r.getFullYear()+"-"+(r.getMonth()+1).toString().padLeft(2,"0")+"-"+r.getDate().toString().padLeft(2,"0")+"T"+r.getHours().toString().padLeft(2,"0")+":"+r.getMinutes().toString().padLeft(2,"0")+":"+r.getSeconds().toString().padLeft(2,"0")+"."+r.getMilliseconds().toString().padLeft(3,"0")+"Z";var a="dt_"+t;if(statics[a])return statics[a](r);var n=!1;(t=t.env())&&"!"===t.substring(0,1)&&(n=!0,t=t.substring(1));var u="'+",d="+'",c=[],i=!1,o=!1,g=!1;return t=t.replace(e.date,function(e){switch(e){case"yyyy":return"'+d.getFullYear()+'";case"yy":return"'+d.getFullYear().toString().substring(2)+'";case"MMM":return i=!0,"'+mm.substring(0, 3)+'";case"MMMM":return i=!0,"'+mm+'";case"MM":return"'+(d.getMonth() + 1).padLeft(2, '0')+'";case"M":return"'+(d.getMonth() + 1)+'";case"ddd":return o=!0,"'+dd.substring(0, 2).toUpperCase()+'";case"dddd":return o=!0,"'+dd+'";case"dd":return"'+d.getDate().padLeft(2, '0')+'";case"d":return"'+d.getDate()+'";case"HH":case"hh":return u+(n?"window.$jcdatempam(d.getHours()).padLeft(2, '0')":"d.getHours().padLeft(2, '0')")+d;case"H":case"h":return u+(n?"window.$jcdatempam(d.getHours())":"d.getHours()")+d;case"mm":return"'+d.getMinutes().padLeft(2, '0')+'";case"m":return"'+d.getMinutes()+'";case"ss":return"'+d.getSeconds().padLeft(2, '0')+'";case"s":return"'+d.getSeconds()+'";case"w":case"ww":return g=!0,u+("ww"===e?"ww.padLeft(2, '0')":"ww")+d;case"a":return"'+(d.getHours() >= 12 ? 'PM':'AM')+'"}}),i&&c.push("var mm = M.months[d.getMonth()];"),o&&c.push("var dd = M.days[d.getDay()];"),g&&c.push("var ww = new Date(+d);ww.setHours(0, 0, 0);ww.setDate(ww.getDate() + 4 - (ww.getDay() || 7));ww = Math.ceil((((ww - new Date(ww.getFullYear(), 0, 1)) / 8.64e7) + 1) / 7);"),statics[a]=new Function("d",c.join("\n")+"return '"+t+"';"),statics[a](r)}});
//# sourceMappingURL=../sourcemaps/_langx/DateEx.js.map
