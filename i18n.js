define('i18n', ['ajax'], function(ajax) {
	var config = {
		retries: 1,
		timeout: 20000,
		async: false
	};

	var updateLocalI18n = function(key) {
		ajax.get('/i18n/' + key, {}, {
			success: function(response){
				sessionStorage.setItem("version", response.version);
				localStorage.setItem(response.key, JSON.stringify(response));
			}
		}, config);
	}

	return {
		get: function(key) {
			var version = sessionStorage.getItem('version'),
				message = localStorage.getItem(key);

			if (!version || !message || JSON.parse(message).version != version) {
				updateLocalI18n(key);
			}
			return JSON.parse(localStorage.getItem(key)).message;
		}
	}
});
