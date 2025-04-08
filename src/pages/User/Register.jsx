import React, { useState } from "react";
import Step1 from "../../components/User/Step1.jsx";
import Step2 from "../../components/User/Step2.jsx";
import Step3 from "../../components/User/Step3.jsx";
import Step4 from "../../components/User/Step4.jsx";
import Step5 from "../../components/User/Step5.jsx";

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

const Register = () => {
    const [step, setStep] = useState(1);
    const [nickname, setNickname] = useState("");
    const [formData, setFormData] = useState(initialPetData);
    const [petDataList, setPetDataList] = useState([]);

    const nextStep = () => {
        if (step < 5) {
            setStep(step + 1);
        }
    };

    const prevStep = () => {
        if (step > 1) {
            setStep(step - 1);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleStep4Next = () => {
        setPetDataList((prevList) => [...prevList, formData]);
        setFormData(initialPetData); // 다음 반려동물 입력을 위해 초기화
        setStep(5);
    };

    const goToStep2 = () => {
        setFormData(initialPetData);
        setStep(2);
    };

    return (
        <div>
            {step === 1 && (
                <Step1 nextStep={nextStep} prevStep={prevStep} nickname={nickname} setNickname={setNickname} />
            )}
            {step === 2 && (
                <Step2 nextStep={nextStep} prevStep={prevStep} handleChange={handleChange} formData={formData} />
            )}
            {step === 3 && (
                <Step3 nextStep={nextStep} prevStep={prevStep} handleChange={handleChange} formData={formData} />
            )}
            {step === 4 && (
                <Step4 nextStep={handleStep4Next} prevStep={prevStep} handleChange={handleChange} formData={formData} />
            )}
            {step === 5 && (
                <Step5 prevStep={prevStep} nickname={nickname} petDataList={petDataList} goToStep2={goToStep2} />
            )}
        </div>
    );
};

export default Register;
