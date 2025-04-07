import "./css/App.css";
import Layout1 from "./components/Global/Layout1.jsx";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Main from "./pages/Main/Main.jsx";
import Login from "./pages/User/Login.jsx";
import PetSta from "./pages/PetSta/PetSta.jsx";
import Board from "./pages/Board/Board.jsx";
import Reserve from "./pages/Reserve/Reserve.jsx";
import PetSitter from "./pages/Sitter/PetSitter.jsx";
import Notification from "./pages/Notification/Notification.jsx";
import Layout0 from "./components/Global/Layout0.jsx";
import Register from "./pages/User/Register.jsx";
import Admin from "./pages/Admin/Admin.jsx";
import MyPage from "./pages/User/MyPage.jsx";
import theme from "./theme/theme.js";
import { ThemeProvider } from "@mui/material";
import Layout2 from "./components/Global/Layout2.jsx";
import PostDetail from "./pages/PetSta/PostDetail.jsx";
import { Provider } from "./context/Context.jsx";
import Cal from "./pages/Calender/Calendar.jsx";
import AdminDashboard from "./pages/Admin/AdminDashboard.jsx";
import PostComment from "./pages/PetSta/PostCommentsPage.jsx";
import AdminPostDetail from "./pages/Admin/AdminPostDetail.jsx";
import { AdminProvider } from "./components/Admin/AdminContext.jsx";
import AdminNotice from "./pages/Admin/AdminNotice.jsx";
import AddVideo from "./pages/PetSta/AddVideo.jsx";
import AddPhoto from "./pages/PetSta/AddPhoto.jsx";

// 관리자 경로를 AdminLayout으로 감싸는 컴포넌트
const AdminLayout = ({ children }) => {
    return <AdminProvider>{children}</AdminProvider>;
};

function App() {
    return (
        <ThemeProvider theme={theme}>
            <Provider>
                <Router>
                    <Routes>
                        {/* 관리자 경로 */}
                        <Route
                            path="/admin"
                            element={
                                <AdminLayout>
                                    <Admin />
                                </AdminLayout>
                            }
                        />
                        <Route
                            path="/admin/board/list"
                            element={
                                <AdminLayout>
                                    <AdminDashboard />
                                </AdminLayout>
                            }
                        />
                        <Route
                            path="/admin/board/:id"
                            element={
                                <AdminLayout>
                                    <AdminPostDetail />
                                </AdminLayout>
                            }
                        />
                        <Route
                            path="/admin/board/post"
                            element={
                                <AdminLayout>
                                    <AdminNotice />
                                </AdminLayout>
                            }
                        />
                        <Route
                            path="/admin/petsitter/list"
                            element={
                                <AdminLayout>
                                    <AdminNotice />
                                </AdminLayout>
                            }
                        />
                        <Route
                            path="/admin/petsitter/apply"
                            element={
                                <AdminLayout>
                                    <AdminNotice />
                                </AdminLayout>
                            }
                        />
                        <Route
                            path="/admin/facility/list"
                            element={
                                <AdminLayout>
                                    <AdminNotice />
                                </AdminLayout>
                            }
                        />
                        <Route
                            path="/admin/facility/apply"
                            element={
                                <AdminLayout>
                                    <AdminNotice />
                                </AdminLayout>
                            }
                        />
                        <Route element={<Layout0 />}>
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                        </Route>
                        <Route element={<Layout1 />}>
                            <Route path="/" element={<Main />} />
                            <Route path="/petsta" element={<PetSta />} />
                            <Route path="/board" element={<Board />} />
                            <Route path="/reserve" element={<Reserve />} />
                            <Route path="/petsitter" element={<PetSitter />} />
                            <Route path="/calendar" element={<Cal />} />
                            <Route path="/notification" element={<Notification />} />
                            <Route path="/mypage" element={<MyPage />} />
                            <Route path="/petsta/post/comment/:post_id" element={<PostComment />} />
                            <Route path="/petsta/post/add/video" element={<AddVideo />} />
                            <Route path="/petsta/post/add/Photo" element={<AddPhoto />} />
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
