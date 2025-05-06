// src/pages/ReservationListPage.jsx
import React from "react";
import { Container } from "@mui/material";
import { useReserveListContext } from "../../../context/ReserveContext.jsx";
import useTodayTimer from "../../../hook/Reserve/useTodayTimer.js";

const ReserveListView = () => {
    const { page, setPage, size } = useReserveListContext();
    const today = useTodayTimer().locale("en").format("ddd");
    return (
        <Container maxWidth="sm">
            {/*<ListContent*/}
            {/*    apiFn={getReserveList}*/}
            {/*    page={page}*/}
            {/*    setPage={setPage}*/}
            {/*    noDataComment={"에약 내역을 찾을 수 없습니다."}*/}
            {/*    deps={[page]}*/}
            {/*    enabled={true}*/}
            {/*    accumulate={true}*/}
            {/*    itemComponent={ReserveListItem}*/}
            {/*    today={today}*/}
            {/*    size={size}*/}
            {/*/>*/}
        </Container>
    );
};

export default ReserveListView;
