import React from "react";
import Step1 from "../../components/User/Step1";
import Step2 from "../../components/User/Step2";
import Step3 from "../../components/User/Step3";
import Step4 from "../../components/User/Step4";
import Step5 from "../../components/User/Step5";
import { RegisterProvider, useRegister } from "../../components/User/RegisterContext";

const StepRenderer = () => {
    const { step } = useRegister();

    switch (step) {
        case 1:
            return <Step1 />;
        case 2:
            return <Step2 />;
        case 3:
            return <Step3 />;
        case 4:
            return <Step4 />;
        case 5:
            return <Step5 />;
        default:
            return null;
    }
};

const Register = () => {
    return (
        <RegisterProvider>
            <StepRenderer />
        </RegisterProvider>
    );
};

export default Register;
