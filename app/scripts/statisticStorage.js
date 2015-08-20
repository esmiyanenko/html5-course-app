(function() {

	'use strict';

	if(typeof(Storage)!== 'undefined') {
  	
		window.initializeLocalStorage = function() {
			if (!localStorage.getItem('statistic')) {
				resetStatistic();
			}
			window.statistic = getStatistic();
		};

		window.resetStatistic = function() {
			var statistic = {
					lastNumber: 1,
					foundNumbers: 0,
					runTimes: 0,
					operationTime: 0, // milliseconds
					working: false
				}
			localStorage.setItem("statistic", JSON.stringify(statistic));
		};

		window.getStatistic = function() {
			return JSON.parse(localStorage.getItem("statistic"));
		};

		window.setStatistic = function(statistic) {
			localStorage.setItem("statistic", JSON.stringify(statistic));
		};	

		initializeLocalStorage();

	} else {
		console.log("localStorage is not supported !");
	}

})();