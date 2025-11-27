import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import classNames from 'classnames';
import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
const EyeIcon = (_jsx("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", children: _jsx("path", { d: "M12 5C7 5 2.73 8.11 1 12c1.73 3.89 6 7 11 7s9.27-3.11 11-7c-1.73-3.89-6-7-11-7zm0 12a5 5 0 110-10 5 5 0 010 10z", fill: "currentColor" }) }));
const EyeSlashIcon = (_jsx("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", children: _jsx("path", { d: "M2 2l20 20M10.58 5.08A9.77 9.77 0 0112 5c5 0 9.27 3.11 11 7a14.94 14.94 0 01-4.22 5.06M4.22 6.18A14.94 14.94 0 001 12c1.73 3.89 6 7 11 7a9.86 9.86 0 004.58-1.08", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round" }) }));
const SafePassword = forwardRef(({ id, name, value, onChange, placeholder, required = false, disabled = false, isError = false, inputClassName, errorClassName, containerClassName, togglerContainerClassName, containerStyle, inputStyle, togglerContainerStyle, showToggler = true, togglerRightOffset = '1rem', paddingRightOffset = '1.5rem', hideTitle = 'Hide', showTitle = 'Show', iconShow = EyeIcon, iconHide = EyeSlashIcon, onReset, errorId, }, ref) => {
    const HIDER_CHAR = '\u2022';
    const inputRef = useRef(null);
    // states that affect rendering
    const [visible, setVisible] = useState(false);
    const [rawValue, setRawValue] = useState(value || '');
    // selection stored in a ref to avoid re-renders when selection changes
    const selectionRef = useRef(null);
    // keep external value in sync (preserve original behavior)
    useEffect(() => {
        if (value !== undefined && value !== rawValue) {
            setRawValue(value);
        }
    }, [value, rawValue]);
    // masked or raw displayed value
    const syncedValue = useMemo(() => (visible ? rawValue : HIDER_CHAR.repeat(rawValue.length)), [visible, rawValue]);
    // triggerChange: stable callback, only depends on onChange
    const triggerChange = useCallback((v) => {
        setRawValue(v);
        onChange?.(v);
    }, [onChange]);
    // set cursor position helper (no re-render)
    const setCursor = useCallback((pos) => {
        const input = inputRef.current;
        if (!input)
            return;
        try {
            input.setSelectionRange(pos, pos);
        }
        catch {
            // ignore invalid ranges silently (preserve original resilience)
        }
    }, []);
    // main onChange handler: logic preserved, optimized to avoid extra work
    const handleChange = useCallback(() => {
        const input = inputRef.current;
        if (!input)
            return;
        // early returns (same behavior)
        if (visible || input.value === '') {
            triggerChange(input.value);
            return;
        }
        const newValue = input.value;
        const oldValue = rawValue;
        const diff = newValue.length - oldValue.length;
        const selectionStart = input.selectionStart;
        // original checked `if (selectionStart)` — preserve that exact conditional behavior
        if (selectionStart != null) {
            let updated;
            if (diff > 0) {
                // insertion: take char just before cursor in the masked input (preserve behavior)
                const lastChar = newValue[selectionStart - 1];
                updated = oldValue.slice(0, selectionStart - 1) + lastChar + oldValue.slice(selectionStart - 1);
                triggerChange(updated);
            }
            else {
                // deletion / replacement cases
                const sel = selectionRef.current;
                if (sel) {
                    if (sel.start === 0 && sel.end === oldValue.length) {
                        updated = newValue;
                    }
                    else {
                        if (Math.abs(diff) !== sel.end - sel.start) {
                            updated = oldValue.slice(0, sel.start) + newValue.charAt(sel.start) + oldValue.slice(sel.end);
                        }
                        else {
                            updated = oldValue.slice(0, selectionStart) + oldValue.slice(selectionStart - diff);
                        }
                    }
                }
                else {
                    updated = oldValue.slice(0, selectionStart) + oldValue.slice(selectionStart - diff);
                }
                triggerChange(updated);
            }
            // keep cursor at same position (preserve queueMicrotask)
            queueMicrotask(() => {
                setCursor(selectionStart);
            });
        }
        return;
    }, [rawValue, triggerChange, visible, setCursor]);
    // onSelect: preserve behavior (including preventDefault), but store selection in ref to avoid re-render
    const handleSelect = useCallback((e) => {
        e.preventDefault();
        const input = inputRef.current;
        if (!input)
            return;
        const direction = input.selectionDirection;
        const start = input.selectionStart;
        const end = input.selectionEnd;
        if (start !== null && end !== null && end > start && direction && direction !== 'none') {
            selectionRef.current = { start, end, direction };
            return;
        }
        selectionRef.current = null;
    }, []);
    // paste handler: same behavior, replace selection with pasted text
    const handlePaste = useCallback((e) => {
        e.preventDefault();
        const input = inputRef.current;
        if (!input)
            return;
        const pastedText = e.clipboardData.getData('text');
        const start = input.selectionStart ?? rawValue.length;
        const end = input.selectionEnd ?? rawValue.length;
        const updated = rawValue.slice(0, start) + pastedText + rawValue.slice(end);
        triggerChange(updated);
        queueMicrotask(() => {
            setCursor(start + pastedText.length);
        });
    }, [rawValue, triggerChange, setCursor]);
    // prevent copy/cut default behavior handlers (stable)
    const handleCopy = useCallback((e) => {
        e.preventDefault();
    }, []);
    const handleCut = useCallback((e) => {
        e.preventDefault();
    }, []);
    const toggleShow = useCallback(() => setVisible((p) => !p), []);
    const reset = useCallback(() => {
        if (onReset) {
            onReset();
            return;
        }
        setVisible(false);
        triggerChange('');
    }, [onReset, triggerChange]);
    useImperativeHandle(ref, () => ({ reset }), [reset]);
    // memoize styles so their identity is stable across renders
    const mergedInputStyle = useMemo(() => ({
        paddingRight: showToggler ? `calc(${togglerRightOffset} + ${paddingRightOffset})` : undefined,
        ...inputStyle,
    }), [inputStyle, showToggler, togglerRightOffset, paddingRightOffset]);
    const mergedContainerStyle = useMemo(() => ({
        position: 'relative',
        backgroundColor: 'transparent',
        border: 'none',
        outline: 'none',
        margin: '0',
        padding: '0',
        ...containerStyle,
    }), [containerStyle]);
    const mergedTogglerStyle = useMemo(() => ({
        position: 'absolute',
        backgroundColor: 'transparent',
        border: 'none',
        margin: 0,
        padding: 0,
        top: '50%',
        transform: 'translateY(-50%)',
        cursor: 'pointer',
        userSelect: 'none',
        zIndex: 10,
        right: togglerRightOffset,
        ...togglerContainerStyle,
    }), [togglerContainerStyle, togglerRightOffset]);
    return (_jsxs("div", { className: classNames('react-safe-password-container', containerClassName), style: mergedContainerStyle, children: [_jsx("input", { type: "text", autoComplete: "off", spellCheck: false, onCopy: handleCopy, onCut: handleCut, ref: inputRef, id: id, name: name, value: syncedValue, onChange: handleChange, onPaste: handlePaste, onSelect: handleSelect, placeholder: placeholder, required: required, disabled: disabled, className: classNames('react-safe-password-input', inputClassName, isError && errorClassName), style: mergedInputStyle, "aria-invalid": isError, "aria-describedby": isError && errorId ? errorId : undefined }), showToggler && !!rawValue && (_jsx("div", { className: classNames('react-safe-password-toggler-container', togglerContainerClassName), style: mergedTogglerStyle, onClick: toggleShow, onKeyDown: (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        toggleShow();
                    }
                }, role: "button", tabIndex: 0, "aria-label": visible ? hideTitle : showTitle, "aria-pressed": visible, "aria-live": "polite", children: visible ? iconHide : iconShow }))] }));
});
export default SafePassword;
