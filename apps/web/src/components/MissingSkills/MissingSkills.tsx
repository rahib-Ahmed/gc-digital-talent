import React from "react";
import { useIntl } from "react-intl";
import ExclamationTriangleIcon from "@heroicons/react/24/solid/ExclamationTriangleIcon";
import InformationCircleIcon from "@heroicons/react/24/solid/InformationCircleIcon";
import LightBulbIcon from "@heroicons/react/24/solid/LightBulbIcon";

import {
  Chip,
  Chips,
  Color,
  PillMode,
  Heading,
  HeadingRank,
} from "@gc-digital-talent/ui";
import { getLocale } from "@gc-digital-talent/i18n";
import type { Skill } from "@gc-digital-talent/graphql";

import {
  categorizeSkill,
  differentiateMissingSkills,
  getMissingSkills,
} from "~/utils/skillUtils";

interface MissingSkillsBlockProps {
  pillType: { color: Color; mode: PillMode };
  /** Title for the block */
  title: React.ReactNode;
  /** Message displayed before skills that are missing from application */
  skillsBlurb: React.ReactNode;
  /** Message displayed before skills that are present but missing details */
  detailsBlurb: React.ReactNode;
  /** Icon displayed next to the title */
  icon: React.ReactNode;
  /** Skills missing from the application */
  missingSkills: Skill[];
  /** Skills the user as already added */
  addedSkills?: Skill[];
  /** heading rank to display the title as */
  headingLevel: HeadingRank;
}

const MissingSkillsBlock = ({
  pillType,
  title,
  skillsBlurb,
  detailsBlurb,
  icon,
  missingSkills,
  addedSkills,
  headingLevel = "h2",
  ...rest
}: MissingSkillsBlockProps) => {
  const intl = useIntl();
  const locale = getLocale(intl);

  /** Determine which skills are missing vs present but missing details */
  const [skills, details] = differentiateMissingSkills(
    missingSkills,
    addedSkills,
  );

  return (
    <div
      data-h2-display="base(flex)"
      data-h2-padding="base(x1)"
      data-h2-radius="base(rounded)"
      {...rest}
    >
      <span data-h2-margin="base(x.15, x1, 0, 0)">{icon}</span>
      <div>
        <Heading
          level={headingLevel}
          size="h6"
          data-h2-margin="base(0, 0, x.5, 0)"
        >
          {title}
        </Heading>
        {skills.length ? (
          <>
            <p data-h2-margin="base(x.5, 0, x.25, 0)">{skillsBlurb}</p>
            <Chips>
              {skills.map((skill: Skill) => (
                <Chip
                  key={skill.id}
                  color={pillType.color}
                  mode={pillType.mode}
                  label={skill.name[locale] ?? ""}
                />
              ))}
            </Chips>
          </>
        ) : null}
        {details.length ? (
          <>
            <p data-h2-margin="base(x.5, 0, x.25, 0)">{detailsBlurb}</p>
            <Chips>
              {details.map((skill: Skill) => (
                <Chip
                  key={skill.id}
                  color={pillType.color}
                  mode={pillType.mode}
                  label={skill.name[locale] ?? ""}
                />
              ))}
            </Chips>
          </>
        ) : null}
      </div>
    </div>
  );
};

export interface MissingSkillsProps {
  requiredSkills?: Skill[];
  optionalSkills?: Skill[];
  addedSkills?: Skill[];
  headingLevel?: HeadingRank;
}

