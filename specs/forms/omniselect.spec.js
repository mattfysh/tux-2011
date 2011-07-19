(function() {
	'use strict';
	
	// requires
	var OmniSelect = tux.forms.OmniSelect;
	loadTemplate('/test/src/forms/jst/omni-select-option.jst');
	
	describe('Omni-select', function() {
		
		var input, origParent, omni, el, i, e;
	
		beforeEach(function() {
			// fixtures
			setFixtures('<input name="target" id="input" />');
			input = $('#input');
			origParent = input.parent();
			
			// kickoff
			omni = new OmniSelect({
				input: input.get(0),
				options: [{
					name: 'Income',
					value: 'i'
				}, {
					name: 'Expense',
					value: 'e'
				}]
			});
			
			// shortcuts
			el = $(omni.el);
			i = el.find('li:eq(0)');
			e = el.find('li:eq(1)');
		});
		
		describe('init', function() {
			
			it('should wrap input with markup', function() {
				expect(el).toBe('span');
				expect(el).toContain(input);
				expect(el).toContain('ul');
			});
			
			it('should replace input with wrapper', function() {
				expect(el.parent()).toBe(origParent);
			});
			
			it('should add a class to the wrapper', function() {
				expect(el).toHaveClass('omni-select');
			});
			
			it('should add options in order', function() {
				expect(i).toBe('li');
				expect(i).toHaveText('Income');
				expect(i).toHaveData('value', 'i');
				
				expect(e).toBe('li');
				expect(e).toHaveText('Expense');
				expect(e).toHaveData('value', 'e');
			});
			
		});
	
		describe('activation', function() {
			
			it('should add a class when input gains focus', function() {
				input[0].focus();
				expect(el).toHaveClass('active');
			});
			
			it('should remove class when input loses focus', function() {
				input[0].focus();
				input[0].blur();
				expect(el).not.toHaveClass('active');
			});
			
		});
		
		describe('preselecting', function() {
			
			it('should occur when mouse enters option', function() {
				i.mouseenter();
				expect(i).toHaveClass('preselect');
			});
			
			it('should remove when mouse leaves option', function() {
				i.mouseenter().mouseleave();
				expect(i).not.toHaveClass('preselect');
			});
			
		});
		
		describe('selecting', function() {
			
			it('should deactivate when input loses focus', function() {
				input[0].focus();
				i[0].focus();
				expect(el).not.toHaveClass('active');
			});
			
		});
		
	
	});
	
}());
