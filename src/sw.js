"use strict"

const asset_cache_name = "assets-2022-03-09";
const assets_to_cache = [
    "android-chrome-192x192.png",
    "android-chrome-512x512.png",
    "apple-touch-icon.png",
    "back.jpg",
    "bulma.min.css",
    "cards.json",
    "favicon-16x16.png",
    "favicon-32x32.png",
    "favicon.ico",
    "index.html"
];

self.addEventListener("install", (e) => {
    e.waitUntil((async () => {
        let cache = await caches.open(asset_cache_name);
        await cache.addAll(assets_to_cache);
    })());
});

self.addEventListener("activate", (e) => {
    e.waitUntil((async () => {
        let cache_names = await caches.keys();
        for (let c of cache_names) {
            if (!(c == asset_cache_name || c == "cards")) {
                await caches.delete(c);
            }
        }
    })());
});

self.addEventListener("fetch", (e) => {
    e.respondWith((async () => {
        let cached_response = await caches.match(e.request);
        if (cached_response) {
            return cached_response;
        }

        console.log(`Fetch ${e.request.url}`);
        let response = await fetch(e.request);

        let url = new URL(e.request.url);
        console.log(`Host ${url.host}`);
        let cache = await caches.open(url.host == "c1.scryfall.com" ? "cards" : asset_cache_name);
        cache.put(e.request, response.clone());
        return response;
    })());
});
