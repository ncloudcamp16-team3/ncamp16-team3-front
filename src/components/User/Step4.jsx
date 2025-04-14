import React, { useState } from "react";
import { Box, Button, Grid } from "@mui/material";
import { useRegister } from "./RegisterContext.jsx";

const Step4 = () => {
    const {
        handleChange,
        formData,
        prevStep,
        handleStep4Next,
        mainPhotoIndex,
        previews,
        removePhoto,
        selectMainPhoto,
    } = useRegister();

    const [errors, setErrors] = useState({
        petNeutered: false,
        petPhotos: false,
    });

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        const updatedPhotos = [...(formData.petPhotos || []), ...files];

        handleChange({
            target: {
                name: "petPhotos",
                value: updatedPhotos,
            },
        });

        e.target.value = null;
    };

    const handleNext = () => {
        const newErrors = {
            petNeutered: !formData.petNeutered,
            petPhotos: !formData.petPhotos || formData.petPhotos.length === 0,
        };

        setErrors(newErrors);

        const hasError = Object.values(newErrors).some((e) => e);
        if (hasError) return;

        const newPetData = {
            ...formData,
            mainPhotoIndex,
        };
        handleStep4Next(newPetData);
    };

    return (
        <Box display="flex" flexDirection="column" alignItems="left" width="90%" mx="auto" gap={2}>
            <Grid container spacing={1}>
                <Grid item size={6}>
                    <Button
                        variant="contained"
                        onClick={prevStep}
                        sx={{ mt: 1, width: "100%", backgroundColor: "#fff", color: "black" }}
                    >
                        뒤로
                    </Button>
                </Grid>

                <Grid item size={6}>
                    <Button
                        variant="contained"
                        onClick={handleNext}
                        sx={{ mt: 1, width: "100%", backgroundColor: "#E9A260" }}
                    >
                        작성 완료
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Step4;
