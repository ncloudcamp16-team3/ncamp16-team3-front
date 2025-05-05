import React from "react";
import { Box, Typography, FormGroup } from "@mui/material";
import OptionCheckboxGroup from "../common/OptionCheckboxGroup";


const ExperienceStep = ({ sitterExperience, onChange }) => {
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
        펫시터를 해보신 경험이 있나요?
      </Typography>

      <FormGroup sx={{ width: "100%" }}>
        <OptionCheckboxGroup
          options={sitterExperience}
          onChange={onChange}
          multiSelect={false}
        />
      </FormGroup>
    </Box>
  );
};

export default ExperienceStep;