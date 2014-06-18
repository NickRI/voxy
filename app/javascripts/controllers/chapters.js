var voxyControllers = angular.module('voxyControllers', ['ui.bootstrap', 'ngStorage']);


voxyControllers.controller('ChaptersCtrl', ['$scope', '$rootScope', '$window', '$localStorage', 'navigationService',  function ($scope, $rootScope, $window, $localStorage, navigationService) {
	
	$scope.chaptersStyle = {
		'overflow-y': 'auto',
		height: ($window.innerHeight - 207)+'px'
	};

	$scope.storage = $localStorage;

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