const MissingSkills = ({
  requiredSkills,
  optionalSkills,
  addedSkills,
  headingLevel = "h2",
}: MissingSkillsProps) => {
  const intl = useIntl();
  const locale = getLocale(intl);

  const byLocalizedName = (a: Skill, b: Skill) => {
    const aName = a.name?.[locale];
    const bName = b.name?.[locale];
    if (aName && bName) {
      return aName.localeCompare(bName, locale);
    }
    return 0;
  };

  const categorizedRequiredSkills = categorizeSkill(requiredSkills);
  const categorizedOptionalSkills = categorizeSkill(optionalSkills);

  const missingRequiredTechnicalSkills = getMissingSkills(
    categorizedRequiredSkills.TECHNICAL || [],
    addedSkills,
  ).sort(byLocalizedName);

  const missingRequiredBehaviouralSkills = getMissingSkills(
    [...(categorizedRequiredSkills.BEHAVIOURAL || [])] || [],
    addedSkills,
  ).sort(byLocalizedName);

  const missingOptionalSkills = getMissingSkills(
    [
      ...(categorizedOptionalSkills.TECHNICAL || []),
      ...(categorizedOptionalSkills.BEHAVIOURAL || []),
    ] || [],
    addedSkills,
  ).sort(byLocalizedName);

  return (
    <>
      {missingRequiredTechnicalSkills.length ? (
        <MissingSkillsBlock
          data-h2-shadow="base(medium)"
          data-h2-background-color="base(foreground)"
          data-h2-margin="base(0, 0, x.5, 0)"
          pillType={{ color: "error", mode: "outline" }}
          headingLevel={headingLevel}
          title={intl.formatMessage({
            defaultMessage: "Required application skills",
            id: "B89Ihf",
            description:
              "Title that appears when a user is missing required skills on their profile.",
          })}
          skillsBlurb={intl.formatMessage({
            defaultMessage:
              "These required skills are missing from your profile:",
            id: "AhQ6xv",
            description:
              "Text that appears when a user is missing required skills on their profile.",
          })}
          detailsBlurb={intl.formatMessage({
            defaultMessage: "These required skills are missing information:",
            id: "w6jDaJ",
            description:
              "Text that appears when a user is missing required skills on their profile.",
          })}
          icon={
            <ExclamationTriangleIcon
              style={{ width: "1.2rem" }}
              data-h2-color="base(error)"
            />
          }
          missingSkills={missingRequiredTechnicalSkills}
          addedSkills={addedSkills}
        />
      ) : null}
      {missingRequiredBehaviouralSkills.length ? (
        <MissingSkillsBlock
          data-h2-shadow="base(medium)"
          data-h2-background-color="base(foreground)"
          data-h2-margin="base(0, 0, x.5, 0)"
          pillType={{ color: "primary", mode: "outline" }}
          headingLevel={headingLevel}
          title={intl.formatMessage({
            defaultMessage: "Required transferable skills",
            id: "obD2sw",
            description:
              "Title that appears in transferable skills section on their profile.",
          })}
          skillsBlurb={intl.formatMessage({
            defaultMessage:
              "These skills will be assessed after you submit your application:",
            id: "LZ0Poh",
            description:
              "Text that appears in transferable skills section on their profile.",
          })}
          detailsBlurb="" // No details blurb needed for transferable skills.
          icon={
            <InformationCircleIcon
              style={{ width: "1.2rem" }}
              data-h2-color="base(primary)"
            />
          }
          missingSkills={missingRequiredBehaviouralSkills}
        />
      ) : null}
      {missingOptionalSkills.length ? (
        <MissingSkillsBlock
          data-h2-shadow="base(medium)"
          data-h2-background-color="base(foreground)"
          data-h2-margin="base(0, 0, x.5, 0)"
          pillType={{ color: "secondary", mode: "outline" }}
          headingLevel={headingLevel}
          title={intl.formatMessage({
            defaultMessage: "Nice to have skills",
            id: "CJy0kS",
            description:
              "Title that appears when a user is missing optional skills on their profile.",
          })}
          skillsBlurb={intl.formatMessage({
            defaultMessage:
              "Consider adding these asset skills to your profile:",
            id: "V3ReC1",
            description:
              "Text that appears when a user is missing optional skills on their profile",
          })}
          detailsBlurb={intl.formatMessage({
            defaultMessage:
              "Consider adding information to these asset skills:",
            id: "FckGRB",
            description:
              "Text that appears when a user is missing optional skills on their profile",
          })}
          icon={
            <LightBulbIcon
              style={{ width: "1.2rem" }}
              data-h2-color="base(secondary)"
            />
          }
          missingSkills={missingOptionalSkills}
          addedSkills={addedSkills}
        />
      ) : null}
      <div
        data-h2-display="base(flex)"
        data-h2-padding="base(x1)"
        data-h2-radius="base(rounded)"
        data-h2-shadow="base(medium)"
        data-h2-background-color="base(foreground)"
      >
        <span data-h2-margin="base(x.15, x1, 0, 0)">
          <InformationCircleIcon
            style={{ width: "1.2rem" }}
            data-h2-color="base(primary)"
          />
        </span>
        <div>
          <Heading
            level={headingLevel}
            size="h6"
            data-h2-margin="base(0, 0, x.5, 0)"
          >
            {intl.formatMessage({
              defaultMessage: "Other skills",
              id: "z3QvIv",
              description:
                "Title that appears for skills not in one of the other categories on the users profile.",
            })}
          </Heading>
          <p data-h2-margin="base(x.5, 0, x.25, 0)">
            {intl.formatMessage({
              defaultMessage:
                "Skills unrelated to this application will be hidden during the initial assessment of your application but will always be visible on your profile.",
              id: "00lloL",
              description:
                "Text that appears during an application to explain skills appearing missing from their profile.",
            })}
          </p>
        </div>
      </div>
    </>
  );
};

export default MissingSkills;
