"use Strict";

const version = "v1";

self.addEventListener("install", onInstall);
self.addEventListener("activate", onActivate);

function onInstall(event) {
  console.log("Service Worker: Installed");
  self.skipWaiting();
}

function onActivate(event) {
  console.log("Service Worker: Activated");
  // event.waitUntil(self.clients.claim());
}
