import React, { useState, useRef } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import { styled } from "@mui/material/styles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";

const ContainerBox = styled(Box)(({ theme }) => ({
    width: "80%",
    marginTop: theme.spacing(2),
    border: `2px dashed ${theme.palette.grey[400]}`,
    borderRadius: theme.shape.borderRadius,
    height: 200,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    cursor: "pointer",
    position: "relative", // for absolute positioning of delete button
    "&:hover": {
        borderColor: theme.palette.primary.main,
        backgroundColor: theme.palette.action.hover,
    },
    overflow: "hidden", // Clip image if it overflows
}));

const PreviewImage = styled("img")({
    maxWidth: "100%",
    maxHeight: "100%",
    objectFit: "contain", // Maintain aspect ratio and fit within container
    borderRadius: 4,
});

const FileUploader = ({ onFileChange }) => {
    const [preview, setPreview] = useState(null);
    const [file, setFile] = useState(null);
    const fileInputRef = useRef(null);

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

    const handleClick = () => {
        fileInputRef.current.click();
    };

    return (
        <ContainerBox onClick={handleClick}>
            <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: "none" }}
                id="file-upload"
                ref={fileInputRef}
            />
            {preview ? (
                <>
                    <PreviewImage src={preview} alt="preview" />
                    <IconButton
                        size="small"
                        onClick={(event) => {
                            event.stopPropagation(); // Prevent container click
                            removeFile();
                        }}
                        sx={{
                            position: "absolute",
                            top: 8,
                            right: 8,
                            bgcolor: "white",
                            boxShadow: 1,
                            "&:hover": { bgcolor: "grey.100" },
                        }}
                    >
                        <DeleteIcon fontSize="small" />
                    </IconButton>
                </>
            ) : (
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "100%",
                        height: "100%",
                    }}
                >
                    <CloudUploadIcon fontSize="large" color="action" />
                    <Typography variant="h6" color="textSecondary">
                        사진 첨부하기
                    </Typography>
                </Box>
            )}
        </ContainerBox>
    );
};

export default FileUploader;
