/* eslint-disable no-restricted-globals */
import React, { memo, useEffect, useMemo, useCallback } from "react";
import clsx from "clsx";
import _ from "lodash";

import {
    Box,
    NoSsr,
    Grid,
    Checkbox,
    FormControlLabel,
    Select,
    MenuItem,
    TextareaAutosize,
    Radio,
    RadioGroup,
} from "@material-ui/core";

// import CheckCircleSharpIcon from "@material-ui/icons/CheckCircleSharp";
// import RadioButtonUncheckedSharpIcon from "@material-ui/icons/RadioButtonUncheckedSharp";

import styles from "./form.module.scss";

/**
 * 針對 inputProps 內的 function 加工
 */
const setInputPropsFnMiddleware = (inputProps, callback) => {
    if (_.isUndefined(inputProps)) {
        return false;
    }
    Object.keys(inputProps)
        .filter((key) => _.isFunction(inputProps[key]))
        .map((key) => {
            const originFn = inputProps[key];
            inputProps[key] = (...args) => {
                callback(args, originFn);
            };
            return null;
        });
};
/**
 * 針對 event 加工 fieldKey 屬性
 */
const setInputPropsFnForGetFieldkey = (inputProps, fieldKey) => {
    return setInputPropsFnMiddleware(inputProps, (args, originFn) => {
        args[0].target.name = fieldKey;
        originFn(...args);
    });
};
const setInputPropsFnForGetFieldkeyByProp = (inputProps, fieldKey) => {
    return setInputPropsFnMiddleware(inputProps, (args, originFn) => {
        originFn(...args, fieldKey);
    });
};

/**
 * 輸入行為狀態
 */
export const useInputHandler = ({
    fieldKey,
    inputProps,
    errText,
    hasError,
    pattern,
    errRegexText,
    onRegex,
    required,
}) => {
    /**
     * 設 null 作為不檢查之初始狀態
     * input value 值當 empty 必定將保持為空字串; 若 undefined 則不套用 value 屬性
     * inputProps2 將覆蓋 props 中 value 屬性
     */
    const value = _.get(inputProps, "value", undefined);
    const inputProps2 = { value: _.isEmpty(value) ? "" : value };
    if (_.isUndefined(value)) {
        delete inputProps2.value;
    }
    const isEmpty = useMemo(() => {
        if (required) {
            return value === "";
        }
        return false;
    }, [value, required]);

    const regexValid = useMemo(() => {
        if (pattern) {
            // 有 pattern 當非必填 及 為空值 則不 regex
            if ((!required && _.isEmpty(value)) || _.isNull(value)) {
                return null;
            }
            return pattern.test(value);
        }
        return null;
    }, [required, pattern, value]);

    const { _errText, _hasError } = useMemo(() => {
        if (_.isNull(regexValid) || hasError) {
            return { _errText: errText, _hasError: hasError };
        }
        return {
            _errText: errRegexText,
            _hasError: !regexValid,
        };
    }, [value, errRegexText, errText, hasError]);

    setInputPropsFnForGetFieldkey(inputProps, fieldKey);

    useEffect(() => {
        if (pattern && _.isFunction(onRegex)) {
            // 當非必填 及 為空值 則 true
            onRegex(fieldKey, _.isNull(regexValid) ? true : regexValid);
        }
    }, [pattern, regexValid, required]);

    return { _errText, _hasError, isEmpty, inputProps2 };
};

/**
 * 行為處理相關函式
 */
