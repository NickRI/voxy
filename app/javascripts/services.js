var voxyServices = angular.module('voxyServices', []);

var spawn = require('child_process').spawn;

voxyServices.factory("speakerService", function() {
	var speaker, callback, error = null;

	var spawnSpeaker = function() {
		callback = error = null;
		speaker = spawn("festival", ["--interactive"]);

		speaker.stdout.setEncoding('utf8');

		speaker.stderr.on('data', function(data) {
			error = new Error(data.toString());
		});

		speaker.stdout.on('data', function(data) {
			if (data.indexOf("festival>") !== -1) {
				setTimeout(function() {
					if (callback) callback(error);
					error = void 0;
				}, 10);
			}
		});
	}

	return {
		spawn: spawnSpeaker,
		close: function() {
			speaker.kill();
		},
		say: function(voice, text, cb) {
			callback = cb;
			try {
				speaker.stdin.write("(" + voice + ") (SayText \"" + text + "\")\n", "utf8");
			} catch (ex) {
				callback(ex);
			}
		}
	};

});

voxyServices.factory("navigationService", [function() {
	return function(parent, child, offsetY, speed) {
		$(parent).animate({scrollTop: child.offsetTop - parent.offsetTop + offsetY}, speed || "slow");
	}
}]);