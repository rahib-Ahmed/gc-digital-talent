import { useState } from "react";
import { useIntl } from "react-intl";
import UserCircleIcon from "@heroicons/react/24/outline/UserCircleIcon";

import { unpackMaybes } from "@gc-digital-talent/helpers";
import { Button, Heading, Well } from "@gc-digital-talent/ui";
import { Experience } from "@gc-digital-talent/graphql";
import { navigationMessages } from "@gc-digital-talent/i18n";

import ExperienceCard from "~/components/ExperienceCard/ExperienceCard";
import ExperienceSortAndFilter, {
  FormValues as ExperienceSortAndFilterFormValues,
} from "~/components/ExperienceSortAndFilter/ExperienceSortAndFilter";
import { sortAndFilterExperiences } from "~/components/ExperienceSortAndFilter/sortAndFilterUtil";
import useControlledCollapsibleGroup from "~/hooks/useControlledCollapsibleGroup";
import experienceMessages from "~/messages/experienceMessages";

interface CareerTimelineSectionProps {
  experiences: Experience[];
}

const CareerTimelineSection = ({ experiences }: CareerTimelineSectionProps) => {
  const intl = useIntl();
  const [sortAndFilterValues, setSortAndFilterValues] =
    useState<ExperienceSortAndFilterFormValues>({
      sortBy: "date_desc",
      filterBy: "none",
    });
  const nonEmptyExperiences = unpackMaybes(experiences);
  const { hasExpanded, toggleAllExpanded, toggleExpandedItem, isExpanded } =
    useControlledCollapsibleGroup(nonEmptyExperiences.map((e) => e.id));
  const experienceList = sortAndFilterExperiences(
    nonEmptyExperiences,
    sortAndFilterValues,
    intl,
  );

  const hasExperiences = !!experiences.length;

  return (
    <>
      <Heading Icon={UserCircleIcon} color="tertiary">
        {intl.formatMessage(navigationMessages.careerTimelineAndRecruitment)}
      </Heading>
      <div
        data-h2-display="base(flex)"
        data-h2-gap="base(x.5)"
        data-h2-margin-bottom="base(x.5)"
        data-h2-flex-wrap="base(wrap)"
      >
        <ExperienceSortAndFilter
          initialFormValues={sortAndFilterValues}
          onChange={(formValues) => setSortAndFilterValues(formValues)}
        />
        {hasExperiences && (
          <div
            data-h2-align-self="base(flex-end)"
            data-h2-margin-left="p-tablet(auto)"
          >
            <Button mode="inline" color="secondary" onClick={toggleAllExpanded}>
              {intl.formatMessage(
                hasExpanded
                  ? experienceMessages.collapseDetails
                  : experienceMessages.expandDetails,
              )}
            </Button>
          </div>
        )}
      </div>
      {hasExperiences ? (
        <div
          data-h2-display="base(flex)"
          data-h2-flex-direction="base(column)"
          data-h2-gap="base(x.5 0)"
        >
          {experienceList.map((experience) => (
            <ExperienceCard
              key={experience.id}
              experience={experience}
              headingLevel="h3"
              showSkills={false}
              showEdit={false}
              isOpen={isExpanded(experience.id)}
              onOpenChange={() => toggleExpandedItem(experience.id)}
            />
          ))}
        </div>
      ) : (
        <Well>
          <p data-h2-text-align="base(center)">
            {intl.formatMessage({
              defaultMessage: "No experiences found",
              id: "gHMj31",
              description:
                "Null state messages for career timeline list when no experiences are found.",
            })}
          </p>
        </Well>
      )}
    </>
  );
};

export default CareerTimelineSection;
