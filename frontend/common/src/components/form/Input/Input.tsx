import * as React from "react";
import get from "lodash/get";
import { FieldError, RegisterOptions, useFormContext } from "react-hook-form";
import { useFieldState, useFieldStateStyles } from "../../../helpers/formUtils";
import { InputWrapper } from "../../inputPartials";
import useInputDescribedBy from "../../../hooks/useInputDescribedBy";

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

const Input: React.FunctionComponent<InputProps> = ({
  id,
  context,
  label,
  name,
  rules = {},
  type,
  readOnly,
  errorPosition = "bottom",
  hideOptional,
  whitespaceTrim = true,
  trackUnsaved = true,
  ...rest
}) => {
  const [isContextVisible, setContextVisible] = React.useState<boolean>(false);
  const {
    register,
    setValue,
    formState: { errors },
  } = useFormContext();
  // To grab errors in nested objects we need to use lodash's get helper.
  const error = get(errors, name)?.message as FieldError;
  const stateStyles = useFieldStateStyles(name, !trackUnsaved);
  const fieldState = useFieldState(id, !trackUnsaved);
  const isUnsaved = fieldState === "dirty" && trackUnsaved;
  const [descriptionIds, ariaDescribedBy] = useInputDescribedBy({
    id,
    show: {
      error,
      unsaved: trackUnsaved && isUnsaved,
      context: context && isContextVisible,
    },
  });

  const whitespaceTrimmer = (e: React.FocusEvent<HTMLInputElement>) => {
    if (whitespaceTrim) {
      const value = e.target.value.trim();
      setValue(name, value);
    }
  };

  return (
    <div data-h2-margin="base(x1, 0)">
      <InputWrapper
        inputId={id}
        inputName={name}
        label={label}
        required={!!rules.required}
        context={context}
        error={error}
        hideOptional={hideOptional}
        errorPosition={errorPosition}
        trackUnsaved={trackUnsaved}
        onContextToggle={setContextVisible}
        descriptionIds={descriptionIds}
      >
        <input
          data-h2-padding="base(x.25, x.5)"
          data-h2-radius="base(input)"
          {...stateStyles}
          style={{ width: "100%" }}
          id={id}
          {...register(name, rules)}
          onBlur={whitespaceTrimmer}
          type={type}
          {...(readOnly && {
            "data-h2-background-color": "base(gray.light)",
          })}
          readOnly={readOnly}
          aria-required={rules.required ? "true" : undefined}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={ariaDescribedBy}
          {...rest}
        />
      </InputWrapper>
    </div>
  );
};

export default Input;
