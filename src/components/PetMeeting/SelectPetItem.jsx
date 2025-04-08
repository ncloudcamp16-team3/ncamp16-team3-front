import React, { useContext } from "react";
import { Box } from "@mui/material";
import { PetMeetingContext } from "../../context/PetMeetingContext.jsx";

const SelectPetItem = ({ pet, selected, setSelectedPet }) => {
    const { setDrop } = useContext(PetMeetingContext);
    return (
        <Box
            sx={{
                padding: "12px 0",
                display: "flex",
                justifyContent: "center",
                backgroundColor: selected ? "#E9A260" : "#F2DFCE",
                color: selected ? "white" : "black",
                cursor: "pointer",
                "&:hover": {
                    backgroundColor: selected ? "#D4883E" : "#e6d3c2",
                },
            }}
            onClick={() => {
                setSelectedPet(pet);
                setDrop();
            }}
        >
            {pet}
        </Box>
    );
};

export default SelectPetItem;
