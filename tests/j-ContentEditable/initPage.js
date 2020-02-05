function initPage() {
	COMPONENT('contenteditable', function(self) {

	  var timers = {};
	  var current = { bold: false, underline: false, italic: false, focused: false, node: null };
	  var required = self.attrd('required') === 'true';

	  self.validate = function(value) {
	    var type = typeof(value);

	    if (type === 'undefined' || type === 'object')
	      value = '';
	    else
	      value = value.toString();

	    EMIT('reflow', self.name);
	    return value.length > 0;
	  };

	  !required && self.noValid();

	  self.make = function() {

	    self.attr('contenteditable', 'true');
	    self.aclass('ui-contenteditable');

	    var el = self.element;

	    el.on('selectstart', function() {
	      clearTimeout(timers.selection);
	      timers.selection = setTimeout(function() {
	        self.event('select', self.getSelection());
	      }, 500);
	    });

	    el.on('focus', function() {
	      clearTimeout(timers.focused);
	      clearInterval(timers.changes);
	      self.focused = true;
	      self.event('focus', self);
	      timers.changes = setInterval(self.save, 1000);
	    });

	    self.save = function() {
	      self.getter(self.html());
	    };

	    el.on('click', function(e) {
	      e.target && self.event('click', e.target);
	    });

	    el.on('blur', function() {
	      clearTimeout(timers.focused);
	      clearInterval(timers.changes);
	      self.save();
	      timers.focused = setTimeout(function() {
	        self.event('blur', self);
	        self.reset(true);
	      }, 200);
	    });

	    el.on('paste', function(e) {
	      e.preventDefault();
	      e.stopPropagation();
	      var text = e.originalEvent.clipboardData.getData(self.attrd('clipboard') || 'text/plain');
	      self.event('paste', text);
	    });

	    el.on('keydown', function(e) {

	      clearTimeout(timers.keypress);
	      timers.keypress = setTimeout(function() {
	        var node = self.getNode();
	        if (node === self.element[0])
	          node = undefined;
	        if (current.node === node)
	          return;
	        current.node = node;
	        self.event('current', node);
	      }, 100);

	      if (!e.metaKey && !e.ctrlKey)
	        return;

	      if (e.which === 66) {
	        // bold
	        current.bold = !current.bold;
	        document.execCommand('Bold', false, null);
	        self.event('bold', current.bold);
	        e.preventDefault();
	        e.stopPropagation();
	        return;
	      }

	      if (e.which === 76) {
	        // link
	        e.preventDefault();
	        e.stopPropagation();

	        if (!self.getSelection())
	          return;

	        var url = '#tmp' + Date.now();
	        document.execCommand('CreateLink', false, url);
	        self.event('link', url);
	        return;
	      }

	      if (e.which === 73) {
	        // italic
	        current.italic = !current.italic;
	        document.execCommand('Italic', false, null);
	        self.event('italic', current.italic);
	        e.preventDefault();
	        e.stopPropagation();
	        return;
	      }

	      if (e.which === 85) {
	        // underline
	        current.underline = !current.underline;
	        document.execCommand('Underline', false, null);
	        self.event('underline', current.underline);
	        e.preventDefault();
	        e.stopPropagation();
	        return;
	      }
	    });
	  };

	  self.reset = function() {
	    var keys = Object.keys(current);
	    for (var i = 0, length = keys.length; i < length; i++) {
	      var key = keys[i];
	      switch (key) {
	        case 'focused':
	          break;
	        case 'node':
	          current[key] = null;
	          break;
	        default:
	          if (current[key] === false)
	            break;
	          current[key] = false;
	          self.event(key, false);
	          break;
	      }
	    }
	  };

	  self.exec = function() {
	    document.execCommand.apply(document, arguments);
	    return self;
	  };

	  self.insert = function(value, encoded) {
	    document.execCommand(encoded ? 'insertText' : 'insertHtml', false, value);
	    return self;
	  };

	  self.event = function(type, value) {

	    // type = bold          - when a text is bolded (value is boolean)
	    // type = italic        - when a text is italic (value is boolean)
	    // type = underline     - when a text is underlined (value is boolean)
	    // type = link          - when a link is created (value is a temporary URL)
	    // type = current       - when a current element is changed in the text (value is NODE)
	    // type = paste         - when the clipboard is used (value is a clipboard value)
	    // type = select        - when a text is selected (value is selected text)
	    // type = focus         - editor is focused (value is undefined)
	    // type = blur          - editor is not focused (value is undefined)
	    // type = click         - click on the specific element in the text (value is NODE)

	    if (type === 'paste')
	      self.insert(value, true);
	  };

	  self.getNode = function() {
	    var node = document.getSelection().anchorNode;
	    if (node)
	      return (node.nodeType === 3 ? node.parentNode : node);
	  };

	  self.getSelection = function() {
	    if (document.selection && document.selection.type === 'Text')
	      return document.selection.createRange().htmlText;
	    else if (!window.getSelection)
	      return;
	    var sel = window.getSelection();
	    if (!sel.rangeCount)
	      return '';
	    var container = document.createElement('div');
	    for (var i = 0, len = sel.rangeCount; i < len; ++i)
	      container.appendChild(sel.getRangeAt(i).cloneContents());
	    return container.innerHTML;
	  };

	  self.setter = function(value, path, type) {
	    if (type === 2)
	      return;
	    self.reset();
	    self.html(value ? value.toString() : '');
	  };

	  self.state = function(type) {
	    if (!type)
	      return;
	    var invalid = self.isInvalid();
	    if (invalid === self.$oldstate)
	      return;
	    self.$oldstate = invalid;
	    self.toggle('ui-contenteditable-invalid', invalid);
	  };
	});
     
    COMPILE();

}
