(function() {
	'use strict';
	
	// requires
	var App = tux.core.App;
	
	describe('tux core app', function() {
	
		loadTemplate('/test/src/core/jst/tux-view.jst');
		loadTemplate('/test/src/core/jst/module-wrap.jst');
		loadTemplate('/test/src/core/jst/module-link.jst');
		
		var app;
		
		beforeEach(function() {
			namespace('tux.test');
			namespace('tux.foo');
			
			this.testView = $('<div>')[0];
			this.fooView = $('<div>')[0];
			
			tux.test.TestController = Backbone.View.extend({
				el: this.testView
			});
			tux.foo.FooController = Backbone.View.extend({
				el: this.fooView
			});
			
			this.TestApp = sinon.spy(tux.test, 'TestController');
			this.FooApp = sinon.spy(tux.foo, 'FooController');
			app = new App({
				modules: [{
					name: 'test',
					obj: tux.test.TestController,
					title: 'Test App'
				}, {
					name: 'foo',
					obj: tux.foo.FooController,
					title: 'Foo App'
				}]
			});
			setFixtures(app.el);
		});
		
		describe('init', function() {
			
			it('should load the base app skeleton', function() {
				expect($(app.el)).toContain('ul#nav');
			});
			
			it('should load the app and make a reference globally available', function() {
				expect(this.TestApp).toHaveBeenCalled();
				expect(tux.refs.test).toBeDefined();
			});
			
			it('should append the apps wrapped view', function() {
				expect($(app.el)).toContain('div#test');
				expect(app.$('#test')).toContain(this.testView);
			});
			
			it('should add a module class to the wrapper', function() {
				expect(app.$('#test')).toHaveClass('module');
			});
			
			it('should prepend the view with a title h2', function() {
				var h2 = $(this.testView).prev();
				expect(h2).toBe('h2');
				expect(h2).toHaveText('Test App');
			});
			
			it('should load multiple apps and append in order', function() {
				expect(this.FooApp).toHaveBeenCalled();
				expect(this.TestApp).toHaveBeenCalledBefore(this.FooApp);
				expect($(app.el)).toContain('div#foo');
				expect(app.$('#test').next()).toBe('div#foo');
			});
			
			it('should create a nav list item and link for each app', function() {
				expect(app.$('#nav')).toContain('li a.test');
				expect(app.$('#nav')).toContain('li a.foo');
			});
			
			it('should use app title for link text', function() {
				expect(app.$('#nav li a.test')).toHaveText('Test App');
			});
			
			it('should set a current class on the first wrapper', function() {
				expect(app.$('#module-container > div:eq(0)')).toHaveClass('current');
			});
			
			it('should set a current class on the first link', function() {
				expect(app.$('#nav li:eq(0)')).toHaveClass('current');
			});
			
		});
	
		describe('nav behaviour', function() {
			
			it('should make selected link current', function() {
				app.$('#nav a.foo').click();
				expect(app.$('#nav li:eq(0)')).not.toHaveClass('current');
				expect(app.$('#nav li:eq(1)')).toHaveClass('current');
			});
			
			it('should make selected wrapper current', function() {
				app.$('#nav a.foo').click();
				expect(app.$('#test')).not.toHaveClass('current');
				expect(app.$('#foo')).toHaveClass('current');
			});
			
			it('should not remove the class if selecting the current module', function() {
				app.$('#nav a.test').click();
				expect(app.$('#test')).toHaveClass('current');
				expect(app.$('#nav li:eq(0)')).toHaveClass('current');
			});
			
		});
	
	});
	
}());