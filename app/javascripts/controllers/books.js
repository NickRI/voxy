var voxyControllers = angular.module('voxyControllers');

voxyControllers.controller('BooksCtrl', ['$scope', '$timeout', '$http', '$localStorage', function ($scope, $timeout, $http, $localStorage) {

	$timeout(function () {
		$scope.storage = $localStorage.$default({
			books: [],
			bookmarks: [],
			chapter: { text: "search text"},
		});
	}, 10);

	$scope.addBook = function() {
		$scope.storage.books.push({
			id: Date.now(),
			name: null,
			author: null,
			description: null,
			currentIndex: 0,
			bookmarks: [],
			possibleImages: [],
			file: null,
			chapter: { text: "search text"},
			editmode: true,
		});
	}

	$scope.getImages = function(book) {
		$http.get('http://ajax.googleapis.com/ajax/services/search/images?v=1.0&q=' + book.author + " " + book.name).success(function(images) {
			book.possibleImages = images.responseData.results.map(function(image) {
				return { url: image.url, title: image.title };
			});
		});
	}
 
	$scope.deleteBook = function(id) {
		$scope.storage.books = $scope.storage.books.filter(function(book) {
			return book.id !== id;
		});
	}

	$scope.openFile = function(book) {
		$("#file-"+book.id).click();
	}

	$scope.changeFile = function() {
		var book = this.book;
		$scope.$apply(function() {
			book.file = $("#file-"+book.id).val();
		});
	}

}]);