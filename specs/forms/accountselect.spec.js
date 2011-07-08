(function() {
	'use strict';
	
	// requires
	var AccountSelect = tux.forms.AccountSelect;
	
	describe('Account select input', function() {
		
		loadTemplate('/test/src/forms/jst/account-select-option.jst');
		
		var input, accSel, accounts,
			abc, xyz;
		
		beforeEach(function() {
			namespace('tux.refs');
			accounts = tux.refs.accounts = new Backbone.View();
			accounts.list = new Backbone.Collection([{
				name: 'Bank abc',
				id: 1
			}, {
				name: 'XYZ Bank',
				id: 2
			}]);
			
			input = $('<input type="text" name="account">');
			setFixtures(input);
			
			accSel = new AccountSelect({
				el: input[0]
			});
			
			abc = accSel.$('ul li:eq(0)');
			xyz = accSel.$('ul li:eq(1)');
		});
		
		describe('init', function() {
			
			it('should wrap input using div with class account-select', function() {
				expect($(accSel.el)).toBe('div.account-select');
				expect(accSel.$('input')).toBe(input);
			});
			
			it('should attach the wrapper to the DOM', function() {
				expect($.contains($(document.body)[0], accSel.el)).toBeTruthy();
			});
			
			it('should have an options list', function() {
				expect($(accSel.el)).toContain('ul');
			});
			
			it('should add an account to the options list', function() {
				expect(accSel.$('ul')).toContain('li');
				expect(abc).toHaveData('id', 1);
				expect(abc).toHaveText('Bank abc');
			});
			
			it('should add multiple accounts in order', function() {
				expect(accSel.$('ul li').length).toBe(2);
				expect(xyz).toHaveData('id', 2);
				expect(xyz).toHaveText('XYZ Bank');
			});
			
			it('should have a selection display with hint', function() {
				expect($(accSel.el)).toContain('span.selection');
				expect(accSel.$('span.selection')).toHaveText('Select account...');
			});
			
		});
		
		describe('bindings', function() {
			
			it('should add new accounts', function() {
				accounts.list.add({
					name: 'Visa',
					id: 3
				});
				expect(accSel.$('ul li').length).toBe(3);
				expect(accSel.$('ul li:eq(2)')).toHaveData('id', 3);
				expect(accSel.$('ul li:eq(2)')).toHaveText('Visa');
			});
			
			it('should remove deleted accounts', function() {
				accounts.list.remove(accounts.list.at(1));
				expect(accSel.$('ul li').length).toBe(1);
			});
			
			it('should update with new account names', function() {
				accounts.list.at(1).set({
					name: 'Newy'
				});
				expect(xyz).toHaveText('Newy');
			});
			
		});	
		
		describe('active state', function() {
			
			var view, item;
			
			beforeEach(function() {
				view = $(accSel.el);
				item = accSel.$('li:eq(0)');
				
				view.mouseenter();
				item.mouseenter();
			});
			
			it('should apply a class when mouse enters', function() {
				expect(view).toHaveClass('active');
			});
			
			it('should remove class when mouse leaves', function() {
				view.mouseleave();
				expect(view).not.toHaveClass('active');
			});
			
			it('should apply class to item on mouse enter', function() {
				expect(item).toHaveClass('preselect');
			});
			
			it('should remove preselect when mouse leaves options', function() {
				view.find('ul').mouseleave();
				expect(item).not.toHaveClass('preselect');
			});
			
			describe('click', function() {
				
				beforeEach(function() {
					accSel.$('li:eq(1)').click();
				});
				
				it('should copy the account id to the input', function() {
					expect(accSel.$('input')).toHaveValue(2);
				});
				
				it('should remove class', function() {
					expect(view).not.toHaveClass('active');
				});
				
				it('should update selection text', function() {
					expect(accSel.$('span.selection')).toHaveText('XYZ Bank');
				});
				
			});
			
		});
		
		describe('search', function() {
			
			var view,
				input;
			
			function navKey(which) {
				return $.Event('keydown', {
					which: which
				});
			}
			
			beforeEach(function() {
				view = $(accSel.el);
				view.mouseenter();
				view.find('span.selection').click();
				input = view.find('input');
			});
			
			it('should allow search mode when selection clicked', function() {
				expect(view).toHaveClass('search');
				expect($(document.activeElement)).toBe('input[name=account]');
			});
			
			it('should ensure an active state', function() {
				input.blur();
				view.find('span.selection').click();
				expect(view).toHaveClass('active');
			});
			
			it('should prevent active state from being removed when mouse leaves', function() {
				view.mouseleave();
				expect(view).toHaveClass('active');
			});
			
			describe('filtering', function() {
				
				it('should be based on search text', function() {
					input.val('abc').keyup();
					expect(abc).not.toHaveClass('filtered');
					expect(xyz).toHaveClass('filtered');
					
					input.val('XYZ').keyup();
					expect(abc).toHaveClass('filtered');
					expect(xyz).not.toHaveClass('filtered');
				});
				
				it('should be case insensitive', function() {
					input.val('xyz').keyup();
					expect(abc).toHaveClass('filtered');
					expect(xyz).not.toHaveClass('filtered');
				});
				
				it('should not occur when no term entered', function() {
					input.val('').keyup();
					expect(abc).not.toHaveClass('filtered');
					expect(xyz).not.toHaveClass('filtered');
				});
				
				it('should remove preselect from hidden matches', function() {
					input.trigger(navKey(40));
					input.val('XYZ').keyup();
					expect(abc).not.toHaveClass('preselect');
				});
				
				it('should trim search term', function() {
					input.val('abc ').keyup();
					expect(abc).not.toHaveClass('filtered');
				});
				
			});
			
			describe('weighting', function() {
				
				it('should affect search term', function() {
					input.val('abc').keyup();
					expect(accSel.$('ul li:eq(0) strong')).toHaveText('abc');
				});
				
				it('should remove previous strength where no match', function() {
					input.val('abc').keyup();
					input.val('abcd').keyup();
					expect(abc).not.toContain('strong');
				});
				
				it('should add weight for case insensitive search', function() {
					input.val('xyz').keyup();
					expect(accSel.$('ul li:eq(1) strong')).toHaveText('XYZ');
				});
				
				it('should not add weighting for blank terms', function() {
					input.val('').keyup();
					expect(accSel.$('ul li strong')).not.toExist();
				});
				
			});
			
			describe('nav', function() {
				
				var visa;
				
				beforeEach(function() {
					// add third
					accounts.list.add({
						name: 'abc Visa',
						id: 3
					});
					input.trigger(navKey(40));
					visa = accSel.$('ul li:eq(2)');
				});
				
				it('should simulate hover on first item', function() {
					expect(abc).toHaveClass('preselect');
				});
				
				it('should move hover down to next item', function() {
					input.trigger(navKey(40));
					expect(abc).not.toHaveClass('preselect');
					expect(xyz).toHaveClass('preselect');
				});
				
				it('should move hover up to next item', function() {
					input.trigger(navKey(40));
					input.trigger(navKey(38));
					expect(abc).toHaveClass('preselect');
					expect(xyz).not.toHaveClass('preselect');
				});
				
				it('should remove hover if moving up from top', function() {
					input.trigger(navKey(38));
					expect(abc).not.toHaveClass('preselect');
				});
				
				it('should not move past last item', function() {
					input.trigger(navKey(40));
					input.trigger(navKey(40));
					input.trigger(navKey(40));
					expect(visa).toHaveClass('preselect');
				});
				
				it('should not move down to first item when up is pressed', function() {
					input.trigger(navKey(38));
					input.trigger(navKey(38));
					expect(abc).not.toHaveClass('preselect');
				});
				
				it('should skip filtered when moving to first', function() {
					input.trigger(navKey(38));
					input.val('XYZ').keyup();
					input.trigger(navKey(40));
					expect(abc).not.toHaveClass('preselect');
					expect(xyz).toHaveClass('preselect');
				});
				
				it('should skip filtered after first preselect', function() {
					input.val('abc').keyup();
					input.trigger(navKey(40));
					expect(xyz).not.toHaveClass('preselect');
					expect(visa).toHaveClass('preselect');
					
					input.trigger(navKey(38));
					expect(xyz).not.toHaveClass('preselect');
					expect(abc).toHaveClass('preselect');
				});
				
				it('should lose preselect if mouse enters an item', function() {
					visa.mouseover();
					expect(abc).not.toHaveClass('preselect');
					expect(visa).toHaveClass('preselect');
				});
				
			});
			
			describe('blur', function() {
				
				beforeEach(function() {
					input.val('xyz').keyup().trigger(navKey(40)).blur();
				});
				
				it('should remove search state', function() {
					expect(view).not.toHaveClass('search');
					expect(input).toHaveValue('');
				});
				
				it('should remove active state', function() {
					expect(view).not.toHaveClass('active');
				});
				
				it('should remove filtering', function() {
					expect(accSel.$('ul li.filtered')).not.toExist();
				});
				
				it('should remove weighting', function() {
					expect(accSel.$('ul li strong')).not.toExist();
				});
				
				it('should accept preselect', function() {
					accSel.$('input').trigger(navKey(40)).blur();
					expect(accSel.$('input')).toHaveValue(1);
				});
				
			});
			
			describe('search on selection', function() {
				
				var prevSel;
				
				beforeEach(function() {
					accSel.$('li:eq(1)').click();
					prevSel = accSel.$('input').val();
					accSel.$('span.selection').click();
				});
				
				it('should clear search box', function() {
					expect(accSel.$('input')).toHaveValue('');
				});
				
				it('should replace previous text if nothing selected', function() {
					accSel.$('input').blur();
					expect(accSel.$('input')).toHaveValue(prevSel);
				});
				
				it('should remove filtering and weighting', function() {
					accSel.$('input').blur();
					expect(accSel.$('ul li.filtered')).not.toExist();
					expect(accSel.$('ul li strong')).not.toExist();
				});
				
				it('should remove any psuedo-hover preselects', function() {
					accSel.$('input').trigger(navKey(40)).blur();
					expect(abc).not.toHaveClass('preselect');
				});
				
			});
			
		});
	
	});
	
}());