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
	
	// export global functions
	_(global).extend({
		namespace: namespace,
		noop: noop
	});
	
}());

namespace('tux.util');

(function() {
	
	/**
	 * Currency
	 */
	
	// format cents to dollar strings
	function formatCurrency(value) {
		var prefix = (value < 0) ? '-' : '',
			rGroup = /\d{1,3}(?=(\d{3})+(?!\d))/g;
		
		value = Math.abs((value / 100)).toFixed(2);
		value = value.replace(rGroup, function(g) {
			return g + ',';
		});
		
		return prefix + '$' + value;
	}
	
	// parse currency value/strings
	function parseCurrency(value) {
		if (typeof value === 'string') {
			value = value.replace(/[^\d|\.|\-]/g, '');
		}
		return Math.floor(value * 100);
	}
	
	/**
	 * Dates
	 */
	
	// format date object to standard dd/mm/yyyy string
	function formatDate(value) {
		var year = value.getFullYear().toString().slice(2),
			month = value.getMonth() + 1,
			day = value.getDate();
		
		if (month < 10) {
			month = '0' + month;
		};
		
		return [day, month, year].join('/');
	}
	
	// take a date string and return a date object
	function parseDate(value) {
		value = value.split('/');
		return new Date(value[2], value[1] - 1, value[0]);
	}
	
	// util
	tux.util = {
		formatCurrency: formatCurrency,
		parseCurrency: parseCurrency,
		formatDate: formatDate,
		parseDate: parseDate
	};

}());

