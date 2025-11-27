# react-safe-password

A **secure, standalone and fully customizable React password input** component designed for modern React applications. It works across all browsers without relying on browser password management features, ensuring your users' passwords are never auto-saved, suggested, prefilled, or copied. Fully compatible with Formik for form integration.

---

## GitHub

[View the repository on GitHub](https://github.com/rantomh/react-safe-password.git)

---

## Key Features

* **Safe & independent of the browser**

  * No autocomplete
  * No password suggestions
  * No memorization by the browser
  * Prevent copy and cut events

* Controlled or uncontrolled input values

* Toggle button to show/hide password

* Customizable icons for show/hide

* Supports standard HTML attributes (`placeholder`, `required`, `disabled`, etc.)

* Minimal dependencies (`classnames` only)

* Reset function accessible via handle ref

* Compatible with React 18+ and modern ESM projects

* Works seamlessly with Formik or other form libraries

---

## Installation

```bash
npm install @rantomah/react-safe-password
# or
yarn add @rantomah/react-safe-password
```

---

## Example usage with Formik

```tsx
import { Field, FieldInputProps, FormikProps } from 'formik';
import { FC, useRef } from 'react';
import SafePassword, { SafePasswordHandle } from '@rantomah/react-safe-password';
import { LoginReq } from '@domain/types/auth.type';

interface PasswordFieldProps {
  loading?: boolean;
}

interface SafePasswordRenderProps {
  field: FieldInputProps<string>;
  form: FormikProps<LoginReq>;
}

const PasswordField: FC<PasswordFieldProps> = ({ loading }) => {
  const safePasswordRef = useRef<SafePasswordHandle>(null);
  return (
    <Field name="password">
      {({ field, form }: SafePasswordRenderProps) => (
        <SafePassword
          ref={safePasswordRef}
          id="password"
          name="password"
          value={field.value}
          onChange={(value) => {
            form.setFieldValue('password', value);
          }}
          placeholder="Enter your password"
          inputClassName="form-control"
          errorClassName="form-error"
          isError={!!form.errors.password && form.touched.password}
          disabled={loading}
          showToggler
        />
      )}
    </Field>
  );
};

export default PasswordField;

/* reset dispatcher */
const resetPassword = (ref: SafePasswordHandle) => {
  ref.reset();
}
```

---

## Props

| Prop                        | Type                   | Default    | Description                                                                                         |
| --------------------------- | ---------------------- | ---------- | --------------------------------------------------------------------------------------------------- |
| `id`                        | `string`               | —          | Unique identifier for the input. Used for accessibility and form linkage.                           |
| `name`                      | `string`               | —          | Name of the input, typically used inside forms.                                                     |
| `value`                     | `string`               | —          | Controlled value of the password input.                                                             |
| `onChange`                  | `(value:string)=>void` | —          | Callback fired when the input value changes.                                                        |
| `placeholder`               | `string`               | —          | Placeholder text shown when the input is empty.                                                     |
| `required`                  | `boolean`              | `false`    | Marks the input as required for form submission.                                                    |
| `disabled`                  | `boolean`              | `false`    | Disables the input.                                                                                 |
| `isError`                   | `boolean`              | `false`    | Visually marks the input as having an error.                                                        |
| `showToggler`               | `boolean`              | `false`    | Shows the password visibility toggle button.                                                        |
| `togglerRightOffset`        | `string`               | `"1rem"`   | Right offset for the toggler container (applies only when `showToggler` is true).                   |
| `paddingRightOffset`        | `string`               | `"1.5rem"` | Adds right padding to the input to prevent overlapping with the toggler.                            |
| `inputClassName`            | `string`               | `""`       | Custom CSS class applied to the input element.                                                      |
| `errorClassName`            | `string`               | `""`       | Custom CSS class applied when the input is in error state.                                          |
| `containerClassName`        | `string`               | `""`       | Custom CSS class applied to the outer container.                                                    |
| `togglerContainerClassName` | `string`               | `""`       | Custom CSS class applied to the toggler button container.                                           |
| `containerStyle`            | `React.CSSProperties`  | —          | Inline style applied to the container, overrides all classNames.                                    |
| `inputStyle`                | `React.CSSProperties`  | —          | Inline style applied to the input, overrides all classNames.                                        |
| `togglerContainerStyle`     | `React.CSSProperties`  | —          | Inline style applied to the toggler container, overrides all classNames.                            |
| `hideTitle`                 | `string`               | `"Hide"`   | Label for the toggler when hiding the password.                                                     |
| `showTitle`                 | `string`               | `"Show"`   | Label for the toggler when showing the password.                                                    |
| `iconShow`                  | `React.ReactNode`      | —          | Custom icon displayed when the password is hidden.                                                  |
| `iconHide`                  | `React.ReactNode`      | —          | Custom icon displayed when the password becomes visible.                                            |
| `onReset`                   | `()=>void`             | —          | Callback triggered when the input is reset.                                                         |
| `errorId`                   | `string`               | —          | ID of the element containing error text (for ARIA accessibility).                                   |


---

## Security Notes

`react-safe-password` **ensures maximum privacy for passwords**:

* Uses `type="text"` with custom masking (`•`) instead of `type="password"` for full control
* Prevents autocomplete and password manager suggestions
* Avoids browser new password suggestion
* Avoids storing the password in browser memory
* Prevent copy and cut actions
* Works consistently across all modern browsers
* No external services or browser APIs are used
* Fully customizable style

---

## License

MIT © Rantomah

---

## Author

**Rantomah** [Linkedin](https://www.linkedin.com/in/rantomah)
Senior Fullstack Developer & Software Architect
