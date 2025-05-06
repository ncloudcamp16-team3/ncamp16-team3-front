importScripts("https://www.gstatic.com/firebasejs/11.6.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/11.6.1/firebase-messaging-compat.js");

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
    console.log("[firebase-messaging-sw.js] Background Message received.", payload);

    const notificationTitle = payload.notification?.title || "알림";
    const notificationBody = payload.notification?.body || "새로운 알림이 도착했습니다.";

    // 아이콘은 notification.image 또는 data.icon 중 하나에서 가져옴
    const notificationIcon = payload.notification?.image || payload.data?.icon || "/default-icon.png";

    const notificationOptions = {
        body: notificationBody,
        icon: notificationIcon,
        data: payload.data,
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});
