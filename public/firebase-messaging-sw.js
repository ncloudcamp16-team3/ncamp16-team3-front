importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js");

// Firebase 앱 초기화
firebase.initializeApp({
    apiKey: "AIzaSyD-oywRSpnCf7X1t9sw9NSwaoHd14MwT7I",
    authDomain: "tailfrineds.firebaseapp.com",
    projectId: "tailfrineds",
    storageBucket: "tailfrineds.firebasestorage.app",
    messagingSenderId: "21402298120",
    appId: "1:21402298120:web:e39b8e1315772c27bcaebd",
    measurementId: "G-HB37Y89CF7",
});

// 메시징 객체 초기화
const messaging = firebase.messaging();

// 백그라운드에서 푸시 알림 수신 처리
messaging.onBackgroundMessage(function (payload) {
    console.log("[firebase-messaging-sw.js] Background Message received. ", payload);

    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: payload.notification.image,
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});
