import React from "react";
import { Container } from "@mui/material";

const DetailContent = ({ detail, detailPage: DetailPage, ...params }) => {
    return (
        <Container sx={{ maxWidth: 500 }}>
            <DetailPage detail={detail} />
            {params?.DetailPage2 && <DetailPage2 detail={detail} />}
        </Container>
    );
};

export default DetailContent;
