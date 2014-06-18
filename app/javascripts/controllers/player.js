var voxyControllers = angular.module('voxyControllers');

voxyControllers.controller('PlayerCtrl', ['$scope', '$rootScope', '$window', 'speakerService', 'navigationService', 'parseFileService',
function ($scope, $rootScope, $window, speakerService, navigationService, parseFileService) {
	speakerService.spawn();
	$scope.alerts = [];
	$scope.state = 'none';
	$scope.playerStyle = {};

	$scope.closeAlert = function(index) {
		$scope.alerts.splice(index, 1);
	}

	$scope.fileChange = function() {
		parseFileService($('#input-file').val(), function(alerts, sentenses) {
			$scope.$apply(function() {
				$scope.state = 'loaded';
				$scope.alerts = alerts;
				$rootScope.sentenses = sentenses;
			});
		});
	}

	$scope.openFile = function() {
		$('#input-file').click();
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
