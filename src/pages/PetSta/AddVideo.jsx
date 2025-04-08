import React, { useState } from "react";
import AddVideoSelect from "../../components/PetSta/AddVideoSelect.jsx";
import AddVideoTrim from "../../components/PetSta/AddVideoTrim.jsx";
import AddVideoDetail from "../../components/PetSta/AddVideoDetail.jsx";

const AddVideo = () => {
    const [step, setStep] = useState(1);
    const [videoPreview, setVideoPreview] = useState(null);
    const [trimmedData, setTrimmedData] = useState(null); // trimStart, trimEnd 포함

    return (
        <>
            {step === 1 && (
                <AddVideoSelect
                    videoPreview={videoPreview}
                    setVideoPreview={setVideoPreview}
                    goNext={() => setStep(2)}
                />
            )}

            {step === 2 && (
                <AddVideoTrim
                    videoPreview={videoPreview}
                    onBack={() => setStep(1)}
                    onNext={(data) => {
                        setTrimmedData(data);
                        setStep(3);
                    }}
                />
            )}

            {step === 3 && <AddVideoDetail videoData={trimmedData} onBack={() => setStep(2)} />}
        </>
    );
};

export default AddVideo;
