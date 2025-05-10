import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { checkLogin } from "../../services/authService.js";

const RegisterContext = createContext();

const initialPetData = {
    petName: "",
    petTypeId: "",
    petGender: "",
    petBirth: "",
    petWeight: "",
    petInfo: "",
    petNeutered: null,
    petPhotos: [],
};

export const RegisterProvider = ({ children }) => {
    const [step, setStep] = useState(1);
    const [nickname, setNickname] = useState("");
    const [formData, setFormData] = useState(initialPetData);
    const [petData, setPetData] = useState(null);
    const [snsAccountId, setSnsAccountId] = useState("");
    const [snsTypeId, setSnsTypeId] = useState(null);
    const [previews, setPreviews] = useState([]);
    const [mainPhotoIndex, setMainPhotoIndex] = useState(0);
    const hasRun = useRef(false); // ✅ useEffect 두 번 실행 방지

    const nextStep = () => setStep((prev) => Math.min(prev + 1, 4));
    const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleStep4Next = (newPetData) => {
        if (!newPetData || !newPetData.petName) {
            console.error("펫 데이터가 누락되었습니다", newPetData);
            return;
        }
        setPetData(newPetData); // 상태 업데이트
        setStep(4); // 스텝 변경
    };

    const goToStep1 = () => {
        setFormData(initialPetData);
        setPetData(null); // 펫 데이터 초기화
        setStep(1); // 스텝 1로 이동
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

    // 몸무게 입력 처리 함수 추가
    const handleWeightChange = (e) => {
        const { name, value } = e.target;

        // 숫자와 소수점만 허용
        const regex = /^[0-9]*\.?[0-9]*$/;

        if (value === "" || regex.test(value)) {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    useEffect(() => {
        if (hasRun.current) return;
        hasRun.current = true;

        (async () => {
            const data = await checkLogin();

            if (!data) {
                console.error("🚨 로그인 체크 실패");
                return;
            }

            if (data.isNewUser) {
                setSnsAccountId(data.snsAccountId);
                setSnsTypeId(data.snsTypeId);
                goToStep1();
            } else {
            }
        })();
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
                handleWeightChange,
            }}
        >
            {children}
        </RegisterContext.Provider>
    );
};

export const useRegister = () => useContext(RegisterContext);
