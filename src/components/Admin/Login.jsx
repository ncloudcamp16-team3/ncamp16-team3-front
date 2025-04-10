import { Box, Paper, TextField, Button } from "@mui/material";

const Login = () => {
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
                <TextField label="아이디" variant="outlined" sx={{ margin: "0 1em" }} />
                <TextField
                    label="비밀번호"
                    variant="outlined"
                    type="password"
                    sx={{
                        margin: "1em 1em 1em 1em",
                    }}
                />
                <Button
                    variant="contained"
                    color="primary"
                    style={{
                        backgroundColor: "#E9A260",
                        height: "50px",
                        margin: "0 1em",
                        fontSize: "1em",
                    }}
                    href={"/admin/board/list"}
                >
                    로그인
                </Button>
            </Paper>
        </Box>
    );
};

export default Login;
