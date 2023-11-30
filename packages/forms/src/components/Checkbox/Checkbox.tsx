import React from "react";
import get from "lodash/get";
import { FieldError, useFormContext } from "react-hook-form";

import Field from "../Field";
import type { CommonInputProps, HTMLInputProps } from "../../types";
import useInputDescribedBy from "../../hooks/useInputDescribedBy";
import useFieldStateStyles from "../../hooks/useFieldStateStyles";

export type CheckboxProps = HTMLInputProps &
  CommonInputProps & {
    /** Wrap input in bounding box. */
    boundingBox?: boolean;
    /** Label for the bounding box. */
    boundingBoxLabel?: React.ReactNode;
    /** Determine if it should track unsaved changes and render it */
    isUnsaved?: boolean;
    /** Render differently when in a list */
    inCheckList?: boolean;
  };

const Checkbox = ({
  id,
  label,
  name,
  rules = {},
  context,
  isUnsaved,
  boundingBox = false,
  boundingBoxLabel = label,
  trackUnsaved = true,
  inCheckList = false,
  ...rest
}: CheckboxProps) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  const stateStyles = useFieldStateStyles(name, !trackUnsaved);
  // To grab errors in nested objects we need to use lodash's get helper.
  const error = get(errors, name)?.message as FieldError;
  const [descriptionIds, ariaDescribedBy] = useInputDescribedBy({
    id,
    show: {
      error,
      unsaved: trackUnsaved && isUnsaved,
      context,
    },
  });

  const asFieldset = boundingBox && boundingBoxLabel;
  const Wrapper = asFieldset ? Field.Fieldset : React.Fragment;
  const BoundingBox = asFieldset ? Field.BoundingBox : React.Fragment;

  return (
    <Field.Wrapper>
      <Wrapper>
        {asFieldset && (
          <Field.Legend required={!!rules.required}>
            {boundingBoxLabel}
          </Field.Legend>
        )}
        <BoundingBox {...(asFieldset ? stateStyles : {})}>
          <Field.Label
            data-h2-display="base(flex)"
            data-h2-align-items="base(flex-start)"
            data-h2-gap="base(x.25)"
          >
            <input
              id={id}
              type="checkbox"
              aria-describedby={ariaDescribedBy}
              aria-required={!!rules.required && !inCheckList}
              aria-invalid={!!error}
              data-h2-margin-top="base(x.26)"
              {...register(name, rules)}
              {...rest}
            />
            <span data-h2-font-size="base(body)">{label}</span>
            {!asFieldset && !inCheckList && (
              <Field.Required required={!!rules.required} />
            )}
          </Field.Label>
        </BoundingBox>
      </Wrapper>
      {!inCheckList && (
        <Field.Descriptions
          ids={descriptionIds}
          error={error}
          context={context}
        />
      )}
    </Field.Wrapper>
  );
};

export default Checkbox;
