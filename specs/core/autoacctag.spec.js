(function() {
	'use strict';
	
	// requires
	var AutoAccTag = tux.core.AutoAccTag;
	
	describe('Auto complete', function() {
		
		loadTemplate('/test/src/core/jst/auto-suggest-item.jst');
		
		var span;
		
		beforeEach(function() {
			span = $('<span id="test"></span>');
			setFixtures(span);
		});
		
		describe('account and tag', function() {
			
			var view;
			
			beforeEach(function() {
				view = new AutoAccTag({
					el: span[0]
				});
			});
			
			describe('init', function() {
				
				it('should add a class of auto-acc-tag', function() {
					expect(span).toHaveClass('auto-acc-tag');
				});
				
				it('should show an account and tag icon', function() {
					expect(span).toContain('img.account');
					expect(span).toContain('img.tag');
				});
				
				it('should add an input', function() {
					expect(span).toContain('input');
				});
				
				it('should add completion list', function() {
					expect(span).toContain('ul');
				});
				
			});
			
			describe('first click', function() {
				
				beforeEach(function() {
					span.click();
				});
				
				it('should add a class of active and focus on input', function() {
					expect(span).toHaveClass('active');
					expect(document.activeElement).toBe(span.find('input')[0]);
				});
				
				it('should remove active class when focus lost', function() {
					span.find('input').blur();
					expect(span).not.toHaveClass('active');
				});
				
				it('should trigger custom event with typed data on keypress', function() {
					var eventSpy = sinon.spy();
					view.bind('search', eventSpy);
					view.$('input').val('abc').keypress();
					expect(eventSpy).toHaveBeenCalled('abc');
					expect(eventSpy).toHaveBeenCalledWith('abc');
				});
				
				it('should display account suggestion', function() {
					view.$('input').val('abc');
					view.suggest([{
						type: 'account',
						id: '1',
						name: 'Bank abc'
					}]);
					expect(view.$('ul')).toContain('li.account[data-id=1]');
					expect(view.$('li.account[data-id=1]')).toHaveHtml('Bank <strong>abc</strong>');
				});
				
				it('should display tag suggestion', function() {
					view.$('input').val('abc');
					view.suggest([{
						type: 'tag',
						id: '1',
						name: 'Bank abc'
					}]);
					expect(view.$('ul')).toContain('li.tag');
				});
				
			});
			
		});
		
		describe('account only', function() {
			
		});
		
		describe('tag only', function() {
			
		});
		
		describe('init errors', function() {
			
			beforeEach(function() {
				this.typeError = new TypeError();
				this.typeStub = sinon.stub(window, 'TypeError').returns(this.typeError);
			});
			
			afterEach(function() {
				this.typeStub.restore();
			});
			
			it('should throw an error if no element given or element is not a span', function() {
				expect(function() {
					new AutoAccTag();
				}).toThrow(this.typeError);
				
			});
			
			it('should throw an error if element is not a span', function() {
				expect(function() {
					new AutoAccTag({
						el: $('<div>')[0]
					});
				}).toThrow(this.typeError);
			});
			
		});
		
		
	
	});
	
}());