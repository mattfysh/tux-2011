namespace('tux.forms');

(function() {
	'use strict';
	
	tux.forms.OmniSelect = Backbone.View.extend({
		
		tagName: 'span',
		className: 'omni-select',
	
		initialize: function(options) {
			var select = $(this.el),
				ul;
			
			// add view to DOM, wrap target input
			$(options.input).before(select);
			$(this.el).append(options.input).append('<ul>');
			
			// add options
			ul = select.find('ul');
			_.each(options.options, function(option) {
				ul.append(tux.forms.omniSelectOption(option));
			});
		},
		
		events: {
			'focus input': 'toggle',
			'blur input': 'toggle',
			'mouseenter li': 'togglePreselect',
			'mouseleave li': 'togglePreselect'
		},
		
		toggle: function() {
			$(this.el).toggleClass('active');
		},
		
		togglePreselect: function(e) {
			$(e.target).toggleClass('preselect');
		}
		
		
	
	});
	
}());