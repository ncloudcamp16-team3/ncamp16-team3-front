import React, { useState } from "react";
import Step1 from "../../components/User/Step1.jsx";
import Step2 from "../../components/User/Step2.jsx";
import Step3 from "../../components/User/Step3.jsx";
import Step4 from "../../components/User/Step4.jsx";

const Register = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        nickname: "",
        petName: "",
        petRegistration: "",
        petGender: "",
        petBirthday: "",
        petWeight: "",
        petBodyType: "",
        petIntroduction: "",
        petNeutered: "",
        petFavorite: "",
    });

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
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <div>
            {step === 1 && (
                <Step1 nextStep={nextStep} prevStep={prevStep} handleChange={handleChange} formData={formData} />
            )}
            {step === 2 && (
                <Step2 nextStep={nextStep} prevStep={prevStep} handleChange={handleChange} formData={formData} />
            )}
            {step === 3 && (
                <Step3 nextStep={nextStep} prevStep={prevStep} handleChange={handleChange} formData={formData} />
            )}
            {step === 4 && <Step4 formData={formData} prevStep={prevStep} />}
        </div>
    );
};

export default Register;
