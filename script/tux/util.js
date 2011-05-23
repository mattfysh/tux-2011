function namespace(path) {
	var spaces = path.split('.'),
		parent = this;
	_.each(spaces, function(s) {
		if (typeof this[s] === 'undefined') {
			parent[s] = {};
		}
		parent = this[s];
	});
}

namespace('tux');

tux.util = (function() {
	
	function fC(v) {
		var p = (v < 0) ? '-' : '',
			v = Math.abs(v).toString(),
			c = v.substr(-2),
			d = v.slice(0, -2) || '0',
			g = [];
		
		if (c.length === 1) c = '0' + c;
		if (d.length > 3) {
			d = d.split('');
			for (var l = d.length, i = l - 3; i > 0; i -= 3) {
				d.splice(i, 0, ',');
			}
			d = d.join('');
		}
		
		return p + '$' + d + '.' + c;
	}
	
	function mD(s) {
		if (!s) return;
		s = s.split('/');
		return new Date(s[2], s[1] - 1, s[0], 0, 0, 0, 0);
	}
	
	function fD(d) {
		var y = d.getFullYear(),
			m = d.getMonth() + 1,
			d = d.getDate();
		
		if (m < 10) m = '0' + m;
		
		return [d, m, y].join('/');
	}
	
	return {
		formatCurrency: fC,
		makeDate: mD,
		formatDate: fD
	}
	
}());

