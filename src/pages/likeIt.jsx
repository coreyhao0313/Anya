import { useCallback, useState, useRef, useMemo } from "react";
import styled from "styled-components";
import { Container, Grid } from "@material-ui/core";
import html2canvas from "html2canvas";

import { ImageControlorForm } from "../components/controlor/image.jsx";
import { CheckboxField, useFormBase } from "../components/controlor/form.jsx";

const CSS = {
    COMMON: `
        position: absolute;
    `,
};
const StyledGridWrapperForStage = styled(Grid)`
    overflow-x: auto;
`;
const Stage = styled.div`
    position: relative;

    display: inline-block;
    width: ${(props) => props.imgWidth + "px" || "auto"};
    height: ${(props) => props.imgHeight + "px" || "auto"};
    overflow: hidden;
    background-color: #000;
`;
const Stuff = styled.div`
    ${CSS.COMMON}
    z-index: 1;
    ${(props) => (!props.url ? "display: none" : "")};

    left: ${(props) => props.left + "px"};
    top: ${(props) => props.top + "px"};

    width: ${(props) => props.imgWidth + "px"};
    height: ${(props) => props.imgHeight + "px" || "auto"};

    background-image: url(${(props) => props.url});
    background-size: ${(props) => (props.imageFilledWay === "width" ? "100% auto" : "auto 100%")};
    background-position: center;
    background-repeat: no-repeat;

    ${(props) => (props.mirror ? "transform: rotateY(180deg)" : "")};
`;

const Bg = styled.img`
    ${CSS.COMMON}
    z-index: 2;

    ${(props) => (props.mirror ? "transform: rotateY(180deg)" : "")};
    ${(props) => (props.invisible ? "visibility: hidden" : "")};
`;
const Anya = styled.img`
    ${CSS.COMMON}
    left: 0;
    z-index: 3;

    ${(props) => (props.mirror ? "transform: rotateY(180deg)" : "")};
    ${(props) => (props.invisible ? "visibility: hidden" : "")};
`;
const SubHw = styled.div`
    ${CSS.COMMON}
    z-index: 4;

    left: 50%;
    transform: translateX(-50%);
    bottom: ${(props) => props.bottom + "px"};

    font-size: ${(props) => props.imgFontSize + "px"};
    font-family: sans-serif;
    font-weight: bold;
    color: white;
    -webkit-text-stroke: 0.03em black;
    text-shadow: 0.04em 0.04em 0.04em rgba(0, 0, 0, 0.4);
`;

