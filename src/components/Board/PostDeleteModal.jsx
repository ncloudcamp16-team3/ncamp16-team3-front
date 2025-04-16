import React from "react";
import { Modal, Box, Button, Fade, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";

const PostDeleteModal = ({ openDeleteModal, setOpenDeleteModal, postId }) => {
    const theme = useTheme();
    const navigate = useNavigate();
    const requestPostDelete = () => {
        alert(postId + "번 게시글 삭제 요청");
        setOpenDeleteModal(false);
        navigate(-1);
    };
    return (
        <Modal
            open={openDeleteModal}
            onClose={() => setOpenDeleteModal(false)}
            disableScrollLock
            sx={{
                zIndex: 10000,
            }}
        >
            <Fade in={openDeleteModal}>
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
                        "게시글 삭제"
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        "삭제하시겠습니까?"
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
                            onClick={requestPostDelete}
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
                            onClick={() => setOpenDeleteModal(false)}
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

export default PostDeleteModal;
