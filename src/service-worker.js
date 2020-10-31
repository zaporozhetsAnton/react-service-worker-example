import { precacheAndRoute } from 'workbox-precaching';
import { skipWaiting, clientsClaim } from 'workbox-core';

skipWaiting();
clientsClaim();

precacheAndRoute(self.__WB_MANIFEST);

self.addEventListener('push', function (event) {
    event.waitUntil(
        self.clients.matchAll().then(function (clientList) {
            // const focused = clientList.some(function (client) {
            //     return client.focused;
            // });
            // if (focused) {
            //     // logic if page is focused
            //     return;
            // } else if (clientList.length > 0) {
            //     // logic if page wasn't closed
            //     return;
            // }
            let notificationMessage;
            if (event.data) {
                // event.data.json() also possible
                notificationMessage = event.data.text();
            } else {
                notificationMessage = 'Push message no payload';
            }
            const options = {
                // requireInteraction: true, // use it if you want notification to not close automatically.
                body: notificationMessage,
                image:
                    'https://media.npr.org/assets/artslife/arts/2010/09/galifianakis-aa06dc89e0b14a5f9c88556fc85b6dc997814c19.jpg',
                icon:
                    'https://resizing.flixster.com/wtFNMrhUf2cuhgPmv0HfSSlj4R0=/300x300/v1.cjs0MjIwNTtqOzE4NTQwOzEyMDA7Mjc1OzI0MA',
                vibrate: [500, 110, 500, 110, 450, 110, 200, 110, 170, 40, 450, 110, 200, 110, 170, 40, 500],
                data: {
                    dateOfArrival: Date.now(),
                    primaryKey: 1,
                },
                actions: [
                    {
                        action: 'explore',
                        title: 'Explore this new world',
                        iconn:
                            'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQtZHxnKNGIFNi1StkDu_WWFIOK7UPoUDLODQ&usqp=CAU',
                    },
                    {
                        action: 'close',
                        title: "I don't want any of this",
                        icon: 'https://images-na.ssl-images-amazon.com/images/I/51dkZR8fI7L._AC_.jpg',
                    },
                ],
            };
            // If you need grouping messages use Tags - https://developers.google.com/web/fundamentals/push-notifications/notification-behaviour#tag
            self.registration.showNotification('test message', options);
        }),
    );
});

self.addEventListener('notificationclick', function (event) {
    event.notification.close();
    // const notificationData = event.notification.data; // if you need notification data in this event
    if (!event.action) {
        // Was a normal notification click
        event.waitUntil(
            self.clients.matchAll().then(function (clientList) {
                if (clientList.length > 0) {
                    clientList[0].focus();
                } else {
                    self.clients.openWindow('google.com');
                }
            }),
        );
        return;
    }

    switch (event.action) {
        case 'explore':
            self.clients.openWindow('google.com');
            break;
        case 'close':
            console.log('do nothing');
            break;
        default:
            console.log(`Unknown action clicked: '${event.action}'`);
            break;
    }
});
