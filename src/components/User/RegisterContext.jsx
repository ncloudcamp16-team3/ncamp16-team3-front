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
        setStep(2);
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
            setMainPhotoIndex(mainPhotoIndex - 1);
        }
    };

    const selectMainPhoto = (index) => {
        setMainPhotoIndex(index);
    };

    // ✅ HttpOnly 쿠키 기반 사용자 인증 정보 가져오기
    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const res = await fetch("http://localhost:8080/api/auth/me", {
                    credentials: "include", // 쿠키 포함
                });

                if (res.ok) {
                    const data = await res.json();
                    console.log("🔐 사용자 인증 정보:", data);
                    setEmail(data.email);
                    setSnsTypeId(data.snsTypeId);
                    setStep(2); // 사용자 인증 완료되었으면 회원가입 시작
                } else {
                    console.warn("❌ 인증되지 않은 사용자");
                }
            } catch (err) {
                console.error("🚨 사용자 정보 조회 실패:", err);
            }
        };

        fetchUserInfo();
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

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has("email")) {
            setEmail(urlParams.get("email"));
        }
        if (urlParams.has("snsTypeId")) {
            setSnsTypeId(Number(urlParams.get("snsTypeId")));
        }
    }, []);

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
