import React, { useEffect } from "react";
import { useFacilityDetailContext } from "../../../context/ReserveContext.jsx";
// MUI Components
import { Typography, Divider, Container } from "@mui/material";
import DetailContent from "../content/DetailContent.jsx";
import { getFacilityReviewById } from "../../../services/reserveService.js";
import Loading from "../../Global/Loading.jsx";
import CenteredContainer from "../common/CenteredContainer.jsx";
import FacilityDetail from "../detail/FacilityDetail.jsx";
import ListContent from "../content/ListContent.jsx";
import ReviewListItem from "../item/ReviewListItem.jsx";

// 예시 데이터 변환 함수

const FacilityDetailView = ({ id }) => {
    const { reviewPage, setReviewPage, reviewSize, facility, loading, error, fetchFacility } =
        useFacilityDetailContext();

    useEffect(() => {
        console.log(id);
        if (id) {
            fetchFacility(id);
        }
    }, []);

    if (loading)
        return (
            <CenteredContainer>
                <Loading />
            </CenteredContainer>
        );

    if (error)
        return (
            <CenteredContainer>
                <Typography color="error">{error}</Typography>
            </CenteredContainer>
        );

    return (
        <Container disableGutters>
            <Divider sx={{ width: "100%", mb: 3 }} />
            <DetailContent detail={facility} detailPage={FacilityDetail} />
            <ListContent
                apiFn={getFacilityReviewById}
                page={reviewPage}
                setPage={setReviewPage}
                noDataComment="이 시설의 리뷰가 없습니다."
                deps={[reviewPage, id]}
                itemComponent={ReviewListItem}
                id={id}
                size={reviewSize}
            />
        </Container>
    );
};

export default FacilityDetailView;
