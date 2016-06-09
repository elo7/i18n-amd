define('i18n', ['ajax'], function(ajax) {
	var config = {
		retries: 1,
		timeout: 20000,
		async: false
	};

	var updateLocalI18n = function(key, domain) {
		domain = domain || "";
		ajax.get(domain + '/i18n/' + key, {}, {
			success: function(response){
				sessionStorage.setItem("version", response.version);
				localStorage.setItem(response.key, JSON.stringify(response));
			}
		}, config);
	};

	function get(key) {
		var version = sessionStorage.getItem('version'),
			message = localStorage.getItem(key);

		if (!version || !message || JSON.parse(message).version != version) {
			updateLocalI18n(key, this.domain);
		}
		var data = localStorage.getItem(key);
		if(data) {
			return JSON.parse(data).message;
		}
		return '???' + key + '???';
	}

	function formatCountKey(key, size) {
		if(size == 0) return key + ".zero";
		else if(size == 1) return key + ".one";
		else return key + ".other";
	}

	function count(key, size) {
		var message = get(formatCountKey(key, size));
		return message.replace('{0}', size);
	}

	function args(key) {
		var message = get(key);
		for(var i = 0, size = arguments.length; i < size; i++) {
			var position = i - 1;
			message = message.replace('{' + position + '}', arguments[i]);
		}
		return message;
	}

	return {
		get: get,
		count: count,
		args: args,
		domain: false
	}
});
