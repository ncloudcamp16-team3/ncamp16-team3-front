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
import PostComment from "./pages/PetSta/PostCommentsPage.jsx";

function App() {
    return (
        <ThemeProvider theme={theme}>
            <Provider>
                <Router>
                    <Routes>
                        <Route path="/admin/dashboard" element={<Admin />} />
                        <Route path="/admin" element={<Admin />} />
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
