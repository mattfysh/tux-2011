(function() {
	'use strict';
	
	// requires
	var App = tux.core.App;
	
	describe('tux core app', function() {
	
		loadTemplate('/test/src/core/jst/tux-view.jst');
		loadTemplate('/test/src/core/jst/module-wrap.jst');
		loadTemplate('/test/src/core/jst/module-link.jst');
		
		var app, vitals, vitalsView;
		
		beforeEach(function() {
			namespace('tux.foo');
			namespace('tux.bar');
			
			// modules
			this.fooView = $('<div>')[0];
			this.barView = $('<div>')[0];
			
			tux.foo.FooController = Backbone.View.extend({
				el: this.fooView
			});
			tux.bar.BarController = Backbone.View.extend({
				el: this.barView
			});
			
			this.FooController = sinon.spy(tux.foo, 'FooController');
			this.BarController = sinon.spy(tux.bar, 'BarController');
			
			// vitals
			vitalsView = document.createElement('div');
			vitals = sinon.stub(tux.core, 'Vitals').returns(new Backbone.View({
				el: vitalsView
			}));
			
			// kick off app
			app = new App({
				modules: [{
					name: 'foo',
					obj: tux.foo.FooController,
					title: 'Foo App'
				}, {
					name: 'bar',
					obj: tux.bar.BarController,
					title: 'Bar App'
				}]
			});
			setFixtures(app.el);
		});
		
		afterEach(function() {
			vitals.restore();
		});
		
		describe('init', function() {
			
			it('should load the base app skeleton', function() {
				expect($(app.el)).toContain('ul#nav');
			});
			
			it('should load the app and make a reference globally available', function() {
				expect(this.FooController).toHaveBeenCalled();
				expect(foo).toBeDefined();
				expect(window.hasOwnProperty('foo')).toBeTruthy(); // webkit is finding `foo` on the window prototype chain, refers to DOM element
			});
			
			it('should append the apps wrapped view', function() {
				expect($(app.el)).toContain('div#foo');
				expect(app.$('#foo')).toContain(this.fooView);
			});
			
			it('should add a module class to the wrapper', function() {
				expect(app.$('#foo')).toHaveClass('module');
			});
			
			it('should prepend the view with a title h2', function() {
				var h2 = $(this.fooView).prev();
				expect(h2).toBe('h2');
				expect(h2).toHaveText('Foo App');
			});
			
			it('should load multiple apps and append in order', function() {
				expect(this.FooController).toHaveBeenCalled();
				expect(this.BarController).toHaveBeenCalledAfter(this.FooController);
				expect($(app.el)).toContain('div#bar');
				expect(app.$('#foo').next()).toBe('div#bar');
				expect(bar).toBeDefined();
				expect(window.hasOwnProperty('bar')).toBeTruthy();
			});
			
			it('should create a nav list item and link for each app', function() {
				expect(app.$('#nav')).toContain('li a.foo');
				expect(app.$('#nav')).toContain('li a.bar');
			});
			
			it('should use app title for link text', function() {
				expect(app.$('#nav li a.foo')).toHaveText('Foo App');
			});
			
			it('should set a current class on the first wrapper', function() {
				expect(app.$('#module-container > div:eq(0)')).toHaveClass('current');
			});
			
			it('should set a current class on the first link', function() {
				expect(app.$('#nav li:eq(0)')).toHaveClass('current');
			});
			
			it('should add the vitals beneath the logo', function() {
				expect(app.$('h1').next()).toBe(vitalsView);
			});
			
		});
	
		describe('nav behaviour', function() {
			
			it('should make selected link current', function() {
				app.$('#nav a.bar').click();
				expect(app.$('#nav li:eq(0)')).not.toHaveClass('current');
				expect(app.$('#nav li:eq(1)')).toHaveClass('current');
			});
			
			it('should make selected wrapper current', function() {
				app.$('#nav a.bar').click();
				expect(app.$('#foo')).not.toHaveClass('current');
				expect(app.$('#bar')).toHaveClass('current');
			});
			
			it('should not remove the class if selecting the current module', function() {
				app.$('#nav a.foo').click();
				expect(app.$('#foo')).toHaveClass('current');
				expect(app.$('#nav li:eq(0)')).toHaveClass('current');
			});
			
		});
	
	});
	
}());