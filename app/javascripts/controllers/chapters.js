var voxyControllers = angular.module('voxyControllers');


voxyControllers.controller('ChaptersCtrl', ['$scope', '$rootScope', '$window', '$localStorage', 'navigationService',  function ($scope, $rootScope, $window, $localStorage, navigationService) {

	$scope.storage = $localStorage;

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