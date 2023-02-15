import React from "react";
import { FieldError, RegisterOptions, useFormContext } from "react-hook-form";
import get from "lodash/get";
import { InputWrapper } from "../../inputPartials";
import { useFieldState, useFieldStateStyles } from "../../../helpers/formUtils";
import useInputDescribedBy from "../../../hooks/useInputDescribedBy";

export type Option = {
  label: string;
  value: string;
  disabled?: boolean;
};

export type OptGroup = {
  label: string;
  options: Array<Option>;
  disabled?: boolean;
};

type OptGroupOrOption = OptGroup[] | Option[];

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  /** HTML id used to identify the element. */
  id: string;
  /** The text for the label associated with the select input. */
  label: string | React.ReactNode;
  /** A string specifying a name for the input control. */
  name: string;
  /** List of options and/or optgroups for the select element. */
  options: OptGroupOrOption;
  /** Object set of validation rules to impose on input. */
  rules?: RegisterOptions;
  /** Optional context which user can view by toggling a button. */
  context?: string;
  /** Null selection string provides a null value with instructions to user (eg. Select a department...) */
  nullSelection?: string;
  /** Determine if it should track unsaved changes and render it */
  trackUnsaved?: boolean;
  /** Determine if it should sort options in alphanumeric ascending order */
  doNotSort?: boolean;
}

const Select: React.FunctionComponent<SelectProps> = ({
  id,
  label,
  name,
  options,
  rules,
  context,
  nullSelection,
  trackUnsaved = true,
  doNotSort = false,
  ...rest
}) => {
  const [isContextVisible, setContextVisible] = React.useState<boolean>(false);
  const {
    register,
    formState: { errors },
  } = useFormContext();
  const stateStyles = useFieldStateStyles(name, !trackUnsaved);
  const error = get(errors, name)?.message as FieldError;
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

  return (
    <div data-h2-margin="base(x1, 0)">
      <InputWrapper
        inputId={id}
        inputName={name}
        label={label}
        required={!!rules?.required}
        context={context}
        error={error}
        trackUnsaved={trackUnsaved}
        onContextToggle={setContextVisible}
        descriptionIds={descriptionIds}
      >
        <select
          data-h2-padding="base(x.25, x.5)"
          data-h2-radius="base(input)"
          {...stateStyles}
          id={id}
          style={{ width: "100%", paddingTop: "4.5px", paddingBottom: "4.5px" }}
          {...register(name, rules)}
          aria-invalid={error ? "true" : "false"}
          aria-required={rules?.required ? "true" : undefined}
          aria-describedby={ariaDescribedBy}
          {...rest}
          defaultValue=""
        >
          {nullSelection && (
            <option value="" disabled>
              {nullSelection}
            </option>
          )}
          {doNotSort
            ? options.map((option) =>
                "options" in option ? (
                  <optgroup key={option.label} label={option.label}>
                    {options.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </optgroup>
                ) : (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ),
              )
            : options
                .map((option) =>
                  "options" in option ? (
                    <optgroup key={option.label} label={option.label}>
                      {options
                        .map((o) => (
                          <option key={o.value} value={o.value}>
                            {o.label}
                          </option>
                        ))
                        .sort((a, b) =>
                          a.label
                            .toLowerCase()
                            .localeCompare(b.label.toLowerCase()),
                        )}
                    </optgroup>
                  ) : (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ),
                )
                .sort((a, b) =>
                  a.label.toLowerCase().localeCompare(b.label.toLowerCase()),
                )}
        </select>
      </InputWrapper>
    </div>
  );
};

export default Select;
