import React from "react";
import { Box, Typography, FormGroup } from "@mui/material";
import OptionCheckboxGroup from "../common/OptionCheckboxGroup";

/**
 * 반려동물 마릿수 선택 단계 컴포넌트
 * @param {Object} props
 * @param {Object} props.petCount 반려동물 마릿수 객체
 * @param {Function} props.onChange 선택 변경 핸들러
 */
const PetCountStep = ({ petCount, onChange }) => {
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
                몇마리를 키우고 계신가요?
            </Typography>

            <FormGroup sx={{ width: "100%" }}>
                <OptionCheckboxGroup options={petCount} onChange={onChange} multiSelect={false} />
            </FormGroup>
        </Box>
    );
};

export default PetCountStep;