export const useFormBase = ({ setForm, setFormStatus }) => {
    /**
     * EVENTS
     */
    const onChange = useCallback((event) => {
        setForm((state) => ({
            ...state,
            [event.target.name]:
                typeof event.target.value === "string" ? event.target.value : event.target.value.toString(),
        }));
    }, []);

    const onRegex = useCallback((fieldKey, regexValid) => {
        setFormStatus((state) => ({ ...state, regexError: { ...state.regexError, [fieldKey]: !regexValid } }));
    }, []);

    const emptyChecker = useCallback((notRequiredFields = [], requiredFields = []) => {
        setForm((state) => {
            Object.keys(state)
                .filter(
                    (key) =>
                        _.isNull(state[key]) &&
                        (requiredFields.length ? requiredFields.includes(key) : !notRequiredFields.includes(key))
                )
                .map((key) => {
                    state[key] = "";
                    return key;
                });

            return { ...state };
        });
    }, []);

    const plzCheckUrField = useCallback((requiredFields = [], state, status) => {
        let wrongFieldKeys = Object.keys(state).filter((key) => _.isEmpty(state[key]) && requiredFields.includes(key));
        if (_.isObject(status) && !_.isArray(status)) {
            if (_.has(status, "error")) {
                wrongFieldKeys = wrongFieldKeys.concat(
                    Object.keys(status.error).filter((key) => status.error[key] && requiredFields.includes(key))
                );
            }
            if (_.has(status, "regexError")) {
                wrongFieldKeys = wrongFieldKeys.concat(
                    Object.keys(status.regexError).filter(
                        (key) => status.regexError[key] && requiredFields.includes(key)
                    )
                );
            }
        }
        if (wrongFieldKeys.legnth === 0) {
            return;
        }

        return wrongFieldKeys[0];
    }, []);

    const onCheck = useCallback((event) => {
        setForm((state) => ({
            ...state,
            [event.target.name]: event.target.checked,
        }));
    }, []);

    const onChangeForDatepicker = useCallback((date, value, fieldKey) => {
        setForm((state) => ({
            ...state,
            [fieldKey]: date,
        }));
    }, []);
    /*
    const onDatepickerAccept = useCallback((v, fieldKey) => {
        console.log("onDatepickerAccept");
        setFormStatus((state) => ({ ...state, error: { ...state.error, [fieldKey]: false } }));
    }, []);
    */
    const onDatepickerError = useCallback((n, date, fieldKey) => {
        // 有無錯誤都會被呼，超怪
        if (_.isNull(date)) {
            setFormStatus((state) => ({ ...state, error: { ...state.error, [fieldKey]: false } }));
            return;
        }
        const invalid = n === false;
        setFormStatus((state) => ({ ...state, error: { ...state.error, [fieldKey]: invalid } }));
    }, []);

    return {
        onChange,
        onRegex,
        emptyChecker,
        onCheck,
        onChangeForDatepicker,
        onDatepickerError,
        plzCheckUrField,
    };
};

export const Field = ({
    className,
    fieldKey,
    isEmpty,
    emptyText,
    label,
    text,
    errText,
    hasError,
    children,
    showBlock = "auto",
    fixedBottomText = false,
}) => {
    const { showLabel, showText } =
        showBlock === "auto"
            ? {
                  showLabel: !_.isEmpty(label),
                  showText: !_.isEmpty(text) || (hasError && !_.isEmpty(errText)) || (isEmpty && !_.isEmpty(emptyText)),
              }
            : { showLabel: showBlock && !_.isEmpty(label), showText: showBlock };

    return (
        <NoSsr>
            <Box id={fieldKey ? `field-${fieldKey}` : ""} className={className} py={1}>
                <Grid container className={styles.root__field} direction="column" spacing={1}>
                    {(showBlock === "auto" && (showLabel || (showText && !fixedBottomText))) || showBlock === true ? (
                        <Grid container item>
                            <Grid container direction="row" spacing={1}>
                                {showLabel ? (
                                    <Grid item className={styles.root__field__label}>
                                        {label}
                                    </Grid>
                                ) : (
                                    ""
                                )}
                                {showText && !fixedBottomText ? (
                                    <Grid
                                        item
                                        className={clsx([
                                            styles.root__field__helper,
                                            {
                                                [styles["root__field__helper--error"]]: hasError || isEmpty,
                                            },
                                        ])}
                                    >
                                        <span>{isEmpty ? emptyText : <>{hasError ? errText : text}</>}</span>
                                    </Grid>
                                ) : (
                                    ""
                                )}
                            </Grid>
                        </Grid>
                    ) : (
                        ""
                    )}

                    <Grid item container>
                        {children}
                    </Grid>

                    {showText && fixedBottomText ? (
                        <Grid item>
                            <Box
                                mt={-1}
                                className={clsx([
                                    styles.root__field__helper,
                                    {
                                        [styles["root__field__helper--error"]]: hasError || isEmpty,
                                    },
                                ])}
                            >
                                <span>{isEmpty ? emptyText : <>{hasError ? errText : text}</>}</span>
                            </Box>
                        </Grid>
                    ) : (
                        ""
                    )}
                </Grid>
            </Box>
        </NoSsr>
    );
};

