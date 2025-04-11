import React, { createContext, useContext, useEffect, useState } from "react";

const RegisterContext = createContext();

const initialPetData = {
    petName: "",
    petTypeId: "",
    petGender: "",
    petBirth: "",
    petWeight: "",
    petInfo: "",
    petNeutered: "N",
    petPhotos: [],
};

function getSignupInfo() {
    const cookies = document.cookie.split(";").reduce((acc, cookieStr) => {
        const [key, value] = cookieStr.trim().split("=");
        acc[key] = decodeURIComponent(value);
        return acc;
    }, {});
    if (cookies.signupInfo) {
        try {
            const parsed = JSON.parse(cookies.signupInfo);
            console.log("🔍 회원가입 쿠키 정보:", parsed);
            return parsed;
        } catch {
            console.warn("⚠️ signupInfo 쿠키 파싱 실패");
        }
    }
    return null;
}

export const RegisterProvider = ({ children }) => {
    const [step, setStep] = useState(1);
    const [nickname, setNickname] = useState("");
    const [formData, setFormData] = useState(initialPetData);
    const [petDataList, setPetDataList] = useState([]);
    const [email, setEmail] = useState("");
    const [snsTypeId, setSnsTypeId] = useState(null);
    const [previews, setPreviews] = useState([]);
    const [mainPhotoIndex, setMainPhotoIndex] = useState(0);

    const nextStep = () => setStep((prev) => Math.min(prev + 1, 5));
    const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleStep4Next = (newPetData) => {
        setPetDataList([...petDataList, newPetData]);
        setStep(5);
    };

    const goToStep2 = () => {
        setFormData(initialPetData);
        setStep(1);
    };

    const removePhoto = (index) => {
        const updatedPhotos = [...formData.petPhotos];
        updatedPhotos.splice(index, 1);

        handleChange({
            target: {
                name: "petPhotos",
                value: updatedPhotos,
            },
        });

        if (mainPhotoIndex === index) {
            setMainPhotoIndex(0);
        } else if (mainPhotoIndex > index) {
            setMainPhotoIndex((prev) => prev - 1);
        }
    };

    const selectMainPhoto = (index) => {
        setMainPhotoIndex(index);
    };

    // ✅ 회원가입 초기 정보 설정
    useEffect(() => {
        const initUserInfo = async () => {
            const cookieInfo = getSignupInfo();
            const urlParams = new URLSearchParams(window.location.search);
            const emailParam = urlParams.get("email");
            const snsTypeParam = urlParams.get("snsTypeId");

            if (cookieInfo) {
                setEmail(cookieInfo.email);
                setSnsTypeId(cookieInfo.snsTypeId);
            } else if (emailParam || snsTypeParam) {
                if (emailParam) setEmail(emailParam);
                if (snsTypeParam) setSnsTypeId(Number(snsTypeParam));
            } else {
                try {
                    const res = await fetch("http://localhost:8080/api/auth/check", {
                        credentials: "include",
                    });

                    if (res.ok) {
                        const data = await res.json();
                        console.log("🔐 사용자 인증 정보:", data);

                        if (data.userId === -1) {
                            // SNS 로그인은 되었으나 회원가입은 안 된 상태
                            setEmail(data.email);
                            setSnsTypeId(data.snsTypeId);
                            goToStep2();
                        } else {
                            console.log("✅ 이미 가입된 사용자입니다. userId:", data.userId);
                            // 필요한 경우 메인 페이지로 이동 등 처리
                        }
                    }
                } catch (err) {
                    console.error("🚨 사용자 정보 조회 실패:", err);
                }
            }
        };

        initUserInfo();
    }, []);

    // ✅ 이미지 미리보기 처리
    useEffect(() => {
        const loadedPreviews = (formData.petPhotos || []).map((file) =>
            typeof file === "string" ? file : URL.createObjectURL(file)
        );

        setPreviews((prev) => {
            prev.forEach((url) => URL.revokeObjectURL(url));
            return loadedPreviews;
        });

        return () => {
            loadedPreviews.forEach((url) => {
                if (typeof url === "string") return;
                URL.revokeObjectURL(url);
            });
        };
    }, [formData.petPhotos]);

    return (
        <RegisterContext.Provider
            value={{
                step,
                setStep,
                nickname,
                setNickname,
                formData,
                setFormData,
                petDataList,
                setPetDataList,
                nextStep,
                prevStep,
                handleChange,
                handleStep4Next,
                goToStep2,
                email,
                setEmail,
                snsTypeId,
                setSnsTypeId,
                previews,
                setPreviews,
                mainPhotoIndex,
                setMainPhotoIndex,
                removePhoto,
                selectMainPhoto,
            }}
        >
            {children}
        </RegisterContext.Provider>
    );
};

export const useRegister = () => useContext(RegisterContext);
