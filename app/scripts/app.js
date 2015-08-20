(function () {

	'use strict';

	var	worker = new Worker("app/scripts/primeNumbersWorker.js");

	$("#runWorker").on('click', function(e) {
		statistic.working = !statistic.working;
		if(statistic.working) {
			statistic.runTimes += 1;
		}
		setStatistic(statistic);
		toggleButtonAppearance();
		work();
		time();
	})

	$("#reset").on('click', function(e) {
		resetDB();
		resetStatistic();
		worker.postMessage({ command: "resetDB" });
		statistic = getStatistic();
		showStatistic();
	})

	$("#refreshTable").on('click', function(e) {
		$('#primesTable').paging({ limit:5 });
	})

	worker.onmessage = function(message) {
		addNumber(message.data.number);
		statistic.foundNumbers += 1;
		setStatistic(statistic);
	}

	function work() {
		if(statistic.working) {
			worker.postMessage({ command: "checkPrime", number: statistic.lastNumber });
			statistic.lastNumber += 1;
			setStatistic(statistic);
			showStatistic();
			setTimeout(work, 25);
		}
	}

	function time() {
		var step = 1000; // ms
		if(statistic.working) {
			statistic.operationTime += step;
			setStatistic(statistic);
			setTimeout(time, step);
		}
	}

	function toggleButtonAppearance() {
		$("#runWorker").toggleClass("btn-success");
		$("#runWorker").toggleClass("btn-danger");
		if(statistic.working) {
			$("#runWorker").text("stop");
			$("#reset").attr("disabled", "disabled");
		} else {
			$("#runWorker").text("start");
			$("#reset").removeAttr("disabled");
		}
	}

	function showStatistic() {
		$("#lastNumber").text("Last number: " + statistic.lastNumber);
		$("#foundNumbers").text("Found numbers: " + statistic.foundNumbers);
		$("#runTimes").text("Run times: " + statistic.runTimes);
		$("#operationTime").text("Operation time: " + formatTime(statistic.operationTime));
	}

	function formatTime(input) {
		function addZero(n) {
			return (n<10? '0':'') + n;
		}
		input = input / 1000;
		var secs = input % 60;
		input = (input - secs) / 60;
		var mins = input % 60;
		var hrs = (input - mins) / 60;
		return addZero(hrs) + ':' + addZero(mins) + ':' + addZero(secs);// + '.' + ms;
	}

	showStatistic();

})();