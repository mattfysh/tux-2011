(function() {
	'use strict';
	
	var global = (function() { return this; }());
	
	// global namespace function
	function namespace(path) {
		var spaces = path.split('.'),
			parent = global,
			i, l, scope;
		
		// progress through the namespace and create each scope if required
		for (i = 0, l = spaces.length; i < l; i += 1) {
			scope = spaces[i];
			if (typeof parent[scope] === 'undefined') {
				parent[scope] = {};
			}
			parent = parent[scope];
		}
	}
	// global noop function
	function noop() {}
	
	// formatting
	function format(value) {
		var prefix = (value < 0) ? '-' : '',
			value = Math.abs((value / 100)).toFixed(2),
			rGroup = /\d{1,3}(?=(\d{3})+(?!\d))/g;
		
		value = value.replace(rGroup, function(g) {
			return g + ',';
		});
		
		return prefix + '$' + value;
	}
	
	function unformat(value) {
		if (typeof value === 'string') {
			value = value.replace(/[^\d|\.|-]/g, '');
		}
		return Math.floor(value * 100);
	}
	
	// export global functions
	_(global).extend({
		namespace: namespace,
		noop: noop,
		format: format,
		unformat: unformat
	});
	
}());

