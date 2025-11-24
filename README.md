# react-safe-password

A **secure, standalone React password input** component designed for modern applications. It works across all browsers without relying on browser password management features, ensuring your users' passwords are never auto-saved, suggested, or prefilled. Fully compatible with Formik for form integration.

---

## Key Features

- **Safe & independent of the browser**
  - No autocomplete
  - No password suggestions
  - No memorization by the browser

- Controlled or uncontrolled input values
- Masked password input with customizable character
- Toggle button to show/hide password
- Customizable icons for show/hide
- Supports standard HTML attributes (`placeholder`, `required`, `disabled`, etc.)
- Minimal dependencies (`classnames` only)
- Compatible with React 18+ and modern ESM projects
- Works seamlessly with Formik or other form libraries

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

interface Props {
  loading?: boolean;
}

const PasswordField: FC<Props> = ({ loading }) => {
  const safePassRef = useRef<SafePasswordHandle>(null);
  return (
    <Field name="password">
      {({ field, form }: { field: FieldInputProps<string>; form: FormikProps<LoginReq> }) => (
        <SafePassword
          ref={safePassRef}
          id="password"
          name="password"
          value={field.value}
          onChange={(value) => {
            form.setFieldValue('password', value);
          }}
          showToggler={true}
          placeholder="Enter your password"
          className="form-control"
          errorClassName="form-error"
          disabled={loading}
          isError={!!form.errors.password && form.touched.password}
          required
        />
      )}
    </Field>
  );
};

export default PasswordField;
```

---

## Props

| Prop                 | Type                      | Default    | Description                                                      |
| -------------------- | ------------------------- | ---------- | ---------------------------------------------------------------- |
| `id`                 | `string`                  | —          | Unique ID for the input                                          |
| `name`               | `string`                  | —          | Input name (for forms)                                           |
| `value`              | `string`                  | —          | Controlled password value                                        |
| `onChange`           | `(value: string) => void` | —          | Callback fired when value changes                                |
| `isError`            | `boolean`                 | `false`    | Marks the input as having an error                               |
| `placeholder`        | `string`                  | —          | Input placeholder text                                           |
| `showToggler`        | `boolean`                 | `false`    | Show the toggle button to reveal/hide password                   |
| `togglerRightOffset` | `string`                  | `"1rem"`   | Right offset for the toggle button                               |
| `paddingRightOffset` | `string`                  | `"1.5rem"` | Right padding for the input to avoid overlapping with the toggle |
| `className`          | `string`                  | `""`       | CSS class for the input                                          |
| `errorClassName`     | `string`                  | `""`       | CSS class applied when the input has an error                    |
| `containerClassName` | `string`                  | `""`       | CSS class for the container                                      |
| `togglerClassName`   | `string`                  | `""`       | CSS class for the toggle button                                  |
| `hideTitle`          | `string`                  | `"Hide"`   | Label for toggle when password is hidden                         |
| `showTitle`          | `string`                  | `"Show"`   | Label for toggle when password is visible                        |
| `required`           | `boolean`                 | `false`    | Marks the input as required                                      |
| `disabled`           | `boolean`                 | `false`    | Disables the input                                               |
| `iconShow`           | `React.ReactNode`         | —          | Custom icon to show password                                     |
| `iconHide`           | `React.ReactNode`         | —          | Custom icon to hide password                                     |
| `onReset`            | `() => void`              | —          | Callback fired when reset is called                              |

---

## Security Notes

`react-safe-password` **ensures maximum privacy for passwords**:

- Uses custom masking (`•`) instead of `type="password"` for full control
- Prevents autocomplete and password manager suggestions
- Avoids storing the password in browser memory
- Works consistently across all modern browsers
- No external services or browser APIs are used

---

## License

MIT © Rantomah

---

## Author

**Rantomah** [Linkedin](https://www.linkedin.com/in/rantomah)\
Senior Fullstack Developer & Software Architect
