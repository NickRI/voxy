var voxyApp = angular.module('voxyApp', ['ngRoute', 'ngAnimate', 'voxyControllers', 'voxyDirectives']);
var fs = require('fs');

voxyApp.config(['$routeProvider', function($routeProvider) {
	$routeProvider.
		when('/', {
			templateUrl: 'partials/player.html',
			controller: 'PlayerCtrl'
		}).
		when('/books-list', {
			templateUrl: 'partials/books.html',
			controller: 'BooksCtrl'
		}).
		otherwise({
			redirectTo: '/'
		});
}]);
