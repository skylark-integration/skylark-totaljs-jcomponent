function initPage($,Tangular,globals) {

COMPONENT('timepicker', function(self, config) {

  var cls = 'ui-timepicker';
  var cls2 = '.' + cls;
  var bindedevents = false;
  var timeout = 0;
  var is;

  self.readonly();
  self.singleton();
  self.nocompile && self.nocompile();

  self.make = function() {

    self.aclass(cls + ' hidden');
    self.append('<div class="{0}-hours"><i class="fa fa-chevron-up"></i><input type="text" maxlength="2" /><i class="fa fa-chevron-down"></i></div><div class="{0}-minutes"><i class="fa fa-chevron-up"></i><input type="text" maxlength="2" /><i class="fa fa-chevron-down"></i></div><div class="{0}-seconds hidden"><i class="fa fa-chevron-up"></i><input type="text" maxlength="2" /><i class="fa fa-chevron-down"></i></div><div class="{0}-ampm hidden"><i class="fa fa-chevron-up"></i><span>AM</span><i class="fa fa-chevron-down"></i></div>'.format(cls));

    var fn = function(e) {
      if (is && (e.type !== 'keydown' || e.which === 27))
        self.hide(1);
    };

    self.on('reflow', fn);
    self.on('scroll', fn);
    self.on('resize', fn);

    self.event('keydown', 'input', function(e) {
      var code = e.which;

      if (code === 38 || code === 40) {
        e.preventDefault();
        $(this).parent().find('.fa-chevron-' + (code === 38 ? 'up' : 'down')).trigger('click');
        return;
      }

      if (code === 13 || code === 27) {
        self.hide(1);
        return;
      }

      if ((code === 9 || code === 8 || code === 37 || code === 39 || code === 27 || (code > 47 && code < 58))) {
        if (code > 47 || code === 8)
          self.update();
      } else
        e.preventDefault();
    });

    self.event('click', 'i', function() {

      var el = $(this);
      var parent = el.parent();
      var cls = parent.attr('class');
      var up = el.hclass('fa-chevron-up');
      var type = cls.substring(cls.lastIndexOf('-') + 1);
      var val;

      switch (type) {
        case 'hours':
        case 'minutes':
        case 'seconds':
          var input = parent.find('input');
          val = +input.val();

          if (up)
            val++;
          else
            val--;

          if (val < 0) {
            if (type === 'hours')
              val = self.opt.ampm ? 12 : 23;
            else
              val = 59;
          } else {
            if (type === 'hours') {
              if (self.opt.ampm) {
                if (val > 12)
                  val = 0;
              } else if (val > 23)
                val = 0;
            } else {
              if (val > 59)
                val = 0;
            }
          }

          val = val.toString();
          input.val(self.opt.ampm ? val : (val.length > 1 ? val : ('0' + val)));
          break;
        case 'ampm':
          var span = self.find('span');
          val = span.text().toLowerCase();
          if (val === 'am')
            val = 'PM';
          else
            val = 'AM';
          span.html(val);
          break;
      }

      self.update();
    });

    self.update = function() {
      setTimeout2(self.ID, function() {

        var current = self.opt.current;
        var h = +(self.find(cls2 + '-hours input').val() || '0');
        var m = +(self.find(cls2 + '-minutes input').val() || '0');
        var s = +(self.find(cls2 + '-seconds input').val() || '0');
        var ampm = +self.find(cls2 + '-ampm span').html().toLowerCase();

        if (!self.opt.seconds)
          s = 0;

        if (ampm === 'pm')
          h += 12;

        current.setHours(h);
        current.setMinutes(m);
        current.setSeconds(s);

        if (self.opt.callback)
          self.opt.callback(current);
        else if (self.opt.path)
          SET(self.opt.path, current);

      }, 500);
    };

    self.event('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
    });

    self.bindevents = function() {
      if (!bindedevents) {
        bindedevents = true;
        $(document).on('click', fn);
        $(W).on('scroll', fn).on('keydown', fn);
      }
    };

    self.unbindevents = function() {
      if (bindedevents) {
        bindedevents = false;
        $(document).off('click', fn);
        $(W).off('scroll', fn).off('keydown', fn);
      }
    };
  };

  self.show = self.toggle = function(opt) {

    var el = opt.element;
    if (el instanceof $)
      el = el[0];

    if (self.target === el) {
      self.hide(0);
      return;
    }

    var value = opt.value || opt.date || opt.time;

    if (typeof(value) === 'string') {
      opt.path = value;
      value = GET(value);
    }

    var count = 0;

    if (opt.ampm == null)
      opt.ampm = !!config.ampm;

    if (opt.seconds == null)
      opt.seconds = !!config.seconds;

    self.find(cls2 + '-seconds').tclass('hidden', !opt.seconds);
    self.find(cls2 + '-ampm').tclass('hidden', !opt.ampm);

    if (opt.seconds)
      count++;

    if (opt.ampm)
      count++;

    var ampm = opt.ampm;

    self.find(cls2 + '-hours input').val(value.format(ampm ? '!H' : 'HH'));
    self.find(cls2 + '-minutes input').val(value.format(ampm ? 'm' : 'mm'));
    self.find(cls2 + '-seconds input').val(value.format(ampm ? 's' : 'ss'));
    self.find(cls2 + '-ampm span').html(value.format('a').toUpperCase());

    opt.current = value;
    self.target = el;
    self.opt = opt;
    self.bindevents();

    el = $(el);
    var off = el.offset();

    if (opt.offsetX)
      off.left += opt.offsetX;

    if (opt.offsetY)
      off.top += opt.offsetY;

    off.top += el.innerHeight() + 12;
    self.element.css(off);
    self.rclass2(cls + '-').tclass(cls + '-' + count).rclass('hidden').aclass(cls + '-visible', 100);
    clearTimeout(timeout);

    setTimeout(function() {
      is = true;
    }, 500);
  };

  self.hide = function(sleep) {
    if (!is)
      return;
    clearTimeout(timeout);
    timeout = setTimeout(function() {
      self.unbindevents();

      if (self.opt) {
        self.opt.close && self.opt.close();
        self.opt.close = null;
      }

      self.rclass(cls + '-visible').aclass('hidden');
      self.target = null;
      is = false;
    }, sleep ? sleep : 100);
  };

});      

