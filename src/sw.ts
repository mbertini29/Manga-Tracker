/// <reference lib="webworker" />

import { clientsClaim } from "workbox-core";
import { createHandlerBoundToURL, precacheAndRoute } from "workbox-precaching";
import { NavigationRoute, registerRoute } from "workbox-routing";

declare const self: ServiceWorkerGlobalScope;

self.skipWaiting();  // attiva il SW immediatamente 
clientsClaim();      // il SW prende il controllo della pagina attuale immediatamente

// Precache dei file generati da Vite
precacheAndRoute(self.__WB_MANIFEST);

// App Shell: tutte le navigazioni restituiscono index.html
const navigationHandler = createHandlerBoundToURL("/index.html");

// Ogni volta che il browser richiede una pagina HTML, invece di andare in rete, restituisci index.html che ho già nella cache.
registerRoute(new NavigationRoute(navigationHandler));


