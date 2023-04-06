// Based on this example by Google
// https://github.com/GoogleChrome/samples/blob/gh-pages/service-worker/prefetch/service-worker.js
var CACHE_VERSION = "20230406141941";
var CACHES = {
	prefetch: 'prefetch-cache-v' + CACHE_VERSION,
	runtime: 'runtime'
}

const updatePreFetchCache = async () => {
	var urlsToPrefetch = [
		"/",
		"/about",
		"/galaxies",
	];

	caches.open(CACHES.prefetch)
		.then(cache => cache.addAll(urlsToPrefetch))
		// .then(self.skipWaiting())
}

self.addEventListener('install', event => {
	var urlsToPrefetch = [
		"/",
		"/about",
		"/galaxies",
	];
	
	event.waitUntil(
		caches.open(CACHES.prefetch)
		.then(cache => cache.addAll(urlsToPrefetch) )
		.then(self.skipWaiting())
	);
});

self.addEventListener('activate', event => {
	const currentCaches = [CACHES.prefetch];
	event.waitUntil(
		caches.keys().then(cacheNames => {
			return cacheNames.filter(cacheName => !currentCaches.includes(cacheName));
		}).then(cachesToDelete => {
			return Promise.all(cachesToDelete.map(cacheToDelete => {
				return caches.delete(cacheToDelete);
			}));
		}).then(() => self.clients.claim())
	);
});

const putInCache = async (request, response) => {
	const cache = await caches.open(CACHES.runtime);
	await cache.put(request, response);
}

const updateCache = async (request) => {
	const responseFromNetwork = await fetch(request);
	await putInCache(request, responseFromNetwork.clone());
	updatePreFetchCache();
	return responseFromNetwork;
}

const cacheFirst = async (request) => {
	const responseFromCache = await caches.match(request);
	if (responseFromCache) {
		console.log("Responding from cache to request: " + request)
		updateCache(request);
		return responseFromCache;
	}

	const responseFromNetwork = await updateCache(request);
	return responseFromNetwork;
}

self.addEventListener('fetch', event => {
	if (event.request.url.startsWith(self.location.origin)) {
		event.respondWith(cacheFirst(event.request));
	}
	// if (event.request.url.startsWith(self.location.origin)) {
  //   event.respondWith(
  //     caches.match(event.request).then(cachedResponse => {
  //       if (cachedResponse) {
  //         return cachedResponse;
  //       }

  //       return caches.open(CACHES.runtime).then(cache => {
  //         return fetch(event.request).then(response => {
  //           // Put a copy of the response in the runtime cache.
  //           return cache.put(event.request, response.clone()).then(() => {
  //             return response;
  //           });
  //         });
  //       });
  //     })
  //   );
  // }
})