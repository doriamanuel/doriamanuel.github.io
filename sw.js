const CACHE_STATIC_NAME = "static-v05";
const CACHE_INMUTABLE_NAME = "inmutable-v05";
const CACHE_DYNAMIC_NAME = "dynamic-v05";

self.addEventListener("install", (e) => {
	console.log("sw install");

	self.skipWaiting();

	const cacheStatic = caches.open(CACHE_STATIC_NAME).then((cache) => {
		console.log("static", cache);
		return cache.addAll([
			"/index.html",
			"css/estilos.css",
			"js/main.js",
			"js/api.js",
			"js/handlebars.min-v4.7.6.js",
			"/plantilla-lista.hbs",
			"imagenes/sentra.jpg",
		]);
	});

	const cacheInmutable = caches.open(CACHE_INMUTABLE_NAME).then((cache) => {
		console.log("Inmutable", cache);
		return cache.addAll([
			"https://code.getmdl.io/1.3.0/material.indigo-pink.min.css",
			"https://code.getmdl.io/1.3.0/material.min.js",
			"https://code.jquery.com/jquery-3.5.1.min.js",
		]);
	});

	e.waitUntil(promise.all[(cacheStatic, cacheInmutable)]);
});

self.addEventListener("activate", (e) => {
	console.log("activate");
	const cacheWhiteList = [
		CACHE_STATIC_NAME,
		CACHE_INMUTABLE_NAME,
		CACHE_DYNAMIC_NAME,
	];

	/* Borro los caches que no corresponden a la version actual */
	e.waitUntil(
		caches.keys().then((keys) => {
			return Promise.all(
				keys.map((cache) => {
					if (!cacheWhiteList.includes(cache)) {
						return caches.delete(cache);
					}
				})
			);
		})
	);
});

self.addEventListener("fetch", (e) => {
	//	console.log(e.request.url);
	//e.respondWith(fetch(e.request.url));
	if (!e.request.url.includes("chrome-extension")) {
		if (e.request.method == "GET" && !e.request.url.includes("mockapi.io")) {
			const respuesta = caches.match(e.request).then((res) => {
				if (res) {
					console.log("EXISTE EN EL CACHE", e.request.url);
					return res;
				}
				console.error("NO EXISTE EN EL CACHE", e.request.url);
				return fetch(e.request).then((nuevaRespuesta) => {
					caches.open(CACHE_DYNAMIC_NAME).then((cache) => {
						cache.put(e.request, nuevaRespuesta);
					});
					return nuevaRespuesta.clone();
				});
			});
			e.respondWith(respuesta);
		} else {
			console.warn("BYPASS", e.request.method, e.request.url);
		}
	}
});
