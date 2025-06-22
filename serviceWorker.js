"use Strict";

const version = "v1";

self.addEventListener("install", onInstall);
self.addEventListener("activate", onActivate);

function onInstall(event) {
  console.log("Service Worker: Installed");
  self.skipWaiting();
}

function onActivate(event) {
  event.waitUntil(handleActivation());
}

async function handleActivation() {
  await clients.claim();
  console.log("Service Worker: Activated");
}

function main() {
  console.log("Service Worker: Main function running");
}

main();
