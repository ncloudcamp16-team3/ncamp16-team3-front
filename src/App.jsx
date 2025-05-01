import "./css/App.css";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { ThemeProvider } from "@mui/material";
import theme from "./theme/theme.js";
import { Provider } from "./context/Context.jsx";
import { Suspense, lazy } from "react";

// Global Layouts
import Layout0 from "./components/Global/Layout0.jsx";
import Layout1 from "./components/Global/Layout1.jsx";
import Layout2 from "./components/Global/Layout2.jsx";
import AdminLayout from "./components/Admin/AdminLayout.jsx";

// Protected Routes
import ProtectedRoute from "./components/User/ProtectedRoute.jsx";
import ProtectedAdminRoute from "./components/Admin/ProtectedAdminRoute.jsx";
import EditVideoDetail from "./pages/PetSta/EditVideoDetail.jsx";
import EditPhotoDetail from "./pages/PetSta/EditPhotoDetail.jsx";

// Lazy-loaded Pages
const Main = lazy(() => import("./pages/PetMeeting/Main.jsx"));
const Login = lazy(() => import("./pages/User/Login.jsx"));
const Register = lazy(() => import("./pages/User/Register.jsx"));
const Board = lazy(() => import("./pages/Board/Board.jsx"));
const Reserve = lazy(() => import("./pages/Reserve/Reserve.jsx"));
const ReserveDetail = lazy(() => import("./pages/Reserve/ReserveDetail.jsx"));
const ReservationList = lazy(() => import("./pages/Reserve/ReservationList.jsx"));
const Reservation = lazy(() => import("./pages/Reserve/Reservation.jsx"));
const ReservationDetail = lazy(() => import("./pages/Reserve/ReservationDetail.jsx"));
const Review = lazy(() => import("./pages/Reserve/Review.jsx"));
const PetSitter = lazy(() => import("./pages/Sitter/PetSitter.jsx"));
const MyPage = lazy(() => import("./pages/User/MyPage.jsx"));
const AddPet = lazy(() => import("./pages/User/AddPet.jsx"));
const EditPet = lazy(() => import("./pages/User/EditPet.jsx"));
const Bookmark = lazy(() => import("./pages/User/Bookmark"));
const PetstaBookmarks = lazy(() => import("./pages/User/PetstaBookmarks"));
const PostBookmarks = lazy(() => import("./pages/User/BoardBookmarks.jsx"));
const PetSitterRegister = lazy(() => import("./pages/Sitter/PetSitterRegister.jsx"));
const PetSitterFinder = lazy(() => import("./pages/Sitter/PetSitterFinder.jsx"));
const PetSitterDetail = lazy(() => import("./pages/Sitter/PetSitterDetail.jsx"));
const Payment = lazy(() => import("./pages/Payment/Payment.jsx"));
const Cal = lazy(() => import("./pages/Calender/Cal.jsx"));
const PostComment = lazy(() => import("./pages/PetSta/PostCommentsPage.jsx"));
const AddPhoto = lazy(() => import("./pages/PetSta/AddPhoto.jsx"));
const AddVideo = lazy(() => import("./pages/PetSta/AddVideo.jsx"));
const UserPage = lazy(() => import("./pages/PetSta/UserPage.jsx"));
const FollowersTab = lazy(() => import("./pages/PetSta/FollowersTab.jsx"));
const UserLayout = lazy(() => import("./components/PetSta/UserLayout.jsx"));
const ChatList = lazy(() => import("./components/Chat/ChatList.jsx"));
const ChatRoom = lazy(() => import("./components/Chat/ChatRoom.jsx"));
const PetDetails = lazy(() => import("./pages/PetMeeting/PetDetails.jsx"));
const OAuth2Success = lazy(() => import("./components/User/OAuth2Success.jsx"));
const Announce = lazy(() => import("./pages/Board/Announce.jsx"));
const PostDetails = lazy(() => import("./pages/Board/PostDetails.jsx"));
const PostSave = lazy(() => import("./pages/Board/PostSave.jsx"));
const Notify = lazy(() => import("./pages/Notification/Notification.jsx"));
const PetstaMain = lazy(() => import("./pages/PetSta/PetstaMain.jsx"));
const PostDetailWrapper = lazy(() => import("./pages/PetSta/PostDetailWrapper.jsx"));
const Admin = lazy(() => import("./pages/Admin/Admin.jsx"));
const AdminDashboard = lazy(() => import("./pages/Admin/AdminDashboard.jsx"));
const AdminPostDetail = lazy(() => import("./pages/Admin/AdminPostDetail.jsx"));
const AdminNotice = lazy(() => import("./pages/Admin/AdminNotice.jsx"));
const AdminPetsitterList = lazy(() => import("./pages/Admin/AdminPetsitterList.jsx"));
const AdminPetsitterDetail = lazy(() => import("./pages/Admin/AdminPetsitterDetail.jsx"));
const AdminPetSitterApplyList = lazy(() => import("./pages/Admin/AdminPetSitterApplyList.jsx"));
const AdminPetSitterApplyDetail = lazy(() => import("./pages/Admin/AdminPetSitterApplyDetail.jsx"));
const AdminFacilityList = lazy(() => import("./pages/Admin/AdminFacilityList.jsx"));
const AdminFacilityDetail = lazy(() => import("./pages/Admin/AdminFacilityDetail.jsx"));
const AdminFacilityAdd = lazy(() => import("./pages/Admin/AdminFacilityAdd.jsx"));
const AdminFacilityUpdate = lazy(() => import("./pages/Admin/AdminFacilityUpdate.jsx"));

function App() {
    return (
        <ThemeProvider theme={theme}>
            <Provider>
                <Router>
                    <Suspense fallback={<div>로딩 중...</div>}>
                        <Routes>
                            <Route path="/admin" element={<AdminLayout />}>
                                <Route index element={<Admin />} />
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
                                    <Route path="facility/:id/update" element={<AdminFacilityUpdate />} />
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
                                    <Route path="/petsitter/:sitterId" element={<PetSitterDetail />} />
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
                                    <Route path="/petsta/post/edit/photo/:postId" element={<EditPhotoDetail />} />
                                    <Route path="/petsta/post/edit/video/:postId" element={<EditVideoDetail />} />
                                    <Route path="/petsta/user/:userId" element={<UserLayout />}>
                                        <Route index element={<UserPage />} />
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
                    </Suspense>
                </Router>
            </Provider>
        </ThemeProvider>
    );
}

export default App;
