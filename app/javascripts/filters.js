var voxyFilters = angular.module('voxyFilters', []);

voxyFilters.filter('chapters', ['$rootScope', function($rootScope) {
	return function(sentenses, showByChapters) {
		if (showByChapters && $rootScope.chapters && $rootScope.chapters.length > 0) {
			var chapters = $rootScope.chapters.filter(function(chapter) {
				return chapter.id <= $rootScope.selectedIndex || chapter.id > $rootScope.selectedIndex;
			}).slice(1, 3);
			return sentenses.filter(function(sentense) {
				return sentense.id >= chapters[0].id && sentense.id < chapters[1].id;
			});
		} else {
			return sentenses;
		}
		
	}
}]);