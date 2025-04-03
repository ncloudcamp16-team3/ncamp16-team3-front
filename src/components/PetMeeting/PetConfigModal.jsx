import React, { useState } from "react";
import { Box, Button, Modal, Typography } from "@mui/material";
import Dog from "../../assets/images/PetMeeting/dog.svg";

const PetConfigModal = ({ open, handleClose, pet, setPet }) => {
    const [drop, setDrop] = useState(false);
    const changePetName = () => {
        setPet((prev) => ({ ...prev, name: "초코" }));
    };

    const close = () => {
        setDrop(false);
        handleClose();
    };

    return (
        <Modal open={open} onClose={handleClose} container={document.body}>
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
                        등록하기
                    </Typography>
                </Box>
                <Typography
                    sx={{
                        marginBottom: "10px",
                        fontSize: "20px",
                    }}
                >
                    등록할 친구
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
                        {pet?.name}
                    </Button>
                    {drop && (
                        <Box
                            sx={{
                                position: "absolute",
                                top: "90%", // 버튼 아래에 위치
                                left: 0,
                                width: "100%",
                                backgroundColor: "#F2DFCE",
                                boxShadow: 3,
                                borderRadius: "8px",
                                p: 2,
                                mt: 1,
                                zIndex: 10, // 다른 요소보다 위에 배치
                            }}
                        >
                            <p>옵션 1</p>
                            <p>옵션 2</p>
                        </Box>
                    )}
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
                            color: "black",
                            borderRadius: 5,
                            padding: "7px 30px",
                        }}
                        onClick={changePetName}
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
                        onClick={close}
                    >
                        취소
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default PetConfigModal;
