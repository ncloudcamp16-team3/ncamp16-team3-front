import React from "react";
import { Box, Button, Fade, Modal, Typography } from "@mui/material";

const InfoModal = ({ open, title, message, onClose }) => {
    return (
        <Modal
            open={open}
            onClose={onClose}
            disableScrollLock
            sx={{
                zIndex: 10000,
            }}
        >
            <Fade in={open}>
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: 260,
                        bgcolor: "background.paper",
                        borderRadius: 4,
                        boxShadow: 24,
                        p: 4,
                        textAlign: "center",
                        backgroundColor: "#FDF1E5",
                    }}
                >
                    {title && (
                        <Typography variant="h6" component="h2" gutterBottom>
                            {title}
                        </Typography>
                    )}
                    <Typography variant="h6" component="h2" gutterBottom>
                        {message.split("\n").map((line, index) => (
                            <React.Fragment key={index}>
                                {line}
                                <br />
                            </React.Fragment>
                        ))}
                    </Typography>
                    <Button
                        onClick={onClose}
                        variant="contained"
                        sx={{
                            mt: 2,
                            bgcolor: "#F4A261",
                            borderRadius: 5,
                            px: 4,
                            "&:hover": { bgcolor: "#e68a3d" },
                        }}
                    >
                        확인
                    </Button>
                </Box>
            </Fade>
        </Modal>
    );
};

export default InfoModal;
