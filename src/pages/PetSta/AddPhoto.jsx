import React, { useState } from "react";
import AddPhotoSelect from "../../components/PetSta/Upload/AddPhotoSelect.jsx";
import AddPhotoDetail from "../../components/PetSta/Upload/AddPhotoDetail.jsx";

const AddPhoto = () => {
    const [step, setStep] = useState(1);
    const [imagePreview, setImagePreview] = useState(null);
    const [imageFile, setImageFile] = useState(null);

    return (
        <>
            {step === 1 && (
                <AddPhotoSelect
                    imagePreview={imagePreview}
                    setImagePreview={setImagePreview}
                    imageFile={imageFile}
                    setImageFile={setImageFile}
                    goNext={() => setStep(2)}
                />
            )}
            {step === 2 && (
                <AddPhotoDetail imagePreview={imagePreview} imageFile={imageFile} onBack={() => setStep(1)} />
            )}
        </>
    );
};

export default AddPhoto;
