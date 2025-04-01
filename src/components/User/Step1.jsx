import React from "react";
import joinLogo from "/src/assets/images/User/join_logo.png";
import KakaoLogo from "/src/assets/images/User/Kakao Login.png";
import NaverLogo from "/src/assets/images/User/Naver Login.png";
import GoogleLogo from "/src/assets/images/User/Google Login.png";
import { Box, Typography } from "@mui/material";

const Step1 = ({ nextStep }) => {
    const handleGoogleLogin = () => {
        window.location.href =
            "http://localhost:8080/oauth2/authorization/kakao";
    };

    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            textAlign="center"
        >
            <Typography variant="h6" fontWeight="bold" mb={4}>
                꼬리친구들
            </Typography>
            <Box component="img" src={joinLogo} alt="logo" width={300} mb={4} />
            <Typography variant="h6" fontWeight="bold" mb={4}>
                다양한 애완동물을 위한 컨텐츠!
            </Typography>
            <Typography variant="body1" mb={10} sx={{ color: "#C8C8C8" }}>
                꼬리친구들을 만나볼까요?
            </Typography>

            <Box
                width="90%"
                display="flex"
                flexDirection="column"
                alignItems="center"
                gap={2}
            >
                <Box
                    component="button"
                    onClick={handleGoogleLogin}
                    border="none"
                    bgcolor="white"
                    width="100%"
                >
                    <Box
                        component="img"
                        src={KakaoLogo}
                        alt="Kakao Login"
                        width="100%"
                    />
                </Box>
                <Box
                    component="button"
                    onClick={nextStep}
                    border="none"
                    bgcolor="white"
                    width="100%"
                >
                    <Box
                        component="img"
                        src={NaverLogo}
                        alt="Naver Login"
                        width="100%"
                    />
                </Box>
                <Box
                    component="button"
                    onClick={nextStep}
                    border="none"
                    bgcolor="white"
                    width="100%"
                >
                    <Box
                        component="img"
                        src={GoogleLogo}
                        alt="Google Login"
                        width="100%"
                    />
                </Box>
            </Box>
        </Box>
    );
};

export default Step1;
