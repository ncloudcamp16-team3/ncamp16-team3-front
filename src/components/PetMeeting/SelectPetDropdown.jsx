import React, { useContext } from "react";
import { Box, Divider, Fade } from "@mui/material";
import SelectPetItem from "./SelectPetItem.jsx";
import { PetMeetingContext } from "../../context/PetMeetingContext.jsx";

const SelectPetDropdown = ({ selectedPet, setSelectedPet, myPets }) => {
    const { drop } = useContext(PetMeetingContext);

    return (
        <Fade in={drop} timeout={300}>
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
                {myPets?.map((petItem, index) => (
                    <React.Fragment key={petItem}>
                        <SelectPetItem
                            pet={petItem}
                            selected={selectedPet === petItem}
                            setSelectedPet={setSelectedPet}
                        />
                        {index !== myPets.length - 1 && <Divider sx={{ borderColor: "#989898" }} />}
                    </React.Fragment>
                ))}
            </Box>
        </Fade>
    );
};

export default SelectPetDropdown;
