importScripts('https://www.gstatic.com/firebasejs/3.6.6/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/3.6.6/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing in the
// messagingSenderId.
firebase.initializeApp({
    messagingSenderId: '684146341663'
});
var messaging = firebase.messaging();
messaging.setBackgroundMessageHandler(function (payload) {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    // Customize notification here
    const notificationTitle = 'Alerta da Rhases';
    const notificationOptions = {
        body: 'Temos uma novidade pra você!.',
        icon: '/assets/alert.png'
    };

    return self.registration.showNotification(notificationTitle,
        notificationOptions);
});
