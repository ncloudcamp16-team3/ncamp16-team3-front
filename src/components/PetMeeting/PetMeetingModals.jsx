import React, { useContext, useEffect, useState } from "react";
import { PetMeetingContext } from "../../context/PetMeetingContext.jsx";
import { Box, Button, Fade, Modal, Typography } from "@mui/material";
import Dog from "../../assets/images/PetMeeting/dog.svg";
import SelectPetDropdown from "./SelectPetDropdown.jsx";
import { getMyPets, savePet } from "../../services/petService.js";
import { Context } from "../../context/Context.jsx";

const PetConfigModal = () => {
    const { openPetConfigModal, drop, setDrop, setClose } = useContext(PetMeetingContext);
    const { pet, setPet, user } = useContext(Context);
    const [selectedPet, setSelectedPet] = useState(null);
    const [myPets, setMyPets] = useState([]);

    useEffect(() => {
        getMyPets({ userId: user.id })
            .then((res) => {
                const data = res.data;
                // console.log("응답 성공: " + res.message);
                // console.log(data);
                setMyPets(data);
                if (data.length > 0) {
                    setPet(data[0]);
                }
            })
            .catch((err) => {
                // console.log("에러 발생: " + err.message);
            });
    }, []);

    useEffect(() => {
        if (pet) {
            setSelectedPet(pet);
        } else {
            setSelectedPet(null);
        }
    }, [pet, openPetConfigModal]);

    const petRegister = () => {
        setPet(selectedPet);
        setClose();

        savePet(selectedPet, user.id)
            .then((res) => {
                // console.log(res.message);
            })
            .catch((err) => {
                // console.log(err.message);
            });
    };

    return (
        <Modal
            open={openPetConfigModal}
            onClose={setClose}
            disableScrollLock
            sx={{
                zIndex: 10000,
            }}
        >
            <Fade in={openPetConfigModal} timeout={400}>
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
                                fontSize: "16px",
                            }}
                            onClick={() => setDrop((prev) => !prev)}
                        >
                            {selectedPet?.name ? selectedPet.name : "친구 선택"}
                        </Button>
                        {drop && (
                            <SelectPetDropdown
                                selectedPet={selectedPet}
                                setSelectedPet={setSelectedPet}
                                myPets={myPets}
                            />
                        )}
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
                                backgroundColor: selectedPet?.activityStatus === "WALK" ? "#E9A260" : "transparent",
                                color: selectedPet?.activityStatus === "WALK" ? "white" : "black",
                                transition: "0.3s",
                                width: "50%",
                                textAlign: "center",
                                margin: "3px 0 3px 3px",
                            }}
                            onClick={() =>
                                setSelectedPet((prev) => ({
                                    ...prev,
                                    activityStatus: "WALK",
                                }))
                            }
                        >
                            <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                산책가기
                            </Typography>
                        </Box>

                        <Box
                            sx={{
                                padding: "7px 0",
                                borderRadius: "8px",
                                cursor: "pointer",
                                backgroundColor: selectedPet?.activityStatus === "PLAY" ? "#E9A260" : "transparent",
                                color: selectedPet?.activityStatus === "PLAY" ? "white" : "black",
                                transition: "0.3s",
                                width: "50%",
                                textAlign: "center",
                                margin: "3px 3px 3px 0px",
                            }}
                            onClick={() =>
                                setSelectedPet((prev) => ({
                                    ...prev,
                                    activityStatus: "PLAY",
                                }))
                            }
                        >
                            <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                놀러가기
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

const ActivityModal = () => {
    const { openActivityModal, setOpenActivityModal } = useContext(PetMeetingContext);
    const { setPet } = useContext(Context);

    const handleRegisterClick = () => {
        setPet((prev) => ({
            ...prev,
            activityStatus: "NONE",
        }));
        setOpenActivityModal(false);
    };

    return (
        <Modal
            open={openActivityModal}
            onClose={() => setOpenActivityModal(false)}
            disableScrollLock
            sx={{
                zIndex: 10000,
            }}
        >
            <Fade in={openActivityModal} timeout={400}>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
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
                            fontSize: "24px",
                        }}
                    >
                        그만 놀까요?
                    </Typography>
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
                                padding: "7px 0",
                                width: "100px",
                            }}
                            onClick={handleRegisterClick}
                        >
                            집가기
                        </Button>
                        <Button
                            sx={{
                                backgroundColor: "#F2DFCE",
                                color: "black",
                                borderRadius: 5,
                                padding: "7px 0",
                                width: "100px",
                            }}
                            onClick={() => setOpenActivityModal(false)}
                        >
                            취소
                        </Button>
                    </Box>
                </Box>
            </Fade>
        </Modal>
    );
};

export { ActivityModal, PetConfigModal };
