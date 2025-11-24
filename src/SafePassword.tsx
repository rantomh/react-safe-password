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
  /** Unique ID for the input */
  id: string;
  /** Input name (for forms) */
  name: string;
  /** Controlled password value */
  value?: string;
  /** Callback fired when the value changes */
  onChange?: (value: string) => void;
  /** Marks the input as having an error */
  isError?: boolean;
  /** Input placeholder text */
  placeholder?: string;
  /** Shows the toggle button to reveal/hide the password */
  showToggler?: boolean;
  /** Right offset for the toggle button */
  togglerRightOffset?: string;
  /** Right padding for the input to avoid overlapping with the toggle */
  paddingRightOffset?: string;
  /** CSS class for the input */
  className?: string;
  /** CSS class applied when the input has an error */
  errorClassName?: string;
  /** CSS class for the container wrapping the input */
  containerClassName?: string;
  /** CSS class for the toggle button */
  togglerClassName?: string;
  /** Label for the toggle when password is hidden */
  hideTitle?: string;
  /** Label for the toggle when password is visible */
  showTitle?: string;
  /** Marks the input as required */
  required?: boolean;
  /** Disables the input */
  disabled?: boolean;
  /** Custom icon to show the password */
  iconShow?: React.ReactNode;
  /** Custom icon to hide the password */
  iconHide?: React.ReactNode;
  /** Callback fired when reset is called */
  onReset?: () => void;
}

const SafePassword = forwardRef<SafePasswordHandle, SafePasswordProps>(
  (
    {
      id,
      name,
      value,
      onChange,
      isError = false,
      placeholder,
      showToggler: shower = false,
      className = '',
      errorClassName = '',
      containerClassName = '',
      togglerClassName = '',
      togglerRightOffset = '1rem',
      paddingRightOffset = '1.5rem',
      hideTitle = 'Hide',
      showTitle = 'Show',
      required = false,
      disabled = false,
      iconShow = EyeIcon,
      iconHide = EyeSlashIcon,
      onReset,
    },
    ref,
  ) => {
    const HIDER_CHAR = '\u2022';

    const inputRef = useRef<HTMLInputElement>(null);
    const [visible, setVisible] = useState(false);
    const [rawValue, setRawValue] = useState(value || '');

    useEffect(() => {
      if (value !== undefined && value !== rawValue) {
        setRawValue(value);
      }
    }, [value]);

    const syncedValue: string = useMemo(
      () => (visible ? rawValue : HIDER_CHAR.repeat(rawValue.length)),
      [visible, rawValue],
    );

    const triggerChange: (v: string) => void = useCallback(
      (v: string) => {
        setRawValue(v);
        onChange?.(v);
      },
      [onChange],
    );

    const handleChange = useCallback(() => {
      if (!inputRef.current) return;
      const input = inputRef.current;
      const newMasked = input.value;
      const selectionStart = input.selectionStart ?? newMasked.length;
      const oldRaw = rawValue;

      const diff = newMasked.length - syncedValue.length;
      if (diff > 0) {
        const inserted = newMasked.slice(selectionStart - diff, selectionStart);
        const updated = oldRaw.slice(0, selectionStart - diff) + inserted + oldRaw.slice(selectionStart - diff);
        triggerChange(updated);
      } else if (diff < 0) {
        const index = selectionStart;
        const removedCount = Math.abs(diff);
        const updated = oldRaw.slice(0, index) + oldRaw.slice(index + removedCount);
        triggerChange(updated);
      }
    }, [rawValue, syncedValue, triggerChange]);

    const handlePaste = useCallback(
      (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (!inputRef.current) return;

        const input = inputRef.current;
        const pastedText = e.clipboardData.getData('text');
        const start = input.selectionStart ?? rawValue.length;
        const end = input.selectionEnd ?? rawValue.length;

        const updated = rawValue.slice(0, start) + pastedText + rawValue.slice(end);
        triggerChange(updated);

        queueMicrotask(() => {
          input.setSelectionRange(start + pastedText.length, start + pastedText.length);
        });
      },
      [rawValue, triggerChange],
    );

    const toggleShow = useCallback(() => setVisible((prev) => !prev), []);

    const reset = useCallback(() => {
      if (onReset) {
        onReset();
        return;
      }
      setVisible(false);
      triggerChange('');
    }, [triggerChange]);

    useImperativeHandle(ref, () => ({
      reset,
    }));

    return (
      <div className={containerClassName} style={{ position: 'relative' }}>
        <input
          ref={inputRef}
          style={{ paddingRight: shower ? `calc(${togglerRightOffset} + ${paddingRightOffset})` : undefined }}
          type="text"
          id={`safe-password-${id}`}
          name={name}
          placeholder={placeholder}
          value={syncedValue}
          onChange={handleChange}
          onPaste={handlePaste}
          autoComplete="off"
          spellCheck={false}
          className={classNames(className, { [errorClassName]: isError })}
          required={required}
          disabled={disabled}
          aria-invalid={isError}
          aria-describedby={isError ? `safe-password-${id}-error` : undefined}
        />
        {shower && !!rawValue && (
          <div
            className={togglerClassName}
            style={{
              position: 'absolute',
              right: togglerRightOffset,
              top: '50%',
              transform: 'translateY(-50%)',
              cursor: 'pointer',
              userSelect: 'none',
              zIndex: 10,
              padding: 0,
              margin: 0,
            }}
            onClick={toggleShow}
            role="button"
            aria-label={visible ? hideTitle : showTitle}
            aria-pressed={visible}
            aria-live="polite"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleShow();
              }
            }}
          >
            {visible ? iconHide : iconShow}
          </div>
        )}
      </div>
    );
  },
);

export default SafePassword;
