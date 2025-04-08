import React, { useContext, useEffect, useState } from "react";
import { Box, Button, Fade, Modal, Typography } from "@mui/material";
import Dog from "../../assets/images/PetMeeting/dog.svg";
import SelectPetDropdown from "./SelectPetDropdown.jsx";
import { PetMeetingContext } from "../../context/PetMeetingContext.jsx";

const PetConfigModal = () => {
    const { pet, setPet, open, drop, setDrop, setClose } = useContext(PetMeetingContext);
    const [selectedPet, setSelectedPet] = useState(null);
    const [selectedActivity, setSelectedActivity] = useState(null);

    useEffect(() => {
        if (pet) {
            setSelectedPet(pet.name);
            setSelectedActivity(pet.activity_status);
        } else {
            setSelectedPet(null);
            setSelectedActivity(null);
        }
    }, [pet, open]);

    const petRegister = () => {
        setPet((prev) => ({ ...prev, name: selectedPet, activity_status: selectedActivity }));
        setClose();
    };

    return (
        <Modal
            open={open}
            onClose={setClose}
            disableScrollLock
            sx={{
                zIndex: 10000,
            }}
        >
            <Fade in={open} timeout={400}>
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: 300,
                        backgroundColor: "#FDF1E5",
                        borderRadius: 2,
                        p: 3,
                        boxShadow: 24,
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <Box
                            component="img"
                            src={Dog}
                            alt="dog"
                            sx={{
                                width: 60,
                                height: 60,
                                objectFit: "contain",
                                marginBottom: "10px",
                            }}
                        ></Box>
                        <Typography
                            sx={{
                                margin: "20px",
                                fontSize: "35px",
                            }}
                        >
                            놀러가기
                        </Typography>
                    </Box>
                    <Typography
                        sx={{
                            marginBottom: "10px",
                            fontSize: "20px",
                        }}
                    >
                        놀러갈 친구
                    </Typography>
                    <Box sx={{ position: "relative", width: "100%" }}>
                        <Button
                            sx={{
                                width: "100%",
                                backgroundColor: "#E9A260",
                                borderRadius: 2,
                                color: "white",
                            }}
                            onClick={() => setDrop((prev) => !prev)}
                        >
                            {selectedPet ? selectedPet : "친구 선택"}
                        </Button>
                        {drop && <SelectPetDropdown selectedPet={selectedPet} setSelectedPet={setSelectedPet} />}
                    </Box>
                    <Typography
                        sx={{
                            margin: "10px 0",
                            fontSize: "20px",
                        }}
                    >
                        활동목록
                    </Typography>
                    <Box
                        sx={{
                            display: "flex",
                            gap: 0,
                            margin: "10px 0",
                            backgroundColor: "rgba(46, 45, 45, 0.1)",
                            borderRadius: "8px",
                        }}
                    >
                        <Box
                            sx={{
                                padding: "7px 0",
                                borderRadius: "8px",
                                cursor: "pointer",
                                backgroundColor: selectedActivity === "WALK" ? "#E9A260" : "transparent",
                                color: selectedActivity === "WALK" ? "white" : "black",
                                transition: "0.3s",
                                width: "50%",
                                textAlign: "center",
                                margin: "3px 0 3px 3px",
                            }}
                            onClick={() => setSelectedActivity("WALK")}
                        >
                            <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                산책친구들
                            </Typography>
                        </Box>

                        <Box
                            sx={{
                                padding: "7px 0",
                                borderRadius: "8px",
                                cursor: "pointer",
                                backgroundColor: selectedActivity === "PLAY" ? "#E9A260" : "transparent",
                                color: selectedActivity === "PLAY" ? "white" : "black",
                                transition: "0.3s",
                                width: "50%",
                                textAlign: "center",
                                margin: "3px 3px 3px 0px",
                            }}
                            onClick={() => setSelectedActivity("PLAY")}
                        >
                            <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                놀이친구들
                            </Typography>
                        </Box>
                    </Box>

                    <Box
                        sx={{
                            width: "100%",
                            display: "flex",
                            gap: "30px",
                            justifyContent: "center",
                            marginTop: "20px",
                        }}
                    >
                        <Button
                            sx={{
                                backgroundColor: "#E9A260",
                                color: "white",
                                borderRadius: 5,
                                padding: "7px 30px",
                            }}
                            onClick={() => petRegister(selectedPet)}
                        >
                            등록
                        </Button>
                        <Button
                            sx={{
                                backgroundColor: "#F2DFCE",
                                color: "black",
                                borderRadius: 5,
                                padding: "7px 30px",
                            }}
                            onClick={setClose}
                        >
                            취소
                        </Button>
                    </Box>
                </Box>
            </Fade>
        </Modal>
    );
};

export default PetConfigModal;
