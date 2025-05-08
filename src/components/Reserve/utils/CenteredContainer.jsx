import React from "react";
import { Container } from "@mui/material";

const CenteredContainer = ({ children }) => {
    return (
        <Container
            sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            {children}
        </Container>
    );
};

export default CenteredContainer;
