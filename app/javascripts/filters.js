var voxyFilters = angular.module('voxyFilters', []);

voxyFilters.filter('chapters', [function() {
	return function(sentenses, showByChapters, selectedIndex, chapters) {
		if (showByChapters) {
			if (chapters && chapters.length > 0) {
				var chapersIds = chapters.map(function(chapter) { return chapter.id; });
				var minChapter = Math.min.apply(null, chapersIds);
				var maxChapter = Math.max.apply(null, chapersIds);

				if (minChapter > selectedIndex) {
					return sentenses.filter(function(sentense) {
						return sentense.id >= 0 && sentense.id < minChapter;
					});
				} else if (maxChapter <= selectedIndex) {
					return sentenses.filter(function(sentense) {
						return sentense.id >= maxChapter && sentense.id < sentenses.length;
					});
				} else {

					var nextChapter = chapersIds.filter(function(chapter) {
						return selectedIndex < chapter;
					}).slice(0, 1).shift();

					var currentChapter = chapersIds[chapersIds.indexOf(nextChapter) - 1];

					return sentenses.filter(function(sentense) {
						return sentense.id >= currentChapter && sentense.id < nextChapter;
					});
				}
			}
		} else {
			return sentenses;
		}
		
	}
}]);