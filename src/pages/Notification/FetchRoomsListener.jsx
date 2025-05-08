// // src/components/fcm/FetchRoomsListener.jsx
// import { useEffect, useContext } from "react";
// import { onMessage } from "firebase/messaging";
// import { messaging } from "../../../public/firebase";
// import { Context } from "../../context/Context";
//
// const FetchRoomsListener = () => {
//     const { setChatLoad } = useContext(Context);
//
//     useEffect(() => {
//         const unsubscribe = onMessage(messaging, (payload) => {
//             const { type } = payload.data || {};
//             if (type === "FETCH_ROOMS") {
//                 console.log("💬 FETCH_ROOMS 수신, 채팅방 새로고침 트리거");
//                 setChatLoad(true);
//             }
//         });
//
//         return () => unsubscribe(); // 컴포넌트 unmount 시 정리
//     }, [setChatLoad]);
//
//     return null; // UI 요소는 없음
// };
//
// export default FetchRoomsListener;
