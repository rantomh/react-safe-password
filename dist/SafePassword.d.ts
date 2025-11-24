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
declare const SafePassword: import("react").ForwardRefExoticComponent<SafePasswordProps & import("react").RefAttributes<SafePasswordHandle>>;
export default SafePassword;
