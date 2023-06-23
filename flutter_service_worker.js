'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';

const RESOURCES = {"assets/AssetManifest.json": "d3fb89e4a7cb85a2f880adbc87378f86",
"assets/AssetManifest.smcbin": "8ecbbaaee2264b3157ae0be19d1093cc",
"assets/assets/fonts/Comic%2520Book.ttf": "e47b24293d67a1c431010d26d708494b",
"assets/assets/fonts/Comicv2b.ttf": "20f6bdb837385aa6073edf593bae48ed",
"assets/assets/fonts/Digital%2520Dismay.otf": "582cac299faac1ab8d378a6488ba2ced",
"assets/assets/fonts/HACKED.ttf": "2f48abc8c45de9add264c5be432e878e",
"assets/assets/fonts/SF%2520Arch%2520Rival%2520Bold.ttf": "bb273bd0c0667f82875caae505b28965",
"assets/assets/fonts/SFPRODISPLAYMEDIUM.OTF": "51fd7406327f2b1dbc8e708e6a9da9a5",
"assets/assets/icons/logo-black.png": "d3c2978cc444e1ddd6484cff57e2bb44",
"assets/assets/icons/logo-color.png": "530c3a6f488c7aa289aacb0c0b7168d1",
"assets/assets/icons/logo-no-background.png": "29a15198d4c926d6a7d2b8e80d0cf162",
"assets/assets/icons/logo-white.png": "2260a0b87313a69fc92c45934c66a93b",
"assets/assets/images/app_store.png": "f17fd8c827f217a3fdd86169b7723bae",
"assets/assets/images/audify-feature.png": "60ad183367aee2c2ba45117b83d93500",
"assets/assets/images/audify-phone-image.png": "494df83360ac3a89bd75f925d557b941",
"assets/assets/images/audify-plus-feature.png": "0afbdcc236298d6f5d7c2399f33a1d29",
"assets/assets/images/audify-plus.png": "e118c06aaa708a8f2a6a9bddaf5abc7e",
"assets/assets/images/audify-songs.png": "085290a9094c1ddcd56cd91a32127f78",
"assets/assets/images/audify.png": "88eedc3237dbf771ff9abbf82b05df45",
"assets/assets/images/gpa-calculator-feature.png": "7613104409be9dc8fea64913587ab46f",
"assets/assets/images/gpa-calculator.png": "7a0642358926a69cb9725bbbf7f60e8d",
"assets/assets/images/gpacalculator-grades.png": "383770cdbf02c7af2e21180563aa0e8c",
"assets/assets/images/gpacalculator-phone-image.png": "a350b9eb626fbe666bc9ee2cd3e86618",
"assets/assets/images/gpacalculator-support.png": "85d76c9929b73e5b8fe90be8f76472f1",
"assets/assets/images/huawei-appgallery.png": "7fa16d04c3439ac0d886b8f7e5c4ee01",
"assets/assets/images/play_store.png": "f791178430ac07ec7d6def146319a08a",
"assets/FontManifest.json": "147d835b1c87c135a1680d7fa852e1ab",
"assets/fonts/MaterialIcons-Regular.otf": "793f6c68db52ccf80298077a433c0e48",
"assets/NOTICES": "7ea7b7f0eada215645a1c17b89fc7bd9",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "4c41479b3c11cd7858ce773f6ca0a847",
"assets/shaders/ink_sparkle.frag": "f8b80e740d33eb157090be4e995febdf",
"canvaskit/canvaskit.js": "76f7d822f42397160c5dfc69cbc9b2de",
"canvaskit/canvaskit.wasm": "f48eaf57cada79163ec6dec7929486ea",
"canvaskit/chromium/canvaskit.js": "8c8392ce4a4364cbb240aa09b5652e05",
"canvaskit/chromium/canvaskit.wasm": "fc18c3010856029414b70cae1afc5cd9",
"canvaskit/skwasm.js": "1df4d741f441fa1a4d10530ced463ef8",
"canvaskit/skwasm.wasm": "6711032e17bf49924b2b001cef0d3ea3",
"canvaskit/skwasm.worker.js": "19659053a277272607529ef87acf9d8a",
"favicon.png": "5dcef449791fa27946b3d35ad8803796",
"flutter.js": "6b515e434cea20006b3ef1726d2c8894",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"icons/Icon-maskable-192.png": "c457ef57daa1d16f64b27b786ec2ea3c",
"icons/Icon-maskable-512.png": "301a7604d45b3e739efc881eb04896ea",
"index.html": "022644e9707e8fbfa7b6dc426c61738f",
"/": "022644e9707e8fbfa7b6dc426c61738f",
"main.dart.js": "c63e3431fb24d0a0b53ab8398b938ac3",
"manifest.json": "08b707c1edf1bf909098ac32054165ca",
"version.json": "0412d19446a07d43a896d85e93832b8b"};
// The application shell files that are downloaded before a service worker can
// start.
const CORE = ["main.dart.js",
"index.html",
"assets/AssetManifest.json",
"assets/FontManifest.json"];

// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});
// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        // Claim client to enable caching on first launch
        self.clients.claim();
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      // Claim client to enable caching on first launch
      self.clients.claim();
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});
// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});
self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});
// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}
// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
