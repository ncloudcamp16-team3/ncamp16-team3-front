// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getMessaging } from "firebase/messaging";

// Firebase 설정
const firebaseConfig = {
    apiKey: "AIzaSyD-oywRSpnCf7X1t9sw9NSwaoHd14MwT7I",
    authDomain: "tailfrineds.firebaseapp.com",
    projectId: "tailfrineds",
    storageBucket: "tailfrineds.firebasestorage.app",
    messagingSenderId: "21402298120",
    appId: "1:21402298120:web:e39b8e1315772c27bcaebd",
    measurementId: "G-HB37Y89CF7",
};

// Firebase 앱 초기화
const app = initializeApp(firebaseConfig);

// (선택) Analytics 사용
const analytics = getAnalytics(app);

// Firebase Cloud Messaging 초기화
const messaging = getMessaging(app); // FCM 객체 초기화

// 필요한 경우 app, messaging, analytics를 export
export { app, messaging, analytics };
