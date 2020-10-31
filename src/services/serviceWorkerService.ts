const pushNotificationSubscriptionUrl = 'http://localhost:3000/subscribe';
const publicVapidKey = 'BPjl1X5c76RjGD4vqeJj4tXznvKjDvkJ7LR0rDXCH6leqvOT6mRo60V2MKBshSQKx5HhfwTnLD-gSHHVoXjHfns';

const askPermission = () => {
    return new Promise(function (resolve, reject) {
        const permissionResult = Notification.requestPermission(function (result) {
            resolve(result);
        });

        if (permissionResult) {
            permissionResult.then(resolve, reject);
        }
    }).then(function (permissionResult) {
        if (permissionResult !== 'granted') {
            throw new Error("We weren't granted permission.");
        }
    });
};

const urlBase64ToUint8Array = (base64String: string) => {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
};

const subscribe = () => {
    navigator.serviceWorker.ready
        .then(function (registration) {
            return registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
            });
        })
        .then(function (subscription) {
            return fetch(pushNotificationSubscriptionUrl, {
                method: 'post',
                headers: {
                    'Content-type': 'application/json',
                },
                body: JSON.stringify(JSON.stringify(subscription)),
            });
        })
        .catch(function (e) {
            if (Notification.permission === 'denied') {
                console.warn('Permission for notifications was denied');
            } else {
                console.error('Unable to subscribe to push', e);
            }
        });
};

export const register = (): void => {
    if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/service-worker.js').then(
                function (registration) {
                    console.log('ServiceWorker registration successful with scope: ', registration.scope);
                    registration.pushManager.getSubscription().then(function (sub) {
                        if (sub === null) {
                            console.log('Not subscribed to push service!');
                            // it would be better to use this approach https://developers.google.com/web/fundamentals/push-notifications/permission-ux
                            askPermission().then(subscribe);
                        } else {
                            console.log('Subscription object: ', sub);
                        }
                    });
                },
                function (err) {
                    console.error('ServiceWorker registration failed: ', err);
                },
            );
        });
    }
};

export const unregister = (): void => {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready
            .then((registration) => {
                registration.unregister();
            })
            .catch((error) => {
                console.error(error.message);
            });
    }
};

// useful functions that wasn't needed in this demo
// const getSubscription = () => {
//     return navigator.serviceWorker.ready.then(function (registration) {
//         return registration.pushManager.getSubscription();
//     });
// };
//
// const unsubscribe = () => {
//     getSubscription().then(function (subscription) {
//         return subscription.unsubscribe().then(function () {
//             return fetch(pushNotificationSubscriptionurl, {
//                 method: 'post',
//                 headers: {
//                     'Content-type': 'application/json',
//                 },
//                 body: JSON.stringify({
//                     endpoint: subscription.endpoint,
//                 }),
//             });
//         });
//     });
// };
