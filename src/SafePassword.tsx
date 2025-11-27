import classNames from 'classnames';
import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';

const EyeIcon = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path
      d="M12 5C7 5 2.73 8.11 1 12c1.73 3.89 6 7 11 7s9.27-3.11 11-7c-1.73-3.89-6-7-11-7zm0 12a5 5 0 110-10 5 5 0 010 10z"
      fill="currentColor"
    />
  </svg>
);

const EyeSlashIcon = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path
      d="M2 2l20 20M10.58 5.08A9.77 9.77 0 0112 5c5 0 9.27 3.11 11 7a14.94 14.94 0 01-4.22 5.06M4.22 6.18A14.94 14.94 0 001 12c1.73 3.89 6 7 11 7a9.86 9.86 0 004.58-1.08"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

export interface SafePasswordHandle {
  reset: () => void;
}

interface SafePasswordProps {
  /** Unique identifier for the input. Used for linking labels and accessibility */
  id: string;
  /** Name of the input, used in forms */
  name: string;
  /** Controlled value of the password input */
  value?: string;
  /** Callback triggered whenever the value changes */
  onChange?: (value: string) => void;
  /** Placeholder text displayed when the input is empty */
  placeholder?: string;
  /** Marks the input as required for form submission */
  required?: boolean;
  /** Disables the input if true */
  disabled?: boolean;
  /** Indicates visually that the input has an error */
  isError?: boolean;
  /** Shows or hides the toggle button to show/hide the password */
  showToggler?: boolean;
  /** Right offset for the toggler button (e.g., "1rem"). Only used if `showToggler` is true */
  togglerRightOffset?: string;
  /** Right padding of the input to make space for the toggler (e.g., "1.5rem") */
  paddingRightOffset?: string;
  /** Additional CSS classes for the input */
  inputClassName?: string;
  /** Additional CSS classes for the input when in error state */
  errorClassName?: string;
  /** Additional CSS classes for the outer container */
  containerClassName?: string;
  /** Additional CSS classes for the toggler container */
  togglerContainerClassName?: string;
  /** Inline styles applied to the outer container */
  containerStyle?: React.CSSProperties;
  /** Inline styles applied to the input */
  inputStyle?: React.CSSProperties;
  /** Inline styles applied to the toggler container */
  togglerContainerStyle?: React.CSSProperties;
  /** Label for the toggler when hiding the password (default: "Hide") */
  hideTitle?: string;
  /** Label for the toggler when showing the password (default: "Show") */
  showTitle?: string;
  /** Custom icon displayed when password is hidden */
  iconShow?: React.ReactNode;
  /** Custom icon displayed when password is visible */
  iconHide?: React.ReactNode;
  /** Callback invoked when the input is reset */
  onReset?: () => void;
  /** ID of the element describing the error for accessibility */
  errorId?: string;
}

interface Selection {
  start: number;
  end: number;
  direction: 'forward' | 'backward' | 'none';
}

