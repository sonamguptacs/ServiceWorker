"use Strict";

const version = "v5";

self.addEventListener("install", onInstall);
self.addEventListener("activate", onActivate);
self.addEventListener("message", onMessage);

async function onInstall() {
  await sendMessage({ message: "Service Worker installed", version });
  self.skipWaiting();
}

async function onActivate(event) {
  event.waitUntil(handleActivation());
}

async function handleActivation() {
  await clients.claim();
  await sendMessage({ message: "Service Worker activated", version });
}

async function main() {
  await sendMessage({ message: "Main function running", version });
  await sendMessage({ requestedUpdate: true });
}

async function sendMessage(message) {
  const clientsList = await clients.matchAll({ includeUncontrolled: true });
  return Promise.all(
    clientsList.map(function (client) {
      const channel = new MessageChannel();
      channel.port1.onmessage = onMessage;
      return client.postMessage(message, [channel.port2]);
    })
  );
}

function onMessage({ data }) {
  if ({ data }) {
    sendMessage({
      message:
        "Service Worker received online status update as " +
        data.status.isOnLine,
      version,
    });
  }
}

main();
