import React from "react";
import { useWatch } from "react-hook-form";
import { useIntl } from "react-intl";

import { Heading } from "@gc-digital-talent/ui";

import { ExperienceType } from "~/types/experience";

import { Select } from "@gc-digital-talent/forms";
import { errorMessages } from "@gc-digital-talent/i18n";
import { experienceTypeTitles } from "~/pages/Applications/ApplicationCareerTimelineAddPage/messages";

interface ExperienceTypeProps {
  experienceType?: ExperienceType;
}

const SelectExperience = ({ experienceType }: ExperienceTypeProps) => {
  const intl = useIntl();
  const type: ExperienceType = useWatch({ name: "experienceType" });
  const derivedType = type ?? experienceType;

  return (
    <section data-h2-margin="base(0, 0, x2, 0)">
      <Heading level="h3" size="h5" data-h2-margin-bottom="base(x.5)">
        {intl.formatMessage({
          defaultMessage: "Select a type of experience",
          id: "jw6Umr",
          description:
            "Heading for the experience type section for the experience form",
        })}
      </Heading>
      <Select
        label={intl.formatMessage({
          defaultMessage: "Experience type",
          id: "chnoRd",
          description: "Label for the type of experience a user is creating",
        })}
        name="experienceType"
        id="experienceType"
        doNotSort
        defaultValue={derivedType ?? ""}
        rules={{ required: intl.formatMessage(errorMessages.required) }}
        nullSelection={intl.formatMessage({
          defaultMessage: "Select a type",
          id: "5PUycY",
          description: "Default selection for the experience type field",
        })}
        options={[
          {
            value: "work",
            label: intl.formatMessage(experienceTypeTitles.work),
          },
          {
            value: "education",
            label: intl.formatMessage(experienceTypeTitles.education),
          },
          {
            value: "community",
            label: intl.formatMessage(experienceTypeTitles.community),
          },
          {
            value: "personal",
            label: intl.formatMessage(experienceTypeTitles.personal),
          },
          {
            value: "award",
            label: intl.formatMessage(experienceTypeTitles.award),
          },
        ]}
      />
    </section>
  );
};

export default SelectExperience;