export const _InputField = (props) => {
    const { className, fieldKey, showBlock, label, text, emptyText, inputProps, fixedBottomText } = props;
    const { _errText, _hasError, isEmpty, inputProps2 } = useInputHandler(props);

    return (
        <Field
            fieldKey={fieldKey}
            label={label}
            text={text}
            errText={_errText}
            hasError={_hasError}
            showBlock={showBlock}
            isEmpty={isEmpty}
            emptyText={emptyText}
            fixedBottomText={fixedBottomText}
            className={className}
        >
            <input
                className={clsx([
                    styles.root__field__input,
                    {
                        [styles["root__field__input--empty"]]: isEmpty,
                        [styles["root__field__input--error"]]: _hasError,
                    },
                ])}
                {...inputProps}
                {...inputProps2}
            />
        </Field>
    );
};
export const InputField = memo(_InputField);

export const _CheckboxField = ({ fieldKey, inputProps, label, className }) => {
    return (
        <FormControlLabel
            className={clsx([styles.root__field__controllabel, className])}
            control={<Checkbox color="default" name={fieldKey} {...inputProps} />}
            label={label}
        />
    );
};
export const CheckboxField = memo(_CheckboxField);

export const _SelectField = ({ className, label, text, inputProps, fieldKey, items, showBlock, fixedBottomText }) => {
    setInputPropsFnForGetFieldkey(inputProps, fieldKey);

    return (
        <>
            <Field
                label={label}
                text={text}
                showBlock={showBlock}
                fixedBottomText={fixedBottomText}
                className={className}
            >
                <Select className={styles.root__field__select} {...inputProps}>
                    {items.map((item, index) => (
                        <MenuItem value={item.value} key={`selectField_${fieldKey}_${index + 1}`}>
                            {item.label}
                        </MenuItem>
                    ))}
                </Select>
            </Field>
        </>
    );
};
export const SelectField = memo(_SelectField);

export const Textarea = (props) => {
    const { className, ..._props } = props;

    return <TextareaAutosize className={clsx([styles.root__field__textarea, className])} {..._props} />;
};

export const _TextareaField = (props) => {
    const { className, fieldKey, showBlock, label, text, emptyText, inputProps, fixedBottomText } = props;
    const { _errText, _hasError, isEmpty, inputProps2 } = useInputHandler(props);

    return (
        <Field
            fieldKey={fieldKey}
            label={label}
            text={text}
            errText={_errText}
            hasError={_hasError}
            showBlock={showBlock}
            isEmpty={isEmpty}
            emptyText={emptyText}
            fixedBottomText={fixedBottomText}
            className={className}
        >
            <Textarea
                className={clsx([
                    styles.root__field__input,
                    {
                        [styles["root__field__input--empty"]]: isEmpty,
                        [styles["root__field__input--error"]]: _hasError,
                    },
                ])}
                {...inputProps}
                {...inputProps2}
            />
        </Field>
    );
};
export const TextareaField = memo(_TextareaField);

// export const _RadioField = ({ fieldKey, options = [], inputProps, className, radioClassName }) => {
//     return (
//         <RadioGroup className={className} {...inputProps}>
//             {options.map((option, index) => (
//                 <FormControlLabel
//                     key={`form_radio_${fieldKey}_item_${index + 1}`}
//                     className={clsx([styles.root__field__controllabel, radioClassName])}
//                     control={
//                         <Radio
//                             color="default"
//                             name={fieldKey}
//                             icon={<RadioButtonUncheckedSharpIcon />}
//                             checkedIcon={<CheckCircleSharpIcon />}
//                         />
//                     }
//                     {...option}
//                 />
//             ))}
//         </RadioGroup>
//     );
// };
// export const RadioField = memo(_RadioField);
