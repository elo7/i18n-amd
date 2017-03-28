var fs = require('fs');
var vm = require('vm');
var assert = require('assert');

var EXTERNAL_DOMAIN = 'http://localhost:3030';
var DEFAULT_DOMAIN = 'http://localhost:3000';

vm.runInThisContext(fs.readFileSync('bower_components/async-define/async-define.js'));
vm.runInThisContext(fs.readFileSync('i18n.js'));
vm.runInThisContext(
	// Mocking behavior of ajax-amd
	define('ajax',[], function() {
		return {
			get: function(url, data, callback, config) {
				var args = url.split('/i18n/');
				var domain = args[0] || DEFAULT_DOMAIN,
					key = args[1];
				if(messages[domain] && messages[domain][key]) {
					var response = {
						version: 1,
						key: key,
						message: messages[domain][key]
					};
					callback.success(response);
				}
			}
		}
	})
);

function setup() {
	messages = {};

	session = {}, local = {};
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

function addMessage(key, message, domain = DEFAULT_DOMAIN) {
	messages[domain] = messages[domain] || {};
	messages[domain][key] = message;
}

define(['i18n'], function(subject) {
	describe('I18n', function() {
		beforeEach(setup);

		it('should return internacionalized string', function() {
			addMessage('test.Title', 'Test');
			assert.equal('Test', subject.get('test.Title'));
		});

		it('should update internacionalized string if theres a new version', function() {
			// Cached value
			addMessage('test.Title', 'Test');
			assert.equal('Test', subject.get('test.Title'));

			// Update cached value
			sessionStorage.setItem('version', 2);
			addMessage('test.Title', 'New Test');
			assert.equal('New Test', subject.get('test.Title'));
		});

		it('should not update internacionalized string if its the same version', function() {
			addMessage('test.Title', 'Test');
			assert.equal('Test', subject.get('test.Title'));
			addMessage('test.Title', 'New Test');
			assert.equal('Test', subject.get('test.Title'));
		});

		it('should pluralize string when using count', function() {
			addMessage('products.zero', 'No product');
			addMessage('products.one', '1 product');
			addMessage('products.other', '{0} products');
			assert.equal('No product', subject.count('products', 0));
			assert.equal('1 product', subject.count('products', 1));
			assert.equal('2 products', subject.count('products', 2));
		});

		it('should replace message arguments', function() {
			addMessage('arguments.test', 'Hello {0}, you are {1}!');
			assert.equal('Hello Bielo, you are awesome!', subject.args('arguments.test', 'Bielo', 'awesome'));
		});

		it('should not replace message arguments if theres no additional parameter', function() {
			addMessage('arguments.test', 'Hello {0}, you are {1}!');
			assert.equal('Hello {0}, you are {1}!', subject.args('arguments.test'));
		});

		it('should return internationalized string using a external domain', function() {
			subject.domain(EXTERNAL_DOMAIN);
			addMessage('test.Title', 'Test domain', EXTERNAL_DOMAIN);
			assert.equal('Test domain', subject.get('test.Title'));
		});

		it('should replace message arguments using a external domain', function() {
			subject.domain(EXTERNAL_DOMAIN);
			addMessage('arguments.test', 'Hello {0}, you are {1}!', EXTERNAL_DOMAIN);
			assert.equal('Hello Bielo, you are awesome!', subject.args('arguments.test', 'Bielo', 'awesome'));
		});

		it('should pluralize string when using count using a external domain', function() {
			subject.domain(EXTERNAL_DOMAIN);
			addMessage('products.zero', 'No product', EXTERNAL_DOMAIN);
			addMessage('products.one', '1 product', EXTERNAL_DOMAIN);
			addMessage('products.other', '{0} products', EXTERNAL_DOMAIN);
			assert.equal('No product', subject.count('products', 0));
			assert.equal('1 product', subject.count('products', 1));
			assert.equal('2 products', subject.count('products', 2));
		});

		it('should return key not found', function() {
			var testKey = 'key.NotFound';
			assert.equal('???' + testKey + '???', subject.get(testKey));
		});
	});
});
