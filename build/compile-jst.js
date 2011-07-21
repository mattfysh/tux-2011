load('../lib/underscore.js');

(function(jst) {
	
	var name, path, templateFn;
	
	// check jst file exists
	if (!jst) {
		print('Usage: compile-jst.js template.jst');
		quit(1);
	}
	
	// determine template namespace and function name
	name = jst.match(/([^\\]+).jst$/)[1]
			.replace(/\-\w/g, function(match) {
				return match[1].toUpperCase();
			});
	path = 'tux.' + jst.match(/([^\\]+)\\jst/)[1] + '.' + name;
	
	// mustachify underscore templates
	_.templateSettings = {
		interpolate: /\{\{(.+?)\}\}/g,
		evaluate: /##(.+?)##/g
	};
	
	// generate the template function declaration
	template = _.template(readFile(jst)).toString()
		.replace('function anonymous(obj)', 'function(obj)')
		.replace(/(^\s|\s$)/g, ''); // remove leading and trailing whitespace
	
	// format the template assignment
	print(path + ' = ' + template + ';');
	
	quit(0);
	
}.apply(this, arguments));