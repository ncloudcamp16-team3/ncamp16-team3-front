import React, { useContext, useEffect, useState } from "react";
import { Box, Divider, Fade } from "@mui/material";
import SelectPetItem from "./SelectPetItem.jsx";
import { PetMeetingContext } from "../../context/PetMeetingContext.jsx";
import { getMyPets } from "../../services/petService.js";
import { Context } from "../../context/Context.jsx";

const SelectPetDropdown = ({ selectedPet, setSelectedPet }) => {
    const { drop } = useContext(PetMeetingContext);
    const { user } = useContext(Context);
    const [pets, setPets] = useState([]);

    useEffect(() => {
        getMyPets({ userId: user.id })
            .then((res) => {
                const data = res.data;
                console.log("응답 성공: " + res.message);
                console.log(data);
                setPets(data);
            })
            .catch((err) => {
                console.log("에러 발생: " + err.message);
            });
    }, []);

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
                {pets.map((petItem, index) => (
                    <React.Fragment key={petItem}>
                        <SelectPetItem
                            pet={petItem}
                            selected={selectedPet === petItem}
                            setSelectedPet={setSelectedPet}
                        />
                        {index !== pets.length - 1 && <Divider sx={{ borderColor: "#989898" }} />}
                    </React.Fragment>
                ))}
            </Box>
        </Fade>
    );
};

export default SelectPetDropdown;
