import React, { useEffect } from "react";
import { Typography, Button, Container, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";

const WithdrawalCompletePage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate("/login");
        }, 10000); //일단 10초

        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <Container maxWidth="sm" sx={{ mt: 10 }}>
            <Paper
                elevation={3}
                sx={{
                    p: 5,
                    textAlign: "center",
                    borderRadius: "12px",
                    backgroundColor: "#fff7ef",
                }}
            >
                <Typography variant="h5" component="h1" fontWeight="bold" sx={{ mb: 3, color: "#E9A260" }}>
                    회원 탈퇴 완료
                </Typography>

                <Typography variant="body1" sx={{ mb: 4 }}>
                    회원 탈퇴가 정상적으로 완료되었습니다.
                    <br />
                    그동안 서비스를 이용해 주셔서 감사합니다.
                </Typography>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                    잠시 후 로그인 페이지로 이동합니다...
                </Typography>

                <Button
                    variant="contained"
                    onClick={() => navigate("/login")}
                    sx={{
                        backgroundColor: "#E9A260",
                        color: "white",
                        "&:hover": { backgroundColor: "#d0905a" },
                        minWidth: "150px",
                        borderRadius: "20px",
                        py: 1,
                    }}
                >
                    로그인 페이지로 이동
                </Button>
            </Paper>
        </Container>
    );
};

export default WithdrawalCompletePage;
