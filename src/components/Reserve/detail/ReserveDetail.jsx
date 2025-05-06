import React from "react";
import { Box, Button, Divider, List, ListItem, Typography } from "@mui/material";
import FacilityLocationMap from "../utils/FacilityLocationMap.jsx";
import CustomizedDot from "../utils/CustomizedDot.jsx";
import { useReserveRouteContext } from "../../../context/ReserveContext.jsx";

const ReserveDetail = ({ detail }) => {
    const { goTo } = useReserveRouteContext();
    const [facility, reserve, facilityType] = detail;

    return (
        <Box sx={{ m: 2 }}>
            <Box my={2} sx={{ cursor: "pointer" }} onClick={() => goTo("reserve/facility/detail", facility.id)}>
                <Typography variant="h5" fontWeight="bold">
                    {facility.name}
                </Typography>
            </Box>

            <FacilityLocationMap latitude={facility.latitude} longitude={facility.longitude} />

            <List>
                <ListItem>
                    <Box display="flex" flexDirection="column" gap={1} width="100%">
                        <Typography variant="body2" component="div">
                            <CustomizedDot />
                            서비스 업종: {facilityType.name}
                        </Typography>
                        <Typography variant="body2" component="div">
                            <CustomizedDot />
                            위치: {facility.address}
                        </Typography>
                        <Typography variant="body2" component="div">
                            <CustomizedDot />
                            {reserve.exitTime ? "체크인" : "예약시간"}: {reserve.entryTime}
                        </Typography>
                        {reserve.exitTime && (
                            <Typography variant="body2" component="div">
                                <CustomizedDot />
                                체크아웃: {reserve.exitTime}
                            </Typography>
                        )}
                        <Typography variant="body2" color="primary" component="div">
                            <CustomizedDot />
                            결제금액: {reserve.amount.toLocaleString()} 원
                        </Typography>
                    </Box>
                </ListItem>
            </List>
            <Divider />
            <Button
                variant="contained"
                sx={{ bgcolor: "#E9A260", borderRadius: 3, mt: 2, mb: 2 }}
                size="large"
                onClick={() => goTo("/reserve/facility/review/", facility.id)}
                fullWidth
            >
                리뷰작성
            </Button>
            <Button variant="contained" sx={{ bgcolor: "#E9A260", borderRadius: 3, mb: 1 }} size="large" fullWidth>
                예약취소
            </Button>
        </Box>
    );
};

export default ReserveDetail;
