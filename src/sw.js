import { manifest, version } from "@parcel/service-worker";

async function install() {
    let cache = await caches.open(version);
    await cache.addAll(manifest);
}
self.addEventListener("install", e => e.waitUntil(install()));

async function activate() {
    let cache_names = await caches.keys();
    for (let c of cache_names) {
        if (!(c == version || c == "cards")) {
            await caches.delete(c);
        }
    }
}
self.addEventListener("activate", e => e.waitUntil(activate()));

self.addEventListener("fetch", (e) => {
    e.respondWith((async () => {
        let cached_response = await caches.match(e.request);
        if (cached_response) {
            return cached_response;
        }

        let response = await fetch(e.request);
        let url = new URL(e.request.url);
        let cache_name = url.host == "c1.scryfall.com" ? "cards" : version;
        let cache = await caches.open(cache_name);
        cache.put(e.request, response.clone());
        return response;
    })());
});
