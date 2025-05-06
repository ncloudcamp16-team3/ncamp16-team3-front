import React from "react";
import { Box, Typography, FormGroup, TextField } from "@mui/material";
import OptionCheckboxGroup from "../common/OptionCheckboxGroup";

const PetTypeStep = ({ petTypes, onChange, otherPetText, onOtherPetTextChange }) => {
    return (
        <Box
            sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                pt: 2,
                alignItems: "center",
            }}
        >
            <Typography
                variant="h6"
                fontWeight="bold"
                sx={{
                    mb: 4,
                    textAlign: "center",
                }}
            >
                어떤 반려동물을 키우고 계신가요?
            </Typography>

            <FormGroup sx={{ width: "100%" }}>
                <OptionCheckboxGroup options={petTypes} onChange={onChange} multiSelect={true} />
            </FormGroup>

            {petTypes["기타"] && (
                <TextField
                    fullWidth
                    placeholder="반려동물을 입력해주세요"
                    value={otherPetText}
                    onChange={(e) => onOtherPetTextChange(e.target.value)}
                    sx={{
                        mt: 2,
                        "& .MuiOutlinedInput-root": {
                            borderRadius: "12px",
                        },
                    }}
                />
            )}
        </Box>
    );
};

export default PetTypeStep;
