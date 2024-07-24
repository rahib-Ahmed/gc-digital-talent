import { useIntl } from "react-intl";
import isEmpty from "lodash/isEmpty";
import { Fragment, ReactNode, forwardRef } from "react";

import { Heading } from "@gc-digital-talent/ui";
import {
  insertBetween,
  notEmpty,
  unpackMaybes,
} from "@gc-digital-talent/helpers";
import {
  commonMessages,
  getEmploymentEquityGroup,
  getEmploymentEquityStatement,
  getLocale,
  getLocalizedName,
  getOperationalRequirement,
  navigationMessages,
} from "@gc-digital-talent/i18n";
import {
  graphql,
  OperationalRequirement,
  PositionDuration,
  IndigenousCommunity,
  FragmentType,
  getFragment,
} from "@gc-digital-talent/graphql";

import { getFullNameLabel } from "~/utils/nameUtils";
import PrintExperienceByType from "~/components/UserProfile/PrintExperienceByType/PrintExperienceByType";
import { anyCriteriaSelected as anyCriteriaSelectedDiversityEquityInclusion } from "~/validators/profile/diversityEquityInclusion";

import UserSkillList from "./UserSkillList";
import Display from "../Profile/components/LanguageProfile/Display";

export const ProfileDocument_Fragment = graphql(/* GraphQL */ `
  fragment ProfileDocument on User {
    id
    email
    firstName
    lastName
    telephone
    citizenship {
      value
      label {
        en
        fr
      }
    }
    armedForcesStatus {
      value
      label {
        en
        fr
      }
    }
    preferredLang {
      value
      label {
        en
        fr
      }
    }
    preferredLanguageForInterview {
      value
      label {
        en
        fr
      }
    }
    preferredLanguageForExam {
      value
      label {
        en
        fr
      }
    }
    currentProvince {
      value
      label {
        en
        fr
      }
    }
    currentCity
    lookingForEnglish
    lookingForFrench
    lookingForBilingual
    firstOfficialLanguage {
      value
      label {
        en
        fr
      }
    }
    secondLanguageExamCompleted
    secondLanguageExamValidity
    comprehensionLevel {
      value
      label {
        en
        fr
      }
    }
    writtenLevel {
      value
      label {
        en
        fr
      }
    }
    verbalLevel {
      value
      label {
        en
        fr
      }
    }
    estimatedLanguageAbility {
      value
      label {
        en
        fr
      }
    }
    isGovEmployee
    govEmployeeType {
      value
      label {
        en
        fr
      }
    }
    hasPriorityEntitlement
    priorityNumber
    locationPreferences {
      value
      label {
        en
        fr
      }
    }
    locationExemptions
    positionDuration
    acceptedOperationalRequirements {
      value
      label {
        en
        fr
      }
    }
    indigenousCommunities {
      value
      label {
        en
        fr
      }
    }
    indigenousDeclarationSignature
    hasDisability
    isVisibleMinority
    isWoman
    department {
      id
      departmentNumber
      name {
        en
        fr
      }
    }
    currentClassification {
      id
      group
      level
      name {
        en
        fr
      }
    }
    experiences {
      id
      __typename
      user {
        id
        email
      }
      details
      skills {
        id
        key
        name {
          en
          fr
        }
        description {
          en
          fr
        }
        keywords {
          en
          fr
        }
        category {
          value
          label {
            en
            fr
          }
        }
        experienceSkillRecord {
          details
        }
      }
      ... on AwardExperience {
        title
        issuedBy
        awardedDate
        awardedTo {
          value
          label {
            en
            fr
          }
        }
        awardedScope {
          value
          label {
            en
            fr
          }
        }
      }
      ... on CommunityExperience {
        title
        organization
        project
        startDate
        endDate
      }
      ... on EducationExperience {
        institution
        areaOfStudy
        thesisTitle
        startDate
        endDate
        type {
          value
          label {
            en
            fr
          }
        }
        status {
          value
          label {
            en
            fr
          }
        }
      }
      ... on PersonalExperience {
        title
        description
        startDate
        endDate
      }
      ... on WorkExperience {
        role
        organization
        division
        startDate
        endDate
      }
    }
    topTechnicalSkillsRanking {
      id
      skill {
        id
        key
        category {
          value
          label {
            en
            fr
          }
        }
        name {
          en
          fr
        }
      }
      skillLevel
      topSkillsRank
      improveSkillsRank
    }
    topBehaviouralSkillsRanking {
      id
      skill {
        id
        key
        category {
          value
          label {
            en
            fr
          }
        }
        name {
          en
          fr
        }
      }
      skillLevel
      topSkillsRank
      improveSkillsRank
    }
    improveTechnicalSkillsRanking {
      id
      skill {
        id
        key
        category {
          value
          label {
            en
            fr
          }
        }
        name {
          en
          fr
        }
      }
      skillLevel
      topSkillsRank
      improveSkillsRank
    }
    improveBehaviouralSkillsRanking {
      id
      skill {
        id
        key
        category {
          value
          label {
            en
            fr
          }
        }
        name {
          en
          fr
        }
      }
      skillLevel
      topSkillsRank
      improveSkillsRank
    }
  }
`);

