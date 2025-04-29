import "./css/App.css";
import Layout1 from "./components/Global/Layout1.jsx";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Main from "./pages/PetMeeting/Main.jsx";
import Login from "./pages/User/Login.jsx";
import Board from "./pages/Board/Board.jsx";
import Reserve from "./pages/Reserve/Reserve.jsx";
import ReserveDetail from "./pages/Reserve/ReserveDetail.jsx";
import ReservationList from "./pages/Reserve/ReservationList.jsx";
import Reservation from "./pages/Reserve/Reservation.jsx";
import ReservationDetail from "./pages/Reserve/ReservationDetail.jsx";
import Review from "./pages/Reserve/Review.jsx";
import PetSitter from "./pages/Sitter/PetSitter.jsx";
import Layout0 from "./components/Global/Layout0.jsx";
import Register from "./pages/User/Register.jsx";
import Admin from "./pages/Admin/Admin.jsx";
import MyPage from "./pages/User/MyPage.jsx";
import AddPet from "./pages/User/AddPet.jsx";
import EditPet from "./pages/User/EditPet.jsx";
import Bookmark from "./pages/User/Bookmark";
import PetstaBookmarks from "./pages/User/PetstaBookmarks";
import PostBookmarks from "./pages/User/PostBookmarks";
import PetSitterRegister from "./pages/Sitter/PetSitterRegister.jsx";
import PetSitterFinder from "./pages/Sitter/PetSitterFinder.jsx";
import PetSitterDetail from "./pages/Sitter/PetSitterDetail.jsx";
import Payment from "./pages/Payment/Payment.jsx";
import theme from "./theme/theme.js";
import { ThemeProvider } from "@mui/material";
import Layout2 from "./components/Global/Layout2.jsx";
import { Provider } from "./context/Context.jsx";
import Cal from "./pages/Calender/Cal.jsx";
import PostComment from "./pages/PetSta/PostCommentsPage.jsx";
import AdminPostDetail from "./pages/Admin/AdminPostDetail.jsx";
import AdminNotice from "./pages/Admin/AdminNotice.jsx";
import AdminPetsitterList from "./pages/Admin/AdminPetsitterList.jsx";
import AdminPetsitterDetail from "./pages/Admin/AdminPetsitterDetail.jsx";
import AdminPetSitterApplyList from "./pages/Admin/AdminPetSitterApplyList.jsx";
import AdminPetSitterApplyDetail from "./pages/Admin/AdminPetSitterApplyDetail.jsx";
import AdminLayout from "./components/Admin/AdminLayout.jsx";
import AddPhoto from "./pages/PetSta/AddPhoto.jsx";
import AddVideo from "./pages/PetSta/AddVideo.jsx";
import UserPage from "./pages/PetSta/UserPage.jsx";
import FollowersTab from "./pages/PetSta/FollowersTab.jsx";
import UserLayout from "./components/PetSta/UserLayout.jsx";
import ChatList from "./components/Chat/ChatList.jsx";
import ChatRoom from "./components/Chat/ChatRoom.jsx";
import AdminFacilityList from "./pages/Admin/AdminFacilityList.jsx";
import AdminFacilityDetail from "./pages/Admin/AdminFacilityDetail.jsx";
import AdminFacilityAdd from "./pages/Admin/AdminFacilityAdd.jsx";
import PetDetails from "./pages/PetMeeting/PetDetails.jsx";
import OAuth2Success from "./components/User/OAuth2Success.jsx";
import ProtectedRoute from "./components/User/ProtectedRoute.jsx";
import ProtectedAdminRoute from "./components/Admin/ProtectedAdminRoute.jsx";
import Announce from "./pages/Board/Announce.jsx";
import PostDetails from "./pages/Board/PostDetails.jsx";
import PostSave from "./pages/Board/PostSave.jsx";
import Notify from "./pages/Notification/Notification.jsx";
import AdminDashboard from "./pages/Admin/AdminDashboard.jsx";
import PetstaMain from "./pages/PetSta/PetstaMain.jsx";
import PostDetailWrapper from "./pages/PetSta/PostDetailWrapper.jsx";
import NotificationClient from "./pages/Notification/NotificationClient.jsx";
import { useEffect, useState } from "react";
import { initCsrfToken } from "./services/axiosInstance.js";

