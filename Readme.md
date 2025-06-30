# ServiceWorker

Similar to **Web Workers** , Service Worker allows you to handle tasks without interrupting web page operations.'

## Register a ServiceWorker

Service worker can be registered using register function of **serviceWorker** object of **navigator** 

```js
 swRegistration = await navigator.serviceWorker.register(
        "serviceWorker.js",
        {
          updateViaCache: "none",
        }
      );
```

## LifeCycle

- Installing
- Waiting
- Active

After registering `service worker` , **swRegistration** object can be used to get the current state of `service worker`

```js
 sWorker =
        swRegistration.installing ||
        swRegistration.waiting ||
        swRegistration.active;

```

## EventListeners

### controllerchange

When there is a change in the state of `service worker` from `Pause` to `Start` , **controllerchange** event is triggered

```js
 navigator.serviceWorker.addEventListener(
        "controllerchange",
        onControllerChange
      );

function onControllerChange() {
    sWorker = navigator.serviceWorker.controller;
    sendSWMessage();
  }
```

### message

This event is occured when `message` is received from `service worker`

```js
navigator.serviceWorker.addEventListener("message", onSWMessage);

function onSWMessage(event) {
    if (event.data.requestedUpdate) {
      const target = event.ports && event.ports[0];
      sendSWMessage(target);
    } else {
      printMessage(event.data);
    }
  }
```

### Sending Message to Service Worker

Like `Web Workers` **postMessage** method is used to send message to service worker.

We can use **target** port in which service worker is running , or **registration**  object or **controller.navigator** object to send message.

```js
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
```

### How Service Worker gets registered

Once service worker is registered, it is installed 

```js
self.addEventListener("install", onInstall);
async function onInstall() {
  await sendMessage({ message: "Service Worker installed", version });
  self.skipWaiting(); 
}
```
Waiting phase can be skipped

Since multiple tabs can be opened , hence it is important to know which tab has claimed the service worker during activation

```js
self.addEventListener("activate", onActivate);

async function onActivate(event) {
  event.waitUntil(handleActivation());
}

async function handleActivation() {
  await clients.claim();
  await sendMessage({ message: "Service Worker activated", version });
}

```

### How Service Worker request and recieve data from client

- Service worker needs to get list of all client tabs which are using it using **clients.matchAll**
- Then a *channel* is opened using **MessageChannel()** which has 2 ports object
- *port1* has the `onmessage` property to which callback to be executed on receiving message from client can be assigned.
- *port2* is sent to client, which can be used by client to send messages back to same service worker.
- *postMessage* is used for sending message to client

```js
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
```

## Applications

### Caching
