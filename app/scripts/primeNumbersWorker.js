(function() {

	'use strict';

	var baseName = "NumbersDB-worker",
	    storeName = "primeNumbers",
	    version = 1;

	self.onmessage = function(message) {
		var data = message.data;
		if(data.command == "checkPrime") {
			checkIfPrime(data.number);
		} else if(data.command == "resetDB") {
			resetDB();
		}
	}

	function checkIfPrime(number) {
	    var isPrime = true,
	    	last = lastDigit(number),
	    	isEnds1379 = checkIf1379(last);

	    if(number > 10 && isEnds1379) {
	        var i = 0,
	        	sqrt = Math.sqrt(number),
	        	floor = Math.floor(sqrt);

	        getRange(floor, function(primes) {
	        	for(i; i < primes.length; i++) {
		            if(number % primes[i].value == 0) {
		                isPrime = false;
		                break;
		            }
	        	}
		        if(isPrime) {
					addNumber(number);
					postMessage({ number: number });
				}
	        })       
	    } else if(number == 2 || number == 3 || number == 5 || number == 7) {
	    	addNumber(number);
			postMessage({ number: number });
	    } else {
	    	isPrime = false;
	    }
	}

	function lastDigit(input) {
	    return (input % 10);
	}

	function checkIf1379(input) {
	    return (input == 1 || input == 3 || input == 7 || input == 9);
	}	

	//DB CODE

	function logError(error) {
	    console.log(error);
	}

	function connectDB(cb) {
	    var request = indexedDB.open(baseName, version);
	    
	    request.onsuccess = function() {
	        cb(request.result);
	    }

	    request.onupgradeneeded = function(e) {
	    	var db = e.target.result;
	    	if(!db.objectStoreNames.contains(storeName)) {
	    		var objectStore = db.createObjectStore(storeName);
	    		objectStore.createIndex("value","value", { unique: true });
	    	}
	        connectDB(cb);
	    }

	    request.onerror = logError;
	}

	function resetDB() {
		var request = indexedDB.deleteDatabase(baseName);
		
		request.onerror = logError;
	}

	function addNumber(number) {
		connectDB(function(db) {
			var transaction = db.transaction([storeName], "readwrite"),
	    		store = transaction.objectStore(storeName),
	    		request = store.add({ value: number }, number);

		    request.onerror = logError;
		});
	}

	function getRange(max, cb) {
	    connectDB(function(db) {
	        var transaction = db.transaction([storeName], "readonly"),
				store = transaction.objectStore(storeName),
				range = IDBKeyRange.bound(1, max),
	        	request = store.index("value").openCursor(range, 'next'),
	        	result = [];

        	request.onsuccess = function(e) {
        		var cursor = e.target.result;
        		if(cursor) {
        			result.push(cursor.value);
        			cursor.continue();
        		} else {
        			cb(result);
        		}
			}

	        request.onerror = logError;
	    });
	}

})();