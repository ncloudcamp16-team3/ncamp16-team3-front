import React, { useEffect, useState } from "react";
import { Container, Typography, Button } from "@mui/material";
import Loading from "../../Global/Loading.jsx";
import useApiFetch from "../../../hook/Reserve/useApiFetch.js";
import useInfiniteScroll from "../../../hook/Reserve/useInfiniteScroll.js";
import CenteredContainer from "../common/CenteredContainer.jsx";

const ListContent = ({
    apiFn,
    params = {},
    deps = [],
    isList = true,
    noDataComment = "결과가 없습니다.",
    itemComponent: ItemComponent,
}) => {
    const [isLast, setIsLast] = useState(false);
    const [legacy, setLegacy] = useState([]);
    const [beforePage, setBeforePage] = useState(0);

    useInfiniteScroll(isLast, params.setPage);

    const { data, loading, error, last, noData } = useApiFetch({
        apiFn,
        params,
        deps: [deps],
    });

    useEffect(() => {
        if (data && data.length > 0) {
            if (isList) {
                if (params.page - beforePage === 1) {
                    setLegacy((prev) => [...prev, ...data]);
                } else {
                    setLegacy(data);
                }
                setBeforePage(params.page);
            } else {
                setLegacy(data);
            }
        }
    }, [data]);

    // last 상태 변경 감지
    useEffect(() => {
        if (last) setIsLast(true);
        console.log("ListContent - 마지막 페이지 감지");
    }, [last]);

    console.log("ListContent 응답 데이터: " + data.length + " 개");

    if (noData)
        return (
            <CenteredContainer>
                <Typography>{noDataComment}</Typography>
            </CenteredContainer>
        );

    if (loading && (!data || data.length === 0)) {
        return (
            <CenteredContainer>
                <Loading />
            </CenteredContainer>
        );
    }

    if (error) {
        return (
            <CenteredContainer>
                <Typography color="error">{error}</Typography>
                <Button variant="contained" sx={{ mt: 2 }} onClick={() => params.setPage(0)}>
                    다시 시도
                </Button>
            </CenteredContainer>
        );
    }

    return (
        <Container disableGutters sx={{ paddingTop: "160px" }}>
            {legacy && legacy.map((item) => <ItemComponent key={item.id} item={item} />)}

            {loading && data && data.length > 0 && <Loading />}

            {isLast && data && data.length > 0 && (
                <Typography variant="body2" color="textSecondary" sx={{ my: 2 }}>
                    마지막 항목입니다
                </Typography>
            )}
        </Container>
    );
};

export default ListContent;
