import React from "react";
import { Box, Chip, Typography } from "@mui/material";
import useInTimeRange from "../../../hook/Reserve/useInTimeRange.js";
import getOpenTime from "../../../hook/Reserve/getOpenTime.js";
import useTodayTimer from "../../../hook/Reserve/useTodayTimer.js";

/**
 * @param {Object} props
 * @param {string} props.openDays - 요일 간격 문자열. 예: "월–금"
 * @param {Object} props.timeRangeForWeek - 요일: 시간 형식의 객체. 예: { "월": "09:00 - 18:00", "화": null, ... }
 */

const CardContentAboutTime = ({ timeRangeForWeek }) => {
    const today = useTodayTimer();
    const openStatus = useInTimeRange(timeRangeForWeek, today);
    const openTimeInfo = getOpenTime(timeRangeForWeek, today);

    return (
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Chip
                size="small"
                label={openStatus ? "영업중" : "영업종료"}
                color={openStatus ? "success" : "default"}
                className="open-chip"
            />
            <Typography variant="body2" color="textSecondary">
                {openTimeInfo}
            </Typography>
        </Box>
    );
};

export default CardContentAboutTime;