const SafePassword = forwardRef<SafePasswordHandle, SafePasswordProps>(
  (
    {
      id,
      name,
      value,
      onChange,
      placeholder,
      required = false,
      disabled = false,
      isError = false,
      inputClassName,
      errorClassName,
      containerClassName,
      togglerContainerClassName,
      containerStyle,
      inputStyle,
      togglerContainerStyle,
      showToggler = true,
      togglerRightOffset = '1rem',
      paddingRightOffset = '1.5rem',
      hideTitle = 'Hide',
      showTitle = 'Show',
      iconShow = EyeIcon,
      iconHide = EyeSlashIcon,
      onReset,
      errorId,
    },
    ref,
  ) => {
    const HIDER_CHAR = '\u2022';

    const inputRef = useRef<HTMLInputElement | null>(null);

    // states that affect rendering
    const [visible, setVisible] = useState<boolean>(false);
    const [rawValue, setRawValue] = useState<string>(value || '');

    // selection stored in a ref to avoid re-renders when selection changes
    const selectionRef = useRef<Selection | null>(null);

    // keep external value in sync (preserve original behavior)
    useEffect(() => {
      if (value !== undefined && value !== rawValue) {
        setRawValue(value);
      }
    }, [value, rawValue]);

    // masked or raw displayed value
    const syncedValue = useMemo(() => (visible ? rawValue : HIDER_CHAR.repeat(rawValue.length)), [visible, rawValue]);

    // triggerChange: stable callback, only depends on onChange
    const triggerChange = useCallback(
      (v: string) => {
        setRawValue(v);
        onChange?.(v);
      },
      [onChange],
    );

    // set cursor position helper (no re-render)
    const setCursor = useCallback((pos: number) => {
      const input = inputRef.current;
      if (!input) return;
      try {
        input.setSelectionRange(pos, pos);
      } catch {
        // ignore invalid ranges silently (preserve original resilience)
      }
    }, []);

    // main onChange handler: logic preserved, optimized to avoid extra work
    const handleChange = useCallback(() => {
      const input = inputRef.current;
      if (!input) return;

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
        let updated: string | undefined;

        if (diff > 0) {
          // insertion: take char just before cursor in the masked input (preserve behavior)
          const lastChar = newValue[selectionStart - 1];
          updated = oldValue.slice(0, selectionStart - 1) + lastChar + oldValue.slice(selectionStart - 1);
          triggerChange(updated);
        } else {
          // deletion / replacement cases
          const sel = selectionRef.current;
          if (sel) {
            if (sel.start === 0 && sel.end === oldValue.length) {
              updated = newValue;
            } else {
              if (Math.abs(diff) !== sel.end - sel.start) {
                updated = oldValue.slice(0, sel.start) + newValue.charAt(sel.start) + oldValue.slice(sel.end);
              } else {
                updated = oldValue.slice(0, selectionStart) + oldValue.slice(selectionStart - diff);
              }
            }
          } else {
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
    const handleSelect = useCallback((e: React.SyntheticEvent<HTMLInputElement>) => {
      e.preventDefault();
      const input = inputRef.current;
      if (!input) return;

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
    const handlePaste = useCallback(
      (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const input = inputRef.current;
        if (!input) return;

        const pastedText = e.clipboardData.getData('text');
        const start = input.selectionStart ?? rawValue.length;
        const end = input.selectionEnd ?? rawValue.length;
        const updated = rawValue.slice(0, start) + pastedText + rawValue.slice(end);
        triggerChange(updated);

        queueMicrotask(() => {
          setCursor(start + pastedText.length);
        });
      },
      [rawValue, triggerChange, setCursor],
    );

    // prevent copy/cut default behavior handlers (stable)
    const handleCopy = useCallback((e: React.ClipboardEvent<HTMLInputElement>) => {
      e.preventDefault();
    }, []);
    const handleCut = useCallback((e: React.ClipboardEvent<HTMLInputElement>) => {
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
    const mergedInputStyle = useMemo(
      () => ({
        paddingRight: showToggler ? `calc(${togglerRightOffset} + ${paddingRightOffset})` : undefined,
        ...inputStyle,
      }),
      [inputStyle, showToggler, togglerRightOffset, paddingRightOffset],
    );

    const mergedContainerStyle: React.CSSProperties = useMemo(
      () => ({
        position: 'relative',
        backgroundColor: 'transparent',
        border: 'none',
        outline: 'none',
        margin: '0',
        padding: '0',
        ...containerStyle,
      }),
      [containerStyle],
    );

    const mergedTogglerStyle: React.CSSProperties = useMemo(
      () => ({
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
      }),
      [togglerContainerStyle, togglerRightOffset],
    );

    return (
      <div className={classNames('react-safe-password-container', containerClassName)} style={mergedContainerStyle}>
        <input
          type="text"
          autoComplete="off"
          spellCheck={false}
          onCopy={handleCopy}
          onCut={handleCut}
          ref={inputRef}
          id={id}
          name={name}
          value={syncedValue}
          onChange={handleChange}
          onPaste={handlePaste}
          onSelect={handleSelect}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className={classNames('react-safe-password-input', inputClassName, isError && errorClassName)}
          style={mergedInputStyle}
          aria-invalid={isError}
          aria-describedby={isError && errorId ? errorId : undefined}
        />

        {showToggler && !!rawValue && (
          <div
            className={classNames('react-safe-password-toggler-container', togglerContainerClassName)}
            style={mergedTogglerStyle}
            onClick={toggleShow}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleShow();
              }
            }}
            role="button"
            tabIndex={0}
            aria-label={visible ? hideTitle : showTitle}
            aria-pressed={visible}
            aria-live="polite"
          >
            {visible ? iconHide : iconShow}
          </div>
        )}
      </div>
    );
  },
);

export default SafePassword;
