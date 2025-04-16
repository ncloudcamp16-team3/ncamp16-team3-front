import "./css/App.css";
import Layout1 from "./components/Global/Layout1.jsx";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Main from "./pages/PetMeeting/Main.jsx";
import Login from "./pages/User/Login.jsx";
import PetSta from "./pages/PetSta/PetSta.jsx";
import Board from "./pages/Board/Board.jsx";
import Reserve from "./pages/Reserve/Reserve.jsx";
import PetSitter from "./pages/Sitter/PetSitter.jsx";
import Layout0 from "./components/Global/Layout0.jsx";
import Register from "./pages/User/Register.jsx";
import Admin from "./pages/Admin/Admin.jsx";
import MyPage from "./pages/User/MyPage.jsx";
import AddPet from "./pages/User/AddPet.jsx";
import EditPet from "./pages/User/EditPet.jsx";
import PetSitterRegister from "./pages/Sitter/PetSitterRegister.jsx";
import PetSitterFinder from "./pages/Sitter/PetSitterFinder.jsx";
import Payment from "./pages/Payment/Payment.jsx";
import theme from "./theme/theme.js";
import { ThemeProvider } from "@mui/material";
import Layout2 from "./components/Global/Layout2.jsx";
import PostDetail from "./pages/PetSta/PostDetail.jsx";
import { Provider } from "./context/Context.jsx";
import Cal from "./pages/Calender/Cal.jsx";
import AdminDashboard from "./pages/Admin/AdminDashboard.jsx";
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
import AdminFacilityList from "./pages/Admin/AdminFacilityAdd.jsx";
import AdminFacilityDetail from "./pages/Admin/AdminFacilityDetail.jsx";
import AdminFacilityAdd from "./pages/Admin/AdminFacilityAdd.jsx";
import Petdetails from "./components/PetMeeting/Petdetails.jsx";
import OAuth2Success from "./components/User/OAuth2Success.jsx";
import ProtectedRoute from "./components/User/ProtectedRoute.jsx";
import ProtectedAdminRoute from "./components/Admin/ProtectedAdminRoute.jsx";
import Notify from "./pages/Notification/Notification.jsx";

function App() {
    return (
        <ThemeProvider theme={theme}>
            <Provider>
                <Router>
                    <Routes>
                        <Route path="/admin" element={<AdminLayout />}>
                            <Route index element={<Admin />} />
                            <Route element={<ProtectedAdminRoute />}>
                                <Route path="board/list" element={<AdminDashboard />} />
                                <Route path="board/:id" element={<AdminPostDetail />} />
                                <Route path="board/post" element={<AdminNotice />} />
                                <Route path="petsitter/list" element={<AdminPetsitterList />} />
                                <Route path="petsitter/:id" element={<AdminPetsitterDetail />} />
                                <Route path="petsitter/apply" element={<AdminPetSitterApplyList />} />
                                <Route path="petsitter/apply/:id" element={<AdminPetSitterApplyDetail />} />
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
                        <Route element={<Layout1 />}>
                            <Route path="/" element={<Main />} />
                            <Route path="/petdetails/:petId" element={<Petdetails />} />
                            <Route path="/petsta" element={<PetSta />} />
                            <Route path="/board" element={<Board />} />
                            <Route path="/reserve" element={<Reserve />} />
                            <Route path="/petsitter" element={<PetSitter />} />
                            <Route path="/calendar" element={<Cal />} />
                            <Route
                                path="/notification"
                                element={
                                    <ProtectedRoute>
                                        <Notify />
                                    </ProtectedRoute>
                                }
                            />
                            <Route path="/mypage" element={<MyPage />} />
                            <Route path="/add-pet" element={<AddPet />} />
                            <Route path="/pet/edit/:petId" element={<EditPet />} />
                            <Route path="/petsitter-register" element={<PetSitterRegister />} />
                            <Route path="/petsitter-finder" element={<PetSitterFinder />} />
                            <Route path="/petsta/post/comment/:post_id" element={<PostComment />} />
                            <Route path="/petsta/post/add/photo" element={<AddPhoto />} />
                            <Route path="/petsta/post/add/video" element={<AddVideo />} />
                            <Route path="/petsta/user/:userId" element={<UserLayout />}>
                                <Route path="" element={<UserPage />} />
                                <Route path="follower" element={<FollowersTab />} />
                                <Route path="following" element={<FollowersTab />} />
                            </Route>
                            <Route path="/chat" element={<ChatList />} />
                            <Route path="/chat/room/:roomId" element={<ChatRoom />} />
                            <Route path="/payment" element={<Payment />} />
                        </Route>
                        <Route element={<Layout2 />}>
                            <Route path="/petsta/post/:post_id" element={<PostDetail />} />
                        </Route>
                    </Routes>
                </Router>
            </Provider>
        </ThemeProvider>
    );
}

export default App;
