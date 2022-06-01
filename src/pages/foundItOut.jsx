import { useCallback, useState, useRef, useMemo } from "react";
import styled from "styled-components";
import { Container, Grid } from "@material-ui/core";
import html2canvas from "html2canvas";

import { ImageControlorForm } from "../components/controlor/image.jsx";
import { CheckboxField, useFormBase } from "../components/controlor/form.jsx";
import { image2oliPaint } from "../lib/oldPainting.js";

const CSS = {
    COMMON: `
        position: absolute;
    `,
};

const Stage = styled.div`
    position: relative;

    display: inline-block;
    width: ${(props) => props.imgWidth + "px" || "auto"};
    height: ${(props) => props.imgHeight + "px" || "auto"};
    overflow: hidden;
    background-color: #000;
`;

const Bg = styled.img`
    ${CSS.COMMON}
    z-index: 1;

    ${(props) => (props.mirror ? "transform: rotateY(180deg)" : "")};
    ${(props) => (props.invisible ? "visibility: hidden" : "")};
`;
const Stuff = styled.div`
    ${CSS.COMMON}
    ${(props) => (!props.url ? "display: none" : "")};

    z-index: 2;

    left: ${(props) => props.left + "px"};
    top: ${(props) => props.top + "px"};

    width: ${(props) => props.imgWidth + "px"};
    height: ${(props) => props.imgHeight + "px" || "auto"};

    background-image: url(${(props) => props.url});
    background-size: ${(props) => (props.imageFilledWay === "width" ? "100% auto" : "auto 100%")};
    background-position: center;
    background-repeat: no-repeat;
    background-color: #000;

    border-radius: 2px;

    ${(props) => (props.mirror ? "transform: rotateY(180deg)" : "")};
`;
const SubHw = styled.div`
    ${CSS.COMMON}
    z-index: 2;

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

const FoundItOut = () => {
    const $stage = useRef();

    const [image, setImage] = useState({
        width: 700,
        height: 392,
        src: "",
        imageFilledWay: "width",
        sub: "光溜溜, 光溜溜",
        mirrorStuff: false,
        mirrorBg: false,
        oliPaint: true,
        srcOliPaint: "",
        mouthClosedAnya: false,
    });

    const { onCheck } = useFormBase({
        setForm: setImage,
    });
    const inputProps = {
        mirrorStuff: useMemo(() => ({ checked: image.mirrorStuff, onChange: onCheck }), [image.mirrorStuff]),
        mirrorBg: useMemo(() => ({ checked: image.mirrorBg, onChange: onCheck }), [image.mirrorBg]),
        oliPaint: useMemo(() => ({ checked: image.oliPaint, onChange: onCheck }), [image.oliPaint]),
        mouthClosedAnya: useMemo(
            () => ({ checked: image.mouthClosedAnya, onChange: onCheck }),
            [image.mouthClosedAnya]
        ),
    };

    const onFormChange = useCallback(({ form }) => {
        setImage((imageState) => ({ ...imageState, ...form }));
    }, []);
    const onUploaded = useCallback((base64) => {
        setImage((imageState) => ({ ...imageState, src: base64 }));
        image2oliPaint(base64).then((canvas) => {
            setImage((imageState) => ({ ...imageState, srcOliPaint: canvas.toDataURL("image/jpeg") }));
        });
    }, []);

    const onSave = useCallback(() => {
        html2canvas($stage.current, {
            width: image.width,
            height: image.height,
            scale: 1,
        }).then((canvas) => {
            const $aLink = document.createElement("a");
            $aLink.setAttribute("href", canvas.toDataURL("image/jpeg"));
            $aLink.setAttribute("download", "anya_found_it_out.jpeg");
            $aLink.click();
        });
    }, [image]);

    return (
        <Container component="main">
            <Grid container direction="row" spacing={2}>
                <Grid item xs={12}>
                    <ImageControlorForm
                        maxWidth={1000}
                        maxHeight={562}
                        defaultWidth={700}
                        defaultHeight={393}
                        onFormChange={onFormChange}
                        onSave={onSave}
                        onUploaded={onUploaded}
                        defaultSub={image.sub}
                    >
                        {/* 額外欄位 */}

                        <Grid item xs={12} md="auto">
                            <Grid container direction="column">
                                <Grid item style={{ paddingTop: 60, paddingBottom: 16 }}>
                                    <CheckboxField
                                        label="圖鏡像"
                                        fieldKey="mirrorStuff"
                                        inputProps={inputProps.mirrorStuff}
                                    />
                                </Grid>
                                <Grid item>
                                    <CheckboxField
                                        label="圖油畫感"
                                        fieldKey="oliPaint"
                                        inputProps={inputProps.oliPaint}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>

                        <Grid item xs={12} md="auto">
                            <Grid container direction="column">
                                <Grid item style={{ paddingTop: 60, paddingBottom: 16 }}>
                                    <CheckboxField
                                        label="背景鏡像"
                                        fieldKey="mirrorBg"
                                        inputProps={inputProps.mirrorBg}
                                    />
                                </Grid>
                                <Grid item>
                                    <CheckboxField
                                        label="安妮亞閉口"
                                        fieldKey="mouthClosedAnya"
                                        inputProps={inputProps.mouthClosedAnya}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                    </ImageControlorForm>
                </Grid>
                <Grid item xs={12}>
                    <Stage ref={$stage} imgWidth={image.width} imgHeight={image.height}>
                        <Stuff
                            imgWidth={image.width * 0.499}
                            imgHeight={image.height * 0.534}
                            left={image.width * (0.161 + (image.mirrorBg ? 0.1785 : 0))}
                            top={image.height * 0.0652}
                            url={image.oliPaint ? image.srcOliPaint : image.src}
                            imageFilledWay={image.imageFilledWay}
                            mirror={image.mirrorStuff}
                        />
                        <Bg
                            width={image.width}
                            height={image.height}
                            src={`${process.env.REACT_APP_ROUTER_BASENAME}/spot2_bg${image.mouthClosedAnya ? 2 : 1}.jpg`}
                            mirror={image.mirrorBg}
                        />
                        <SubHw bottom={image.height * 0.09183} imgFontSize={image.width * 0.03428}>
                            {image.sub}
                        </SubHw>
                    </Stage>
                </Grid>
            </Grid>
        </Container>
    );
};

export default FoundItOut;
