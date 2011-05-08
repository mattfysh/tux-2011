function namespace(path) {
	var bits = path.split('.'),
		parent = this;
	$.each(bits, function(i, bit) {
		if (typeof parent[bit] === 'undefined') parent[bit] = {};
		parent = parent[bit];
	})
}