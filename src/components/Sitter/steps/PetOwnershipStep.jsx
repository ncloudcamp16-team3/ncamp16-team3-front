import React from "react";
import { Box, Typography, FormGroup } from "@mui/material";
import OptionCheckboxGroup from "../common/OptionCheckboxGroup";

const PetOwnershipStep = ({ hasPet, onChange }) => {
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
                현재 반려동물을 키우시고 계신가요?
            </Typography>

            <FormGroup sx={{ width: "100%" }}>
                <OptionCheckboxGroup options={hasPet} onChange={onChange} multiSelect={false} />
            </FormGroup>
        </Box>
    );
};

export default PetOwnershipStep;
