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
    const [snsAccountId, setSnsAccountId] = useState("");
    const [snsTypeId, setSnsTypeId] = useState(null);
    const [previews, setPreviews] = useState([]);
    const [mainPhotoIndex, setMainPhotoIndex] = useState(0);

    const nextStep = () => setStep((prev) => Math.min(prev + 1, 4));
    const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleStep4Next = (newPetData) => {
        setPetDataList([...petDataList, newPetData]);
        setStep(4);
    };

    const goToStep1 = () => {
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

    useEffect(() => {
        const initUserInfo = async () => {
            try {
                const res = await fetch(`/api/auth/check`, {
                    credentials: "include",
                });

                if (res.ok) {
                    const data = await res.json();

                    if (data.isNewUser) {
                        // 신규 사용자니까 회원가입 진행
                        setSnsAccountId(data.snsAccountId);
                        setSnsTypeId(data.snsTypeId);
                        goToStep1();
                    } else {
                        // 기존 사용자라면 필요한 정보를 설정하거나
                        // 이미 회원가입이 완료되었으므로 리다이렉션 등의 처리를 할 수 있음
                        console.log("기존 사용자 정보:", data);
                        // 예: 이미 가입한 사용자에 대한 후속 처리 (리다이렉션, 데이터 세팅 등)
                    }
                }
            } catch (err) {
                console.error("🚨 사용자 정보 조회 실패:", err);
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
                goToStep1,
                snsAccountId,
                setSnsAccountId,
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
