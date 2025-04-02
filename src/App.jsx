import "./css/App.css";
import "./css/Admin.css";
import Layout1 from "./components/Global/Layout1.jsx";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Main from "./pages/Main/Main.jsx";
import Login from "./pages/User/Login.jsx";
import PetSta from "./pages/PetSta/PetSta.jsx";
import Board from "./pages/Board/Board.jsx";
import Reserve from "./pages/Reserve/Reserve.jsx";
import PetSitter from "./pages/Sitter/PetSitter.jsx";
import Notification from "./pages/Notification/Notification.jsx";
import Container from "./components/Global/Container.jsx";
import Layout0 from "./components/Global/Layout0.jsx";
import Register from "./pages/User/Register.jsx";
import Admin from "./pages/Admin/Admin.jsx";
import theme from "./theme/theme.js";
import { ThemeProvider } from "@mui/material";
function App() {
    return (
        <ThemeProvider theme={theme}>
            <Router>
                <Container>
                    <Routes>
                        <Route element={<Layout1 />}>
                            <Route path="/" element={<Main />} />
                            <Route path="/petsta" element={<PetSta />} />
                            <Route path="/board" element={<Board />} />
                            <Route path="/reserve" element={<Reserve />} />
                            <Route path="/petsitter" element={<PetSitter />} />
                            <Route
                                path="/notification"
                                element={<Notification />}
                            />
                        </Route>
                        <Route element={<Layout0 />}>
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                        </Route>
                        <Route id="mobile" path="/admin" element={<Admin />} />
                        <Route
                            id="mobile"
                            path="/admin/dashboard"
                            element={<Admin />}
                        />
                    </Routes>
                </Container>
            </Router>
        </ThemeProvider>
    );
}

export default App;
