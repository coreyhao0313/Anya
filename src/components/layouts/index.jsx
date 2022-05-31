import styled from "styled-components";

const Wrapper = styled.div`
    display: flex;
    // background-image: url(/wall11.jpg);
    // background-position: center;
    // background-size: 100% auto;
    background-color: #000;
    min-height: 100vh;
`;
const Side = styled.div`
    flex-basis: 15%;
    position: sticky;
    max-height: 100vh;
    overflow: auto;
`;
const Content = styled.div`
    flex-basis: 85%;
    padding: 30px 0;
`;

export const Layout = {
    Default: ({ sidebar, children }) => {
        return (
            <Wrapper>
                <Side>{sidebar}</Side>
                <Content>{children}</Content>
            </Wrapper>
        );
    },
};
