(function() {
	'use strict';
	
	var global = (function() { return this; }());
	
	// mustachify underscore templates
	_.templateSettings = {
		interpolate: /\{\{(.+?)\}\}/g
	};
	
	// load templates from url
	function loadTemplate(url) {
		var app = url.match(new RegExp('([^/]+)/jst'))[1],
			name = url.match(new RegExp('([^/]+).jst$'))[1]
					.replace(/\-\w/g, function(match) {
						return match[1].toUpperCase();
					});

		// make sync request for template file
		$.ajax({
			url: url,
			async: false,
			cache: false,
			dataType: 'html',
			success: function(data) {
				tux[app][name] = _.template(data);
			}
		});
	}
	
	// export
	_(global).extend({
		loadTemplate: loadTemplate
	});
	
}());