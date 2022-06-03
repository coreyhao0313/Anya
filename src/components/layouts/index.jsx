import styled from "styled-components";
import { Container, Grid } from "@material-ui/core";

const StyledContainer = styled(Container)`
    padding-left: 0 !important;
    padding-right: 0 !important;
`;
const StyledGridBase = styled(Grid)`
    overflow: auto;
    max-height: 100vh;
`;
const StyledGridSide = styled(StyledGridBase)`
    position: sticky;
`;
const StyledGridContent = styled(StyledGridBase)`
    padding: 10vh 0;
`;

export const Layout = {
    Default: ({ sidebar, children }) => {
        return (
            <StyledContainer component="main" maxWidth={false}>
                <Grid container direction="row" wrap="nowrap">
                    <StyledGridSide item xs="auto">
                        {sidebar}
                    </StyledGridSide>
                    <StyledGridContent item xs={8} md>
                        {children}
                    </StyledGridContent>
                </Grid>
            </StyledContainer>
        );
    },
};
