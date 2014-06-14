var voxyDirectives = angular.module('voxyDirectives', ['ngSanitize']);

voxyDirectives.directive('line', function() {
	var directive = {
		replace: true,
		restrict: 'E',
		template: "<span>{{sentense.text}}</span>",
		link: function($scope, element, attrs) {
			for (var i = 0; i < $scope.sentense.endlines; i++) {
				element[0].parentNode.insertBefore(document.createElement("br"), element[0]);
			}
		}
	}

	return directive;
});