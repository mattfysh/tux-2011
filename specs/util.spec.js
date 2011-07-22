/*global test */
(function() {
	'use strict';
	
	describe('tux util', function() {
		
		describe('namespace', function() {
			
			it('should create a namespace', function() {
				namespace('test.spec.namespace');
				expect(test.spec.namespace).toBeDefined();
			});
			
			it('should not overwrite existing values', function() {
				namespace('test');
				test.namespace = 'exists';
				namespace('test.namespace');
				expect(test.namespace).toBe('exists');
			});
		
		});
		
		describe('noop', function() {
			
			it('should define an empty function', function() {
				expect(noop).toBeDefined();
			});
			
		});
			
		describe('currency formatter', function() {
			
			it('should format cent values to dollar amounts', function() {
				expect(tux.util.formatCurrency(200)).toBe('$2.00');
			});
			
			it('should convert negative cent amounts correctly', function() {
				expect(tux.util.formatCurrency(-312)).toBe('-$3.12');
			});
			
			it('should add thousand seperators to amounts', function() {
				expect(tux.util.formatCurrency(123456789)).toBe('$1,234,567.89');
			});
			
		});
		
		describe('currency parser', function() {
			
			it('should convert simple whole dollars to cents', function() {
				expect(tux.util.parseCurrency(12)).toBe(1200);
			});
			
			it('should convert decimal dollars to cents', function() {
				expect(tux.util.parseCurrency(123.45)).toBe(12345);
			});
			
			it('should remove all decimal places from cents value', function() {
				expect(tux.util.parseCurrency(1234.567)).toBe(123456);
			});
			
			it('should convert dollar strings to cents', function() {
				expect(tux.util.parseCurrency('12.34')).toBe(1234);
			});
			
			it('should successfully convert values with symbols', function() {
				expect(tux.util.parseCurrency('$123,456.00')).toBe(12345600);
			});
			
			it('should successfully convert negative string values', function() {
				expect(tux.util.parseCurrency('-12')).toBe(-1200);
			});
		});
		
		describe('date formatter', function() {

			it('should format date objects to standard date strings', function() {
				expect(tux.util.formatDate(new Date(2011, 9, 1))).toBe('1/10/2011');
				expect(tux.util.formatDate(new Date(2011, 0, 1))).toBe('1/01/2011');
			});
			
		});
		
		describe('date parser', function() {
		
			it('should return a new date object from a date string', function() {
				expect(tux.util.parseDate('1/10/2011').getTime()).toBe(new Date(2011, 9, 1).getTime());
			})
			
		});
		
	});
	
}());
