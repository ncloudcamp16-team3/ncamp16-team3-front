import React, { useContext } from "react";
import { Box, Divider, Fade } from "@mui/material";
import SelectPetItem from "./SelectPetItem.jsx";
import myPets from "../../mock/PetMeeting/myPets.json";
import { PetMeetingContext } from "../../context/PetMeetingContext.jsx";

const SelectPetDropdown = ({ selectedPet, setSelectedPet }) => {
    const { drop } = useContext(PetMeetingContext);
    const pets = myPets;

    return (
        <Fade in={drop} timeout={400}>
            <Box
                sx={{
                    position: "absolute",
                    top: "90%",
                    left: 0,
                    width: "100%",
                    backgroundColor: "#F2DFCE",
                    borderRadius: "8px",
                    mt: 1,
                    zIndex: 10,
                    overflow: "hidden",
                }}
            >
                {pets.map((petItem, index) => (
                    <React.Fragment key={petItem}>
                        <SelectPetItem
                            pet={petItem}
                            selected={selectedPet === petItem}
                            setSelectedPet={setSelectedPet}
                        />
                        {index !== pets.length - 1 && <Divider sx={{ borderColor: "#000" }} />}
                    </React.Fragment>
                ))}
            </Box>
        </Fade>
    );
};

export default SelectPetDropdown;
