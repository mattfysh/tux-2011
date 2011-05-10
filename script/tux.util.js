function namespace(path) {
	var bits = path.split('.'),
		parent = this;
	$.each(bits, function(i, bit) {
		if (typeof parent[bit] === 'undefined') parent[bit] = {};
		parent = parent[bit];
	})
}

Date.prototype.toString = function() {
	function zeroPad(d) {
		return (d.toString().length === 1 ? '0' + d : d);
	}
	return this.getDate() + '/' + zeroPad(this.getMonth() + 1) + '/' + this.getFullYear();
}

function formatCurrency(amt) {
	var neg = amt < 0 ? '-' : '',
		amt = Math.abs(amt).toString(),
		dlr = amt.substr(0, amt.length - 2),
		cnt = amt.substr(amt.length - 2);
	
	return neg + '$' + dlr + '.' + cnt;
}