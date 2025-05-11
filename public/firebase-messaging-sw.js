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

messaging.onBackgroundMessage((payload) => {
    const type = payload.data?.type;

    if (type === "FETCH_ROOMS") {
        // console.log("[firebase-messaging-sw.js] FETCH_ROOMS 메시지 수신, 알림 생략");

        // React 앱으로 메시지 전달
        self.clients.matchAll({ includeUncontrolled: true, type: "window" }).then((clients) => {
            clients.forEach((client) => {
                client.postMessage({
                    type: "FETCH_ROOMS",
                    data: payload.data,
                });
            });
        });

        return;
    }

    const title = payload.data?.title;
    const options = {
        body: payload.data?.body,
        icon: payload.data?.icon,
        data: payload.data,
    };
    self.registration.showNotification(title, options);
});
