const KAKAO_CLIENT_ID = "1deef78689094dd84adbd48fe98c08db";

const REDIRECT_URI = "http://localhost:3000/oauth/kakao/callback"; // 내 프론트 주소

const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code`;

const handleKakaoLogin = () => {
    window.location.href = kakaoAuthUrl;
};

export default useKakaoLogin;