COMPONENT('datepicker', 'today:Set today;firstday:0;close:Close;yearselect:true;monthselect:true;yearfrom:-70 years;yearto:5 years', function(self, config) {

  var skip = false;
  var visible = false;
  var touchdiff;
  var startX;

  self.days = EMPTYARRAY;
  self.months = EMPTYARRAY;
  self.months_short = EMPTYARRAY;
  self.years_from;
  self.years_to;

  self.singleton();
  self.readonly();
  self.nocompile();

  self.configure = function(key, value) {
    switch (key) {
      case 'days':
        if (value instanceof Array)
          self.days = value;
        else
          self.days = value.split(',').trim();

        for (var i = 0; i < DAYS.length; i++) {
          DAYS[i] = self.days[i];
          self.days[i] = DAYS[i].substring(0, 2).toUpperCase();
        }

        break;

      case 'months':
        if (value instanceof Array)
          self.months = value;
        else
          self.months = value.split(',').trim();

        self.months_short = [];

        for (var i = 0, length = self.months.length; i < length; i++) {
          var m = self.months[i];
          MONTHS[i] = m;
          if (m.length > 4)
            m = m.substring(0, 3) + '.';
          self.months_short.push(m);
        }
        break;

      case 'yearfrom':
        if (value.indexOf('current') !== -1)
          self.years_from = +(new Date().format('yyyy'));
        else
          self.years_from = +(new Date().add(value).format('yyyy'));
        break;

      case 'yearto':
        if (value.indexOf('current') !== -1)
          self.years_to = +(new Date().format('yyyy'));
        else
          self.years_to = +(new Date().add(value).format('yyyy'));
        break;
    }
  };

  function getMonthDays(dt) {

    var m = dt.getMonth();
    var y = dt.getFullYear();

    if (m === -1) {
      m = 11;
      y--;
    }

    return (32 - new Date(y, m, 32).getDate());
  }

  self.calculate = function(year, month, selected) {

    var d = new Date(year, month, 1, 12, 0);
    var output = { header: [], days: [], month: month, year: year };
    var firstDay = config.firstday;
    var firstCount = 0;
    var frm = d.getDay() - firstDay;
    var today = new Date();
    var ty = today.getFullYear();
    var tm = today.getMonth();
    var td = today.getDate();
    var sy = selected ? selected.getFullYear() : -1;
    var sm = selected ? selected.getMonth() : -1;
    var sd = selected ? selected.getDate() : -1;
    var days = getMonthDays(d);

    if (frm < 0)
      frm = 7 + frm;

    while (firstCount++ < 7) {
      output.header.push({ index: firstDay, name: self.days[firstDay] });
      firstDay++;
      if (firstDay > 6)
        firstDay = 0;
    }

    var index = 0;
    var indexEmpty = 0;
    var count = 0;
    var prev = getMonthDays(new Date(year, month - 1, 1, 12, 0)) - frm;
    var cur;

    for (var i = 0; i < days + frm; i++) {

      var obj = { isToday: false, isSelected: false, isEmpty: false, isFuture: false, number: 0, index: ++count };

      if (i >= frm) {
        obj.number = ++index;
        obj.isSelected = sy === year && sm === month && sd === index;
        obj.isToday = ty === year && tm === month && td === index;
        obj.isFuture = ty < year;
        if (!obj.isFuture && year === ty) {
          if (tm < month)
            obj.isFuture = true;
          else if (tm === month)
            obj.isFuture = td < index;
        }

      } else {
        indexEmpty++;
        obj.number = prev + indexEmpty;
        obj.isEmpty = true;
        cur = d.add('-' + indexEmpty + ' days');
      }

      if (!obj.isEmpty)
        cur = d.add(i + ' days');

      obj.month = i >= frm && obj.number <= days ? d.getMonth() : cur.getMonth();
      obj.year = i >= frm && obj.number <= days ? d.getFullYear() : cur.getFullYear();
      obj.date = cur;
      output.days.push(obj);
    }

    indexEmpty = 0;

    for (var i = count; i < 42; i++) {
      var cur = d.add(i + ' days');
      var obj = { isToday: false, isSelected: false, isEmpty: true, isFuture: true, number: ++indexEmpty, index: ++count };
      obj.month = cur.getMonth();
      obj.year = cur.getFullYear();
      obj.date = cur;
      output.days.push(obj);
    }

    return output;
  };

  self.hide = function() {
    if (visible) {
      self.unbindevents();
      self.opt.close && self.opt.close();
      self.opt = null;
      self.older = null;
      self.target = null;
      self.aclass('hidden');
      self.rclass('ui-datepicker-visible');
      visible = false;
    }
    return self;
  };

  self.show = function(opt) {

    setTimeout(function() {
      clearTimeout2('datepickerhide');
    }, 5);

    var el = $(opt.element);
    var dom = el[0];

    if (self.target === dom) {
      self.hide();
      return;
    }

    if (self.opt && self.opt.close)
      self.opt.close();

    var off = el.offset();
    var h = el.innerHeight();
    var l = off.left + (opt.offsetX || 0);
    var t = off.top + h + 12 + (opt.offsetY || 0);
    var s = 250;

    if (l + s > WW) {
      var w = el.innerWidth();
      l = (l + w) - s;
    }

    var dt = typeof(opt.value) === 'string' ? GET(opt.value) : opt.value;
    if ((!(dt instanceof Date)) || isNaN(dt.getTime()))
      dt = NOW;

    self.opt = opt;
    self.time = dt.format('HH:mm:ss');
    self.css({ left: l, top: t });
    self.rclass('hidden');
    self.date(dt);
    self.aclass('ui-datepicker-visible', 50);
    self.bindevents();
    self.target = dom;
    visible = true;
    return self;
  };

  self.setdate = function(dt) {

    var time = self.time.split(':');

    if (time.length > 1) {
      dt.setHours(+(time[0] || '0'));
      dt.setMinutes(+(time[1] || '0'));
      dt.setSeconds(+(time[2] || '0'));
    }

    if (typeof(self.opt.value) === 'string')
      SET2(self.opt.value, dt);
    else
      self.opt.callback(dt);
  };

  self.make = function() {

    self.aclass('ui-datepicker hidden');

    var conf = {};

    if (!config.days) {
      conf.days = [];
      for (var i = 0; i < DAYS.length; i++)
        conf.days.push(DAYS[i].substring(0, 2).toUpperCase());
    }

    !config.months && (conf.months = MONTHS);
    self.reconfigure(conf);

    self.event('click', '.ui-datepicker-today-a', function() {
      self.setdate(new Date());
      self.hide();
    });

    self.event('click touchend', '.ui-datepicker-day', function() {
      if (Date.now() - touchdiff > 500)
        return;
      var arr = this.getAttribute('data-date').split('-');
      var dt = new Date(+arr[0], +arr[1], +arr[2], 12, 0);
      self.find('.ui-datepicker-selected').rclass('ui-datepicker-selected');
      var el = $(this).aclass('ui-datepicker-selected');
      skip = !el.hclass('ui-datepicker-disabled');
      self.setdate(dt);
      self.hide();
    });

    self.event('click', '.ui-datepicker-header', function(e) {
      e.stopPropagation();
    });

    self.event('change', '.ui-datepicker-year', function(e) {

      clearTimeout2('datepickerhide');
      e.preventDefault();
      e.stopPropagation();

      var arr = $(this).attrd('date').split('-');
      var dt = new Date(+arr[0], +arr[1], 1, 12, 0);
      dt.setFullYear(this.value);
      self.date(dt, true);
    });

    self.event('change', '.ui-datepicker-month', function(e){

      clearTimeout2('datepickerhide');
      e.preventDefault();
      e.stopPropagation();

      var arr = $(this).attrd('date').split('-');
      var dt = new Date(+arr[0], +arr[1], 1, 12, 0);
      dt.setMonth(this.value);
      self.date(dt, true);
    });

    self.event('click', 'button', function(e) {

      e.preventDefault();
      e.stopPropagation();

      var arr = $(this).attrd('date').split('-');
      var dt = new Date(+arr[0], +arr[1], 1, 12, 0);
      switch (this.name) {
        case 'prev':
          dt.setMonth(dt.getMonth() - 1);
          break;
        case 'next':
          dt.setMonth(dt.getMonth() + 1);
          break;
      }

      self.date(dt, true);
    });

    self.event('touchstart touchmove', '.ui-datepicker-table',function(e){

      e.stopPropagation();
      e.preventDefault();

      var x = e.originalEvent.touches[0].pageX;

      if (e.type === 'touchstart') {
        startX = x;
        touchdiff = Date.now();
        return;
      }

      var diffX = startX - x;
      if (diffX > 70 || diffX < -70) {
        var arr = $(this).data('date').split('-');
        var dt = new Date(+arr[0], +arr[1], 1, 12, 0);
        dt.setMonth(dt.getMonth() + (diffX > 50 ? 1 : -1));
        self.date(dt, true);
      }
    });

    window.$datepicker = self;

    var hide = function() {
      visible && window.$datepicker && window.$datepicker.hide();
    };

    var hide2 = function() {
      visible && setTimeout2('datepickerhide', function() {
        window.$datepicker && window.$datepicker.hide();
      }, 20);
    };

    self.bindevents = function() {
      if (!visible)
        $(window).on('scroll click', hide2);
    };

    self.unbindevents = function() {
      if (visible)
        $(window).off('scroll click', hide2);
    };

    self.on('reflow + scroll + resize', hide);
  };

  self.date = function(value, skipday) {

    var clssel = 'ui-datepicker-selected';

    if (typeof(value) === 'string')
      value = value.parseDate();

    var year = value == null ? null : value.getFullYear();
    if (year && (year < self.years_from || year > self.years_to))
      return;

    if (!value || isNaN(value.getTime())) {
      self.find('.' + clssel).rclass(clssel);
      value = NOW;
    }

    var empty = !value;

    if (skipday) {
      skipday = false;
      empty = true;
    }

    if (skip) {
      skip = false;
      return;
    }

    if (!value)
      value = NOW = new Date();

    var output = self.calculate(value.getFullYear(), value.getMonth(), value);
    var builder = [];

    for (var i = 0; i < 42; i++) {

      var item = output.days[i];

      if (i % 7 === 0) {
        builder.length && builder.push('</tr>');
        builder.push('<tr>');
      }

      var cls = [];

      item.isEmpty && cls.push('ui-datepicker-disabled');
      cls.push('ui-datepicker-day');

      !empty && item.isSelected && cls.push(clssel);
      item.isToday && cls.push('ui-datepicker-day-today');
      builder.push('<td class="{0}" data-date="{1}-{2}-{3}"><div>{3}</div></td>'.format(cls.join(' '), item.year, item.month, item.number));
    }

    builder.push('</tr>');

    var header = [];
    for (var i = 0; i < 7; i++)
      header.push('<th>{0}</th>'.format(output.header[i].name));

    var years = value.getFullYear();
    if (config.yearselect) {
      years = '';
      var current_year = value.getFullYear();
      for (var i = self.years_from; i <= self.years_to; i++)
        years += '<option value="{0}" {1}>{0}</option>'.format(i, i === current_year ? 'selected' : '');
      years = '<select data-date="{0}-{1}" class="ui-datepicker-year">{2}</select>'.format(output.year, output.month, years);
    }

    var months = self.months[value.getMonth()];
    if (config.monthselect) {
      months = '';
      var current_month = value.getMonth();
      for (var i = 0, l = self.months.length; i < l; i++)
        months += '<option value="{0}" {2}>{1}</option>'.format(i, self.months[i], i === current_month ? 'selected' : '');
      months = '<select data-date="{0}-{1}" class="ui-datepicker-month">{2}</select>'.format(output.year, output.month, months);
    }

    self.html('<div class="ui-datepicker-header"><button class="ui-datepicker-header-prev" name="prev" data-date="{0}-{1}"><span class="fa fa-arrow-left"></span></button><div class="ui-datepicker-header-info">{2} {3}</div><button class="ui-datepicker-header-next" name="next" data-date="{0}-{1}"><span class="fa fa-arrow-right"></span></button></div><div class="ui-datepicker-table" data-date="{0}-{1}"><table cellpadding="0" cellspacing="0" border="0"><thead>{4}</thead><tbody>{5}</tbody></table></div>'.format(output.year, output.month, months, years, header.join(''), builder.join('')) + (config.today ? '<div class="ui-datepicker-today"><span class="link">{0}</span><span class="link ui-datepicker-today-a"><i class="fa fa-datepicker"></i>{1}</span></div>'.format(config.close, config.today) : ''));
  };
});

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
COMPONENT('filter', 'reset:Reset;apply:Apply;cancel:Cancel', function(self, config) {

  var cls = 'ui-filter';
  var cls2 = '.' + cls;
  var events = {};
  var is = false;
  var container, timeout;

  self.singleton();
  self.readonly();
  self.nocompile && self.nocompile();

  self.bindevents = function() {
    if (!is)
      $(W).on('scroll', events.resize).on('resize', events.resize);
  };

  self.unbindevents = function() {
    if (is)
      $(W).off('scroll', events.resize).off('resize', events.resize);
  };

  self.make = function() {
    self.aclass(cls + ' hidden');
    self.append('<div class="' + cls + '-items"></div><div class="' + cls + '-buttons"><button name="reset">{reset}</button><button name="apply"><i class="fa fa-filter"></i>{apply}</button><button name="cancel">{cancel}</button></div>'.arg(config));
    container = self.find(cls2 + '-items');

    self.event('click', 'button', function(e) {
      e.preventDefault();
      var t = this;
      if (t.name === 'cancel') {
        self.hide(1);
      } else if (t.name === 'reset') {
        self.opt.callback(null);
        self.hide(1);
      } else {

        var obj = {};
        var changed = [];

        for (var i = 0; i < self.opt.items.length; i++) {
          var item = self.opt.items[i];
          var key = item.name || item.label;
          if (item.current != null) {
            obj[key] = item.current;
            if (item.changed)
              changed.push(key);
          }
        }

        self.opt.callback(obj, changed);
        self.hide(1);
      }
    });

    self.event('change', 'input', function() {
      var el = $(this);
      el = el.closest(cls2 + '-item');
      self.val(el, this.value);
    });

    self.event('input', 'input', function() {
      var t = this;
      if (t.$prev != t.value) {
        t.$prev = t.value;
        $(t).closest(cls2 + '-item').find(cls2 + '-placeholder').tclass('hidden', !!t.value);
      }
    });

    self.event('click', cls2 + '-checkbox', function() {
      var el = $(this);
      var is = !el.hclass(cls + '-checkbox-checked');
      el = el.closest(cls2 + '-item');
      self.val(el, is);
    });

    self.event('click', cls2 + '-icon-click,' + cls2 + '-placeholder', function() {

      var el = $(this).closest(cls2 + '-item');
      var item = self.opt.items[+el.attrd('index')];
      var opt;

      if (item.type === Date) {
        opt = {};
        opt.offsetX = -5;
        opt.offsetY = -5;
        opt.value = item.current || NOW;
        opt.element = el.find('input');
        opt.callback = function(date) {
          self.val(el, date);
        };
        SETTER('datepicker', 'show', opt);
      } else if (item.type instanceof Array) {
        el.find(cls2 + '-option').trigger('click');
      } else if (item.type === 'Time') {
        opt = {};
        opt.offsetX = -5;
        opt.offsetY = -5;
        opt.value = item.current || NOW;
        opt.element = el.find('input');
        opt.callback = function(date) {
          self.val(el, date);
        };
        SETTER('timepicker', 'show', opt);
      } else
        el.find('input').focus();
    });

    self.event('click', cls2 + '-option', function() {

      var el = $(this).closest(cls2 + '-item');
      var item = self.opt.items[+el.attrd('index')];
      var opt = {};

      opt.element = el;
      opt.items = item.type;
      opt.offsetWidth = -20;
      opt.placeholder = 'Search';
      opt.offsetX = 10;
      opt.offsetY = 10;
      opt.key = item.dirkey;
      opt.empty = item.dirempty;

      opt.callback = function(selected, el, custom) {

        if (custom)
          return;

        if (typeof(selected) === 'string')
          self.val(opt.element, selected);
        else
          self.val(opt.element, selected[item.dirvalue]);
      };

      SETTER('directory', 'show', opt);
    });

    events.resize = function() {
      is && self.hide(1);
    };

    self.on('reflow', events.resize);
    self.on('scroll', events.resize);
    self.on('resize', events.resize);
  };

  self.val = function(el, val, init) {

    var item = self.opt.items[+el.attrd('index')];
    var type = typeof(val);
    var tmp;

    if (item.type instanceof Array) {
      if (typeof(item.type[0]) === 'string') {
        tmp = item.type.indexOf(val);
        if (tmp !== -1) {
          el.find(cls2 + '-option').html(val);
          item.current = val;
        }
      } else {
        item.current = val;
        val = item.type.findValue(item.dirvalue, val, item.dirkey, '');
        el.find(cls2 + '-option').html(val);
      }
    } else {
      switch (item.type) {
        case Date:
          if (type === 'string')
            val = val ? val.parseDate(item.format) : '';
          break;
        case Number:
          if (type === 'string')
            val = val.parseFloat();
          break;
        case Boolean:
          el.find(cls2 + '-checkbox').tclass(cls + '-checkbox-checked', val);
          break;
        case 'Time':
          if (type === 'string') {
            val = val ? val.parseDate(item.format) : '';
            item.current.setHours(val.getHours());
            item.current.setMinutes(val.getMinutes());
            item.current.setSeconds(val.getSeconds());
          }
          break;
      }
      item.current = val;
      val = val ? item.format ? val.format(item.format) : val : '';
      item.input && (el.find('input').val(val)[0].$prev = val);
    }

    if (!init)
      item.changed = true;

    item.placeholder && el.find(cls2 + '-placeholder').tclass('hidden', !!val);
  };

  self.show = function(opt) {

    var el = opt.element instanceof $ ? opt.element[0] : opt.element.element ? opt.element.dom : opt.element;

    if (is) {
      clearTimeout(timeout);
      if (self.target === el) {
        self.hide(1);
        return;
      }
    }

    var builder = [];
    for (var i = 0; i < opt.items.length; i++) {
      var item = opt.items[i];
      var value = '';

      if (item.type instanceof Array) {
        value = '<div class="' + cls + '-option"></div>';
        item.icon = 'chevron-down';
        item.iconclick = true;

        if (!item.dirkey)
          item.dirkey = 'name';

        if (!item.dirvalue)
          item.dirvalue = 'id';

      } else {
        switch (item.type) {
          case Date:
            item.icon = 'calendar';
            item.input = true;
            item.iconclick = true;
            if (!item.format)
              item.format = 'yyyy–MM–dd';
            item.maxlength = item.format.length;
            break;
          case Number:
            item.input = true;
            item.iconclick = true;
            break;
          case String:
            item.input = true;
            item.iconclick = true;
            break;
          case Boolean:
            value = '<div class="{0}-checkbox"><i class="fa fa-check"></i></div>'.format(cls);
            break;
          case 'Time':
            item.input = true;
            item.iconclick = true;
            item.icon = 'clock-o';
            if (!item.format)
              item.format = 'HH:mm';
            item.maxlength = item.format.length;
            break;
        }
      }

      if (item.input) {
        value = '<input type="text" />';
        if (item.maxlength)
          value = value.replace('/>', 'maxlength="' + item.maxlength + '" />');
      }

      if (item.icon)
        value = '<div class="{0}-item-icon{3}">{1}</div><div class="{0}-item-input">{2}</div>'.format(cls, item.icon.charAt(0) === '!' ? item.icon.substring(1) : '<i class="fa fa-{0}"></i>'.format(item.icon), value, item.iconclick ? (' ' + cls + '-icon-click') : '');

      if (opt.value && !item.current)
        item.current = opt.value[item.name];

      builder.push('<div class="{0}-item" data-index="{3}"><div class="{0}-item-label">{1}</div><div class="{0}-item-value"><div class="{0}-placeholder">{4}</div>{2}</div></div>'.format(cls, item.label || item.name, value, i, item.placeholder || ''));
    }

    container.html(builder.join(''));

    self.opt = opt;
    self.target = el;

    self.find(cls2 + '-item').each(function() {
      var el = $(this);
      var index = +el.attrd('index');
      self.val(el, self.opt.items[index].current, true);
    });

    el = $(el);

    var css = {};
    var off = el.offset();

    css.width = opt.width || null;
    css.left = off.left + (opt.offsetX || 0);
    css.top = el.innerHeight() + off.top + (opt.offsetY || 10);

    self.element.css(css);
    self.rclass('hidden');
    self.aclass(cls + '-visible', 100);
    self.bindevents();
    is = true;
  };

  self.hide = function(sleep) {
    if (!is)
      return;
    clearTimeout(timeout);
    timeout = setTimeout(function() {
      self.unbindevents();
      self.rclass(cls + '-visible').aclass('hidden');
      if (self.opt)
        self.opt = null;
      is = false;
    }, sleep ? sleep : 100);
  };
});
      COMPILE();

  $(document).on('click', 'a', function() {

    var opt = {};
    opt.element = this;
    opt.width = 300;
    opt.items = [{ label: 'Brand', name: 'brand', type: ['Audi', 'VWFS', 'Porsche', 'Škoda'] }, { label: 'City', name: 'city', type: [{ name: 'Banská Bystrica', id: 1 }, { name: 'Bratislava', id: 2 }], placeholder: 'Choose a city' }, { label: 'From', name: 'from', type: Date, placeholder: 'Date from', format: 'dd.MM.yyyy' }, { label: 'Time', name: 'time', type: 'Time', format: 'HH:mm' }, { label: 'Search', name: 'search', type: String, placeholder: 'Search in items' }, { label: 'Removed', name: 'removed', type: Boolean }, { label: 'Price', name: 'price', type: Number }];
    opt.value = { brand: 'VWFS', from: new Date() };

    opt.callback = function(value, changed) {
      console.log(value, changed);
    };

    SETTER('filter', 'show', opt);
  });

}