require.config({
  baseUrl: "./"
  ,map: {
    '*': {
      'jquery': 'skylark-jquery/core'
  	}
  }
  , shim: {
  }
  ,packages : [
     { name: "skylark-langx", location: "../../node_modules/skylark-langx/dist/uncompressed/skylark-langx" },
     { name: "skylark-utils-dom", location: "../../node_modules/skylark-utils-dom/dist/uncompressed/skylark-utils-dom"},
     { name: "skylark-totaljs-jcomponent", location: "../../src" }
  ],
});
 
var form = {};

// require(["module/name", ...], function(params){ ... });
require([
  "skylark-utils-dom/query",
  "skylark-totaljs-jcomponent/globals"], function ($,globals) {
    $(function() {
      globals();

COMPONENT('textarea', 'scrollbar:true', function(self, config) {

  var input, content = null;

  self.nocompile && self.nocompile();

  self.validate = function(value) {
    if (config.disabled || !config.required || config.readonly)
      return true;
    if (value == null)
      value = '';
    else
      value = value.toString();
    return value.length > 0;
  };

  self.configure = function(key, value, init) {
    if (init)
      return;

    var redraw = false;

    switch (key) {
      case 'readonly':
        self.find('textarea').prop('readonly', value);
        break;
      case 'disabled':
        self.tclass('ui-disabled', value);
        self.find('textarea').prop('disabled', value);
        self.reset();
        break;
      case 'required':
        self.noValid(!value);
        !value && self.state(1, 1);
        self.tclass('ui-textarea-required', value);
        break;
      case 'placeholder':
        input.prop('placeholder', value || '');
        break;
      case 'maxlength':
        input.prop('maxlength', value || 1000);
        break;
      case 'label':
        redraw = true;
        break;
      case 'autofocus':
        input.focus();
        break;
      case 'monospace':
        self.tclass('ui-textarea-monospace', value);
        break;
      case 'icon':
        redraw = true;
        break;
      case 'format':
        self.format = value;
        self.refresh();
        break;
      case 'height':
        self.find('textarea').css('height', (value > 0 ? value + 'px' : value));
        break;
    }

    redraw && setTimeout2('redraw' + self.id, function() {
      self.redraw();
      self.refresh();
    }, 100);
  };

  self.redraw = function() {

    var attrs = [];
    var builder = [];

    self.tclass('ui-disabled', config.disabled === true);
    self.tclass('ui-textarea-monospace', config.monospace === true);
    self.tclass('ui-textarea-required', config.required === true);

    config.placeholder && attrs.attr('placeholder', config.placeholder);
    config.maxlength && attrs.attr('maxlength', config.maxlength);
    config.error && attrs.attr('error');
    attrs.attr('data-jc-bind', '');
    config.height && attrs.attr('style', 'height:{0}px'.format(config.height));
    config.autofocus === 'true' && attrs.attr('autofocus');
    config.disabled && attrs.attr('disabled');
    config.readonly && attrs.attr('readonly');
    builder.push('<textarea {0}></textarea>'.format(attrs.join(' ')));

    var label = config.label || content;

    if (!label.length) {
      config.error && builder.push('<div class="ui-textarea-helper"><i class="fa fa-warning" aria-hidden="true"></i> {0}</div>'.format(config.error));
      self.aclass('ui-textarea ui-textarea-container');
      self.html(builder.join(''));
      input = self.find('textarea');
      return;
    }

    var html = builder.join('');

    builder = [];
    builder.push('<div class="ui-textarea-label">');
    config.icon && builder.push('<i class="fa fa-{0}"></i>'.format(config.icon));
    builder.push(label);
    builder.push(':</div><div class="ui-textarea">{0}</div>'.format(html));
    config.error && builder.push('<div class="ui-textarea-helper"><i class="fa fa-warning" aria-hidden="true"></i> {0}</div>'.format(config.error));

    self.html(builder.join(''));
    self.rclass('ui-textarea');
    self.aclass('ui-textarea-container');
    input = self.find('textarea');

    if (!config.scrollbar) {
      input.noscrollbar();
      input.css('padding-right', (SCROLLBARWIDTH() + 5) + 'px');
    }
  };

  self.make = function() {
    content = self.html();
    self.type = config.type;
    self.format = config.format;
    self.redraw();
  };

  self.state = function(type) {
    if (!type)
      return;
    var invalid = config.required ? self.isInvalid() : false;
    if (invalid === self.$oldstate)
      return;
    self.$oldstate = invalid;
    self.tclass('ui-textarea-invalid', invalid);
    config.error && self.find('.ui-textarea-helper').tclass('ui-textarea-helper-show', invalid);
  };
});

COMPONENT('jsontree', function(self, config) {

  var item = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAYAAADE6YVjAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAOxAAADsQBlSsOGwAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAABoSURBVEiJ7dSxDYAwDETRO4vBsk22QBFTJNuExXKp6CgMKBKFf23rdUcAhLNaayG5Ayg558P7Z97DLwUSSCA/QbY3TyRTa809R48QM4MkSEoA0hJkjAGSINklnUuQK0k9VjiQQAK5bwLU3xq8lh5dEwAAAABJRU5ErkJggg==';
  var itemlast = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAYAAADE6YVjAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAOxAAADsQBlSsOGwAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAABnSURBVEiJ7ZSxDYAwDAQvyHvBNhkjyhgeJ5swSAqaFKmCMQ1CPum7f11jOQEJI6pagALUnHO17jZr8Q0hCUlIPiIR5+5Q1WVhfjteyT6ywifpvTcRacA5YiLx4At7+c91hSQkIbnnAlzgEDui0adaAAAAAElFTkSuQmCC';
  var spacer = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAYAAADE6YVjAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAOxAAADsQBlSsOGwAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAA2SURBVEiJ7c1BDQBACMTAcmaRQZCBWyyQ3Ld972YCCI7NTAEFdGb29feuw59ERERERERERERYWZ4FM3XRVJ0AAAAASUVORK5CYII=';
  var spacerempty = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAYAAADE6YVjAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAOxAAADsQBlSsOGwAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAAZSURBVEiJ7cEBDQAAAMKg909tDwcUAAA3BgndAAF85o4iAAAAAElFTkSuQmCC';
  var $tree, $textarea;

  self.readonly();

  self.make = function(){
    var title = self.html();
    self.empty();
    self.aclass('jsontree');
    self.append('<div class="jsontree-label"><i class="fa fa-code-fork fa-rotate-90"></i>&nbsp;{0}<button>Clear</button></div>'.format(title || 'JSON tree'));
    self.append('<div class="jsontree-textarea"><div data-jc="textarea__{0}__height:400" data-jc-noscope="true"></div></div>'.format(self.path));
    self.append('<div class="jsontree-tree hidden"></div>');
    $textarea = self.find('.jsontree-textarea');
    $tree = self.find('.jsontree-tree');

    self.event('click', 'span', function(){
      var path = $(this).parent().attrd('path');
      config.click && EXEC(config.click, path, self);
    });

    self.event('click', 'button', function(){
      self.set('');
    });
  };

  self.setter = function(value) {

    if (!value || typeof value !== 'string') {
      $tree.tclass('hidden', true);
      $textarea.tclass('hidden', false);
      return $tree.html('<div style="color:grey;width:100%;text-align:center;">INCORRECT OR NO DATA</div>');
    }

    var parsed = PARSE(value);
    if (!parsed) {
      $tree.tclass('hidden', true);
      $textarea.tclass('hidden', false);
      return $tree.html('<div style="color:grey;width:100%;text-align:center;">PARSING ERROR</div>');
    }

    $textarea.tclass('hidden', true);
    $tree.html(self.tree(parsed, ''));
    $tree.tclass('hidden', false);
  };

  self.tree = function(obj, path, spacers) {
    var temp = '';
    var keys = Object.keys(obj);
    var kl = keys.length;
    var sp = [].concat(spacers || []);
    var isArr = obj instanceof Array;
    for (var i = 0; i < kl; i++) {
      var isNum = !isNaN(keys[i]) && !isArr;
      var p = path + (isArr || isNum ? '[{0}'.format(isNum ? '\'' : '') : path === '' ? path : '.') + keys[i] + (isArr || isNum ? '{0}]'.format(isNum ? '\'' : '') : '');
      var item = obj[keys[i]];
      var last = i === kl - 1;
      var s = spacers ? sp.concat([last]) : [];
      temp += self.treeitem(p, last, keys[i], s);
      if (typeof item === 'object')
        temp += self.tree(item, p, s);
    }
    return temp;
  };

  self.treeitem = function(path, last, key, s) {
    var img = s.length ? '<img src="{0}"/>'.format(last ? itemlast : item) : '';
    return '<div class="treeitem">' + self.spacer(s) + '<div data-path="{0}" title="{0}">{1}<span>'.format(path, img) + key + '<span></div></div>\n';
  };

  self.spacer = function(s) {
    var d = '';
    for (var i = 0; i < s.length - 1; i++)
      d += '<div class="spacer"><img src="{0}"/></div>'.format(s[i] ? spacerempty : spacer);
    return d;
  };
});

    SET('json', '{"datecreated":"2018-06-18T22:27:00.000Z","name":"j-JSONTree","color":"transparent","version":1,"responsive":true,"picture":"picture.png","dependencies":"","author":"Martin Smola","email":"smola.martin@gmail.com","license":"MIT"}');

      COMPILE();


    });
});