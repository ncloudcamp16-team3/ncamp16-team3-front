import React, { useContext } from "react";
import { Box, Button, Typography } from "@mui/material";
import { PetMeetingContext } from "../../context/PetMeetingContext.jsx";

const PetRegister = () => {
    const { pet, setOpenPetConfigModal, friendType } = useContext(PetMeetingContext);
    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                height: "40px",
                m: "5px 0 10px 0",
            }}
        >
            <Box>
                <Typography
                    variant="h5"
                    sx={{
                        textAlign: "center",
                    }}
                >
                    {friendType}
                </Typography>
            </Box>
            {!pet && (
                <Button
                    sx={{
                        borderRadius: 5,
                        backgroundColor: "#E9A260",
                        fontWeight: 600,
                        padding: "7px 20px",
                        color: "white",
                    }}
                    onClick={() => setOpenPetConfigModal(true)}
                >
                    놀러가기
                </Button>
            )}
        </Box>
    );
};

export default PetRegister;
