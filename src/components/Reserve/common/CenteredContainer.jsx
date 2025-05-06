import { Container } from "@mui/material";

const CenteredContainer = ({ children }) => {
    return (
        <Container
            sx={{ height: "calc(100vh - 250px)", display: "flex", alignItems: "center", justifyContent: "center" }}
        >
            {children}
        </Container>
    );
};

export default CenteredContainer;
