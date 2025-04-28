import React from "react";
import { Box, Typography, FormGroup } from "@mui/material";
import OptionCheckboxGroup from "../common/OptionCheckboxGroup";

/**
 * 주거형태 선택 단계 컴포넌트
 * @param {Object} props
 * @param {Object} props.houseType 주거형태 객체
 * @param {Function} props.onChange 선택 변경 핸들러
 */
const HousingTypeStep = ({ houseType, onChange }) => {
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
        주거형태가 어떻게 되시나요?
      </Typography>

      <FormGroup sx={{ width: "100%" }}>
        <OptionCheckboxGroup
          options={houseType}
          onChange={onChange}
          multiSelect={true}
        />
      </FormGroup>
    </Box>
  );
};

export default HousingTypeStep;