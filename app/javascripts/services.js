var voxyServices = angular.module('voxyServices', []);

var fs = require('fs');
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

voxyServices.factory("parseFileService", [function() {
	return function(file, callback) {
		fs.readFile(file, function(error, data) {
			if (error) {
				callback([{
					type: 'danger',
					head: 'File loading',
					text: error.toString()
				}]);
			} else {

				var parsed = [];
				var endlines = 0;

				var split_string_on = function(chr, string) {
					return string.split(chr).map(function (item, index) {
						if (item.length > 0 && item.match(/\S/g)) {
							return { text: item + chr, endlines: 0 };
						}
					}).filter(function(item) { return item; });
				}

				data.toString().split("\n").forEach(function(item, index) {
					if (item.length > 0 && item.match(/\S/g)) {

						if (item.split('.').length > 2) {
							var chunks  = split_string_on(".", item);
							chunks[0].endlines = endlines;
							parsed = parsed.concat(chunks);
							endlines = 0;
						} else if (item.split('!').length > 2) {
							var chunks  = split_string_on("!", item);
							chunks[0].endlines = endlines;
							parsed = parsed.concat(chunks);
							endlines = 0;
						} else if (item.split('?').length > 2) {
							var chunks  = split_string_on("?", item);
							chunks[0].endlines = endlines;
							parsed = parsed.concat(chunks);
							endlines = 0;
						} else if (item.split('?!').length > 2) {
							var chunks  = split_string_on("?!", item);
							chunks[0].endlines = endlines;
							parsed = parsed.concat(chunks);
							endlines = 0;
						} else {
							parsed.push({ text: item, endlines: (endlines > 0 ? endlines : 1) });
							endlines = 0;
						}
					} else {
						endlines +=2;
					}
				})
				callback([{
					type: 'success',
					head: 'File uploaded',
					text: file
				}],
				parsed.map(function(raw, index) {
					raw.id = index;
					return raw;
				}));
			}
		});
	}
}]);
