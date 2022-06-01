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

    left: ${(props) => props.left + "px"};
    top: ${(props) => props.top + "px"};

    width: ${(props) => props.imgWidth + "px"};
    height: ${(props) => props.imgHeight + "px" || "auto"};

    background-image: url(${(props) => props.url});
    background-size: ${(props) => (props.imageFilledWay === "width" ? "100% auto" : "auto 100%")};
    background-position: center;
    background-repeat: no-repeat;
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
    -webkit-text-stroke: 0.02em black;
    text-shadow: 0.04em 0.04em 0.04em rgba(0, 0, 0, 0.4);
`;

const Naked = () => {
    const $stage = useRef();

    const [image, setImage] = useState({
        width: 700,
        height: 392,
        src: "",
        imageFilledWay: "width",
        sub: "安妮亞喜歡這個",
        mirror_anya: false,
        mirror_bg: false,
        invisible_anya: false,
        invisible_bg: false,
    });

    const { onCheck } = useFormBase({
        setForm: setImage,
    });
    const inputProps = {
        mirror_anya: useMemo(() => ({ checked: image.mirror_anya, onChange: onCheck }), [image.mirror_anya]),
        mirror_bg: useMemo(() => ({ checked: image.mirror_bg, onChange: onCheck }), [image.mirror_bg]),
        invisible_anya: useMemo(() => ({ checked: image.invisible_anya, onChange: onCheck }), [image.invisible_anya]),
        invisible_bg: useMemo(() => ({ checked: image.invisible_bg, onChange: onCheck }), [image.invisible_bg]),
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

                        <Grid item xs={12} md="auto">
                            <Grid container direction="column">
                                <Grid item style={{ paddingTop: 60, paddingBottom: 16 }}>
                                    <CheckboxField
                                        label="安妮亞鏡像"
                                        fieldKey="mirror_anya"
                                        inputProps={inputProps.mirror_anya}
                                    />
                                </Grid>
                                <Grid item>
                                    <CheckboxField
                                        label="背景鏡像"
                                        fieldKey="mirror_bg"
                                        inputProps={inputProps.mirror_bg}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>

                        <Grid item xs={12} md="auto">
                            <Grid container direction="column">
                                <Grid item style={{ paddingTop: 60, paddingBottom: 16 }}>
                                    <CheckboxField
                                        label="安妮亞消失"
                                        fieldKey="invisible_anya"
                                        inputProps={inputProps.invisible_anya}
                                    />
                                </Grid>
                                <Grid item>
                                    <CheckboxField
                                        label="背景消失"
                                        fieldKey="invisible_bg"
                                        inputProps={inputProps.invisible_bg}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                    </ImageControlorForm>
                </Grid>
                <Grid item xs={12}>
                    <Stage ref={$stage} imgWidth={image.width} imgHeight={image.height}>
                        <Stuff
                            imgWidth={image.width * 0.345}
                            imgHeight={image.height * 0.473}
                            left={image.width * (0.308 + (image.mirror_bg && !image.invisible_bg ? 0.041428 : 0))}
                            top={image.height * 0.141}
                            url={image.src}
                            imageFilledWay={image.imageFilledWay}
                        />
                        <Bg
                            width={image.width}
                            height={image.height}
                            src="/material_1/bg.png"
                            mirror={image.mirror_bg}
                            invisible={image.invisible_bg}
                        />
                        <Anya
                            width={image.width}
                            height={image.height}
                            src="/material_1/anya.png"
                            mirror={image.mirror_anya}
                            invisible={image.invisible_anya}
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

export default Naked;
