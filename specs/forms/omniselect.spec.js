(function() {
	'use strict';
	
	// requires
	var OmniSelect = tux.forms.OmniSelect;
	
	describe('Omni-select input', function() {
		
		loadTemplate('/test/src/forms/jst/omni-select-option.jst');
		
		var input, omniSel,
			accounts, tags;
		
		beforeEach(function() {
			namespace('tux.refs');
			
			// accounts
			accounts = tux.refs.accounts = new Backbone.View();
			accounts.list = new Backbone.Collection([{
				name: 'Bank abc',
				id: 1
			}, {
				name: 'XYZ Bank',
				id: 2
			}]);
			
			// tags
			tags = tux.refs.tags = new Backbone.View();
			tags.list = new Backbone.Collection([{
				name: 'dinner',
				type: 'ex',
				id: 1
			}, {
				name: 'pay',
				type: 'in',
				id: 2
			}]);

			// form input
			input = $('<input type="text">');
			setFixtures(input);
		});
		
		describe('with accounts', function() {
			
			var abc, xyz;
			
			beforeEach(function() {
				// kick off
				omniSel = new OmniSelect({
					el: input[0],
					items: ['accounts']
				});
				
				// shortcuts
				abc = omniSel.$('ul li:eq(0)');
				xyz = omniSel.$('ul li:eq(1)');
			});
			
			describe('init', function() {
				
				it('should wrap input using classed div', function() {
					expect($(omniSel.el)).toBe('div.omni-select');
					expect(omniSel.$('input')).toBe(input);
				});
				
				it('should attach the wrapper to the DOM', function() {
					expect($.contains($(document.body)[0], omniSel.el)).toBeTruthy();
				});
				
				it('should have an options list', function() {
					expect($(omniSel.el)).toContain('ul');
				});
				
				it('should add an account to the list', function() {
					expect(omniSel.$('ul')).toContain('li');
					expect(abc).toHaveData('id', 1);
					expect(abc).toHaveText('Bank abc');
					expect(abc).toHaveClass('accounts');
				});
				
				it('should add multiple accounts in order', function() {
					expect(omniSel.$('ul li').length).toBe(2);
					expect(xyz).toHaveData('id', 2);
					expect(xyz).toHaveText('XYZ Bank');
				});
				
				it('should have a selection display with hint', function() {
					expect($(omniSel.el)).toContain('span.selection');
					expect(omniSel.$('span.selection')).toHaveText('Make selection');
				});
				
			});
			
			describe('bindings', function() {
				
				it('should add new items', function() {
					accounts.list.add({
						name: 'Visa',
						id: 3
					});
					expect(omniSel.$('ul li').length).toBe(3);
					expect(omniSel.$('ul li:eq(2)')).toHaveData('id', 3);
					expect(omniSel.$('ul li:eq(2)')).toHaveText('Visa');
				});
				
				it('should remove deleted items', function() {
					accounts.list.remove(accounts.list.at(1));
					expect(omniSel.$('ul li').length).toBe(1);
				});
				
				it('should update with new item names', function() {
					accounts.list.at(1).set({
						name: 'Newy'
					});
					expect(xyz).toHaveText('Newy');
				});
				
			});	
			
			describe('active state', function() {
				
				var view, item;
				
				beforeEach(function() {
					view = $(omniSel.el);
					item = omniSel.$('li:eq(0)');
					
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
						omniSel.$('li:eq(1)').click();
					});
					
					it('should copy the option id to the input', function() {
						expect(omniSel.$('input')).toHaveValue(2);
					});
					
					it('should remove class', function() {
						expect(view).not.toHaveClass('active');
					});
					
					it('should update selection text', function() {
						expect(omniSel.$('span.selection')).toHaveText('XYZ Bank');
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
					view = $(omniSel.el);
					view.mouseenter();
					view.find('span.selection').click();
					input = view.find('input');
				});
				
				it('should allow search mode when selection clicked', function() {
					expect(view).toHaveClass('search');
					expect($(document.activeElement)).toBe(input);
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
						expect(omniSel.$('ul li:eq(0) strong')).toHaveText('abc');
					});
					
					it('should remove previous strength where no match', function() {
						input.val('abc').keyup();
						input.val('abcd').keyup();
						expect(abc).not.toContain('strong');
					});
					
					it('should add weight for case insensitive search', function() {
						input.val('xyz').keyup();
						expect(omniSel.$('ul li:eq(1) strong')).toHaveText('XYZ');
					});
					
					it('should not add weighting for blank terms', function() {
						input.val('').keyup();
						expect(omniSel.$('ul li strong')).not.toExist();
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
						visa = omniSel.$('ul li:eq(2)');
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
						expect(omniSel.$('ul li.filtered')).not.toExist();
					});
					
					it('should remove weighting', function() {
						expect(omniSel.$('ul li strong')).not.toExist();
					});
					
					it('should accept preselect', function() {
						omniSel.$('input').trigger(navKey(40)).blur();
						expect(omniSel.$('input')).toHaveValue(1);
					});
					
				});
				
				describe('search on selection', function() {
					
					var prevSel;
					
					beforeEach(function() {
						omniSel.$('li:eq(1)').click();
						prevSel = omniSel.$('input').val();
						omniSel.$('span.selection').click();
					});
					
					it('should clear search box', function() {
						expect(omniSel.$('input')).toHaveValue('');
					});
					
					it('should replace previous text if nothing selected', function() {
						omniSel.$('input').blur();
						expect(omniSel.$('input')).toHaveValue(prevSel);
					});
					
					it('should remove filtering and weighting', function() {
						omniSel.$('input').blur();
						expect(omniSel.$('ul li.filtered')).not.toExist();
						expect(omniSel.$('ul li strong')).not.toExist();
					});
					
					it('should remove any psuedo-hover preselects', function() {
						omniSel.$('input').trigger(navKey(40)).blur();
						expect(abc).not.toHaveClass('preselect');
					});
					
				});
				
			});
			
		});
		
		describe('with tags', function() {
			
			var dinner, pay;
			
			beforeEach(function() {
				// kick off
				omniSel = new OmniSelect({
					el: input[0],
					items: ['tags']
				});
				
				// shortcuts
				dinner = omniSel.$('ul li:eq(0)');
				pay = omniSel.$('ul li:eq(1)');
			});
			
			it('should add a tag to the list', function() {
				expect(omniSel.$('ul')).toContain('li');
				expect(dinner).toHaveClass('tags');
				expect(dinner).toHaveData('id', 1);
				expect(dinner).toHaveData('type', 'ex');
				expect(dinner).toHaveText('dinner');
			});
			
			it('should add multiple tags in order', function() {
				expect(omniSel.$('ul li').length).toBe(2);
				expect(pay).toHaveData('id', 2);
				expect(pay).toHaveText('pay');
			});
			
		});
		
		describe('with accounts and tags', function() {
			
		});
	
	});
	
}());