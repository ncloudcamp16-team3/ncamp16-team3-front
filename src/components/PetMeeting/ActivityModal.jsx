import React, { useContext } from "react";
import { Box, Button, Fade, Modal, Typography } from "@mui/material";
import { PetMeetingContext } from "../../context/PetMeetingContext.jsx";
import Dog from "../../assets/images/PetMeeting/dog.svg";

const ActivityModal = () => {
    const { setPet, openActivityModal, setOpenActivityModal } = useContext(PetMeetingContext);

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

export default ActivityModal;
