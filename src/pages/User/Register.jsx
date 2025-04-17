import React from "react";
import Step1 from "../../components/User/Step1";
import Step2 from "../../components/User/Step2";
import Step3 from "../../components/User/Step3";
import Step4 from "../../components/User/Step4";
import { RegisterProvider, useRegister } from "../../components/User/RegisterContext";
// 디버깅용 컴포넌트
import { useLocation } from "react-router-dom";

const steps = [<Step1 />, <Step2 />, <Step3 />, <Step4 />];

const StepRenderer = () => {
    const { step } = useRegister();
    const location = useLocation();

    const debugInfo = Object.fromEntries(new URLSearchParams(location.search));

    return (
        <>
            {steps[step - 1] || null}
            {/*<DebugInfo debugInfo={debugInfo} />*/}
        </>
    );
};

const Register = () => {
    return (
        <RegisterProvider>
            <StepRenderer />
        </RegisterProvider>
    );
};

export default Register;
