import "./css/App.css";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { Box, CircularProgress, ThemeProvider } from "@mui/material";
import theme from "./theme/theme.js";
import { Provider } from "./context/Context.jsx";
import { ReserveProvider } from "./context/ReserveContext.jsx";
import React, { Suspense, lazy } from "react";
import WithdrawalCompletePage from "./pages/User/WithdrawalCompletePage";
import { Outlet } from "react-router-dom";

// Global Layouts
import Layout0 from "./components/Global/Layout0.jsx";
import Layout1 from "./components/Global/Layout1.jsx";
import AdminLayout from "./components/Admin/AdminLayout.jsx";

// Protected Routes
import ProtectedRoute from "./components/User/ProtectedRoute.jsx";
import ProtectedAdminRoute from "./components/Admin/ProtectedAdminRoute.jsx";
import EditVideoDetail from "./pages/PetSta/EditVideoDetail.jsx";
import EditPhotoDetail from "./pages/PetSta/EditPhotoDetail.jsx";
import AdminNoticeList from "./pages/Admin/AdminNoticeList.jsx";
import AdminNoticeDetail from "./pages/Admin/AdminNoticeDetail.jsx";

// Lazy-loaded Pages
const Main = lazy(() => import("./pages/PetMeeting/Main.jsx"));
const LocationConfig = lazy(() => import("./pages/LocationConfig/LocationConfig.jsx"));
const Login = lazy(() => import("./pages/User/Login.jsx"));
const Register = lazy(() => import("./pages/User/Register.jsx"));
const Board = lazy(() => import("./pages/Board/Board.jsx"));
const Reserve = lazy(() => import("./pages/Reserve/Reserve.jsx"));
const ReserveDetail = lazy(() => import("./pages/Reserve/ReserveDetail.jsx"));
const Reservation = lazy(() => import("./pages/Reserve/Reservation.jsx"));
const ReservationDetail = lazy(() => import("./pages/Reserve/ReservationDetail.jsx"));
const Review = lazy(() => import("./pages/Reserve/Review.jsx"));
const PetSitter = lazy(() => import("./pages/Sitter/PetSitter.jsx"));
const MyPage = lazy(() => import("./pages/User/MyPage.jsx"));
const AddPet = lazy(() => import("./pages/User/AddPet.jsx"));
const EditPet = lazy(() => import("./pages/User/EditPet.jsx"));
const Bookmark = lazy(() => import("./pages/User/Bookmark.jsx"));
const PetstaBookmarks = lazy(() => import("./pages/User/PetstaBookmarks.jsx"));
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
const MyPosts = lazy(() => import("./pages/User/MyPosts.jsx"));

function App() {
    return (
        <ThemeProvider theme={theme}>
            <Suspense
                fallback={
                    <Box width="100vw" height="100vh" display="flex" justifyContent="center" alignItems="center">
                        <CircularProgress size={30} />
                    </Box>
                }
            >
                <Router>
                    <Provider>
                        <Routes>
                            <Route path="/admin" element={<AdminLayout />}>
                                <Route index element={<Admin />} />
                                <Route element={<ProtectedAdminRoute />}>
                                    <Route path="board/list" element={<AdminDashboard />} />
                                    <Route path="board/:id" element={<AdminPostDetail />} />
                                    <Route path="board/post" element={<AdminNotice />} />
                                    <Route path="board/notice/list" element={<AdminNoticeList />} />
                                    <Route path="board/notice/:id" element={<AdminNoticeDetail />} />
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
                                <Route path="/withdrawal-complete" element={<WithdrawalCompletePage />} />
                                <Route path="/register" element={<Register />} />
                            </Route>

                            <Route element={<ProtectedRoute />}>
                                <Route element={<Layout1 />}>
                                    <Route path="/" element={<Main />} />
                                    <Route path="/location" element={<LocationConfig />} />
                                    <Route path="/announce/:announceId" element={<Announce />} />
                                    <Route path="/pet/:petId" element={<PetDetails />} />
                                    <Route path="/board" element={<Board />} />
                                    <Route path="/board/:postId" element={<PostDetails />} />
                                    <Route path="/board/update/:postId" element={<PostSave />} />
                                    <Route path="/board/add" element={<PostSave />} />
                                    <Route path="/bookmark" element={<Bookmark />} />
                                    <Route path="/bookmarks/petsta" element={<PetstaBookmarks />} />
                                    <Route path="/bookmarks/posts" element={<PostBookmarks />} />
                                    <Route path="/my-posts" element={<MyPosts />} />
                                    <Route
                                        path="/reserve"
                                        element={
                                            <ReserveProvider>
                                                <Outlet />
                                            </ReserveProvider>
                                        }
                                    >
                                        <Route index element={<Reserve />} />
                                        <Route path=":id" element={<ReserveDetail />} />
                                        <Route path="success" element={<Reservation />} />
                                        <Route path="detail/:id" element={<ReservationDetail />} />
                                        <Route path="review/:id" element={<Review />} />
                                    </Route>
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
                                    <Route path="/petsta/post/:postId" element={<PostDetailWrapper />} />
                                </Route>
                            </Route>
                        </Routes>
                    </Provider>
                </Router>
            </Suspense>
        </ThemeProvider>
    );
}

export default App;
