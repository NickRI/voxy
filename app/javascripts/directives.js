var voxyDirectives = angular.module('voxyDirectives', []);

voxyDirectives.directive('ngAutoresize', ['$window', function($window) {
	var directive = {
		restrict: 'A',
		link: function($scope, element, attrs) {
			element[0].style.height = ($window.innerHeight - attrs.ngAutoresize) + "px";
			$window.addEventListener('resize', function() {
				$scope.$apply(function () {
					element[0].style.height = ($window.innerHeight - attrs.ngAutoresize) + "px";
				});
			}, false);
		}
	}

	return directive;
}]);