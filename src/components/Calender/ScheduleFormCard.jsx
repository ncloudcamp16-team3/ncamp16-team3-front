import React, { useEffect, useState } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Box, Button, Card, FormControl, FormHelperText, Input, InputLabel, Modal } from "@mui/material";
import { MobileDateTimePicker } from "@mui/x-date-pickers";
import DaumPost2 from "./DaumPost2.jsx";
import DaumPost from "./DaumPost.jsx";

const ScheduleFormCard = ({
    formData,
    setFormData,
    isModify = false,
    onSubmit,
    onCancel,
    onDelete,
    onInputChange,
    onDateChange,
}) => {
    const [addressObj, setAddressObj] = useState(null);

    const [openMapModal, setOpenMapModal] = useState(false);

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
        <>
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
                    <FormControl variant="standard" fullWidth sx={{ mb: 1.5 }}>
                        <InputLabel>제목</InputLabel>
                        <Box sx={{ mt: 1 }}>
                            <Input
                                name="title"
                                value={formData.title}
                                onChange={onInputChange}
                                fullWidth
                                sx={{ height: 36 }}
                            />
                        </Box>
                    </FormControl>

                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <FormHelperText sx={{ mb: 0.5 }}>일정</FormHelperText>
                        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1, mt: 1 }}>
                            <MobileDateTimePicker
                                label="시작일"
                                value={formData.startDate}
                                onChange={(val) => onDateChange("startDate", val)}
                                slotProps={{ textField: { fullWidth: true, size: "small" } }}
                            />
                            <MobileDateTimePicker
                                label="종료일"
                                value={formData.endDate}
                                onChange={(val) => onDateChange("endDate", val)}
                                slotProps={{ textField: { fullWidth: true, size: "small" } }}
                            />
                        </Box>
                    </LocalizationProvider>

                    {/*<FormControl variant="standard" fullWidth sx={{ mt: 1, mb: 0.5 }}>*/}
                    {/*    <InputLabel>장소</InputLabel>*/}
                    {/*    <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1, mt: 1 }}>*/}
                    {/*        <Input*/}
                    {/*            name="address"*/}
                    {/*            value={formData.address}*/}
                    {/*            onChange={onInputChange}*/}
                    {/*            fullWidth*/}
                    {/*            sx={{ height: 36 }}*/}
                    {/*        />*/}
                    {/*        <DaumPost setAddressObj={setAddressObj} />*/}
                    {/*    </Box>*/}
                    {/*</FormControl>*/}

                    <FormControl variant="standard" fullWidth sx={{ mt: 1, mb: 0.5 }}>
                        <InputLabel>장소</InputLabel>
                        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1, mt: 1 }}>
                            <Input
                                name="address"
                                value={formData.address}
                                onChange={onInputChange}
                                disabled
                                fullWidth
                                sx={{ height: 36 }}
                            />
                            <DaumPost setAddressObj={setAddressObj} />
                            <Button variant="outlined" onClick={() => setOpenMapModal(true)}>
                                지도
                            </Button>
                        </Box>
                    </FormControl>

                    <FormControl variant="standard" fullWidth sx={{ mb: 1.5 }}>
                        <InputLabel>내용</InputLabel>
                        <Box sx={{ mt: 1 }}>
                            <Input
                                name="content"
                                value={formData.content}
                                onChange={onInputChange}
                                fullWidth
                                sx={{ height: 36 }}
                            />
                        </Box>
                    </FormControl>

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

            <Modal open={openMapModal} onClose={() => setOpenMapModal(false)}>
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: "90%",
                        maxWidth: 600,
                        bgcolor: "background.paper",
                        borderRadius: 2,
                        boxShadow: 24,
                        p: 2,
                    }}
                >
                    <DaumPost2
                        address={formData.address}
                        setAddress={(addr) => setFormData((prev) => ({ ...prev, address: addr }))}
                        setLatitude={(lat) => setFormData((prev) => ({ ...prev, latitude: lat }))}
                        setLongitude={(lng) => setFormData((prev) => ({ ...prev, longitude: lng }))}
                    />
                    <Box textAlign="right" mt={2}>
                        <Button variant="contained" onClick={() => setOpenMapModal(false)}>
                            닫기
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </>
    );
};

export default ScheduleFormCard;
