import React, { useState } from "react";
import { Modal, Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    borderRadius: 2,
    boxShadow: 24,
    p: 4,
};

const BasicModal = ({ message }) => {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const navigate = useNavigate();

    const handleRedirect = () => {
        if (message?.redirectUrl) {
            navigate(message.redirectUrl);
        }
    };

    return (
        <div>
            <Button variant="contained" onClick={handleOpen}>
                모달 열기
            </Button>
            <Modal open={open} onClose={handleClose}>
                <Box sx={style}>
                    <Typography variant="h6" component="h2">
                        모달 제목
                    </Typography>
                    <Typography sx={{ mt: 2 }}>{message?.text || "여기에 모달 내용을 작성할 수 있습니다."}</Typography>

                    <Button sx={{ mt: 2 }} variant="outlined" onClick={handleClose}>
                        닫기
                    </Button>

                    {/* ✅ redirectUrl이 있을 때만 표시 */}
                    {message?.redirectUrl && (
                        <Button sx={{ mt: 2, ml: 1 }} variant="contained" color="primary" onClick={handleRedirect}>
                            이동하기
                        </Button>
                    )}
                </Box>
            </Modal>
        </div>
    );
};

export default BasicModal;
