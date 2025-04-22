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

const PreviewContainer = styled(Box)(({ theme }) => ({
    display: "flex",
    flexWrap: "wrap",
    gap: theme.spacing(1),
    marginTop: theme.spacing(2),
}));

const PreviewImage = styled("img")({
    width: 100,
    height: 100,
    objectFit: "cover",
    borderRadius: 4,
});

const FileUploader = () => {
    const [files, setFiles] = useState([]);
    const [previews, setPreviews] = useState([]);

    const handleFileChange = (event) => {
        const selectedFiles = Array.from(event.target.files);
        setFiles((prev) => [...prev, ...selectedFiles]);

        // 파일 미리보기 생성
        selectedFiles.forEach((file) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                setPreviews((prev) => [...prev, e.target.result]);
            };
            reader.readAsDataURL(file);
        });
    };

    const removeFile = (index) => {
        setFiles(files.filter((_, i) => i !== index));
        setPreviews(previews.filter((_, i) => i !== index));
    };

    return (
        <Box sx={{ width: "100%", display: "flex", flexDirection: "row", alignItems: "center" }}>
            {previews.length > 0 && (
                <PreviewContainer>
                    {previews.map((preview, index) => (
                        <Box key={index} position="relative">
                            <PreviewImage src={preview} alt={`preview-${index}`} />
                            <IconButton
                                size="small"
                                onClick={() => removeFile(index)}
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
                    ))}
                </PreviewContainer>
            )}
            <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                style={{ display: "none" }}
                id="file-upload"
            />
            <label htmlFor="file-upload" style={{ cursor: "pointer", width: "100%", height: 100 }}>
                <UploadBox
                    sx={{
                        width: "100%",
                        height: 100,
                        display: "flex",
                        flexDirection: "row",
                        gap: "3%",
                    }}
                >
                    <CloudUploadIcon fontSize="large" color="action" />
                    <Typography variant="h6" color="textSecondary">
                        사진 첨부하기
                    </Typography>
                </UploadBox>
            </label>
        </Box>
    );
};

export default FileUploader;
