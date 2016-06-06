var fs = require('fs');
var vm = require('vm');
var assert = require("assert");

var EXTERNAL_DOMAIN = 'http://localhost:3000';

vm.runInThisContext(fs.readFileSync('bower_components/async-define/async-define.js'));
vm.runInThisContext(fs.readFileSync('i18n.js'));
vm.runInThisContext(
	// Mocking behavior of ajax-amd
	define('ajax',[], function() {
		return {
			get: function(url, data, callback, config) {
				var key = url.replace('/i18n/', ''),
						key = key.replace(EXTERNAL_DOMAIN, '');
				var response = {
					version: 1,
					key: key,
					message: messages[key]
				};
				callback.success(response);
			}
		}
	})
);

function setup() {
	session = {}, local = {}, messages = {};
	sessionStorage = {
		setItem: function(key, value) {
			session[key] = value;
		},
		getItem: function(key) {
			return session[key];
		}
	};
	localStorage = {
		setItem: function(key, value) {
			local[key] = value;
		},
		getItem: function(key) {
			return local[key];
		}
	};
}

define(['i18n'], function(subject) {
	describe('I18n', function() {
		beforeEach(setup);

		it('should return internacionalized string', function() {
			messages['test.Title'] = 'Test';
			assert.equal('Test', subject.get('test.Title'));
		});

		it('should update internacionalized string if theres a new version', function() {
			// Cached value
			messages['test.Title'] = 'Test';
			assert.equal('Test', subject.get('test.Title'));

			// Update cached value
			sessionStorage.setItem('version', 2);
			messages['test.Title'] = 'New Test';
			assert.equal('New Test', subject.get('test.Title'));
		});

		it('should not update internacionalized string if its the same version', function() {
			messages['test.Title'] = 'Test';
			assert.equal('Test', subject.get('test.Title'));
			messages['test.Title'] = 'New Test';
			assert.equal('Test', subject.get('test.Title'));
		});

		it('should pluralize string when using count', function() {
			messages['products.zero'] = 'No product';
			messages['products.one'] = '1 product';
			messages['products.other'] = '{0} products';
			assert.equal('No product', subject.count('products', 0));
			assert.equal('1 product', subject.count('products', 1));
			assert.equal('2 products', subject.count('products', 2));
		});

		it('should replace message arguments', function() {
			messages['arguments.test'] = 'Hello {0}, you are {1}!';
			assert.equal('Hello Bielo, you are awesome!', subject.args('arguments.test', 'Bielo', 'awesome'));
		});

		it('should not replace message arguments if theres no additional parameter', function() {
			messages['arguments.test'] = 'Hello {0}, you are {1}!';
			assert.equal('Hello {0}, you are {1}!', subject.args('arguments.test'));
		});

		it('should return internationalized string using a external domain', function() {
			subject.domain = EXTERNAL_DOMAIN;
			messages['test.Title'] = 'Test domain';
			assert.equal('Test domain', subject.get('test.Title'));
		});

		it('should replace message arguments using a external domain', function() {
			subject.domain = EXTERNAL_DOMAIN;
			messages['arguments.test'] = 'Hello {0}, you are {1}!';
			assert.equal('Hello Bielo, you are awesome!', subject.args('arguments.test', 'Bielo', 'awesome'));
		});

		it('should pluralize string when using count using a external domain', function() {
			subject.domain = EXTERNAL_DOMAIN;
			messages['products.zero'] = 'No product';
			messages['products.one'] = '1 product';
			messages['products.other'] = '{0} products';
			assert.equal('No product', subject.count('products', 0));
			assert.equal('1 product', subject.count('products', 1));
			assert.equal('2 products', subject.count('products', 2));
		});
	});
});
