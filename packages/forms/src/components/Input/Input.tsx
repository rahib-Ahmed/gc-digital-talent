import * as React from "react";
import get from "lodash/get";
import { FieldError, RegisterOptions, useFormContext } from "react-hook-form";

import Base from "../Base";

import useFieldState from "../../hooks/useFieldState";
import useFieldStateStyles from "../../hooks/useFieldStateStyles";
import useInputDescribedBy from "../../hooks/useInputDescribedBy";
import InputWrapper from "../InputWrapper";
import useCommonInputStyles from "../../hooks/useCommonInputStyles";

export interface InputProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "capture" | "type"
  > {
  /** HTML id used to identify the element. */
  id: string;
  /** Optional context which user can view by toggling a button. */
  context?: string;
  /** Holds text for the label associated with the input element */
  label: string | React.ReactNode;
  /** A string specifying a name for the input control. */
  name: string;
  /** Set of validation rules and error messages to impose on input. */
  rules?: RegisterOptions;
  /** Set the type of the input. */
  type: "text" | "number" | "email" | "tel" | "password" | "date" | "search";
  /** If input is not required, hide the 'Optional' label */
  hideOptional?: boolean;
  errorPosition?: "top" | "bottom";
  // Whether to trim leading/ending whitespace upon blurring of an input, default on
  whitespaceTrim?: boolean;
  /** Determine if it should track unsaved changes and render it */
  trackUnsaved?: boolean;
}

const Input = ({
  id,
  context,
  label,
  name,
  rules = {},
  type,
  readOnly,
  whitespaceTrim = true,
  trackUnsaved = true,
  ...rest
}: InputProps) => {
  const {
    register,
    setValue,
    formState: { errors },
  } = useFormContext();
  // To grab errors in nested objects we need to use lodash's get helper.
  const error = get(errors, name)?.message as FieldError;
  const baseStyles = useCommonInputStyles();
  const stateStyles = useFieldStateStyles(name, !trackUnsaved);
  const fieldState = useFieldState(id, !trackUnsaved);
  const isUnsaved = fieldState === "dirty" && trackUnsaved;
  const [descriptionIds, ariaDescribedBy] = useInputDescribedBy({
    id,
    show: {
      error,
      unsaved: trackUnsaved && isUnsaved,
      context,
    },
  });

  const whitespaceTrimmer = (e: React.FocusEvent<HTMLInputElement>) => {
    if (whitespaceTrim) {
      const value = e.target.value.trim();
      setValue(name, value);
    }
  };

  return (
    <Base.Wrapper>
      <Base.Label id={`${id}-label`} htmlFor={id} required={!!rules.required}>
        {label}
      </Base.Label>
      <input
        id={id}
        type={type}
        aria-describedby={ariaDescribedBy}
        required={!!rules.required}
        {...baseStyles}
        {...stateStyles}
        {...register(name, {
          ...rules,
          onBlur: whitespaceTrimmer,
        })}
        {...rest}
      />
      {context && (
        <Base.Description id={descriptionIds?.context}>
          {context}
        </Base.Description>
      )}
      {error && (
        <Base.Error id={descriptionIds?.error}>{error?.toString()}</Base.Error>
      )}
    </Base.Wrapper>
  );
};

export default Input;
