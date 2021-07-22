import React from "react";
import { RegisterOptions, useFormContext } from "react-hook-form";
import get from "lodash/get";
import { InputWrapper } from "../H2Components/InputWrapper";

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  /** HTML id used to identify the element. */
  id: string;
  /** The text for the label associated with the select input. */
  label: string;
  /** A string specifying a name for the input control. */
  name: string;
  /** List of options for the select element. */
  options: { value: string | number; label: string; disabled?: boolean }[];
  /** Object set of validation rules to impose on input. */
  rules?: RegisterOptions;
  /** Optional context which user can view by toggling a button. */
  context?: string;
}

const Select: React.FunctionComponent<SelectProps> = ({
  id,
  label,
  name,
  options,
  rules,
  context,
  ...rest
}) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const error = get(errors, name)?.message;
  return (
    <div>
      <InputWrapper
        inputId={id}
        label={label}
        required={!!rules?.required}
        context={context}
        error={error}
        hideOptional
      >
        <select
          data-h2-radius="b(s)"
          data-h2-padding="b(top-bottom, xxs) b(left, xxs)"
          data-h2-margin="b(bottom, xs)"
          data-h2-font-size="b(normal)"
          id={id}
          style={{ width: "100%" }}
          {...register(name, rules)}
          aria-invalid={error ? "true" : "false"}
          {...rest}
        >
          {options.map((option) => (
            <option
              data-h2-font-size="b(caption)"
              key={option.value}
              value={option.value}
              disabled={option.disabled}
              selected={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>
      </InputWrapper>
    </div>
  );
};

export default Select;