interface ProfileDocumentProps {
  userQuery: FragmentType<typeof ProfileDocument_Fragment>[];
  anonymous?: boolean;
}

const PageSection = ({ children }: { children: ReactNode }) => (
  <div
    data-h2-margin-bottom="base(2rem)"
    data-h2-display="base(block)"
    data-h2-break-inside="base(avoid) base:print(avoid)"
    data-h2-break-after="base(avoid) base:print(avoid)"
  >
    {children}
  </div>
);

// If a section is too big, use this instead of PageSection to allow it to break
const BreakingPageSection = ({ children }: { children: ReactNode }) => (
  <div data-h2-margin-bottom="base(2rem)" data-h2-display="base(block)">
    {children}
  </div>
);

const ProfileDocument = forwardRef<HTMLDivElement, ProfileDocumentProps>(
  ({ userQuery, anonymous }, ref) => {
    const intl = useIntl();
    const locale = getLocale(intl);
    const results = getFragment(ProfileDocument_Fragment, userQuery);

    return (
      <div style={{ display: "none" }}>
        <div data-h2 ref={ref}>
          <div
            data-h2-font-family="base(sans) base:print(sans)"
            data-h2-padding-bottom="base(1rem)"
            data-h2-border-bottom="base(2px dashed black) base:print(2px dashed black)"
          >
            {results && (
              <div>
                <Heading level="h1" data-h2-font-weight="base(700)">
                  {intl.formatMessage(
                    {
                      defaultMessage: `{resultCount, plural,
                      =1 {Candidate profile}
                      other {Candidate profiles}
                    }`,
                      id: "mUiS9q",
                      description: "Document title for printing profiles",
                    },
                    {
                      resultCount: results.length,
                    },
                  )}
                </Heading>
              </div>
            )}
            {results &&
              results.map((initialResult, index) => {
                const result = initialResult;

                const regionPreferencesSquished =
                  result.locationPreferences?.map((region) =>
                    getLocalizedName(region?.label, intl),
                  );
                const regionPreferences = regionPreferencesSquished
                  ? insertBetween(", ", regionPreferencesSquished)
                  : "";

                const acceptedOperationalArray =
                  result.acceptedOperationalRequirements
                    ? result.acceptedOperationalRequirements.map(
                        (opRequirement) => (
                          <li key={opRequirement?.value}>
                            {getLocalizedName(opRequirement?.label, intl)}
                          </li>
                        ),
                      )
                    : null;
                const anyCriteriaSelected = !isEmpty(acceptedOperationalArray);
                const operationalRequirementsSubsetV2 = [
                  OperationalRequirement.OvertimeOccasional,
                  OperationalRequirement.OvertimeRegular,
                  OperationalRequirement.ShiftWork,
                  OperationalRequirement.OnCall,
                  OperationalRequirement.Travel,
                  OperationalRequirement.TransportEquipment,
                  OperationalRequirement.DriversLicense,
                ];
                const unselectedOperationalArray =
                  operationalRequirementsSubsetV2.filter(
                    (requirement) =>
                      !result.acceptedOperationalRequirements?.some(
                        (req) => req?.value === requirement,
                      ),
                  );
                const unacceptedOperationalArray = unselectedOperationalArray
                  ? unselectedOperationalArray.map((opRequirement) => (
                      <li key={opRequirement}>
                        {opRequirement
                          ? intl.formatMessage(
                              getOperationalRequirement(
                                opRequirement,
                                "firstPerson",
                              ),
                            )
                          : ""}
                      </li>
                    ))
                  : null;

                const nonLegacyIndigenousCommunities =
                  unpackMaybes(result.indigenousCommunities).filter(
                    (c) => c.value !== IndigenousCommunity.LegacyIsIndigenous,
                  ) || [];

                return (
                  <Fragment key={result.id}>
                    <div>
                      <PageSection>
                        <Heading level="h2" data-h2-font-weight="base(700)">
                          {anonymous ? (
                            <>
                              {getFullNameLabel(
                                result.firstName,
                                result.lastName
                                  ? `${result.lastName?.slice(0, 1)}.`
                                  : null,
                                intl,
                              )}
                            </>
                          ) : (
                            <>
                              {getFullNameLabel(
                                result.firstName,
                                result.lastName,
                                intl,
                              )}
                            </>
                          )}
                        </Heading>
                      </PageSection>
                      {!anonymous && (
                        <PageSection>
                          <Heading level="h3" data-h2-font-weight="base(700)">
                            {intl.formatMessage({
                              defaultMessage: "Contact information",
                              id: "XqF3wS",
                              description:
                                "Profile section title for contact information",
                            })}
                          </Heading>
                          {result.email && (
                            <p>
                              {intl.formatMessage(commonMessages.email)}
                              {intl.formatMessage(commonMessages.dividingColon)}
                              {result.email}
                            </p>
                          )}
                          {result.telephone && (
                            <p>
                              {intl.formatMessage(commonMessages.telephone)}
                              {intl.formatMessage(commonMessages.dividingColon)}
                              {result.telephone}
                            </p>
                          )}
                          {result.currentCity && result.currentProvince && (
                            <p>
                              {intl.formatMessage({
                                defaultMessage: "City",
                                id: "QjO3Y0",
                                description:
                                  "Label for city and province/territory",
                              })}
                              {intl.formatMessage(commonMessages.dividingColon)}
                              {result.currentCity},{" "}
                              {getLocalizedName(
                                result.currentProvince.label,
                                intl,
                              )}
                            </p>
                          )}
                          {result.preferredLang && (
                            <p>
                              {intl.formatMessage({
                                defaultMessage: "Communication language",
                                id: "BzKGyK",
                                description: "Label for communication language",
                              })}
                              {intl.formatMessage(commonMessages.dividingColon)}
                              {getLocalizedName(
                                result.preferredLang.label,
                                intl,
                              )}
                            </p>
                          )}
                          {result.preferredLanguageForInterview && (
                            <p>
                              {intl.formatMessage({
                                defaultMessage: "Spoken interview language",
                                id: "HUy0EA",
                                description:
                                  "Label for spoken interview language",
                              })}
                              {intl.formatMessage(commonMessages.dividingColon)}
                              {getLocalizedName(
                                result.preferredLanguageForInterview.label,
                                intl,
                              )}
                            </p>
                          )}
                          {result.preferredLanguageForExam && (
                            <p>
                              {intl.formatMessage({
                                defaultMessage: "Written exam language",
                                id: "Yh1Y7Z",
                                description: "Label for written exam language",
                              })}
                              {intl.formatMessage(commonMessages.dividingColon)}
                              {getLocalizedName(
                                result.preferredLanguageForExam.label,
                                intl,
                              )}
                            </p>
                          )}
                        </PageSection>
                      )}
                      <PageSection>
                        <Heading level="h3" data-h2-font-weight="base(700)">
                          {intl.formatMessage({
                            defaultMessage: "General information",
                            id: "Ot2eBH",
                            description:
                              "Title for general information section",
                          })}
                        </Heading>
                      </PageSection>
                      <PageSection>
                        <Heading level="h4" data-h2-font-weight="base(700)">
                          {intl.formatMessage(commonMessages.status)}
                        </Heading>
                        {result.armedForcesStatus !== null &&
                          result.armedForcesStatus !== undefined && (
                            <p>
                              {intl.formatMessage({
                                defaultMessage: "Member of CAF",
                                id: "ybzxmU",
                                description: "Veteran/member label",
                              })}
                              {intl.formatMessage(commonMessages.dividingColon)}
                              {getLocalizedName(
                                result.armedForcesStatus.label,
                                intl,
                              )}
                            </p>
                          )}
                        {result.citizenship ? (
                          <p>
                            {intl.formatMessage({
                              defaultMessage: "Citizenship",
                              id: "sr20Tb",
                              description: "Citizenship label",
                            })}
                            {intl.formatMessage(commonMessages.dividingColon)}
                            {getLocalizedName(result.citizenship.label, intl)}
                          </p>
                        ) : (
                          intl.formatMessage(commonMessages.notProvided)
                        )}
                      </PageSection>
                      <PageSection>
                        <Heading level="h4" data-h2-font-weight="base(700)">
                          {intl.formatMessage(
                            navigationMessages.languageInformation,
                          )}
                        </Heading>
                        <Display user={result} context="print" />
                      </PageSection>
                      <PageSection>
                        <Heading level="h4" data-h2-font-weight="base(700)">
                          {intl.formatMessage(
                            navigationMessages.governmentInformation,
                          )}
                        </Heading>
                        <p>
                          {intl.formatMessage({
                            defaultMessage: "Government of Canada employee",
                            id: "e5/v2u",
                            description:
                              "Label for status as Government of Canada employee",
                          })}
                          {intl.formatMessage(commonMessages.dividingColon)}
                          {result.isGovEmployee
                            ? intl.formatMessage(commonMessages.yes)
                            : intl.formatMessage(commonMessages.no)}
                        </p>
                        {result.isGovEmployee && result.department && (
                          <p>
                            {intl.formatMessage(commonMessages.department)}
                            {intl.formatMessage(commonMessages.dividingColon)}
                            {result.department.name[locale]}
                          </p>
                        )}
                        {result.govEmployeeType && (
                          <p>
                            {intl.formatMessage({
                              defaultMessage: "Employment type",
                              id: "2Oubfe",
                              description:
                                "Label for applicant's employment type",
                            })}
                            {intl.formatMessage(commonMessages.dividingColon)}
                            {getLocalizedName(
                              result.govEmployeeType.label,
                              intl,
                            )}
                          </p>
                        )}
                        {result.isGovEmployee &&
                          !!result.currentClassification?.group &&
                          !!result.currentClassification?.level && (
                            <p>
                              {intl.formatMessage({
                                defaultMessage:
                                  "Current group and classification",
                                id: "hV2hKJ",
                                description:
                                  "Field label before government employment group and level",
                              })}
                              {intl.formatMessage(commonMessages.dividingColon)}
                              {result.currentClassification?.group}-
                              {result.currentClassification?.level}
                            </p>
                          )}
                        <p>
                          {intl.formatMessage({
                            defaultMessage: "Priority entitlement",
                            id: "Wd/+eR",
                            description:
                              "Label for applicant's priority entitlement status",
                          })}
                          {intl.formatMessage(commonMessages.dividingColon)}
                          {result.hasPriorityEntitlement
                            ? intl.formatMessage(commonMessages.yes)
                            : intl.formatMessage(commonMessages.no)}
                        </p>
                        {result.hasPriorityEntitlement && (
                          <p>
                            {intl.formatMessage({
                              defaultMessage: "Priority number",
                              id: "mGGj/i",
                              description:
                                "Label for applicant's priority number value",
                            })}
                            {intl.formatMessage(commonMessages.dividingColon)}
                            {result.priorityNumber
                              ? result.priorityNumber
                              : intl.formatMessage(commonMessages.notProvided)}
                          </p>
                        )}
                      </PageSection>
                      <PageSection>
                        <Heading level="h4" data-h2-font-weight="base(700)">
                          {intl.formatMessage(navigationMessages.workLocation)}
                        </Heading>
                        {!isEmpty(result.locationPreferences) && (
                          <p>
                            {intl.formatMessage({
                              defaultMessage: "Work location",
                              id: "SZzC9e",
                              description: "Work location label",
                            })}
                            {intl.formatMessage(commonMessages.dividingColon)}
                            {regionPreferences}
                          </p>
                        )}
                        {!!result.locationExemptions && (
                          <p>
                            {intl.formatMessage({
                              defaultMessage: "Work location exceptions",
                              id: "OpKC2i",
                              description: "Work location exceptions label",
                            })}
                            {intl.formatMessage(commonMessages.dividingColon)}
                            {result.locationExemptions}
                          </p>
                        )}
                      </PageSection>
                      <PageSection>
                        <Heading level="h4" data-h2-font-weight="base(700)">
                          {intl.formatMessage(
                            navigationMessages.workPreferences,
                          )}
                        </Heading>
                        {result.positionDuration &&
                          result.positionDuration.includes(
                            PositionDuration.Temporary,
                          ) && (
                            <>
                              <p>
                                {intl.formatMessage({
                                  defaultMessage:
                                    "Would consider accepting a job that lasts for:",
                                  id: "j/28Dz",
                                  description:
                                    "Label for what length of position user prefers, followed by colon",
                                })}
                              </p>
                              <ul>
                                <li>
                                  {intl.formatMessage({
                                    defaultMessage:
                                      "any duration. (short term, long term, or indeterminate duration)",
                                    id: "uHx3G7",
                                    description:
                                      "Label displayed on Work Preferences form for any duration option",
                                  })}
                                </li>
                              </ul>
                            </>
                          )}
                        {result.positionDuration &&
                          !result.positionDuration.includes(
                            PositionDuration.Temporary,
                          ) && (
                            <>
                              <p>
                                {intl.formatMessage({
                                  defaultMessage:
                                    "Would consider accepting a job that lasts for:",
                                  id: "j/28Dz",
                                  description:
                                    "Label for what length of position user prefers, followed by colon",
                                })}
                              </p>
                              <ul>
                                <li>
                                  {intl.formatMessage({
                                    defaultMessage: "Permanent duration",
                                    id: "8cRL8r",
                                    description: "Permanent duration only",
                                  })}{" "}
                                </li>
                              </ul>
                            </>
                          )}
                        {anyCriteriaSelected &&
                          !isEmpty(unacceptedOperationalArray) && (
                            <>
                              <p>
                                {intl.formatMessage({
                                  defaultMessage:
                                    "Would consider accepting a job that:",
                                  id: "q3xbiI",
                                  description:
                                    "Label for what conditions a user will accept, followed by a colon",
                                })}
                              </p>
                              <ul>{acceptedOperationalArray}</ul>
                            </>
                          )}
                        {anyCriteriaSelected &&
                          !isEmpty(unacceptedOperationalArray) && (
                            <>
                              <p>
                                {intl.formatMessage({
                                  defaultMessage:
                                    "Would <strong>not consider</strong> accepting a job that:",
                                  id: "b4Kjwl",
                                  description:
                                    "would not accept job line before a list",
                                })}
                              </p>
                              <ul>{unacceptedOperationalArray}</ul>
                            </>
                          )}
                        {anyCriteriaSelected &&
                          isEmpty(unacceptedOperationalArray) && (
                            <>
                              <p>
                                {intl.formatMessage({
                                  defaultMessage:
                                    "Would consider accepting a job that:",
                                  id: "q3xbiI",
                                  description:
                                    "Label for what conditions a user will accept, followed by a colon",
                                })}
                              </p>
                              <ul>{acceptedOperationalArray}</ul>
                            </>
                          )}
                        {!anyCriteriaSelected && (
                          <>
                            <p>
                              {intl.formatMessage({
                                defaultMessage:
                                  "Would <strong>not consider</strong> accepting a job that:",
                                id: "b4Kjwl",
                                description:
                                  "would not accept job line before a list",
                              })}
                            </p>
                            <ul>{unacceptedOperationalArray}</ul>
                          </>
                        )}
                      </PageSection>
                      <PageSection>
                        <Heading level="h4" data-h2-font-weight="base(700)">
                          {intl.formatMessage(
                            navigationMessages.diversityEquityInclusion,
                          )}
                        </Heading>
                        {anyCriteriaSelectedDiversityEquityInclusion(
                          result,
                        ) && (
                          <>
                            <p>
                              {intl.formatMessage({
                                defaultMessage: "Employment equity information",
                                id: "xd9+6O",
                                description:
                                  "Label preceding what groups the user identifies as part of",
                              })}
                            </p>
                            {result.indigenousCommunities &&
                              result.indigenousCommunities.length > 0 && (
                                <div>
                                  <ul>
                                    <li>
                                      {intl.formatMessage(
                                        getEmploymentEquityStatement(
                                          "indigenous",
                                        ),
                                      )}
                                      <ul>
                                        {nonLegacyIndigenousCommunities.length >
                                        0
                                          ? nonLegacyIndigenousCommunities.map(
                                              (community) => {
                                                return (
                                                  <li key={community.value}>
                                                    {getLocalizedName(
                                                      community.label,
                                                      intl,
                                                    )}
                                                  </li>
                                                );
                                              },
                                            )
                                          : ""}
                                      </ul>
                                    </li>
                                  </ul>
                                </div>
                              )}
                            {(result.isWoman ||
                              result.isVisibleMinority ||
                              result.hasDisability) && (
                              <ul>
                                {result.isWoman && (
                                  <li>
                                    {intl.formatMessage(
                                      getEmploymentEquityGroup("woman"),
                                    )}
                                  </li>
                                )}
                                {result.isVisibleMinority && (
                                  <li>
                                    {intl.formatMessage(
                                      getEmploymentEquityGroup("minority"),
                                    )}
                                  </li>
                                )}{" "}
                                {result.hasDisability && (
                                  <li>
                                    {intl.formatMessage(
                                      getEmploymentEquityGroup("disability"),
                                    )}
                                  </li>
                                )}
                              </ul>
                            )}
                          </>
                        )}
                      </PageSection>
                      <BreakingPageSection>
                        <Heading level="h3" data-h2-font-weight="base(700)">
                          {intl.formatMessage(
                            navigationMessages.careerTimelineAndRecruitment,
                          )}
                        </Heading>
                        <PrintExperienceByType
                          experiences={result.experiences?.filter(notEmpty)}
                        />
                      </BreakingPageSection>
                      <PageSection>
                        <Heading level="h4" data-h2-font-weight="base(700)">
                          {intl.formatMessage(navigationMessages.skillShowcase)}
                        </Heading>
                        <p data-h2-margin="base(x1 0)">
                          {intl.formatMessage({
                            defaultMessage:
                              "The skill showcase allows a candidate to provide a curated series of lists that highlight their specific strengths, weaknesses and skill growth opportunities. These lists can provide you with insight into a candidate's broader skill set and where they might be interested in new skills.",
                            description:
                              "Lead-in text for a users skill showcase in a printed document",
                            id: "0M5Wtb",
                          })}
                        </p>
                        <Heading level="h5" data-h2-font-weight="base(700)">
                          {intl.formatMessage({
                            defaultMessage: "Top skills",
                            id: "SxPilM",
                            description: "Heading for a users top skills",
                          })}
                        </Heading>
                        <UserSkillList
                          technical={
                            result.topTechnicalSkillsRanking?.filter(
                              notEmpty,
                            ) ?? []
                          }
                          behavioural={
                            result.topBehaviouralSkillsRanking?.filter(
                              notEmpty,
                            ) ?? []
                          }
                        />
                        <Heading level="h5" data-h2-font-weight="base(700)">
                          {intl.formatMessage({
                            defaultMessage: "Skills to improve",
                            id: "ZAeStR",
                            description:
                              "Heading for a users skill they would like to improve",
                          })}
                        </Heading>
                        <UserSkillList
                          technical={
                            result.improveTechnicalSkillsRanking?.filter(
                              notEmpty,
                            ) ?? []
                          }
                          behavioural={
                            result.improveBehaviouralSkillsRanking?.filter(
                              notEmpty,
                            ) ?? []
                          }
                        />
                      </PageSection>
                    </div>
                    {index + 1 !== results.length && (
                      <div style={{ breakAfter: "page" }} />
                    )}
                  </Fragment>
                );
              })}
          </div>
        </div>
      </div>
    );
  },
);

export default ProfileDocument;
