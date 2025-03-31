import React from "react";
import joinLogo from "/src/assets/images/User/join_logo.png";
import KakaoLogo from "/src/assets/images/User/Kakao Login.png";
import NaverLogo from "/src/assets/images/User/Naver Login.png";
import GoogleLogo from "/src/assets/images/User/Google Login.png";

const Step1 = ({ nextStep }) => {
    // return (
    //     <div className="flex flex-col">
    //         첫번째페이지
    //         <button className="border border-black" onClick={nextStep}>
    //             다음
    //         </button>
    //     </div>
    // );

    return (
        <div className="flex flex-col">
            <div className="flex flex-col items-center justify-center min-h-screen p-5">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">
                    꼬리친구들
                </h1>
                <img src={joinLogo} className="w-32 h-32 mb-4" alt="logo" />
                <p className="text-lg text-gray-600 mb-6">
                    다양한 애완동물을 위한 컨텐츠
                </p>

                <div className="flex flex-col gap-4">
                    <button
                        onClick={nextStep}
                        className="p-3 bg-yellow-400 hover:bg-yellow-500 rounded-lg"
                    >
                        <img
                            src={KakaoLogo}
                            className="w-40 h-auto"
                            alt="Kakao Login"
                        />
                    </button>

                    <button
                        onClick={nextStep}
                        className="p-3 bg-green-500 hover:bg-green-600 rounded-lg"
                    >
                        <img
                            src={NaverLogo}
                            className="w-40 h-auto"
                            alt="Naver Login"
                        />
                    </button>

                    <button
                        onClick={nextStep}
                        className="p-3 bg-white hover:bg-gray-200 rounded-lg shadow-md"
                    >
                        <img
                            src={GoogleLogo}
                            className="w-40 h-auto"
                            alt="Google Login"
                        />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Step1;
