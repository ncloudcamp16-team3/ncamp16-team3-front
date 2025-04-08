import React, { useEffect, useState } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import {
    Box,
    Button,
    Card,
    FormControl,
    FormHelperText,
    Input,
    InputLabel,
    TextField,
    Typography,
} from "@mui/material";
import { MobileDateTimePicker } from "@mui/x-date-pickers";
import DaumPost from "./DaumPost.jsx";

const ScheduleFormCard = ({
    formData,
    isModify = false,
    onSubmit,
    onCancel,
    onDelete,
    onInputChange,
    onDateChange,
}) => {
    const [addressObj, setAddressObj] = useState(null);

    // 주소 선택 시 formData 업데이트
    useEffect(() => {
        if (addressObj?.address) {
            onInputChange({ target: { name: "address", value: addressObj.address } });
            if (addressObj.latitude && addressObj.longitude) {
                onInputChange({ target: { name: "latitude", value: addressObj.latitude } });
                onInputChange({ target: { name: "longitude", value: addressObj.longitude } });
            }
        }
    }, [addressObj]);

    return (
        <Card
            sx={{
                borderRadius: "32px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                position: "relative",
                display: "flex",
            }}
        >
            <Box sx={{ width: "40px", backgroundColor: "#EB5757" }} />
            <Box sx={{ flex: 1, p: 2 }}>
                <FormControl variant="standard" fullWidth sx={{ mb: 2 }}>
                    <InputLabel>제목</InputLabel>
                    <Input name="title" value={formData.title} onChange={onInputChange} />
                </FormControl>

                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <FormHelperText>일정</FormHelperText>
                    <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
                        <MobileDateTimePicker
                            label="시작일"
                            value={formData.start_date}
                            onChange={(val) => onDateChange("start_date", val)}
                            renderInput={(params) => <TextField {...params} fullWidth />}
                        />
                        <MobileDateTimePicker
                            label="종료일"
                            value={formData.end_date}
                            onChange={(val) => onDateChange("end_date", val)}
                            renderInput={(params) => <TextField {...params} fullWidth />}
                        />
                    </Box>
                </LocalizationProvider>

                <FormControl variant="standard" fullWidth sx={{ mb: 2 }}>
                    <InputLabel>장소</InputLabel>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Input name="address" value={formData.address} onChange={onInputChange} fullWidth />
                        <DaumPost setAddressObj={setAddressObj} />
                    </Box>
                </FormControl>

                <FormControl variant="standard" fullWidth sx={{ mb: 2 }}>
                    <InputLabel>내용</InputLabel>
                    <Input name="content" value={formData.content} onChange={onInputChange} />
                </FormControl>

                {/* 위도/경도 디버깅용 출력 */}
                {formData.latitude && formData.longitude && (
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="textSecondary">
                            위도: {formData.latitude}, 경도: {formData.longitude}
                        </Typography>
                    </Box>
                )}

                <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
                    <Button
                        sx={{ backgroundColor: isModify ? "#FFA500" : "#27AE60", borderRadius: "50px" }}
                        onClick={onSubmit}
                        variant="contained"
                    >
                        {isModify ? "수정" : "저장"}
                    </Button>
                    {isModify && (
                        <Button
                            sx={{ backgroundColor: "#EB5757", borderRadius: "50px" }}
                            onClick={onDelete}
                            variant="contained"
                        >
                            삭제
                        </Button>
                    )}
                    <Button
                        sx={{ backgroundColor: "#D9D9D9", borderRadius: "50px" }}
                        onClick={onCancel}
                        variant="contained"
                    >
                        취소
                    </Button>
                </Box>
            </Box>
        </Card>
    );
};

export default ScheduleFormCard;
