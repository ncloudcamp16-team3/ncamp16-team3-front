import React from "react";
import { Box, IconButton, Typography } from "@mui/material";
import { Photo } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import { useTheme } from "@mui/material/styles";

const UploadFiles = ({ photos, handleAddPhoto, handleDeletePhoto }) => {
    const theme = useTheme();
    return (
        <Box sx={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <label htmlFor="file-upload">
                <Box
                    sx={{
                        border: "1px solid #E9A260",
                        width: "50px",
                        height: "50px",
                        alignItems: "center",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        cursor: "pointer",
                    }}
                >
                    <Photo
                        sx={{
                            color: theme.brand3,
                            fontSize: "30px",
                        }}
                    />
                    <Typography sx={{ fontSize: "10px" }}>{photos?.length ?? 0}/5</Typography>
                </Box>
            </label>
            <input
                id="file-upload"
                type="file"
                accept="image/*"
                onChange={handleAddPhoto}
                style={{ display: "none" }}
                multiple
            />
            {photos?.map((photo, index) => (
                <Box key={index} sx={{ position: "relative" }}>
                    <Box
                        component="img"
                        src={photo.path}
                        alt="uploaded"
                        sx={{
                            width: "50px",
                            height: "50px",
                        }}
                    />
                    <IconButton
                        size="small"
                        sx={{ position: "absolute", top: 0, right: 0 }}
                        onClick={() => handleDeletePhoto(index)}
                    >
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </Box>
            ))}
        </Box>
    );
};

export default UploadFiles;
