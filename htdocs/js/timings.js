function calculate_load_times(){
	if("performance" in window === false){
		console.log("Calculate Load Times: Timing API not supported.");
		return;
	}

	// Get resources
	var resources = window.performance.getEntriesByType("resource");

	// Check for resource records
	if(resources === undefined || resources.length <= 0){
		console.log("Calculate Load Times: No `resource` records.");
		return;
	}

	var resourceArray = {},
		pageTimings = {};

	// Iterate through resources
	for(var i = 0; i < resources.length; i++){
		var resourceData = {
			sizes: {},
			timings: {}
		};

		// Collect size information
		resourceData.sizes.compressed = resources[i].encodedBodySize,
		resourceData.sizes.uncompressed = resources[i].decodedBodySize,
		resourceData.sizes.compressionRatio = (resources[i].encodedBodySize / resources[i].decodedBodySize) * 100,
		resourceData.sizes.headers = resources[i].transferSize - resources[i].encodedBodySize;
		resourceData.sizes.totalPayload = resources[i].transferSize;

		// Collect timings
		resourceData.timings.redirect = resources[i].redirectEnd - resources[i].redirectStart,
		resourceData.timings.dnsLookup = resources[i].domainLookupEnd - resources[i].domainLookupStart,
		resourceData.timings.tcpHandshake = resources[i].connectEnd - resources[i].connectStart,
		resourceData.timings.secureConnection = (resources[i].secureConnectionStart > 0) ? (resources[i].connectEnd - resources[i].secureConnectionStart) : 0,
		resourceData.timings.response = resources[i].responseEnd - resources[i].responseStart,
		resourceData.timings.fetchUntilResponseEnd = (resources[i].fetchStart > 0) ? (resources[i].responseEnd - resources[i].fetchStart) : 0,
		resourceData.timings.requestStartUntilResponseEnd = (resources[i].requestStart > 0) ? (resources[i].responseEnd - resources[i].requestStart) : 0,
		resourceData.timings.startUntilResponseEnd = (resources[i].startTime > 0) ? (resources[i].responseEnd - resources[i].startTime) : 0;

		// Add to the resource array
		resourceArray[resources[i].name] = resourceData;
	}

	// Collect page timings
	pageTimings.redirect = window.performance.timing.redirectEnd - window.performance.timing.redirectStart,
	pageTimings.dnsLookup = window.performance.timing.domainLookupEnd - window.performance.timing.domainLookupStart,
	pageTimings.timeToFirstByte = window.performance.timing.responseStart - window.performance.timing.navigationStart,
	pageTimings.pageResponse = window.performance.timing.responseEnd - window.performance.timing.requestStart;
	pageTimings.DOMContentLoaded = window.performance.timing.domContentLoadedEventEnd - window.performance.timing.navigationStart,
	pageTimings.DOMInteractive = window.performance.timing.domInteractive - window.performance.timing.navigationStart,
	pageTimings.pageParse = window.performance.timing.domInteractive - window.performance.timing.domLoading,
	pageTimings.pageLoad = window.performance.timing.loadEventEnd - window.performance.timing.navigationStart;

	// Spit out timing data
	console.log("Page timings:");
	console.dir(pageTimings);
	console.log("Resource information:");
	console.dir(resourceArray);
}

calculate_load_times();
