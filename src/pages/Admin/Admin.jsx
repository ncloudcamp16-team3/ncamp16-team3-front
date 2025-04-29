import React, { useEffect, useState } from "react";
import { Box, Paper, TextField, Button, DialogActions, DialogContent, DialogContentText, Modal } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Background from "../../components/Admin/Background.jsx";
import { useAdmin } from "../../components/Admin/AdminContext.jsx"; // 이미 이 부분은 올바르게 되어 있음.

const Admin = () => {
    const { login, isAuthenticated } = useAdmin();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [openDialog, setOpenDialog] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) {
            navigate("/admin/board/list");
        }
    }, [isAuthenticated, navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            setError("아이디와 비밀번호를 입력해주세요");
            setOpenDialog(true);
            return;
        }

        try {
            await login(email, password);
            navigate("/admin/board/list");
        } catch (error) {
            console.log(error);
            const errorMessage = error.response?.data?.message || "로그인에 실패했습니다";
            setError(errorMessage);
            setOpenDialog(true);
        }
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    return (
        <Box sx={{ position: "relative", width: "100vw", height: "100vh" }}>
            <Background />
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                }}
            >
                <Paper
                    elevation={5}
                    sx={{
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
                        src="/src/assets/images/logo.png"
                        alt="Logo"
                        style={{
                            width: "220px",
                            height: "auto",
                            alignSelf: "center",
                            marginBottom: "30px",
                        }}
                    />
                    <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
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
                            sx={{ margin: "1em 1em 1em 1em" }}
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
                        >
                            로그인
                        </Button>
                    </form>

                    <Modal
                        open={openDialog}
                        onClose={handleCloseDialog}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                    >
                        <Box
                            sx={{
                                backgroundColor: "#F2DFCE",
                                position: "fixed",
                                top: "50%",
                                left: "50%",
                                transform: "translate(-50%, -50%)",
                                borderRadius: "30px",
                                padding: "10px",
                            }}
                        >
                            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                <img
                                    src="/src/assets/images/Admin/dog.svg"
                                    alt="Dog"
                                    style={{
                                        width: "100px",
                                        height: "auto",
                                    }}
                                />
                            </Box>
                            <DialogContent>
                                <DialogContentText
                                    id="alert-dialog-description"
                                    sx={{ fontSize: "1.5em", textAlign: "center" }}
                                >
                                    {error.split("\n").map((line, index) => {
                                        return (
                                            <span key={index}>
                                                {line}
                                                <br />
                                            </span>
                                        );
                                    })}
                                </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                <Button
                                    onClick={handleCloseDialog}
                                    autoFocus
                                    sx={{ backgroundColor: "#E9A260", color: "black", borderRadius: "30px" }}
                                >
                                    확인
                                </Button>
                            </DialogActions>
                        </Box>
                    </Modal>
                </Paper>
            </Box>
        </Box>
    );
};

export default Admin;
