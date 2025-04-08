import React, { useState, useEffect } from "react";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import FormControl from "@mui/material/FormControl";
import {
    Avatar,
    Box,
    Button,
    FormHelperText,
    InputAdornment,
    InputLabel,
    Stack,
    Typography,
    IconButton,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import ReqUi from "./ReqUi.jsx";
import Input from "@mui/material/Input";

const Step4 = ({ nextStep, handleChange, formData, prevStep }) => {
    const [previews, setPreviews] = useState([]);
    const [mainPhotoIndex, setMainPhotoIndex] = useState(0);

    useEffect(() => {
        if (formData.petPhotos && formData.petPhotos.length > 0) {
            const loadedPreviews = formData.petPhotos.map((file) =>
                typeof file === "string" ? file : URL.createObjectURL(file)
            );
            setPreviews(loadedPreviews);
        }
    }, [formData.petPhotos]);

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        const newPreviews = files.map((file) => URL.createObjectURL(file));
        const updatedPhotos = formData.petPhotos ? [...formData.petPhotos, ...files] : [...files];
        const updatedPreviews = [...previews, ...newPreviews];

        handleChange({
            target: {
                name: "petPhotos",
                value: updatedPhotos,
            },
        });

        setPreviews(updatedPreviews);
    };

    const removePhoto = (index) => {
        const updatedPhotos = [...formData.petPhotos];
        const updatedPreviews = [...previews];

        updatedPhotos.splice(index, 1);
        updatedPreviews.splice(index, 1);

        handleChange({
            target: {
                name: "petPhotos",
                value: updatedPhotos,
            },
        });

        setPreviews(updatedPreviews);

        if (mainPhotoIndex === index) {
            setMainPhotoIndex(0);
        } else if (mainPhotoIndex > index) {
            setMainPhotoIndex(mainPhotoIndex - 1);
        }
    };

    const selectMainPhoto = (index) => {
        setMainPhotoIndex(index);
    };

    const handleNext = () => {
        handleChange({
            target: {
                name: "mainPhotoIndex",
                value: mainPhotoIndex,
            },
        });
        nextStep();
    };

    return (
        <Box display="flex" flexDirection="column" alignItems="left" width="90%" mx="auto" gap={2}>
            <FormControl variant="standard" fullWidth sx={{ mb: 2 }}>
                <FormHelperText>
                    중성화 여부를 알려주세요 <ReqUi />
                </FormHelperText>
                <RadioGroup
                    row
                    id="petNeutered"
                    name="petNeutered"
                    value={formData.petNeutered}
                    onChange={handleChange}
                >
                    <FormControlLabel value="Y" control={<Radio />} label="O" />
                    <FormControlLabel value="N" control={<Radio />} label="X" />
                </RadioGroup>
            </FormControl>

            <FormControl variant="standard" fullWidth sx={{ mb: 4 }}>
                <InputLabel htmlFor="petFavorite" sx={{ mb: 4 }}>
                    좋아하는 것을 알려주세요
                </InputLabel>
                <Input
                    id="petFavorite"
                    name="petFavorite"
                    placeholder="ex) 공놀이, 산책"
                    value={formData.petFavorite}
                    onChange={handleChange}
                    startAdornment={<InputAdornment />}
                />
            </FormControl>

            <Typography variant="body1" mt={3} mb={2}>
                아이 사진등록하기
            </Typography>

            <FormHelperText sx={{ mb: 1 }}>
                첫번째 사진으로 프로필 사진이 등록됩니다 <ReqUi />
            </FormHelperText>

            <Button variant="outlined" component="label" sx={{ borderColor: "#E9A260", color: "#E9A260", mb: 2 }}>
                사진 업로드
                <input type="file" accept="image/*" hidden multiple onChange={handleFileChange} />
            </Button>

            {previews.length > 0 && (
                <Stack direction="row" spacing={2} flexWrap="wrap">
                    {previews.map((src, index) => (
                        <Box key={index} position="relative" textAlign="center">
                            <IconButton
                                size="small"
                                onClick={() => removePhoto(index)}
                                sx={{
                                    position: "absolute",
                                    top: -10,
                                    right: -10,
                                    backgroundColor: "white",
                                    zIndex: 1,
                                }}
                            >
                                <CancelIcon fontSize="small" />
                            </IconButton>

                            <IconButton
                                size="small"
                                onClick={() => selectMainPhoto(index)}
                                sx={{
                                    position: "absolute",
                                    top: -10,
                                    left: -10,
                                    backgroundColor: "white",
                                    zIndex: 1,
                                    color: index === mainPhotoIndex ? "#E9A260" : "gray",
                                }}
                            >
                                <CheckCircleIcon fontSize="small" />
                            </IconButton>

                            <Avatar
                                src={src}
                                alt={`preview-${index}`}
                                sx={{
                                    width: 80,
                                    height: 80,
                                    border: index === mainPhotoIndex ? "2px solid #E9A260" : "none",
                                }}
                                variant="rounded"
                            />
                            <Typography variant="caption">
                                {index === mainPhotoIndex ? "대표사진" : `사진 ${index + 1}`}
                            </Typography>
                        </Box>
                    ))}
                </Stack>
            )}

            <Button variant="contained" onClick={prevStep} sx={{ mt: 3, width: "100%", backgroundColor: "#E9A260" }}>
                뒤로
            </Button>

            <Button variant="contained" onClick={handleNext} sx={{ mt: 2, width: "100%", backgroundColor: "#E9A260" }}>
                다음
            </Button>
        </Box>
    );
};

export default Step4;
