import { useCallback, useState, useRef, useMemo } from "react";
import styled from "styled-components";
import { Container, Grid } from "@material-ui/core";
import html2canvas from "html2canvas";

import { ImageControlorForm } from "../components/controlor/image.jsx";
import { CheckboxField, useFormBase, SelectField, InputField } from "../components/controlor/form.jsx";
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
const Stuff = styled.div`
    ${CSS.COMMON}
    ${(props) => (!props.url ? "background-color: #FFF;" : "")};

    z-index: 2;

    left: 0;
    top: 0;

    width: 100%;
    height: 100%;

    background-image: url(${(props) => props.url});
    background-size: ${(props) => (props.imageFilledWay === "width" ? "100% auto" : "auto 100%")};
    background-position: center;
    background-repeat: no-repeat;

    border-radius: 2px;

    ${(props) => (props.mirror ? "transform: rotateY(180deg)" : "")};
`;
const AnyaBase = styled.img`
    z-index: 2;

    width: 100%;
    height: 100%;

    top: ${(props) => {
        const imgScale = props.imgScale / 100 || 1;
        const scaleTop = props.imgHeight * imgScale;
        return (props.imgHeight - scaleTop + 4) / 2;
    }}px;
    transform: scale(${(props) => props.imgScale / 100 || 1}) ${(props) => (props.mirror ? "rotateY(180deg)" : "")};
`;
const Anya = {
    Type1: styled(AnyaBase)`
        ${CSS.COMMON}
        left: 0;
        width: 100%;
    `,
    Type2: styled(AnyaBase)`
        ${CSS.COMMON}
        top: ${(props) => {
            const imgScale = props.imgScale / 100 || 1;
            const scaleTop = props.imgHeight * imgScale;
            const imgOffset = props.imgHeight * 0.235;
            return (props.imgHeight - scaleTop + 4) / 2 + imgOffset;
        }}px;
        left: 0;
    `,
    Type3: styled(AnyaBase)`
        ${CSS.COMMON}
        z-index: 2;

        width: auto;

        ${(props) => (props.mirror ? "left" : "right")}: 0;
    `,
};
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

const AnyaCustom = () => {
    const $stage = useRef();

    const [image, setImage] = useState({
        width: 700,
        height: 392,
        src: "",
        imageFilledWay: "width",
        sub: "那個",
        mirrorStuff: false,
        mirrorAnya: false,
        oliPaint: false,
        srcOliPaint: "",
        typeAnya: "1",
        scaleAnya: "100",
    });

    const { onCheck, onChange, onRegex } = useFormBase({
        setForm: setImage,
        setFormStatus: () => {},
    });
    const inputProps = {
        mirrorStuff: useMemo(() => ({ checked: image.mirrorStuff, onChange: onCheck }), [image.mirrorStuff]),
        mirrorAnya: useMemo(() => ({ checked: image.mirrorAnya, onChange: onCheck }), [image.mirrorAnya]),
        oliPaint: useMemo(() => ({ checked: image.oliPaint, onChange: onCheck }), [image.oliPaint]),
        typeAnya: useMemo(
            () => ({
                value: image.typeAnya,
                defaultValue: "1",
                onChange,
            }),
            [image.typeAnya]
        ),
        typeAnyaItems: useMemo(
            () => [
                {
                    value: "1",
                    label: "1",
                },
                {
                    value: "2",
                    label: "2",
                },
                {
                    value: "3",
                    label: "3",
                },
            ],
            []
        ),
        scaleAnya: useMemo(
            () => ({
                value: image.scaleAnya.toString(),
                placeholder: "基準 100",
                onChange,
            }),
            [image.scaleAnya]
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

    const AnyaRecent = Anya[`Type${image.typeAnya}`];
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
                                <Grid item>
                                    <SelectField
                                        showBlock
                                        fixedBottomText
                                        label="安妮亞類型"
                                        fieldKey="typeAnya"
                                        inputProps={inputProps.typeAnya}
                                        items={inputProps.typeAnyaItems}
                                    />
                                </Grid>
                                <Grid item>
                                    <InputField
                                        showBlock
                                        fixedBottomText
                                        label="安妮亞縮放 1 - 100"
                                        pattern={/^\d+(\.\d{1,})?$/}
                                        errRegexText="只能是數字或小數"
                                        onRegex={onRegex}
                                        inputProps={inputProps.scaleAnya}
                                        fieldKey="scaleAnya"
                                        emptyText={`＊正常比例為 1 倍 = 100`}
                                        required
                                    />
                                </Grid>
                            </Grid>
                        </Grid>

                        <Grid item xs={12} md="auto">
                            <Grid container direction="column">
                                <Grid item style={{ paddingTop: 35 }}>
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
                                <Grid item>
                                    <CheckboxField
                                        label="安妮亞鏡像"
                                        fieldKey="mirrorAnya"
                                        inputProps={inputProps.mirrorAnya}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                    </ImageControlorForm>
                </Grid>
                <Grid item xs={12}>
                    <Stage ref={$stage} imgWidth={image.width} imgHeight={image.height}>
                        <Stuff
                            url={image.oliPaint ? image.srcOliPaint : image.src}
                            imageFilledWay={image.imageFilledWay}
                            mirror={image.mirrorStuff}
                        />
                        <AnyaRecent
                            src={`${process.env.REACT_APP_ROUTER_BASENAME}/anya_${image.typeAnya}.png`}
                            mirror={image.mirrorAnya}
                            imgHeight={image.height}
                            imgScale={image.scaleAnya}
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

export default AnyaCustom;
