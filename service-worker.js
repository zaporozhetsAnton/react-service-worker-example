const CACHE_STATIC = 'my-site-cache-v1';
const CACHE_FLICKR_IMAGES = 'flickr-imgs';
const urlsToCache = [
  'app.32ccc5e5616508ca4369.js',
  'npm.react-dom.7452f274fe23421f8d2e.js',
  'runtime.99366336a554bd3df1b9.js',
  'images/logo.svg'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_STATIC)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.map(key => {
        if (key !== CACHE_STATIC && key !== CACHE_FLICKR_IMAGES) {
          return caches.delete(key);
        }
      })
    ))
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );
});


// Cache only example

// self.addEventListener('fetch', function(event) {
//   // If a match isn't found in the cache, the response
//   // will look like a connection error
//   event.respondWith(caches.match(event.request));
// });


// Network only example

// self.addEventListener('fetch', function(event) {
//   event.respondWith(fetch(event.request));
//   // or simply don't call event.respondWith, which
//   // will result in default browser behaviour
// });


// Cache, falling back to network example

// self.addEventListener('fetch', function(event) {
//   event.respondWith(
//     caches.match(event.request).then(function(response) {
//       return response || fetch(event.request);
//     })
//   );
// });


// Cache & network race example

// // Promise.race is no good to us because it rejects if
// // a promise rejects before fulfilling. Let's make a proper
// // race function:
// function promiseAny(promises) {
//   return new Promise((resolve, reject) => {
//     // make sure promises are all promises
//     promises = promises.map(p => Promise.resolve(p));
//     // resolve this promise as soon as one resolves
//     promises.forEach(p => p.then(resolve));
//     // reject if all promises reject
//     promises.reduce((a, b) => a.catch(() => b))
//       .catch(() => reject(Error("All failed")));
//   });
// };
// self.addEventListener('fetch', function(event) {
//   event.respondWith(
//     promiseAny([
//       caches.match(event.request),
//       fetch(event.request)
//     ])
//   );
// });


// Network falling back to cache example

// self.addEventListener('fetch', function(event) {
//   event.respondWith(
//     fetch(event.request).catch(function() {
//       return caches.match(event.request);
//     })
//   );
// });


// Example of different strategies

// self.addEventListener('fetch', function(event) {
//   // Parse the URL:
//   let requestURL = new URL(event.request.url);
//
//   if (/\.staticflickr\.com$/.test(requestURL.hostname)) {
//     event.respondWith(flickrImageResponse(event.request));
//     return;
//   }
//   // default pattern
//   event.respondWith(
//     caches.match(event.request).then(function(response) {
//       return response || fetch(event.request);
//     })
//   );
// });
// function flickrImageResponse(request) {
//   return caches.match(request).then(function(response) {
//     if (response) {
//       return response;
//     }
//
//     return fetch(request.clone()).then(function(response) {
//       caches.open(CACHE_FLICKR_IMAGES).then(function(cache) {
//         cache.put(request, response).then(function() {
//           console.log('yey img cache');
//         }, function() {
//           console.log('nay img cache');
//         });
//       });
//
//       return response.clone();
//     });
//   });
// }
