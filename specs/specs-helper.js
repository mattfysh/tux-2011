(function() {
	'use strict';
	
	var global = (function() { return this; }());
	
	// mustachify underscore templates
	_.templateSettings.interpolate = /\{\{(.+?)\}\}/g;
	
	// load templates from url
	function loadTemplate(url) {
		var module = url.match(new RegExp('([^/]+)/jst'))[1],
			templateName = url.match(new RegExp('([^/]+).jst$'))[1]
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
				tux[module][templateName] = _.template(data);
			}
		});
	}
	
	// fill form
	function fillForm(form, data) {
		form = $(form);
		_(data).each(function(value, name) {
			form.find(':input[name=' + name + ']').val(value);
		});
		return form;
	}
	
	// export
	_(global).extend({
		loadTemplate: loadTemplate,
		fillForm: fillForm
	});
	
}());