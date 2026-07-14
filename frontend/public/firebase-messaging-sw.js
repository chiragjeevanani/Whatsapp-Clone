importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-compat.js');

// Extract messagingSenderId from query params passed during registration
const urlParams = new URL(location).searchParams;
const messagingSenderId = urlParams.get('messagingSenderId');

if (messagingSenderId) {
  firebase.initializeApp({
    messagingSenderId: messagingSenderId
  });

  const messaging = firebase.messaging();

  messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    
    const notificationTitle = payload.notification.title || 'New Message';
    const notificationOptions = {
      body: payload.notification.body || 'You received a new message.',
      icon: '/image.png',
      data: payload.data,
      tag: payload.data?.conversationId || 'new-msg-tag',
      renotify: true
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
  });
} else {
  console.warn('[firebase-messaging-sw.js] Missing messagingSenderId parameter in registration query.');
}
