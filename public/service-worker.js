self.addEventListener("push", function (event) {
    console.log("[Service Worker] Push Received.");

    let data = {};
    if (event.data) {
        data = event.data.json();
    }

    const title = data.title || "새 알림";
    const options = {
        body: data.body || "내용이 없습니다.",
        icon: "/icon-192x192.png", // 작은 아이콘 (선택)
        badge: "/badge-72x72.png", // 배지 아이콘 (선택)
    };

    event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", function (event) {
    console.log("[Service Worker] Notification click Received.");

    event.notification.close();

    event.waitUntil(
        clients.openWindow("/") // 알림 클릭 시 이동할 URL
    );
});
