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
     { name: "skylark-tangular", location: "../../../skylark-tangular/src"},
     { name: "skylark-totaljs-jcomponent", location: "../../src" }
  ],
});
 

// require(["module/name", ...], function(params){ ... });
require([
  "skylark-utils-dom/query",
  "skylark-tangular",
  "skylark-totaljs-jcomponent/globals"], function ($,Tangular,globals) {
    
    $(function() {
      globals();

COMPONENT('directory', 'minwidth:200', function(self, config) {

  var cls = 'ui-directory';
  var cls2 = '.' + cls;
  var container, timeout, icon, plus, skipreset = false, skipclear = false, ready = false, input = null;
  var is = false, selectedindex = 0, resultscount = 0;
  var template = '<li data-index="{{ $.index }}" data-search="{{ name }}" {{ if selected }} class="current selected{{ if classname }} {{ classname }}{{ fi }}"{{ else if classname }} class="{{ classname }}"{{ fi }}>{{ name | encode | ui_directory_helper }}</li>';

  Thelpers.ui_directory_helper = function(val) {
    var t = this;
    return t.template ? (typeof(t.template) === 'string' ? t.template.indexOf('{{') === -1 ? t.template : Tangular.render(t.template, this) : t.render(this, val)) : self.opt.render ? self.opt.render(this, val) : val;
  };

  self.template = Tangular.compile(template);
  self.readonly();
  self.singleton();
  self.nocompile && self.nocompile();

  self.configure = function(key, value, init) {
    if (init)
      return;
    switch (key) {
      case 'placeholder':
        self.find('input').prop('placeholder', value);
        break;
    }
  };

  self.make = function() {

    self.aclass(cls + ' hidden');
    self.append('<div class="{1}-search"><span class="{1}-add hidden"><i class="fa fa-plus"></i></span><span class="{1}-button"><i class="fa fa-search"></i></span><div><input type="text" placeholder="{0}" class="{1}-search-input" name="dir{2}" autocomplete="dir{2}" /></div></div><div class="{1}-container"><ul></ul></div>'.format(config.placeholder, cls, Date.now()));
    container = self.find('ul');
    input = self.find('input');
    icon = self.find(cls2 + '-button').find('.fa');
    plus = self.find(cls2 + '-add');

    self.event('mouseenter mouseleave', 'li', function() {
      if (ready) {
        container.find('li.current').rclass('current');
        $(this).aclass('current');
        var arr = container.find('li:visible');
        for (var i = 0; i < arr.length; i++) {
          if ($(arr[i]).hclass('current')) {
            selectedindex = i;
            break;
          }
        }
      }
    });

    self.event('click', cls2 + '-button', function(e) {
      input.val('');
      self.search();
      e.stopPropagation();
      e.preventDefault();
    });

    self.event('click', cls2 + '-add', function() {
      if (self.opt.callback) {
        self.opt.callback(input.val(), self.opt.element, true);
        self.hide();
      }
    });

    self.event('click', 'li', function(e) {
      self.opt.callback && self.opt.callback(self.opt.items[+this.getAttribute('data-index')], self.opt.element);
      self.hide();
      e.preventDefault();
      e.stopPropagation();
    });

    var e_click = function(e) {
      is && !$(e.target).hclass(cls + '-search-input') && self.hide(0);
    };

    var e_resize = function() {
      is && self.hide(0);
    };

    self.bindedevents = false;

    self.bindevents = function() {
      if (!self.bindedevents) {
        $(document).on('click', e_click);
        $(window).on('resize', e_resize);
        self.bindedevents = true;
      }
    };

    self.unbindevents = function() {
      if (self.bindedevents) {
        self.bindedevents = false;
        $(document).off('click', e_click);
        $(window).off('resize', e_resize);
      }
    };

    self.event('keydown', 'input', function(e) {
      var o = false;
      switch (e.which) {
        case 8:
          skipclear = false;
          break;
        case 27:
          o = true;
          self.hide();
          break;
        case 13:
          o = true;
          var sel = self.find('li.current');
          if (self.opt.callback) {
            if (sel.length)
              self.opt.callback(self.opt.items[+sel.attrd('index')], self.opt.element);
            else
              self.opt.callback(this.value, self.opt.element, true);
          }
          self.hide();
          break;
        case 38: // up
          o = true;
          selectedindex--;
          if (selectedindex < 0)
            selectedindex = 0;
          self.move();
          break;
        case 40: // down
          o = true;
          selectedindex++;
          if (selectedindex >= resultscount)
            selectedindex = resultscount;
          self.move();
          break;
      }

      if (o) {
        e.preventDefault();
        e.stopPropagation();
      }

    });

    self.event('input', 'input', function() {
      setTimeout2(self.ID, self.search, 100, null, this.value);
    });

    var fn = function() {
      is && self.hide(1);
    };

    self.on('reflow', fn);
    self.on('scroll', fn);
    self.on('resize', fn);
    $(window).on('scroll', fn);
  };

  self.move = function() {
    var counter = 0;
    var scroller = container.parent();
    var h = scroller.height();

    container.find('li').each(function() {
      var el = $(this);

      if (el.hclass('hidden')) {
        el.rclass('current');
        return;
      }

      var is = selectedindex === counter;
      el.tclass('current', is);

      if (is) {
        var t = (h * counter) - h;
        if ((t + h * 4) > h)
          scroller.scrollTop(t - h);
        else
          scroller.scrollTop(0);
      }
      counter++;
    });
  };

  self.search = function(value) {

    if (!self.opt)
      return;

    icon.tclass('fa-times', !!value).tclass('fa-search', !value);
    self.opt.custom && plus.tclass('hidden', !value);

    if (!value && !self.opt.ajax) {
      if (!skipclear)
        container.find('li').rclass('hidden');
      if (!skipreset)
        selectedindex = 0;
      resultscount = self.opt.items ? self.opt.items.length : 0;
      self.move();
      return;
    }

    resultscount = 0;
    selectedindex = 0;

    if (self.opt.ajax) {
      var val = value || '';
      if (self.ajaxold !== val) {
        self.ajaxold = val;
        setTimeout2(self.ID, function(val) {
          self.opt.ajax(val, function(items) {
            var builder = [];
            var indexer = {};
            for (var i = 0; i < items.length; i++) {
              var item = items[i];
              if (self.opt.exclude && self.opt.exclude(item))
                continue;
              indexer.index = i;
              resultscount++;
              builder.push(self.template(item, indexer));
            }
            skipclear = true;
            self.opt.items = items;
            container.html(builder);
            self.move();
          });
        }, 300, null, val);
      }
    } else if (value) {
      value = value.toSearch();
      container.find('li').each(function() {
        var el = $(this);
        var val = el.attrd('search').toSearch();
        var is = val.indexOf(value) === -1;
        el.tclass('hidden', is);
        if (!is)
          resultscount++;
      });
      skipclear = true;
      self.move();
    }
  };

  self.show = function(opt) {

    // opt.element
    // opt.items
    // opt.callback(value, el)
    // opt.offsetX     --> offsetX
    // opt.offsetY     --> offsetY
    // opt.offsetWidth --> plusWidth
    // opt.placeholder
    // opt.render
    // opt.custom
    // opt.minwidth
    // opt.maxwidth
    // opt.key
    // opt.exclude    --> function(item) must return Boolean
    // opt.search
    // opt.selected   --> only for String Array "opt.items"

    var el = opt.element instanceof $ ? opt.element[0] : opt.element;

    if (opt.items == null)
      opt.items = EMPTYARRAY;

    self.tclass(cls + '-default', !opt.render);

    if (!opt.minwidth)
      opt.minwidth = 200;

    if (is) {
      clearTimeout(timeout);
      if (self.target === el) {
        self.hide(1);
        return;
      }
    }

    self.initializing = true;
    self.target = el;
    opt.ajax = null;

    var element = $(opt.element);
    var callback = opt.callback;
    var items = opt.items;
    var type = typeof(items);
    var item;

    if (type === 'function' && callback) {
      opt.ajax = items;
      type = '';
      items = null;
    }

    if (type === 'string')
      items = self.get(items);

    if (!items && !opt.ajax) {
      self.hide(0);
      return;
    }

    self.bindevents();

    self.tclass(cls + '-search-hidden', opt.search === false);

    self.opt = opt;
    opt.class && self.aclass(opt.class);

    input.val('');
    var builder = [];
    var ta = opt.key ? Tangular.compile(template.replace(/\{\{\sname/g, '{{ ' + opt.key)) : self.template;
    var selected = null;

    if (!opt.ajax) {
      var indexer = {};
      for (var i = 0; i < items.length; i++) {
        item = items[i];

        if (typeof(item) === 'string')
          item = { name: item, id: item, selected: item === opt.selected };

        if (opt.exclude && opt.exclude(item))
          continue;

        if (item.selected) {
          selected = i;
          skipreset = true;
        }

        indexer.index = i;
        builder.push(ta(item, indexer));
      }

      if (opt.empty) {
        item = {};
        item[opt.key || 'name'] = opt.empty;
        item.template = '<b>{0}</b>'.format(opt.empty);
        indexer.index = -1;
        builder.unshift(ta(item, indexer));
      }
    }

    self.target = element[0];

    var offset = element.offset();
    var width = element.width() + (opt.offsetWidth || 0);

    if (opt.minwidth && width < opt.minwidth)
      width = opt.minwidth;
    else if (opt.maxwidth && width > opt.maxwidth)
      width = opt.maxwidth;

    ready = false;

    opt.ajaxold = null;
    plus.aclass('hidden');
    self.find('input').prop('placeholder', opt.placeholder || config.placeholder);
    var scroller = self.find(cls2 + '-container').css('width', width + 30);
    container.html(builder.join('\n'));

    var options = { left: offset.left + (opt.offsetX || 0), top: offset.top + (opt.offsetY || 0), width: width };
    self.css(options);

    !isMOBILE && setTimeout(function() {
      ready = true;
      input.focus();
    }, 200);

    setTimeout(function() {
      self.initializing = false;
      is = true;
      if (selected == null)
        scroller[0].scrollTop = 0;
      else
        scroller[0].scrollTop = container.find('.selected').offset().top - (self.element.height() / 2 >> 0);
    }, 50);

    if (is) {
      self.search();
      return;
    }

    selectedindex = selected || 0;
    resultscount = items ? items.length : 0;
    skipclear = true;

    self.search();
    self.rclass('hidden');

    setTimeout(function() {
      if (self.opt && self.target && self.target.offsetParent)
        self.aclass(cls + '-visible');
      else
        self.hide(1);
    }, 100);

    skipreset = false;
  };

  self.hide = function(sleep) {
    if (!is || self.initializing)
      return;
    clearTimeout(timeout);
    timeout = setTimeout(function() {
      self.unbindevents();
      self.rclass(cls + '-visible').aclass('hidden');
      if (self.opt) {
        self.opt.close && self.opt.close();
        self.opt.class && self.rclass(self.opt.class);
        self.opt = null;
      }
      is = false;
    }, sleep ? sleep : 100);
  };
});
      COMPILE();

  $(document).on('click', 'a', function() {

    var opt = {};
    opt.element = this;
    opt.items = [{ name: 'Total.js', template: '<b>{{ name }}</b>' }, { name: 'Express.js' }, { name: 'Meteor.js' }, { name: 'Koa.js' }, { name: 'ASP.NET' }, { name: 'PHP' }, { name: 'Python' }, { name: 'Node.js' }];
    opt.callback = function(value) {
      console.log('CLICK', value);
    };

    SETTER('directory', 'show', opt);
  });
    });
});