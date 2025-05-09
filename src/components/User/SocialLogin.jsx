import React from "react";
import { Box, Button, Typography } from "@mui/material";
import JoinLogo from "../../assets/images/User/join-logo.png";
import KakaoLogo from "../../assets/images/User/kakao-logo.svg";
//import NaverLogo from "../../assets/images/User/naver-logo.svg";
import NaverLogo from "../../assets/images/User/naver-logo2.png";
import GoogleLogo from "../../assets/images/User/google-logo.svg";

const SocialLogin = () => {
    const handleOAuthLogin = (provider) => {
        // ✅ 리다이렉트 방식으로 이동
        window.location.href = `/api/oauth2/authorization/${provider}`;
    };

    return (
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" textAlign="center">
            <Typography variant="h6" fontWeight="bold" mt={3} mb={4}>
                꼬리친구들
            </Typography>
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                borderRadius="50%"
                overflow="hidden"
                width="200px"
                height="200px"
                mb={2}
            >
                <Box component="img" src={JoinLogo} alt="logo" width="200px" height="200px" />
            </Box>
            <Typography variant="h6" fontWeight="bold" mb={2.5}>
                다양한 애완동물을 위한 컨텐츠!
            </Typography>
            <Typography variant="body1" mb={9} sx={{ color: "#C8C8C8" }}>
                꼬리친구들을 만나볼까요?
            </Typography>

            <Box width="90%" display="flex" flexDirection="column" alignItems="center" gap={2}>
                <Button
                    // variant="outlined"
                    onClick={() => handleOAuthLogin("kakao")}
                    sx={{
                        backgroundColor: "#FEE500",
                        color: "black",
                        textTransform: "none",
                        height: "53px",
                        borderRadius: "10px",
                        padding: "12px",
                        width: "90%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-start",
                        gap: "10px",
                        "&:hover": {
                            backgroundColor: "#ffdf00",
                        },
                    }}
                >
                    <Box width="32px" display="flex" justifyContent="center" alignItems="center">
                        <Box component="img" src={KakaoLogo} alt="Kakao Login" width="18px" />
                    </Box>
                    <Typography fontSize="14px">Kakao로 계속하기</Typography>
                </Button>

                <Button
                    // variant="outlined"
                    onClick={() => handleOAuthLogin("naver")}
                    sx={{
                        backgroundColor: "#00C300",
                        color: "white",
                        textTransform: "none",
                        height: "53px",
                        borderRadius: "10px",
                        padding: "12px",
                        width: "90%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-start",
                        gap: "10px",
                        "&:hover": {
                            backgroundColor: "#00b000",
                        },
                    }}
                >
                    <Box width="32px" display="flex" justifyContent="center" alignItems="center">
                        <Box component="img" src={NaverLogo} alt="Naver Login" width="16px" />
                    </Box>
                    <Typography fontSize="14px">Naver로 계속하기</Typography>
                </Button>

                <Button
                    variant="outlined"
                    onClick={() => handleOAuthLogin("google")}
                    sx={{
                        backgroundColor: "#FFFFFF",
                        color: "black",
                        textTransform: "none",
                        height: "53px",
                        borderRadius: "10px",
                        padding: "12px",
                        width: "90%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-start",
                        gap: "10px",
                        borderColor: "#C4C4C4",
                        "&:hover": {
                            backgroundColor: "#f5f5f5",
                            borderColor: "#aaa",
                        },
                    }}
                >
                    <Box width="32px" display="flex" justifyContent="center" alignItems="center">
                        <Box component="img" src={GoogleLogo} alt="Google Login" width="18px" />
                    </Box>
                    <Typography fontSize="14px">Google로 계속하기</Typography>
                </Button>
            </Box>
        </Box>
    );
};

export default SocialLogin;
