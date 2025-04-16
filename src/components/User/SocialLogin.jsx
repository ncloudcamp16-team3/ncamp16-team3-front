import React from "react";
import { Box, Typography } from "@mui/material";
import JoinLogo from "../../assets/images/User/join-logo.png";
import KakaoLogo from "../../assets/images/User/kakao-logo.svg";
import NaverLogo from "../../assets/images/User/naver-logo.svg";
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
                <Box
                    display="flex"
                    border="1px solid #747775"
                    borderRadius="10px"
                    height="53px"
                    padding="12px"
                    alignItems="center"
                    gap="10px"
                    backgroundColor="#FEE500"
                    onClick={() => handleOAuthLogin("kakao")}
                    width="90%"
                >
                    <Box width="32px">
                        <Box component="img" src={KakaoLogo} alt="Kakao Login" width="18px" />
                    </Box>
                    <Typography fontSize="14px">KAKAO로 계속하기</Typography>
                </Box>
                <Box
                    display="flex"
                    border="1px solid #747775"
                    borderRadius="10px"
                    height="53px"
                    padding="12px"
                    alignItems="center"
                    gap="10px"
                    backgroundColor="#27C250"
                    width="90%"
                    onClick={() => handleOAuthLogin("naver")}
                >
                    <Box width="32px">
                        <Box component="img" src={NaverLogo} alt="Naver Login" width="32px" />
                    </Box>
                    <Typography color="white" fontSize="14px">
                        NAVER로 계속하기
                    </Typography>
                </Box>
                <Box
                    display="flex"
                    border="1px solid #747775"
                    borderRadius="10px"
                    height="53px"
                    padding="12px"
                    alignItems="center"
                    gap="10px"
                    backgroundColor="#FFFFFF"
                    width="90%"
                    onClick={() => handleOAuthLogin("google")}
                >
                    <Box width="32px">
                        <Box component="img" src={GoogleLogo} alt="Google Login" width="18px" />
                    </Box>
                    <Typography fontSize="14px">Google로 계속하기</Typography>
                </Box>
            </Box>
        </Box>
    );
};

export default SocialLogin;
