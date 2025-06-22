(function () {
  "use strict";
  let swRegistration;
  let sWorker;

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
    }
  }

  function onControllerChange() {
    sWorker = navigator.serviceWorker.controller;
  }
})();
