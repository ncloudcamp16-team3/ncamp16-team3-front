import React from "react";
import { Box, Card, CardMedia, Divider, Typography, Container } from "@mui/material";
import { useFacilityDetailContext } from "../../../context/ReserveContext.jsx";
import CardContentAboutTime from "../utils/CardContentAboutTime.jsx";
import FacilityLocationMap from "../utils/FacilityLocationMap.jsx";
import TimetablePopover from "../utils/TimetablePopover.jsx";

const FacilityDetail = ({ detail }) => {
    const { isMapOpen, setIsMapOpen } = useFacilityDetailContext();
    const [timetables] = detail;
    console.log(detail);

    return (
        <Container>
            {/* 상단 이미지 */}
            <Card sx={{ mb: 2, width: "100%" }}>
                <CardMedia component="img" height="300" image={detail.thumbnail} alt={detail.name} />
            </Card>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography variant="h4" gutterBottom>
                    {detail.name}
                </Typography>
                <TimetablePopover
                    timetables={timetables}
                    children={CardContentAboutTime}
                    openTimeRange={detail.openTimeRange}
                    isOpened={true}
                />
            </Box>
            {/* 기본 정보 */}
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="body1" color="text.secondary" gutterBottom>
                    ・ {detail.address}
                </Typography>
                <Typography
                    onClick={() => setIsMapOpen(!isMapOpen)}
                    role="button"
                    tabIndex={0}
                    sx={{
                        cursor: "pointer",
                        color: "primary.main",
                        fontWeight: 500,
                        userSelect: "none",
                    }}
                >
                    {isMapOpen ? "지도접기 ▲" : "지도열기 ▼"}
                </Typography>
            </Box>
            <Divider />
            {/* 지도 */}
            {isMapOpen && (
                <Box sx={{ my: 2 }}>
                    <FacilityLocationMap latitude={detail.latitude} longitude={detail.longitude} />
                    <Divider />
                </Box>
            )}
            ;
        </Container>
    );
};

export default FacilityDetail;
