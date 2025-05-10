import React from "react";
import { Paper, Typography } from "@mui/material";
import { useRegister } from "/src/components/User/RegisterContext.jsx";

const DebugInfo = ({ debugInfo }) => {
    const { snsAccountId, nickname, snsTypeId, formData, mainPhotoIndex } = useRegister();

    return (
        <Paper elevation={3} sx={{ p: 2, mt: 4, backgroundColor: "#f5f5f5" }}>
            <Typography variant="subtitle2" fontWeight="bold">
                디버깅 정보
            </Typography>
            <Typography variant="body2">이메일: {snsAccountId || "없음"}</Typography>
            <Typography variant="body2">닉네임: {nickname || "없음"}</Typography>
            <Typography variant="body2">
                SNS 타입 ID: {snsTypeId || "없음"} (타입: {typeof snsTypeId})
            </Typography>
            <Typography variant="body2">반려동물 이름: {formData.petName || "없음"}</Typography>
            <Typography variant="body2">반려동물 종류: {formData.petTypeId || "없음"}</Typography>
            <Typography variant="body2">반려동물 성별: {formData.petGender || "없음"}</Typography>
            <Typography variant="body2">반려동물 생일: {formData.petBirth || "없음"}</Typography>
            <Typography variant="body2">반려동물 몸무게: {formData.petWeight || "없음"}</Typography>
            <Typography variant="body2">반려동물 소개: {formData.petInfo || "없음"}</Typography>
            <Typography variant="body2">
                중성화 여부: {formData.petNeutered !== undefined ? (formData.petNeutered ? "네" : "아니오") : "없음"}
            </Typography>
            <Typography variant="body2">사진 개수: {formData.petPhotos ? formData.petPhotos.length : 0}</Typography>
            <Typography variant="body2">대표 사진 인덱스: {mainPhotoIndex}</Typography>
            <Typography variant="body2" sx={{ mt: 1, fontWeight: "bold" }}>
                URL 파라미터:
            </Typography>
            <pre style={{ fontSize: "0.8rem", overflow: "auto", maxHeight: "100px" }}>
                {JSON.stringify(debugInfo, null, 2)}
            </pre>
        </Paper>
    );
};

export default DebugInfo;
