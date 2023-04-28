import React from "react";
import { useIntl } from "react-intl";

import { Accordion, HeadingRank, Separator } from "@gc-digital-talent/ui";
import {
  getAwardedTo,
  getAwardedScope,
  commonMessages,
} from "@gc-digital-talent/i18n";
import { incrementHeadingRank } from "@gc-digital-talent/ui/src/utils";

import { AwardExperience } from "~/api/generated";
import { formattedDate } from "~/utils/accordionUtils";

import { ExperienceAccordionHeader } from "../ExperienceAccordionHeader";
import ContentSection from "../ExperienceAccordionContentSection";
import SkillSection from "../SkillSection";

interface AwardContentProps
  extends Pick<
    AwardExperience,
    "issuedBy" | "details" | "awardedTo" | "awardedScope" | "skills"
  > {
  headingLevel?: HeadingRank;
}

export const AwardContent = ({
  issuedBy,
  details,
  awardedTo,
  awardedScope,
  skills,
  headingLevel,
}: AwardContentProps) => {
  const intl = useIntl();
  return (
    <>
      <div
        data-h2-display="base(flex)"
        data-h2-flex-direction="base(row)"
        data-h2-justify-content="base(space-between)"
        data-h2-margin-right="base(x1)"
      >
        <ContentSection
          title={intl.formatMessage({
            defaultMessage: "Awarded to",
            id: "YJS2CB",
            description: "The award was given to",
          })}
          headingLevel={headingLevel}
        >
          {intl.formatMessage(
            awardedTo ? getAwardedTo(awardedTo) : commonMessages.notAvailable,
          )}
        </ContentSection>

        <ContentSection
          title={intl.formatMessage({
            defaultMessage: "Issuing organization",
            id: "NGEgVN",
            description:
              "Label displayed on award form for organization section",
          })}
          headingLevel={headingLevel}
        >
          {issuedBy}
        </ContentSection>

        <ContentSection
          title={intl.formatMessage({
            defaultMessage: "Award scope",
            id: "jhhCKX",
            description: "Label displayed on award form for scope section",
          })}
          headingLevel={headingLevel}
        >
          {intl.formatMessage(
            awardedScope
              ? getAwardedScope(awardedScope)
              : commonMessages.notAvailable,
          )}
        </ContentSection>
      </div>

      <Separator
        orientation="horizontal"
        decorative
        data-h2-background-color="base(gray.lighter)"
      />

      <ContentSection
        title={intl.formatMessage({
          defaultMessage: "Tasks and responsibilities",
          id: "jDvu8u",
          description: "Heading for the tasks section of the experience form",
        })}
        headingLevel={headingLevel}
      >
        {details}
      </ContentSection>

      {skills?.map((skill) => {
        return (
          <div key={skill.id}>
            <Separator
              orientation="horizontal"
              decorative
              data-h2-background-color="base(gray.lighter)"
            />

            <SkillSection
              name={skill.name}
              record={skill.experienceSkillRecord}
              headingLevel={headingLevel}
            />
          </div>
        );
      })}
    </>
  );
};

interface AwardAccordionProps extends AwardExperience {
  headingLevel?: HeadingRank;
  editUrl?: string; // A link to edit the experience will only appear if editUrl is defined.
}

const AwardAccordion = ({
  editUrl,
  headingLevel = "h2",
  ...rest
}: AwardAccordionProps) => {
  const intl = useIntl();
  const { id, title, awardedDate } = rest;
  const contentHeadingLevel = incrementHeadingRank(headingLevel);

  return (
    <Accordion.Item value={id}>
      <ExperienceAccordionHeader
        dateRange={awardedDate ? formattedDate(awardedDate, intl) : undefined}
        headingAs={headingLevel}
        category={intl.formatMessage({
          defaultMessage: "Awards and recognition",
          id: "DRYl88",
          description: "Title for award experience section",
        })}
        editUrl={editUrl}
      >
        <span data-h2-font-weight="base(700)">{title || ""}</span>
      </ExperienceAccordionHeader>
      <Accordion.Content>
        <AwardContent headingLevel={contentHeadingLevel} {...rest} />
      </Accordion.Content>
    </Accordion.Item>
  );
};

export default AwardAccordion;
