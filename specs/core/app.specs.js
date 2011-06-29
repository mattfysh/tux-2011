(function() {
	'use strict';
	
	// requires
	var App = tux.core.App;
	
	describe('tux core app', function() {
	
		loadTemplate('/test/src/core/jst/tux-view.jst');
		loadTemplate('/test/src/core/jst/app-wrap-view.jst');
		loadTemplate('/test/src/core/jst/app-link.jst');
		
		describe('init', function() {
			
			beforeEach(function() {
				namespace('tux.test');
				namespace('tux.foo');
				
				this.testView = $('<div>')[0];
				this.fooView = $('<div>')[0];
				
				tux.test.TestApp = Backbone.View.extend({
					el: this.testView
				});
				tux.foo.FooApp = Backbone.View.extend({
					el: this.fooView
				});
				
				this.TestApp = sinon.spy(tux.test, 'TestApp');
				this.FooApp = sinon.spy(tux.foo, 'FooApp');
				this.app = new App({
					modules: [{
						app: 'test',
						obj: 'TestApp',
						title: 'Test App'
					}, {
						app: 'foo',
						obj: 'FooApp',
						title: 'Foo App'
					}]
				});
				setFixtures(this.app.el);
			});
			
			it('should load the base app skeleton', function() {
				expect($(this.app.el)).toContain('ul#nav');
			});
			
			it('should load app and append its wrapped view', function() {
				expect(this.TestApp).toHaveBeenCalled();
				expect($(this.app.el)).toContain('div#test');
				expect(this.app.$('#test')).toContain(this.testView);
			});
			
			it('should prepend the view with a title h2', function() {
				var h2 = $(this.testView).prev();
				expect(h2).toBe('h2');
				expect(h2).toHaveText('Test App');
			});
			
			it('should load multiple apps and append in order', function() {
				expect(this.FooApp).toHaveBeenCalled();
				expect(this.TestApp).toHaveBeenCalledBefore(this.FooApp);
				expect($(this.app.el)).toContain('div#foo');
				expect(this.app.$('#test').next()).toBe('div#foo');
			});
			
			it('should create a nav list item and link for each app', function() {
				expect(this.app.$('#nav')).toContain('li a.test');
				expect(this.app.$('#nav')).toContain('li a.foo');
			});
			
			it('should use app title for link text', function() {
				expect(this.app.$('#nav li a.test')).toHaveText('Test App');
			});
			
		});
	
		
	
	});
	
}());