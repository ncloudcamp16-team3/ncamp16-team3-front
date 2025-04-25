import React from "react";
import { Box, Typography, FormGroup } from "@mui/material";
import OptionCheckboxGroup from "../common/OptionCheckboxGroup";

/**
 * 연령대 선택 단계 컴포넌트
 * @param {Object} props
 * @param {Object} props.selectedAges 선택된 연령대 객체
 * @param {Function} props.onChange 선택 변경 핸들러
 */
const AgeSelectionStep = ({ selectedAges, onChange }) => {
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
                연령대가 어떻게 되시나요?
            </Typography>

            <FormGroup sx={{ width: "100%" }}>
                <OptionCheckboxGroup options={selectedAges} onChange={onChange} multiSelect={false} />
            </FormGroup>
        </Box>
    );
};

export default AgeSelectionStep;
