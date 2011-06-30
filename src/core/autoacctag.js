namespace('tux.core');

(function() {
	'use strict';
	
	tux.core.AutoAccTag = Backbone.View.extend({
	
		initialize: function() {
			var el;
			
			// ensure element is a span
			if (this.el.nodeName.toLowerCase() !== 'span') {
				throw new TypeError();
			}
			
			// add..
			el = $(this.el);
			el.addClass('auto-acc-tag') // class
				.append('<img class="account">') // account icon
				.append('<img class="tag">') // tag icon
				.append('<input>') // input elem
				.append('<ul>'); // completion list
		},
		
		events: {
			'click': 'focus',
			'blur input': 'blur',
			'keypress input': 'search'
		},
		
		focus: function(e) {
			$(this.el).addClass('active')
				.find('input').focus();
		},
		
		blur: function(e) {
			$(this.el).removeClass('active');
		},
		
		search: function(e) {
			this.trigger('search', this.$('input').val());
		},
		
		suggest: function(results) {
			var search = this.$('input').val(),
				strongTerm = results[0].name.replace(new RegExp(search), function(term) {
					return '<strong>' + term + '</strong>'
				});
			
			this.$('ul').empty()
				.append(tux.core.autoSuggestItem({
					type: results[0].type,
					id: results[0].id,
					name: strongTerm
				}));
		}
	
	});
	
}());