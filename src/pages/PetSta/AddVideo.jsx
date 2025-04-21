import React, { useState } from "react";
import AddVideoSelect from "../../components/PetSta/Upload/AddVideoSelect.jsx";
import AddVideoTrim from "../../components/PetSta/Upload/AddVideoTrim.jsx";
import AddVideoDetail from "../../components/PetSta/Upload/AddVideoDetail.jsx";

const AddVideo = () => {
    const [step, setStep] = useState(1);
    const [videoPreview, setVideoPreview] = useState(null);
    const [videoFile, setVideoFile] = useState(null); // ← 파일 추가
    const [trimmedData, setTrimmedData] = useState(null);

    return (
        <>
            {step === 1 && (
                <AddVideoSelect
                    videoPreview={videoPreview}
                    setVideoPreview={setVideoPreview}
                    setVideoFile={setVideoFile} // ← 추가
                    goNext={() => setStep(2)}
                />
            )}

            {step === 2 && (
                <AddVideoTrim
                    videoPreview={videoPreview}
                    onBack={() => setStep(1)}
                    onNext={(data) => {
                        setTrimmedData({
                            ...data,
                            file: videoFile, // ← file도 같이 넘기기!!
                        });
                        setStep(3);
                    }}
                />
            )}

            {step === 3 && <AddVideoDetail videoData={trimmedData} onBack={() => setStep(2)} />}
        </>
    );
};

export default AddVideo;
