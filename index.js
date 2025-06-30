(function () {
  "use strict";
  let swRegistration;
  let sWorker;

  let isOnLine = navigator.onLine ?? false;

  window.addEventListener("online", () => {
    isOnLine = true;
    sendSWMessage();
  });
  window.addEventListener("offline", () => {
    isOnLine = false;
    sendSWMessage();
  });

  document.addEventListener("DOMContentLoaded", onLoad);

  async function onLoad() {
    if ("serviceWorker" in navigator) {
      swRegistration = await navigator.serviceWorker.register(
        "serviceWorker.js",
        {
          updateViaCache: "none",
        }
      );
      sWorker =
        swRegistration.installing ||
        swRegistration.waiting ||
        swRegistration.active;

      navigator.serviceWorker.addEventListener(
        "controllerchange",
        onControllerChange
      );

      navigator.serviceWorker.addEventListener("message", onSWMessage);
    }
  }

  function onControllerChange() {
    sWorker = navigator.serviceWorker.controller;
    sendSWMessage();
  }

  function onSWMessage(event) {
    if (event.data.requestedUpdate) {
      const target = event.ports && event.ports[0];
      sendSWMessage(target);
    } else {
      printMessage(event.data);
    }
  }

  function sendSWMessage(target) {
    const message = { status: { isOnLine } };
    if (target) {
      target.postMessage(message);
      return;
    }
    if (sWorker) {
      sWorker.postMessage(message);
      return;
    } else {
      service.controller.navigator.postMessage(message);
    }
  }
})();

function printMessage(data) {
  const statusElement = document.getElementById("status");
  const div = document.createElement("div");
  div.textContent = `${data.message}`;
  statusElement.appendChild(div);
}
