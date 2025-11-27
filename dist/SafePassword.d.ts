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
declare const SafePassword: import("react").ForwardRefExoticComponent<SafePasswordProps & import("react").RefAttributes<SafePasswordHandle>>;
export default SafePassword;