function App() {
    const [csrfReady, setCsrfReady] = useState(false);

    useEffect(() => {
        const fetchCsrf = async () => {
            await initCsrfToken();
            setCsrfReady(true);
        };
        fetchCsrf();
    }, []);

    if (!csrfReady) {
        return <div>Loading...</div>; // csrf 토큰 준비될 때까지 아무것도 안 띄움
    }
    return (
        <ThemeProvider theme={theme}>
            <Provider>
                <NotificationClient />
                <Router>
                    <Routes>
                        {/* 로그인 페이지는 별도 경로로 유지 */}
                        <Route path="/admin" element={<Admin />} />
                        {/* 관리자 레이아웃은 /admin/* 하위 경로에 적용 */}
                        <Route path="/admin/*" element={<AdminLayout />}>
                            {/* 인증 보호 라우트 */}
                            <Route element={<ProtectedAdminRoute />}>
                                <Route path="board/list" element={<AdminDashboard />} />
                                <Route path="board/:id" element={<AdminPostDetail />} />
                                <Route path="board/post" element={<AdminNotice />} />
                                <Route path="petsitter/list" element={<AdminPetsitterList />} />
                                <Route path="petsitter/:id" element={<AdminPetsitterDetail />} />
                                <Route path="petsitter/pending" element={<AdminPetSitterApplyList />} />
                                <Route path="petsitter/pending/:id" element={<AdminPetSitterApplyDetail />} />
                                <Route path="facility/list" element={<AdminFacilityList />} />
                                <Route path="facility/list/:id" element={<AdminFacilityDetail />} />
                                <Route path="facility/add" element={<AdminFacilityAdd />} />
                            </Route>
                        </Route>
                        <Route element={<Layout0 />}>
                            <Route path="/oauth2/success" element={<OAuth2Success />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                        </Route>
                        <Route element={<ProtectedRoute />}>
                            <Route element={<Layout1 />}>
                                <Route path="/" element={<Main />} />
                                <Route path="/announce/:announceId" element={<Announce />} />
                                <Route path="/pet/:petId" element={<PetDetails />} />
                                <Route path="/board" element={<Board />} />
                                <Route path="/board/:postId" element={<PostDetails />} />
                                <Route path="/board/update/:postId" element={<PostSave />} />
                                <Route path="/board/add" element={<PostSave />} />
                                <Route path="/reserve" element={<Reserve />} />
                                <Route path="/bookmark" element={<Bookmark />} />
                                <Route path="/bookmarks/petsta" element={<PetstaBookmarks />} />
                                <Route path="/bookmarks/posts" element={<PostBookmarks />} />
                                <Route path="/reserve/:id" element={<ReserveDetail />} />
                                <Route path="/reserve/list" element={<ReservationList />} />
                                <Route path="/reserve/success/:id" element={<Reservation />} />
                                <Route path="/reserve/detail/:id" element={<ReservationDetail />} />
                                <Route path="/reserve/review/:id" element={<Review />} />
                                <Route path="/petsitter" element={<PetSitter />} />
                                <Route path="/petsitter/detail/:sitterId" element={<PetSitterDetail />} />
                                <Route path="/calendar" element={<Cal />} />
                                <Route path="/notification" element={<Notify />} />
                                <Route path="/mypage" element={<MyPage />} />
                                <Route path="/add-pet" element={<AddPet />} />
                                <Route path="/pet/edit/:petId" element={<EditPet />} />
                                <Route path="/petsitter-register" element={<PetSitterRegister />} />
                                <Route path="/petsitter-finder" element={<PetSitterFinder />} />
                                <Route path="/petsta" element={<PetstaMain />} />
                                <Route path="/petsta/post/comment/:postId" element={<PostComment />} />
                                <Route path="/petsta/post/add/photo" element={<AddPhoto />} />
                                <Route path="/petsta/post/add/video" element={<AddVideo />} />
                                <Route path="/petsta/user/:userId" element={<UserLayout />}>
                                    <Route path="" element={<UserPage />} />
                                    <Route path="follower" element={<FollowersTab />} />
                                    <Route path="following" element={<FollowersTab />} />
                                </Route>
                                <Route path="/chat" element={<ChatList />} />
                                <Route path="/chat/room/:channelId" element={<ChatRoom />} />
                                <Route path="/payment" element={<Payment />} />
                            </Route>
                            <Route element={<Layout2 />}>
                                <Route path="/petsta/post/:postId" element={<PostDetailWrapper />} />
                            </Route>
                        </Route>
                    </Routes>
                </Router>
            </Provider>
        </ThemeProvider>
    );
}

export default App;
