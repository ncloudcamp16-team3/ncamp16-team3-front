import React from "react";
import { Box, FormControlLabel, Checkbox, FormGroup } from "@mui/material";

/**
 * 옵션 체크박스 그룹 컴포넌트
 * @param {Object} props
 * @param {Object} props.options 옵션 객체
 * @param {Function} props.onChange 선택 변경 핸들러
 * @param {boolean} [props.multiSelect=false] 다중 선택 여부 (true: 다중 선택, false: 단일 선택)
 */
const OptionCheckboxGroup = ({ options = {}, onChange, multiSelect = false }) => {
    if (!options || typeof options !== "object") return null;

    // 단일 선택 모드에서 사용하는 핸들러
    const handleSingleSelect = (option) => {
        const newState = Object.keys(options).reduce((acc, key) => {
            acc[key] = key === option;
            return acc;
        }, {});
        onChange(newState);
    };

    const handleMultiSelect = (option) => {
        onChange({
            ...options,
            [option]: !options[option],
        });
    };

    return (
        <Box
            sx={{
                border: "1px solid #e0e0e0",
                borderRadius: "12px",
                overflow: "hidden",
                width: "100%",
            }}
        >
            <FormGroup>
                {Object.keys(options).map((option, index) => (
                    <FormControlLabel
                        key={option}
                        control={
                            <Checkbox
                                checked={options[option]}
                                onChange={() => (multiSelect ? handleMultiSelect(option) : handleSingleSelect(option))}
                                sx={{
                                    color: "#E9A260",
                                    "&.Mui-checked": {
                                        color: "#E9A260",
                                    },
                                    padding: "12px",
                                }}
                            />
                        }
                        label={option}
                        sx={{
                            borderBottom: index < Object.keys(options).length - 1 ? "1px solid #e0e0e0" : "none",
                            margin: 0,
                            padding: 0,
                            width: "100%",
                            backgroundColor: options[option] ? "#FDF1E5" : "transparent",

                            "& .MuiFormControlLabel-label": {
                                padding: "12px 12px 12px 0",
                                width: "100%",
                            },
                            "& .MuiCheckbox-root": {
                                backgroundColor: options[option] ? "#FDF1E5" : "transparent",
                            },

                            display: "flex",
                            alignItems: "center",
                        }}
                    />
                ))}
            </FormGroup>
        </Box>
    );
};

export default OptionCheckboxGroup;
