var fs = require('fs');
var vm = require('vm');
var assert = require("assert");

vm.runInThisContext(fs.readFileSync('bower_components/async-define/async-define.js'));
vm.runInThisContext(fs.readFileSync('i18n.js'));
vm.runInThisContext(
	// Mocking behavior of ajax-amd
	define('ajax',[], function() {
		return {
			get: function(url, data, callback, config) {
				var key = url.replace('/i18n/', '');
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

	messages = {
		'test.Title': 'Teste'
	};
}

define(['i18n'], function(subject) {
	describe('I18n', function() {
		beforeEach(setup);

		it('should return internacionalized string', function() {
			assert.equal('Teste', subject.get('test.Title'));
		});

		it('should update internacionalized string if theres a new version', function() {
			// Cache value
			assert.equal('Teste', subject.get('test.Title'));
			messages['test.Title'] = "Novo Teste";
			assert.equal('Teste', subject.get('test.Title'));
			// Update cached value
			sessionStorage.setItem('version', 2);
			assert.equal('Novo Teste', subject.get('test.Title'));
		});
	});
});
