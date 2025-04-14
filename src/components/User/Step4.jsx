import React from "react";
import { Box, Button, Grid } from "@mui/material";
import { useRegister } from "./RegisterContext.jsx";

const Step4 = () => {
    const { formData, prevStep, handleStep4Next, mainPhotoIndex } = useRegister();

    const handleNext = () => {
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
