import React, { createContext, useContext, useState } from "react";

const RegisterContext = createContext();

const initialPetData = {
    petName: "",
    petRegistration: "",
    petGender: "",
    petBirthday: "",
    petWeight: "",
    petBodyType: "",
    petIntroduction: "",
    petNeutered: "N",
    petFavorite: "",
    petPhotos: [],
    mainPhotoIndex: 0,
};

export const RegisterProvider = ({ children }) => {
    const [step, setStep] = useState(1);
    const [nickname, setNickname] = useState("");
    const [formData, setFormData] = useState(initialPetData);
    const [petDataList, setPetDataList] = useState([]);

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
            }}
        >
            {children}
        </RegisterContext.Provider>
    );
};

export const useRegister = () => useContext(RegisterContext);
