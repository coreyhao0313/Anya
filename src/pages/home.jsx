import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { Grid, Hidden } from "@material-ui/core";
import html2canvas from "html2canvas";

const StyledGridBg = styled(Grid)`
    position: relative;

    height: 100vh;
    margin: -10vh 0;

    &::after {
        position: absolute;
        z-index: 1;
        content: " ";
        display: block;

        background-image: url(${process.env.REACT_APP_ROUTER_BASENAME}/anya_3.png);
        background-position: left bottom;
        background-repeat: no-repeat;
        background-size: 400px auto;

        width: 100%;
        height: 100%;
    }
`;
const StyledGridItem = styled(Grid)`
    position: relative;
    z-index: 2;
    display: flex;
    flex-direction: column;
    justify-content: center;
    word-break: break-all;
`;
const Block = styled.div`
    font-size: 1.5em;
    color: #fff;
    background-color: rgba(255, 255, 255, 0.5);
    backdrop-filter: blur(2px);

    line-height: 1.44em;

    border-radius: 8px;
    padding: 2vw;

    > p {
        margin: 0.5em;
    }
`;
const SubHw = styled.div`
    ${CSS.COMMON}

    font-size: 2.5em;
    font-family: sans-serif;
    font-weight: bold;
    color: white;
    -webkit-text-stroke: 0.03em black;
    text-shadow: 0.04em 0.04em 0.04em rgba(0, 0, 0, 0.4);
    text-align: center;
`;
const Home = () => {
    const $stageTest = useRef();
    const [testResult, setTestResult] = useState(null);

    useEffect(() => {
        html2canvas($stageTest.current, {
            width: 100,
            height: 100,
            scale: 1,
        }).then((canvas) => {
            try {
                setTestResult(!!canvas.toDataURL("image/jpeg").length);
            } catch (err) {
                setTestResult(false);
            }
        });
    }, []);

    return (
        <StyledGridBg container direction="row">
            <Grid item md={2} implementation="css" component={Hidden} />
            <StyledGridItem item xs={12} md={8}>
                <Block>
                    <p>
                        ??????????????????????????????????????????
                        <br />
                        ?????????????????????????????????
                    </p>
                    <p>
                        ?????????????????????
                        <br />
                        https://forum.gamer.com.tw/C.php?bsn=60076&snA=7039277
                    </p>
                    <p>??????????????????????????? ??????????????????????????????????????????</p>
                    <br />
                    <p ref={$stageTest} style={{textAlign: "center"}}>
                        ?????????????????????<u>?????????</u><br />
                        {testResult === null ? (
                            ""
                        ) : (
                            <>
                                ??????????????????
                                <span style={{ color: testResult ? "#0F0" : "#F00" }}>
                                    {testResult ? "??????" : "???"}??????
                                </span>
                                ????????????
                            </>
                        )}
                    </p>
                </Block>
            </StyledGridItem>
            <StyledGridItem item xs={12}>
                <SubHw>?????????????????????</SubHw>
            </StyledGridItem>
        </StyledGridBg>
    );
};

export default Home;
