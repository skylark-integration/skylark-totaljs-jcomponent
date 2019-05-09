/**
 * skylark-totaljs-jcomponent - A version of totaljs jcomponent that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-totaljs-jcomponent/
 * @license MIT
 */
define(["skylark-langx/langx","./regexp","./now"],function(e,t,r){var a={root:""},n=/\.\*/,s=/\s/g,i=/[^a-zA-Zá-žÁ-Žа-яА-Я\d\s:]/g,c={225:"a",228:"a",269:"c",271:"d",233:"e",283:"e",357:"t",382:"z",250:"u",367:"u",252:"u",369:"u",237:"i",239:"i",244:"o",243:"o",246:"o",353:"s",318:"l",314:"l",253:"y",255:"y",263:"c",345:"r",341:"r",328:"n",337:"o"},u={url:/^(https?:\/\/(?:www\.|(?!www))[^\s.#!:?+=&@!$'~*,;/()[\]]+\.[^\s#!?+=&@!$'~*,;()[\]\\]{2,}\/?|www\.[^\s#!:.?+=&@!$'~*,;/()[\]]+\.[^\s#!?+=&@!$'~*,;()[\]\\]{2,}\/?)/i,phone:/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/im,email:/^[a-zA-Z0-9-_.+]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i},o=String.prototype;o.trimAll=function(){return this.replace(s,"")},o.ROOT=function(t){var r=this,n=a.root,s=a.baseurl,i=/(https|http|wss|ws|file):\/\/|\/\/[a-z0-9]|[a-z]:/i;return n?r=e.isFunction(n)?n(r):i.test(r)?r:n+r:!t&&s&&(r=e.isFunction(s)?s(r):i.test(r)?r:s+r),r.replace(/[^:]\/{2,}/,function(e){return e.substring(0,1)+"/"})},o.replaceWildcard=function(){return this.replace(n,"")},o.parseConfig=o.$config=function(e,t){var r;switch(typeof e){case"function":t=e,r={};break;case"string":r=e.parseConfig();break;case"object":r=null!=e?e:{};break;default:r={}}for(var a=this.env().replace(/\\;/g,"\0").split(";"),n=/^(-)?[0-9.]+$/,s=/(https|http|wss|ws):\/\//gi,i=0,c=a.length;i<c;i++){var u=a[i].replace(/\0/g,";").replace(/\\:/g,"\0").replace(s,function(e){return e.replace(/:/g,"\0")}).split(":");if(2===u.length){var o=u[0].trim(),h=u[1].trim().replace(/\0/g,":").env();if("true"===h||"false"===h)h="true"===h;else if(n.test(h)){var l=+h;isNaN(l)||(h=l)}r[o]=h,t&&t(o,h)}}return r},o.render=function(e,t){return Tangular.render(this,e,t)},o.isJSONDate=function(){var e=this,t=e.length-1;return t>18&&t<30&&90===e.charCodeAt(t)&&84===e.charCodeAt(10)&&45===e.charCodeAt(4)&&58===e.charCodeAt(13)&&58===e.charCodeAt(16)},o.parseExpire=function(){var e=this.split(" "),t=parseInt(e[0]);if(isNaN(t))return 0;switch(e[1].trim().replace(/\./g,"")){case"minutes":case"minute":case"min":case"mm":case"m":return 6e4*t;case"hours":case"hour":case"HH":case"hh":case"h":case"H":return 36e5*t;case"seconds":case"second":case"sec":case"ss":case"s":return 1e3*t;case"days":case"day":case"DD":case"dd":case"d":return 864e5*t;case"months":case"month":case"MM":case"M":return 24192e5*t;case"weeks":case"week":case"W":case"w":return 6048e5*t;case"years":case"year":case"yyyy":case"yy":case"y":return 31536e6*t;default:return 0}},o.removeDiacritics=function(){for(var e="",t=0,r=this.length;t<r;t++){var a=this[t],n=a.charCodeAt(0),s=!1,i=c[n];void 0===i&&(n=a.toLowerCase().charCodeAt(0),i=c[n],s=!0),void 0!==i?(a=i,e+=s?a.toUpperCase():a):e+=a}return e},o.toSearch=function(){for(var e=this.replace(i,"").trim().toLowerCase().removeDiacritics(),t=[],r="",a=0,n=e.length;a<n;a++){var s=e.substring(a,a+1);"y"===s&&(s="i"),s!==r&&(r=s,t.push(s))}return t.join("")},o.slug=function(e){e=e||60;for(var t=this.trim().toLowerCase().removeDiacritics(),r="",a=t.length,n=0;n<a;n++){var s=t.substring(n,n+1),i=t.charCodeAt(n);if(r.length>=e)break;i>31&&i<48?"-"!==r.substring(r.length-1,r.length)&&(r+="-"):i>47&&i<58?r+=s:i>94&&i<123&&(r+=s)}var c=r.length-1;return"-"===r[c]?r.substring(0,c):r},o.isEmail=function(){return!(this.length<=4)&&u.email.test(this)},o.isPhone=function(){return!(this.length<6)&&u.phone.test(this)},o.isURL=function(){return!(this.length<=7)&&u.url.test(this)},o.parseInt=function(e){var r=this.trim().match(t.int);return r?(r=+r[0],isNaN(r)?e||0:r):e||0},o.parseFloat=function(e){var r=this.trim().match(t.float);return r?(-1!==(r=r[0]).indexOf(",")&&(r=r.replace(",",".")),r=+r,isNaN(r)?e||0:r):e||0},o.padLeft=function(e,t){var r=this.toString();return Array(Math.max(0,e-r.length+1)).join(t||" ")+r},o.padRight=function(e,t){var r=this.toString();return r+Array(Math.max(0,e-r.length+1)).join(t||" ")},o.format=function(){var e=arguments;return this.replace(t.format,function(t){var r=e[+t.substring(1,t.length-1)];return null==r?"":r instanceof Array?r.join(""):r})},o.parseDate=function(){var e=this.trim();if(!e)return null;var t=e.charCodeAt(e.length-1);if(41===t)return new Date(e);if(90===t)return new Date(Date.parse(e));var a=-1===e.indexOf(" ")?e.split("T"):e.split(" "),n=a[0].indexOf(":"),s=a[0].length;if(-1!==n){var i=a[1];a[1]=a[0],a[0]=i}void 0===a[0]&&(a[0]="");for(var c=void 0===a[1]||0===a[1].length,u=0;u<s;u++){var o=a[0].charCodeAt(u);if(!(o>47&&o<58||45===o||46===o)&&c)return new Date(e)}void 0===a[1]&&(a[1]="00:00:00");var h=-1===a[0].indexOf("-"),l=(a[0]||"").split(h?".":"-"),f=(a[1]||"").split(":"),g=[];if(l.length<4&&f.length<2)return new Date(e);-1!==(n=(f[2]||"").indexOf("."))?(f[3]=f[2].substring(n+1),f[2]=f[2].substring(0,n)):f[3]="0",g.push(+l[h?2:0]),g.push(+l[1]),g.push(+l[h?0:2]),g.push(+f[0]),g.push(+f[1]),g.push(+f[2]),g.push(+f[3]);var p=r(!0);for(u=0,s=g.length;u<s;u++){isNaN(g[u])&&(g[u]=0);var v=g[u];if(0===v)switch(u){case 0:v<=0&&(g[u]=p.getFullYear());break;case 1:v<=0&&(g[u]=p.getMonth()+1);break;case 2:v<=0&&(g[u]=p.getDate())}}return new Date(g[0],g[1]-1,g[2],g[3],g[4],g[5])}});
//# sourceMappingURL=../sourcemaps/langx/StringEx.js.map
