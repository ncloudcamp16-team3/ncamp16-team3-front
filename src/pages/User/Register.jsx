import React from "react";
import Step1 from "../../components/User/Step1.jsx";
import Step2 from "../../components/User/Step2.jsx";
import Step3 from "../../components/User/Step3.jsx";
import Step4 from "../../components/User/Step4.jsx";

const Register = () => {
    const [step, setStep] = React.useState(1);
    const nextStep = () => {
        if (step < 4) {
            setStep(step + 1);
        }
    };

    return (
        <div>
            {step === 1 && <Step1 nextStep={nextStep} />}
            {step === 2 && <Step2 nextStep={nextStep} />}
            {step === 3 && <Step3 nextStep={nextStep} />}
            {step === 4 && <Step4 nextStep={nextStep} />}
        </div>
    );
};

export default Register;
