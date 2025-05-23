export function registerSW() {
    if ("serviceWorker" in navigator) {
        navigator.serviceWorker
            .register("/firebase-messaging-sw.js")
            .then((registration) => {
                // console.log("서비스 워커 등록 성공:", registration);
            })
            .catch((error) => {
                console.error("서비스 워커 등록 실패:", error);
            });
    }
}
