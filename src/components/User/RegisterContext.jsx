import React, { createContext, useContext, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

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
    const [token, setToken] = useState("");
    const [email, setEmail] = useState("");
    const [snsTypeId, setSnsTypeId] = useState(null);
    const [previews, setPreviews] = useState([]);
    const [mainPhotoIndex, setMainPhotoIndex] = useState(0);
    const [searchParams] = useSearchParams();

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

    // 이미지 미리보기 관리
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

    useEffect(() => {
        const token = searchParams.get("token");
        const email = searchParams.get("email");
        const snsTypeIdStr = searchParams.get("snsTypeId");

        // snsTypeId를 숫자로 변환
        const snsTypeId = snsTypeIdStr ? parseInt(snsTypeIdStr, 10) : null;

        if (token) setToken(token);
        if (email) setEmail(email);
        if (snsTypeId) setSnsTypeId(snsTypeId);

        console.log("Step1 - URL 파라미터:", {
            token,
            email,
            snsTypeId,
            snsTypeIdStr,
            allParams: Object.fromEntries(searchParams.entries()),
        });
    }, [searchParams, setToken, setEmail, setSnsTypeId]);

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
                token,
                setToken,
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
