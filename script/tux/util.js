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