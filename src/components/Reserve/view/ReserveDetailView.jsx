import React from "react";
import { useParams } from "react-router-dom";
import { Container, Typography } from "@mui/material";
import CenteredContainer from "../common/CenteredContainer.jsx";
import useApiFetch from "../../../hook/Reserve/useApiFetch.js";
import { getReserveDetailById } from "../../../services/reserveService.js";
import Loading from "../../Global/Loading.jsx";
import DetailContent from "../content/DetailContent.jsx";
import ReserveDetail from "../detail/ReserveDetail.jsx";

const ReserveDetailView = () => {
    const { id } = useParams();

    const { data, loading, error, noData } = useApiFetch({
        apiFn: getReserveDetailById,
        params: { id },
        deps: [id],
        enabled: !!id,
        accumulate: true,
    });

    if (noData)
        return (
            <CenteredContainer>
                <Typography>해당 시설을 찾을 수 없습니다.</Typography>
            </CenteredContainer>
        );

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
        <Container>
            <DetailContent detail={data} detailPage={ReserveDetail} />
        </Container>
    );
};

export default ReserveDetailView;
