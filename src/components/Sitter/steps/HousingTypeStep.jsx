import React from "react";
import { Box, Typography, FormGroup } from "@mui/material";
import OptionCheckboxGroup from "../common/OptionCheckboxGroup";


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