const LikeIt = () => {
    const $stage = useRef();

    const [image, setImage] = useState({
        width: 700,
        height: 392,
        src: "",
        imageFilledWay: "width",
        sub: "安妮亞喜歡這個",
        mirrorStuff: false,
        mirrorAnya: false,
        mirrorBg: false,
        invisibleAnya: false,
        invisibleBg: false,
        fullStuff: false,
    });

    const { onCheck } = useFormBase({
        setForm: setImage,
    });
    const inputProps = {
        mirrorStuff: useMemo(() => ({ checked: image.mirrorStuff, onChange: onCheck }), [image.mirrorStuff]),
        mirrorAnya: useMemo(() => ({ checked: image.mirrorAnya, onChange: onCheck }), [image.mirrorAnya]),
        mirrorBg: useMemo(() => ({ checked: image.mirrorBg, onChange: onCheck }), [image.mirrorBg]),
        invisibleAnya: useMemo(() => ({ checked: image.invisibleAnya, onChange: onCheck }), [image.invisibleAnya]),
        invisibleBg: useMemo(() => ({ checked: image.invisibleBg, onChange: onCheck }), [image.invisibleBg]),
        fullStuff: useMemo(() => ({ checked: image.fullStuff, onChange: onCheck }), [image.fullStuff]),
    };

    const onFormChange = useCallback(({ form }) => {
        setImage((imageState) => ({ ...imageState, ...form }));
    }, []);
    const onUploaded = useCallback((base64) => {
        setImage((imageState) => ({ ...imageState, src: base64 }));
    }, []);

    const onSave = useCallback(() => {
        html2canvas($stage.current, {
            width: image.width,
            height: image.height,
            scale: 1,
        }).then((canvas) => {
            const $aLink = document.createElement("a");
            $aLink.setAttribute("href", canvas.toDataURL("image/jpeg"));
            $aLink.setAttribute("download", "anya_like_it.jpeg");
            $aLink.click();
        });
    }, [image]);

    return (
        <Container component="main">
            <Grid container direction="row" spacing={2}>
                <Grid item xs={12}>
                    <ImageControlorForm
                        maxWidth={1000}
                        maxHeight={560}
                        defaultWidth={700}
                        defaultHeight={392}
                        onFormChange={onFormChange}
                        onSave={onSave}
                        onUploaded={onUploaded}
                        defaultSub={image.sub}
                    >
                        {/* 額外欄位 */}

                        <Grid item xs="auto">
                            <Grid container direction="column" style={{ height: "100%", justifyContent: "center" }}>
                                <Grid item>
                                    <CheckboxField
                                        label="自訂圖鏡像"
                                        fieldKey="mirrorStuff"
                                        inputProps={inputProps.mirrorStuff}
                                    />
                                </Grid>
                                <Grid item>
                                    <CheckboxField
                                        label="自訂圖填滿"
                                        fieldKey="fullStuff"
                                        inputProps={inputProps.fullStuff}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>

                        <Grid item xs="auto">
                            <Grid container direction="column" style={{ height: "100%", justifyContent: "center" }}>
                                <Grid item>
                                    <CheckboxField
                                        label="安妮亞鏡像"
                                        fieldKey="mirrorAnya"
                                        inputProps={inputProps.mirrorAnya}
                                    />
                                </Grid>
                                <Grid item>
                                    <CheckboxField
                                        label="安妮亞消失"
                                        fieldKey="invisibleAnya"
                                        inputProps={inputProps.invisibleAnya}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>

                        <Grid item xs="auto">
                            <Grid container direction="column" style={{ height: "100%", justifyContent: "center" }}>
                                <Grid item>
                                    <CheckboxField
                                        label="背景鏡像"
                                        fieldKey="mirrorBg"
                                        inputProps={inputProps.mirrorBg}
                                    />
                                </Grid>
                                <Grid item>
                                    <CheckboxField
                                        label="背景消失"
                                        fieldKey="invisibleBg"
                                        inputProps={inputProps.invisibleBg}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                    </ImageControlorForm>
                </Grid>
                <StyledGridWrapperForStage item xs={12}>
                    <Stage ref={$stage} imgWidth={image.width} imgHeight={image.height}>
                        <Stuff
                            {...(image.fullStuff
                                ? { imgWidth: image.width, imgHeight: image.height, left: 0, top: 0 }
                                : {
                                      imgWidth: image.width * 0.345,
                                      imgHeight: image.height * 0.473,
                                      left:
                                          image.width * (0.308 + (image.mirrorBg && !image.invisibleBg ? 0.041428 : 0)),
                                      top: image.height * 0.141,
                                  })}
                            url={image.src}
                            imageFilledWay={image.imageFilledWay}
                            mirror={image.mirrorStuff}
                        />
                        <Bg
                            width={image.width}
                            height={image.height}
                            src={`${process.env.REACT_APP_ROUTER_BASENAME}/spot1_bg.png`}
                            mirror={image.mirrorBg}
                            invisible={image.invisibleBg}
                        />
                        <Anya
                            width={image.width}
                            height={image.height}
                            src={`${process.env.REACT_APP_ROUTER_BASENAME}/anya_1.png`}
                            mirror={image.mirrorAnya}
                            invisible={image.invisibleAnya}
                        />
                        <SubHw bottom={image.height * 0.09183} imgFontSize={image.width * 0.03428}>
                            {image.sub}
                        </SubHw>
                    </Stage>
                </StyledGridWrapperForStage>
            </Grid>
        </Container>
    );
};

export default LikeIt;
