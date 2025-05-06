import React from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import {
    FacilityDetailProvider,
    FacilityListProvider,
    ReserveDetailProvider,
    ReserveListProvider,
    ReserveRouteProvider,
    useReserveRouteContext,
} from "../../context/ReserveContext.jsx";
import FacilityDetailView from "../../components/Reserve/view/FacilityDetailView.jsx";
import ReserveListView from "../../components/Reserve/view/ReserveListView.jsx";
import ReserveDetailView from "../../components/Reserve/view/ReserveDetailView.jsx";
import ReserveResultView from "../../components/Reserve/view/ReserveResultView.jsx";
import ReviewInputFormView from "../../components/Reserve/view/ReviewInputFormView.jsx";
import { Container, Typography } from "@mui/material";
import TitleBar from "../../components/Global/TitleBar.jsx";
import CenteredContainer from "../../components/Reserve/common/CenteredContainer.jsx";
import { useParams } from "react-router-dom";
import FacilityListView from "../../components/Reserve/view/FacilityListView.jsx";

const Reserve = () => {
    const RenderContent = () => {
        const { path } = useReserveRouteContext();
        const id = useParams();

        if (path.startsWith("/reserve/facility/") && id)
            return (
                <FacilityDetailProvider>
                    <TitleBar name="편의시설 상세정보" />
                    <FacilityDetailView id={id} />
                </FacilityDetailProvider>
            );

        if (path.startsWith("/reserve/facility"))
            return (
                <FacilityListProvider>
                    <FacilityListView />
                </FacilityListProvider>
            );

        if (path.startsWith("/reserve/result")) {
            return <ReserveResultView id={id} />;
        }

        if (path.startsWith("/reserve/review")) {
            return (
                <>
                    <TitleBar name="리뷰 작성" />
                    <ReviewInputFormView id={id} />
                </>
            );
        }

        if (path.startsWith("/reserve")) {
            return id ? (
                <ReserveDetailProvider>
                    <TitleBar name="예약 상세" />
                    <ReserveDetailView id={id} />
                </ReserveDetailProvider>
            ) : (
                <ReserveListProvider>
                    <ReserveListView />
                </ReserveListProvider>
            );
        }

        return (
            <CenteredContainer>
                <Typography>잘못된 경로입니다.</Typography>
            </CenteredContainer>
        );
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <ReserveRouteProvider>
                <Container disableGutters sx={{ maxWidth: 500 }}>
                    <RenderContent />
                </Container>
            </ReserveRouteProvider>
        </LocalizationProvider>
    );
};

export default Reserve;
