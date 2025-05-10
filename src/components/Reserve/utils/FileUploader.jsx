import React, { useState } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import { styled } from "@mui/material/styles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";

const UploadBox = styled(Box)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    border: `2px dashed ${theme.palette.grey[400]}`,
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(4),
    textAlign: "center",
    cursor: "pointer",
    "&:hover": {
        borderColor: theme.palette.primary.main,
        backgroundColor: theme.palette.action.hover,
    },
    height: 200,
    width: "100%",
}));

const PreviewImage = styled("img")({
    maxWidth: "100%",
    maxHeight: 150,
    objectFit: "contain",
    borderRadius: 4,
    marginBottom: 8,
});

const FileUploader = ({ onFileChange }) => {
    const [preview, setPreview] = useState(null);
    const [file, setFile] = useState(null);

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (!selectedFile) return;

        setFile(selectedFile);
        onFileChange(selectedFile); // 상위로 전달

        const reader = new FileReader();
        reader.onload = (e) => {
            setPreview(e.target.result);
        };
        reader.readAsDataURL(selectedFile);
    };

    const removeFile = () => {
        setFile(null);
        setPreview(null);
        onFileChange(null); // 상위에도 초기화 전달
    };

    return (
        <Box sx={{ width: "80%", mt: 2 }}>
            {preview ? (
                <Box display="flex" flexDirection="column" alignItems="center">
                    <Box position="relative" display="inline-block">
                        <PreviewImage src={preview} alt="preview" />
                        <IconButton
                            size="small"
                            onClick={removeFile}
                            sx={{
                                position: "absolute",
                                top: -10,
                                right: -10,
                                bgcolor: "white",
                                boxShadow: 1,
                                "&:hover": { bgcolor: "grey.100" },
                            }}
                        >
                            <DeleteIcon fontSize="small" />
                        </IconButton>
                    </Box>
                </Box>
            ) : (
                <>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        style={{ display: "none" }}
                        id="file-upload"
                    />
                    <label htmlFor="file-upload">
                        <UploadBox>
                            <CloudUploadIcon fontSize="large" color="action" />
                            <Typography variant="h6" color="textSecondary">
                                사진 첨부하기
                            </Typography>
                        </UploadBox>
                    </label>
                </>
            )}
        </Box>
    );
};

export default FileUploader;
