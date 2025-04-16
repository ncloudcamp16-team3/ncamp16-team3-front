import React from "react";
import { useTheme } from "@mui/material/styles";
import { Box, Button, Fade, Modal, Typography } from "@mui/material";

const PostUpdateModal = ({ openUpdateModal, setOpenUpdateModal, setUpdateAble }) => {
    const theme = useTheme();

    return (
        <Modal
            open={openUpdateModal}
            onClose={() => setOpenUpdateModal(false)}
            disableScrollLock
            sx={{
                zIndex: 10000,
            }}
        >
            <Fade in={openUpdateModal}>
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: 300,
                        bgcolor: theme.brand5,
                        borderRadius: 3,
                        boxShadow: 24,
                        p: 4,
                        textAlign: "center",
                    }}
                >
                    <Typography variant="h6" gutterBottom>
                        "게시글 수정"
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        "수정하시겠습니까?"
                    </Typography>
                    <Box
                        sx={{
                            display: "flex",
                            gap: "20px",
                            justifyContent: "center",
                        }}
                    >
                        <Button
                            variant="contained"
                            onClick={() => {
                                setOpenUpdateModal(false);
                                setUpdateAble(true);
                            }}
                            sx={{
                                mt: 2,
                                borderRadius: 2,
                                backgroundColor: theme.brand3,
                                px: "25px",
                                "&:hover": { backgroundColor: "#e68a3d" },
                            }}
                        >
                            확인
                        </Button>
                        <Button
                            variant="contained"
                            onClick={() => setOpenUpdateModal(false)}
                            sx={{
                                mt: 2,
                                borderRadius: 2,
                                backgroundColor: theme.brand2,
                                color: "black",
                                px: "25px",
                                "&:hover": { backgroundColor: "#E0C8A2" },
                            }}
                        >
                            취소
                        </Button>
                    </Box>
                </Box>
            </Fade>
        </Modal>
    );
};

export default PostUpdateModal;
