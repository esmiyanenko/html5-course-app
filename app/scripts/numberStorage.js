(function() {

	'use strict';

	var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB,
	    baseName = "NumbersDB",
	    storeName = "primeNumbers",
	    version = 1;

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

	window.resetDB = function() {
		var request = indexedDB.deleteDatabase(baseName);
		
		request.onerror = logError;
	}

	window.addNumber = function(number) {
		connectDB(function(db) {
			var transaction = db.transaction([storeName], "readwrite"),
	    		store = transaction.objectStore(storeName),
	    		request = store.add({ value: number }, number);

		    request.onerror = logError;
		});
	}

})();