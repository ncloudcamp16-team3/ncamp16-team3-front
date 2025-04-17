import { Box, Paper, TextField, Button, Snackbar, Alert } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdmin } from "./AdminContext.jsx";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const navigate = useNavigate();
    const { login } = useAdmin();

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            setError("아이디와 비밀번호를 입력해주세요");
            setOpenSnackbar(true);
            return;
        }

        try {
            await login(email, password);
            navigate("/admin/board/list");
        } catch (error) {
            console.log(error);
            setError(error.message || "로그인 실패. 아이디와 비밀번호를 확인해주세요");
            setOpenSnackbar(true);
        }
    };

    return (
        <Box
            sx={{
                width: "500px",
                height: "600px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Paper
                elevation={5}
                sx={{
                    maxWidth: "none",
                    width: "500px",
                    height: "560px",
                    padding: "2rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem",
                    textAlign: "center",
                    borderRadius: "10px",
                }}
            >
                <img
                    src="/src/assets/images/logo.png" // public 폴더에 있을 경우
                    alt="Logo"
                    style={{
                        width: "220px",
                        height: "auto",
                        alignSelf: "center",
                        marginBottom: "30px",
                    }} // 크기 조절
                />
                <TextField
                    label="아이디"
                    variant="outlined"
                    sx={{ margin: "0 1em" }}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <TextField
                    label="비밀번호"
                    variant="outlined"
                    type="password"
                    sx={{
                        margin: "1em 1em 1em 1em",
                    }}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    style={{
                        backgroundColor: "#E9A260",
                        height: "50px",
                        margin: "0 1em",
                        fontSize: "1em",
                    }}
                    onClick={handleLogin}
                >
                    로그인
                </Button>

                <Snackbar open={openSnackbar} autoHideDuration={2000} onClose={() => setOpenSnackbar(false)}>
                    <Alert onClose={() => setOpenSnackbar(false)} severity="error" sx={{ width: "100%" }}>
                        {error}
                    </Alert>
                </Snackbar>
            </Paper>
        </Box>
    );
};

export default Login;
