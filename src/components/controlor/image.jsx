import { useEffect, useMemo, useState, useCallback, createRef } from "react";
import styled from "styled-components";
import { Grid, Button } from "@material-ui/core";
import { StylesProvider } from "@material-ui/core/styles";
import _ from "lodash";

import { InputField, useFormBase, TextareaField, SelectField } from "./form.jsx";

const StyledButton = styled(Button)`
    color: #ffe7eb !important;
    background-color: #${(props) => (props.bright ? "b96ca5" : "5d4b73")} !important;
    border-radius: 8px !important;
    text-transform: none !important;
    line-height: 1.44 !important;
    padding: 15px 20px !important;
    max-width: 120px;

    &[disabled] {
        opacity: 0.7;
    }
`;

const PATTERN = {
    NUMBER: /\d{1,5}/,
};

export const ImageUpload = ({ src, openFileSelector, onUploaded }) => {
    const [image, setImage] = useState(src);
    const $imageInput = createRef();

    useEffect(() => {
        if (openFileSelector && _.isFunction($imageInput.current.click)) {
            $imageInput.current.click();
        }
    }, [openFileSelector]);

    const onImageSelected = useCallback(async (event) => {
        const file = event.target.files[0];
        if (_.isUndefined(file)) {
            return;
        }

        /**
         * preview
         */
        const reader = new FileReader();
        reader.onload = (_event) => {
            const { result } = _event.target;
            setImage(result);
        };
        reader.readAsDataURL(file);
    }, []);

    useEffect(() => {
        if (_.isEmpty(image)) {
            return;
        }
        onUploaded(image);
    }, [image]);

    return (
        <input type="file" accept="image/*" ref={$imageInput} style={{ display: "none" }} onChange={onImageSelected} />
    );
};

export const ImageControlorForm = ({
    maxWidth = 10000,
    maxHeight = 10000,
    defaultSub = "",
    defaultWidth = 0,
    defaultHeight = 0,
    className,
    onSave,
    onFormChange,
    onUploaded,
    children,
}) => {
    const [formStatus, setFormStatus] = useState({
        error: {
            width: false,
            height: false,
        },
        regexError: {
            width: false,
            height: false,
        },
    });
    const [form, setForm] = useState({
        width: defaultWidth.toString(),
        height: defaultHeight.toString(),
        imageFilledWay: "width",
        sub: defaultSub,
    });

    const formBase = useFormBase({
        setForm,
        setFormStatus,
    });
    const { onChange, onRegex } = formBase;

    const inputProps = {
        width: useMemo(
            () => ({
                value: form.width.toString(),
                placeholder: "???",
                onChange,
            }),
            [form.width]
        ),
        height: useMemo(
            () => ({
                value: form.height.toString(),
                placeholder: "???",
                onChange,
            }),
            [form.height]
        ),
        imageFilledWay: useMemo(
            () => ({
                value: form.imageFilledWay,
                defaultValue: "width",
                onChange,
            }),
            [form.imageFilledWay]
        ),
        imageFilledWayItems: useMemo(
            () => [
                {
                    value: "width",
                    label: "??????",
                },
                {
                    value: "height",
                    label: "??????",
                },
            ],
            []
        ),
        sub: useMemo(
            () => ({
                value: form.sub,
                placeholder: "????????????",
                onChange,
            }),
            [form.sub]
        ),
    };

    const confirmState = Object.keys(formStatus.regexError).every((key) => formStatus.regexError[key] === false);

    useEffect(() => {
        if (!confirmState || form.width > maxWidth || form.height > maxHeight) {
            return;
        }
        onFormChange({
            form,
            formStatus,
            setFormStatus,
        });
    }, [form, confirmState]);

    const QWH = defaultHeight / defaultWidth;
    const expectiveHeight = Math.round(form.width * QWH);
    const expectiveWidth = Math.round(form.height / QWH);

    useEffect(() => {
        setFormStatus((state) => ({
            ...state,
            error: { ...state.error, height: form.height !== expectiveHeight.toString() },
        }));
    }, [expectiveHeight, formStatus.error.width]);
    useEffect(() => {
        setFormStatus((state) => ({
            ...state,
            error: { ...state.error, width: form.width !== expectiveWidth.toString() },
        }));
    }, [expectiveWidth, formStatus.error.height]);

    const onClick = () => {
        if (!confirmState) {
            return;
        }
        onSave({
            form,
            formStatus,
            setFormStatus,
        });
    };

    const [openFileSelector, setOpenFileSelector] = useState(0);

    const onUpload = useCallback(() => {
        setOpenFileSelector((openState) => openState + 1);
    }, []);

    return (
        <Grid container direction="row" spacing={3} className={className}>
            <Grid item xs={12} md="auto">
                <Grid container direction="column">
                    <Grid item>
                        <InputField
                            showBlock
                            fixedBottomText
                            label="??????"
                            pattern={PATTERN.NUMBER}
                            errRegexText="???????????????"
                            onRegex={onRegex}
                            hasError={formStatus.error.width}
                            errText={`?????? ?????????????????? ${expectiveWidth}`}
                            inputProps={inputProps.width}
                            fieldKey="width"
                            emptyText={`????????? ?????? ${expectiveWidth}`}
                            required
                        />
                    </Grid>
                    <Grid item>
                        <InputField
                            showBlock
                            fixedBottomText
                            label="??????"
                            pattern={PATTERN.NUMBER}
                            errRegexText="???????????????"
                            onRegex={onRegex}
                            hasError={formStatus.error.height}
                            errText={`?????? ?????????????????? ${expectiveHeight}`}
                            inputProps={inputProps.height}
                            fieldKey="height"
                            emptyText={`????????? ?????? ${expectiveHeight}`}
                            required
                        />
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12} md="auto">
                <Grid container direction="column">
                    <Grid item>
                        <SelectField
                            showBlock
                            fixedBottomText
                            emptyText="?"
                            label="???????????????"
                            fieldKey="imageFilledWay"
                            inputProps={inputProps.imageFilledWay}
                            items={inputProps.imageFilledWayItems}
                            required
                        />
                    </Grid>
                    <Grid item>
                        <TextareaField
                            showBlock
                            fixedBottomText
                            label="??????"
                            inputProps={inputProps.sub}
                            fieldKey="sub"
                        />
                    </Grid>
                </Grid>
            </Grid>
            {children}
            <Grid item xs={12} md>
                <StylesProvider injectFirst>
                    <Grid
                        container
                        spacing={3}
                        style={{ height: "100%", justifyContent: "center", textAlign: "right" }}
                    >
                        <Grid item xs={12}>
                            <StyledButton bright="??????????????????TURE ??????MUI?????????????????????" onClick={onUpload} fullWidth>
                                ??????
                            </StyledButton>
                            <ImageUpload src="" openFileSelector={openFileSelector} onUploaded={onUploaded} />
                        </Grid>
                        <Grid item xs={12}>
                            <StyledButton onClick={onClick} fullWidth>
                                ??????
                            </StyledButton>
                        </Grid>
                    </Grid>
                </StylesProvider>
            </Grid>
        </Grid>
    );
};

// export const StyledImageControlorForm = styled(ImageControlorForm)`
//     padding: 30px 0;
// `;
