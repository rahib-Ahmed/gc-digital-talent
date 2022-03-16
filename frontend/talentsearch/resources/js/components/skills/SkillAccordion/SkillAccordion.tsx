import * as React from "react";
import { getLocale } from "@common/helpers/localize";
import Accordion from "@common/components/accordion";
import { useIntl } from "react-intl";
import {
  getAwardedScope,
  getAwardedTo,
  getEducationStatus,
  getEducationType,
} from "@common/constants/localizedConstants";
import {
  Skill,
  Experience,
  PersonalExperience,
  WorkExperience,
  AwardExperience,
  CommunityExperience,
  EducationExperience,
  Maybe,
} from "../../../api/generated";
import {
  isAwardExperience,
  isCommunityExperience,
  isEducationExperience,
  isPersonalExperience,
  isWorkExperience,
} from "../../ExperienceAccordion/AnyExperience";

export interface SkillAccordionProps {
  skill: Skill;
}

const SkillAccordion: React.FunctionComponent<SkillAccordionProps> = ({
  skill,
}) => {
  const intl = useIntl();
  const locale = getLocale(intl);

  const { name, experienceSkills } = skill;

  const experiences: Maybe<Array<Maybe<Experience>>> = experienceSkills?.map(
    (item) => item?.experience,
  );

  const getPersonalExperience = (experience: PersonalExperience) => {
    const { title, description, startDate, endDate, details } = experience;
    return (
      <div>
        <p> {title} </p>
        <p>
          {endDate
            ? `${startDate || ""} - ${endDate || ""}`
            : intl.formatMessage(
                {
                  defaultMessage: "Since: {startDate}",
                  description: "Since",
                },
                { startDate },
              )}
        </p>
        <p> {description} </p>
        <p> {details} </p>
      </div>
    );
  };

  const getEducationExperience = (experience: EducationExperience) => {
    const {
      type,
      thesisTitle,
      startDate,
      endDate,
      details,
      status,
      areaOfStudy,
      institution,
    } = experience;
    return (
      <div>
        <p>
          {intl.formatMessage(
            {
              defaultMessage: "{areaOfStudy} at {institution}",
              description: "Study at institution",
            },
            { areaOfStudy, institution },
          )}
        </p>
        <p>
          {" "}
          {type ? intl.formatMessage(getEducationType(type)) : ""}{" "}
          {status ? intl.formatMessage(getEducationStatus(status)) : ""}{" "}
        </p>
        <p>
          {" "}
          {thesisTitle
            ? intl.formatMessage(
                {
                  defaultMessage: "Thesis: {thesisTitle}",
                  description: "Thesis, if applicable",
                },
                { thesisTitle },
              )
            : ""}{" "}
        </p>
        <p>
          {endDate
            ? `${startDate || ""} - ${endDate || ""}`
            : intl.formatMessage(
                {
                  defaultMessage: "Since: {startDate}",
                  description: "Since",
                },
                { startDate },
              )}
        </p>
        <p> {details} </p>
      </div>
    );
  };

  const getAwardExperience = (experience: AwardExperience) => {
    const { awardedDate, awardedScope, awardedTo, details, title, issuedBy } =
      experience;
    return (
      <div>
        <p>
          {intl.formatMessage(
            {
              defaultMessage: "{title} issued by {issuedBy}",
              description: "The award title is issued by some group",
            },
            { title, issuedBy },
          )}
        </p>
        <p>
          {intl.formatMessage({
            defaultMessage: "Awarded to : ",
            description: "The award was given to",
          })}{" "}
          {awardedTo ? intl.formatMessage(getAwardedTo(awardedTo)) : ""}
        </p>
        <p>
          {intl.formatMessage({
            defaultMessage: "Scope : ",
            description: "The scope of the award given",
          })}{" "}
          {awardedScope
            ? intl.formatMessage(getAwardedScope(awardedScope))
            : ""}
        </p>
        <p> {awardedDate}</p>
        <p>
          {intl.formatMessage(
            {
              defaultMessage: "Additional information: {details}",
              description: "Additional information if provided",
            },
            { details },
          )}
        </p>
      </div>
    );
  };

  const getCommunityExperience = (experience: CommunityExperience) => {
    const { startDate, endDate, project, organization, details, title } =
      experience;
    return (
      <div>
        <p>
          {intl.formatMessage(
            {
              defaultMessage: "{title} at {organization}",
              description: "Title at organization",
            },
            { title, organization },
          )}
        </p>
        <p>
          {endDate
            ? `${startDate || ""} - ${endDate || ""}`
            : intl.formatMessage(
                {
                  defaultMessage: "Since: {startDate}",
                  description: "Since",
                },
                { startDate },
              )}
        </p>
        <p>
          {" "}
          {intl.formatMessage(
            {
              defaultMessage: "Project: {project}",
              description: "Project Name",
            },
            { project },
          )}{" "}
        </p>
        <p>
          {" "}
          {intl.formatMessage(
            {
              defaultMessage: "Additional information: {details}",
              description: "Additional information if provided",
            },
            { details },
          )}{" "}
        </p>
      </div>
    );
  };

  const getWorkExperience = (experience: WorkExperience) => {
    const { startDate, endDate, role, division, organization, details } =
      experience;
    return (
      <div>
        <p>
          {intl.formatMessage(
            {
              defaultMessage: "{role} at {division}",
              description: "Role at Team, Group or Division",
            },
            { role, division },
          )}
        </p>
        <p>{organization}</p>
        <p>
          {endDate
            ? `${startDate || ""} - ${endDate || ""}`
            : intl.formatMessage(
                {
                  defaultMessage: "Since: {startDate}",
                  description: "Since",
                },
                { startDate },
              )}
        </p>
        <p>
          {intl.formatMessage(
            {
              defaultMessage: "Additional information: {details}",
              description: "Additional information if provided",
            },
            { details },
          )}
        </p>
      </div>
    );
  };

  return (
    <Accordion
      title={`${name[locale]}`}
      context={
        experiences?.length === 1
          ? intl.formatMessage({
              defaultMessage: "1 Experience",
              description: "Pluralization for one experience",
            })
          : intl.formatMessage(
              {
                defaultMessage: "{experiencesLength} Experiences",
                description: "Pluralization for zero or multiple experiences",
              },
              { experienceLength: experiences?.length },
            )
      }
    >
      <div data-h2-padding="b(left, l)">
        {experiences?.map((experience) => {
          return (
            <ul key={experience?.id}>
              <li>
                <p>
                  {isPersonalExperience(experience!)
                    ? getPersonalExperience(experience)
                    : ""}
                  {isEducationExperience(experience!)
                    ? getEducationExperience(experience)
                    : ""}
                  {isAwardExperience(experience!)
                    ? getAwardExperience(experience!)
                    : ""}
                  {isCommunityExperience(experience!)
                    ? getCommunityExperience(experience!)
                    : ""}
                  {isWorkExperience(experience!)
                    ? getWorkExperience(experience!)
                    : ""}
                </p>
              </li>
            </ul>
          );
        })}
      </div>
      <div data-h2-padding="b(left, l)" />
    </Accordion>
  );
};

export default SkillAccordion;
