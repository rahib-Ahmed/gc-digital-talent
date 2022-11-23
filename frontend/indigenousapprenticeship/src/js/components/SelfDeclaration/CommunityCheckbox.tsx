import React from "react";
import get from "lodash/get";
import { FieldError, useFormContext } from "react-hook-form";

import { InputError } from "@common/components/inputPartials";

import { CheckboxProps } from "@common/components/form/Checkbox";
import CommunityIcon from "./CommunityIcon";
import { partOfCommunity } from "./utils";

interface CommunityCheckboxProps
  extends Pick<CheckboxProps, "id" | "label" | "name" | "value" | "rules"> {
  community: string;
}

const CommunityCheckbox = ({
  id,
  label,
  name,
  community,
  rules = {},
  value,
  ...rest
}: CommunityCheckboxProps) => {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext();
  // To grab errors in nested objects we need to use lodash's get helper.
  const error = get(errors, name)?.message as FieldError;

  const communitiesValue = watch("communities");
  const isOn = partOfCommunity(value as string, communitiesValue);

  return (
    <label
      data-h2-align-items="base(center)"
      data-h2-display="base(flex)"
      data-h2-flex-direction="base(column)"
      data-h2-radius="base(s)"
      data-h2-shadow="base(none) base:hover(s)"
      data-h2-padding="base(x1)"
      data-h2-cursor="base(pointer)"
    >
      <CommunityIcon community={community} on={isOn} />
      <span
        data-h2-display="base(flex)"
        data-h2-flex-direction="base(column)"
        data-h2-align-items="base(center)"
      >
        <span
          data-h2-display="base(inline-flex)"
          data-h2-align-items="base(flex-start)"
          data-h2-justify-content="base(center)"
          data-h2-width="base(auto)"
        >
          <input
            data-h2-margin="base(0, x.25, 0, 0)"
            id={id}
            {...register(name, rules)}
            type="checkbox"
            aria-invalid={error ? "true" : "false"}
            aria-required={rules.required ? "true" : undefined}
            value={value}
            {...rest}
          />
          <span className="InputLabel" data-h2-line-height="base(1)">
            {label}
          </span>
        </span>
        {error && (
          <div
            data-h2-display="base(block)"
            data-h2-margin="base(x.125, 0, 0, 0)"
          >
            <InputError isVisible={!!error} error={error} />
          </div>
        )}
      </span>
    </label>
  );
};

export default CommunityCheckbox;
