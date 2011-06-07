// global namespace function
function namespace(path) {
	var spaces = path.split('.'),
		parent = this,
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