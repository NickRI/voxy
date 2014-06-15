var voxyControllers = angular.module('voxyControllers', ['ui.bootstrap', 'ngAnimate', 'ngStorage', 'voxyServices']);


voxyControllers.controller('BooksCtrl', ['$scope', '$timeout', function ($scope, $timeout) {
	$scope.books = [];
	$timeout(function () {

		for(var i=0; i < 10; i++) {
			$scope.books.push({
				id: i,
				image: "http://yastatic.net/morda-logo/i/logo.png",
				name: "Test book"+i,
				description: "Book description Book description Book description Book description"
			});
		}

	}, 0);

	$scope.deleteBook = function(id) {
		$scope.books = $scope.books.filter(function(book) {
			return book.id !== id;
		});
	}

}]);

voxyControllers.controller('NavigationCtrl', ['$scope', function($scope) {

}]);

voxyControllers.controller('PlayerCtrl', ['$scope', '$rootScope', '$window', 'speakerService', 'navigationService', function ($scope, $rootScope, $window, speakerService, navigationService) {
	speakerService.spawn();
	$scope.alerts = [];
	$scope.playerStyle = {
		'overflow-y': 'auto',
		'overflow-x': 'none',
		height: ($window.innerHeight - 280)+'px'
	}

	$window.addEventListener('resize', function() {
		$scope.$apply(function () {
			$scope.playerStyle.height = ($window.innerHeight - 280)+'px';
		});
	}, false);

	$scope.closeAlert = function(index) {
		$scope.alerts.splice(index, 1);
	}

	$scope.fileChange = function() {
		fs.readFile(document.getElementById('input-file').value, function(error, data) {
			if (error) {
				$scope.$apply(function () {
					$scope.alerts.push({
						type: 'danger',
						head: 'File loading',
						text: error.toString()
					});
				});
			} else {
				$scope.$apply(function () {
					$scope.alerts.push({
						type: 'success',
						head: 'File uploaded',
						text: document.getElementById('input-file').value
					});

					$scope.state = 'loaded';
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
					$rootScope.sentenses = parsed.map(function(raw, index) {
						raw.index = index;
						return raw;
					});
				});
			}
		});
	}

	$scope.openFile = function() {
		document.getElementById('input-file').click();
	}

	$scope.humanizeState = function() {
		if ($scope.state === 'loaded') {
			return "Read text";
		} else if ($scope.state === 'plays') {
			return "Pause reading";
		} else if ($scope.state === 'frozen') {
			return "Resume reading";
		} else if ($scope.state === 'none') {
			return "Wait file...";
		} else if ($scope.state === 'error') {
			return "Restart after error...";
		}
	}

	$scope.speak = function() {

		function play() {
			$scope.state = 'plays';
			if ($scope.autoscroll !== 'disabled') {
				var parent = document.getElementsByClassName('text-editor')[0];
				var child = document.getElementById('sentense-'+$rootScope.selectedIndex);
				if ($scope.autoscroll === 'top') {
					navigationService(parent, child, -$scope.scrollOffset);
				} else if ($scope.autoscroll === 'bottom') {
					navigationService(parent, child, -(parent.offsetHeight - $scope.scrollOffset));
				}
			}
			speakerService.say("voice_msu_ru_nsh_clunits", $scope.sentenses[$rootScope.selectedIndex].text, function(error) {
				if (error) {
					$scope.$apply(function () {
						$scope.state = 'error';
						$scope.alerts.push({
							type: 'danger',
							head: 'Reading',
							text: error.toString()
						});
					});
				} else {
					$scope.$apply(function () {
						if (++$rootScope.selectedIndex < $scope.sentenses.length && $scope.state === 'plays') {
							play();
						}
					});
				}
			});
		}

		if ($scope.state === 'loaded') {
			play();
		} else if ($scope.state === 'plays') {
			$scope.state = 'frozen';
		} else if ($scope.state === 'frozen') {
			play();
		} else if ($scope.state === 'error') {
			play();
		}
	}

}]);

voxyControllers.controller('ChaptersCtrl', ['$scope', '$rootScope', '$window', '$localStorage', 'navigationService',  function ($scope, $rootScope, $window, $localStorage, navigationService) {
	
	$scope.chaptersStyle = {
		'overflow-y': 'auto',
		height: ($window.innerHeight - 207)+'px'
	};

	$scope.storage = $localStorage.$default({
		bookmarks: [],
		chapter: { text: "search text"}
	});

	$window.addEventListener('resize', function() {
		$scope.$apply(function () {
			$scope.chaptersStyle.height = ($window.innerHeight - 207)+'px';
		});
	}, false);

	$scope.addBookmark = function(sentense) {
		$scope.storage.bookmarks.push({ text: sentense.text, sentense: sentense.index, index: $scope.storage.bookmarks.length });
	}

	$scope.deleteBookmark = function(index) {
		$scope.storage.bookmarks = $scope.storage.bookmarks.filter(function(bookmark) {
			return index !== bookmark.index;
		});
	}

	$scope.navigateTo = function(index, indexName) {
		$rootScope[indexName] = index;
		var parent = document.getElementsByClassName('text-editor')[0];
		var child = document.getElementById('sentense-'+index);
		navigationService(parent, child, -50);
	}
}]);