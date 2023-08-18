import React from "react";
import {
  ControllerFieldState,
  ControllerRenderProps,
  FieldValues,
  UseFormStateReturn,
} from "react-hook-form";
import { useIntl } from "react-intl";

import { dateMessages } from "@gc-digital-talent/i18n";

import useCommonInputStyles from "../../hooks/useCommonInputStyles";
import { DateSegment, DATE_SEGMENT } from "./types";
import {
  getMonthOptions,
  getMonthSpan,
  setComputedValue,
  splitSegments,
} from "./utils";

interface ControlledInputProps {
  field: ControllerRenderProps<FieldValues, string>;
  fieldState: ControllerFieldState;
  formState: UseFormStateReturn<FieldValues>;
  show: Array<DateSegment>;
}

const ControlledInput = ({
  field: { onChange, value, name },
  formState: { defaultValues },
  show,
}: ControlledInputProps) => {
  const intl = useIntl();
  const inputStyles = useCommonInputStyles();
  const { year, month, day } = splitSegments(
    defaultValues ? defaultValues[name] : undefined,
  );
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

    onChange(newValue);
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value: newYear } = e.target;
    handleChange(newYear ? newYear.padStart(4, "0") : "", DATE_SEGMENT.Year);
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value: newMonth } = e.target;
    handleChange(newMonth ? newMonth.padStart(2, "0") : "", DATE_SEGMENT.Month);
  };

  const handleDayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value: newDay } = e.target;
    handleChange(newDay ? newDay.padStart(2, "0") : "", DATE_SEGMENT.Day);
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
            defaultValue={year}
            placeholder={intl.formatMessage(dateMessages.yearPlaceholder)}
            data-h2-width="base(100%)"
            min={1900}
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
            defaultValue={month || ""}
            data-h2-width="base(100%)"
            {...inputStyles}
          >
            <option value="">
              {intl.formatMessage(dateMessages.selectAMonth)}
            </option>
            {months.map((monthName, index) => (
              <option value={`${index + 1}`.padStart(2, "0")} key={monthName}>
                {monthName}
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
            defaultValue={day}
            max={31}
            min={1}
            placeholder={intl.formatMessage(dateMessages.dayPlaceholder)}
            data-h2-width="base(100%)"
            {...inputStyles}
          />
        </div>
      )}
    </div>
  );
};

export default ControlledInput;
