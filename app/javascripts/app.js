var voxyApp = angular.module('voxyApp', ['ngRoute', 'voxyControllers']);

voxyApp.config(['$routeProvider', function($routeProvider) {
	$routeProvider.
		when('/listen-book/:bookId', {
			templateUrl: 'partials/player.html',
			controller: 'PlayerCtrl',
			controllerAs: "player"
		}).
		when('/listen-book/', {
			templateUrl: 'partials/player.html',
			controller: 'PlayerCtrl'
		}).
		when('/books-list', {
			templateUrl: 'partials/books.html',
			controller: 'BooksCtrl'
		}).
		otherwise({
			redirectTo: '/books-list'
		});
}]);
