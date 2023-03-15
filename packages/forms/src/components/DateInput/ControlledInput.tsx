import { dateMessages } from "@gc-digital-talent/i18n";
import React from "react";
import {
  ControllerFieldState,
  ControllerRenderProps,
  FieldValues,
  UseFormStateReturn,
} from "react-hook-form";
import { useIntl } from "react-intl";
import { DateSegment, DATE_SEGMENT } from "./types";
import {
  getMonthOptions,
  getMonthSpan,
  inputStyles,
  setComputedValue,
} from "./utils";

interface ControlledInputProps {
  field: ControllerRenderProps<FieldValues, string>;
  fieldState: ControllerFieldState;
  formState: UseFormStateReturn<FieldValues>;
  show: Array<DateSegment>;
}

const ControlledInput = ({
  field: { onChange, value, name },
  show,
}: ControlledInputProps) => {
  const intl = useIntl();
  const ID = {
    YEAR: `${name}Year`,
    MONTH: `${name}Month`,
    DAY: `${name}Day`,
  };

  const handleChange = (segmentValue: string, segment: DateSegment) => {
    const newValue = setComputedValue({
      initialValue: value,
      value: segmentValue,
      segment,
      show,
    });

    if (newValue) {
      onChange(newValue);
    }
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleChange(e.target.value, DATE_SEGMENT.Year);
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    handleChange(e.target.value.padStart(2, "0"), DATE_SEGMENT.Month);
  };

  const handleDayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleChange(e.target.value.padStart(2, "0"), DATE_SEGMENT.Day);
  };

  const months = getMonthOptions(intl);

  return (
    <div
      data-h2-display="base(grid)"
      data-h2-grid-template-columns="base(100%) p-tablet(calc(x4 + 4ch) 1fr calc(x4 + 2ch))"
      data-h2-gap="base(x.5)"
    >
      {show.includes(DATE_SEGMENT.Year) && (
        <div>
          <label data-h2-display="base(block)" htmlFor={ID.YEAR}>
            {intl.formatMessage(dateMessages.year)}
          </label>
          <input
            id={ID.YEAR}
            name={ID.YEAR}
            type="number"
            onChange={handleYearChange}
            {...inputStyles}
          />
        </div>
      )}
      {show.includes(DATE_SEGMENT.Month) && (
        <div {...getMonthSpan(show)}>
          <label data-h2-display="base(block)" htmlFor={ID.MONTH}>
            {intl.formatMessage(dateMessages.month)}
          </label>
          <select
            id={ID.MONTH}
            name={ID.MONTH}
            onChange={handleMonthChange}
            {...inputStyles}
          >
            <option disabled>
              {intl.formatMessage(dateMessages.selectAMonth)}
            </option>
            {months.map((month, index) => (
              <option value={index + 1} key={month}>
                {month}
              </option>
            ))}
          </select>
        </div>
      )}
      {show.includes(DATE_SEGMENT.Day) && (
        <div>
          <label data-h2-display="base(block)" htmlFor={ID.DAY}>
            {intl.formatMessage(dateMessages.day)}
          </label>
          <input
            id={ID.DAY}
            name={ID.DAY}
            type="number"
            onChange={handleDayChange}
            {...inputStyles}
          />
        </div>
      )}
    </div>
  );
};

export default ControlledInput;
