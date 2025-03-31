import React from "react";
import joinLogo from "/src/assets/images/User/join_logo.png";
import KakaoLogo from "/src/assets/images/User/Kakao Login.png";
import NaverLogo from "/src/assets/images/User/Naver Login.png";
import GoogleLogo from "/src/assets/images/User/Google Login.png";

const Step1 = ({ nextStep }) => {
    return (
        <div>
            <div>
                <h1>꼬리친구들</h1>
                <img src={joinLogo} alt="logo" />
                <p>다양한 애완동물을 위한 컨텐츠</p>

                <div>
                    <button onClick={nextStep}>
                        <img src={KakaoLogo} alt="Kakao Login" />
                    </button>

                    <button onClick={nextStep}>
                        <img src={NaverLogo} alt="Naver Login" />
                    </button>

                    <button onClick={nextStep}>
                        <img src={GoogleLogo} alt="Google Login" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Step1;
