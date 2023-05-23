import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { defineMessages, useIntl } from "react-intl";
import { useNavigate, useParams } from "react-router-dom";
import PresentationChartBarIcon from "@heroicons/react/20/solid/PresentationChartBarIcon";
import uniqueId from "lodash/uniqueId";

import {
  Button,
  Heading,
  Pending,
  Separator,
  ThrowNotFound,
} from "@gc-digital-talent/ui";
import {
  ApplicationStep,
  EducationRequirementOption,
  Experience,
  useGetApplicationQuery,
  useGetMyExperiencesQuery,
  useUpdateApplicationMutation,
} from "@gc-digital-talent/graphql";
import { toast } from "@gc-digital-talent/toast";
import useRoutes from "~/hooks/useRoutes";
import {
  isAwardExperience,
  isCommunityExperience,
  isEducationExperience,
  isPersonalExperience,
  isWorkExperience,
} from "~/utils/experienceUtils";
import applicationMessages from "~/messages/applicationMessages";

import { RadioGroup } from "@gc-digital-talent/forms";
import { Radio } from "@gc-digital-talent/forms/src/components/RadioGroup";
import { errorMessages } from "@gc-digital-talent/i18n";
import { notEmpty } from "@gc-digital-talent/helpers";
import { useFeatureFlags } from "@gc-digital-talent/env";
import { GetPageNavInfo } from "~/types/applicationStep";
import { ExperienceForDate } from "~/types/experience";
import { ApplicationPageProps } from "../ApplicationApi";
import LinkResume from "./LinkResume";
import { useApplicationContext } from "../ApplicationContext";

const appliedWorkListMessages = defineMessages({
  onTheJob: {
    defaultMessage: "On-the-job learning",
    id: "fvE7Cx",
    description:
      "List item in applied work option in application education page.",
  },
  nonConventional: {
    defaultMessage: "Non-conventional training",
    id: "DEUOhY",
    description:
      "List item in applied work option in application education page.",
  },
  formalEducation: {
    defaultMessage: "Formal education",
    id: "RtJ+34",
    description:
      "List item in applied work option in application education page.",
  },
  other: {
    defaultMessage: "Other field related experience",
    id: "CnbI8J",
    description:
      "List item in applied work option in application education page.",
  },
});

type EducationRequirementExperiences = {
  educationRequirementAwardExperiences: { sync: string[] };
  educationRequirementCommunityExperiences: { sync: string[] };
  educationRequirementEducationExperiences: { sync: string[] };
  educationRequirementPersonalExperiences: { sync: string[] };
  educationRequirementWorkExperiences: { sync: string[] };
};

type PageAction = "continue" | "cancel";

type FormValues = {
  educationRequirement:
    | EducationRequirementOption.AppliedWork
    | EducationRequirementOption.Education;
  educationRequirementExperiences: string[]; // List of ids
  action: PageAction;
};

export const getPageInfo: GetPageNavInfo = ({
  application,
  paths,
  intl,
  stepOrdinal,
}) => {
  const path = paths.applicationEducation(application.id);
  return {
    title: intl.formatMessage({
      defaultMessage: "Minimum experience or education",
      id: "6esMaA",
      description: "Page title for the application education page",
    }),
    subtitle: intl.formatMessage({
      defaultMessage:
        "Confirm you have the minimum experience or equivalent education for the role.",
      id: "gtns9R",
      description: "Subtitle for the application education  page",
    }),
    icon: PresentationChartBarIcon,
    crumbs: [
      {
        url: path,
        label: intl.formatMessage(applicationMessages.numberedStep, {
          stepOrdinal,
        }),
      },
    ],
    link: {
      url: path,
      label: intl.formatMessage({
        defaultMessage: "Education requirements",
        id: "dlJCeM",
        description: "Link text for the application education page",
      }),
    },
  };
};

interface ApplicationEducationProps extends ApplicationPageProps {
  experiences: Array<ExperienceForDate>;
}

const ApplicationEducation = ({
  application,
  experiences,
}: ApplicationEducationProps) => {
  const intl = useIntl();
  const paths = useRoutes();
  const navigate = useNavigate();
  const { applicantDashboard } = useFeatureFlags(); // TODO: Remove once feature flag has been turned on.
  const { followingPageUrl, currentStepOrdinal, isIAP } =
    useApplicationContext();
  const pageInfo = getPageInfo({
    intl,
    paths,
    application,
    stepOrdinal: currentStepOrdinal,
  });
  const nextStep =
    followingPageUrl ?? paths.applicationSkillsIntro(application.id);
  const previousStep = paths.applicationResume(application.id);
  const cancelPath = applicantDashboard ? paths.dashboard() : paths.myProfile();

  const methods = useForm<FormValues>({
    defaultValues: {
      // Only show default values if applicant has previously submitted data.
      ...(application.educationRequirementOption && {
        educationRequirement: application.educationRequirementOption,
      }),
      ...(application.educationRequirementExperiences && {
        educationRequirementExperiences:
          application.educationRequirementExperiences
            .filter(notEmpty)
            .map(({ id }) => {
              return id;
            }),
      }),
    },
  });
  const { register, setValue, watch } = methods;
  const watchEducationRequirement = watch("educationRequirement");
  const actionProps = register("action");

  const [, executeMutation] = useUpdateApplicationMutation();
  const handleSubmit = (formValues: FormValues) => {
    const includesExperience = (id: string) =>
      formValues.educationRequirementExperiences.includes(id);

    const isValid =
      formValues.educationRequirement &&
      formValues.educationRequirementExperiences &&
      ((formValues.educationRequirement ===
        EducationRequirementOption.AppliedWork &&
        formValues.educationRequirementExperiences.length > 0) ||
        (formValues.educationRequirement ===
          EducationRequirementOption.Education &&
          experiences.filter(
            (experience) =>
              isEducationExperience(experience as ExperienceForDate) &&
              includesExperience(experience.id),
          ).length > 0));

    if (isValid) {
      const emptyEducationRequirementExperiences: EducationRequirementExperiences =
        {
          educationRequirementAwardExperiences: { sync: [] },
          educationRequirementCommunityExperiences: { sync: [] },
          educationRequirementEducationExperiences: { sync: [] },
          educationRequirementPersonalExperiences: { sync: [] },
          educationRequirementWorkExperiences: { sync: [] },
        };

      // Gets all experiences by type that have been selected by the applicant.
      const allExperiences = experiences.reduce(
        (
          accumulator: EducationRequirementExperiences,
          experience: Experience,
        ) => {
          return {
            ...accumulator,
            ...(isAwardExperience(experience) &&
              includesExperience(experience.id) && {
                educationRequirementAwardExperiences: {
                  sync: [
                    ...accumulator.educationRequirementAwardExperiences.sync,
                    experience.id,
                  ],
                },
              }),
            ...(isCommunityExperience(experience) &&
              includesExperience(experience.id) && {
                educationRequirementCommunityExperiences: {
                  sync: [
                    ...accumulator.educationRequirementCommunityExperiences
                      .sync,
                    experience.id,
                  ],
                },
              }),
            ...(isEducationExperience(experience) &&
              includesExperience(experience.id) && {
                educationRequirementEducationExperiences: {
                  sync: [
                    ...accumulator.educationRequirementEducationExperiences
                      .sync,
                    experience.id,
                  ],
                },
              }),
            ...(isPersonalExperience(experience) &&
              includesExperience(experience.id) && {
                educationRequirementPersonalExperiences: {
                  sync: [
                    ...accumulator.educationRequirementPersonalExperiences.sync,
                    experience.id,
                  ],
                },
              }),
            ...(isWorkExperience(experience) &&
              includesExperience(experience.id) && {
                educationRequirementWorkExperiences: {
                  sync: [
                    ...accumulator.educationRequirementWorkExperiences.sync,
                    experience.id,
                  ],
                },
              }),
          };
        },
        emptyEducationRequirementExperiences,
      );

      // Only save education experiences IF the applicant selects "I meet the post-secondary option".
      // Otherwise, save all experiences.
      const educationRequirementExperiences =
        formValues.educationRequirement === EducationRequirementOption.Education
          ? {
              ...emptyEducationRequirementExperiences,
              educationRequirementEducationExperiences:
                allExperiences.educationRequirementEducationExperiences,
            }
          : allExperiences;

      executeMutation({
        id: application.id,
        application: {
          educationRequirementOption: formValues.educationRequirement,
          ...educationRequirementExperiences,
          ...(formValues.action === "continue" && {
            insertSubmittedStep: ApplicationStep.EducationRequirements,
          }),
        },
      })
        .then((res) => {
          if (!res.error) {
            toast.success(
              intl.formatMessage({
                defaultMessage:
                  "Successfully updated your education requirement!",
                id: "QYlwuE",
                description:
                  "Message displayed to users when saving education requirement is successful.",
              }),
            );
            navigate(formValues.action === "continue" ? nextStep : cancelPath);
          }
        })
        .catch(() => {
          toast.error(
            intl.formatMessage({
              defaultMessage: "Error: updating education requirement failed",
              id: "ZCUy93",
              description:
                "Message displayed to user after education requirement fails to be updated.",
            }),
          );
        });
    } else {
      toast.error(
        intl.formatMessage({
          defaultMessage:
            "It looks like you haven't added any education experiences to your résumé yet.",
          id: "Td1lSw",
          description:
            "Alert message informing user to add education experience in application education page.",
        }),
      );
    }
  };

  const educationRequirementOptions: Radio[] = [
    {
      value: EducationRequirementOption.AppliedWork,
      label: intl.formatMessage({
        defaultMessage: "I meet the applied work experience option",
        id: "9+kmjB",
        description:
          "Radio group option for education requirement filter in application education form.",
      }),
      contentBelow: (
        <div data-h2-margin="base(x.5, 0, x.5, x1)">
          <p data-h2-margin="base(0, 0, x.5, 0)">
            {intl.formatMessage({
              defaultMessage:
                "Combined experience in computer science, information technology information management or another specialty relevant to this advertisement, including any of the following:",
              id: "MQUZaf",
              description:
                "Message under radio button in application education page.",
            })}
          </p>
          <ul>
            {Object.values(appliedWorkListMessages).map((value) => (
              <li key={uniqueId()} data-h2-margin="base(0, 0, x.25, 0)">
                {intl.formatMessage(value)}
              </li>
            ))}
          </ul>
        </div>
      ),
    },
    {
      value: EducationRequirementOption.Education,
      label: isIAP
        ? intl.formatMessage({
            defaultMessage: "I have a high school diploma or GED equivalent.",
            id: "u1Jsln",
            description:
              "Radio group option for education requirement filter in Indigenous apprenticeship application education form.",
          })
        : intl.formatMessage({
            defaultMessage: "I meet the 2-year post-secondary option",
            id: "rGqohv",
            description:
              "Radio group option for education requirement filter in application education form.",
          }),
      contentBelow: (
        <div data-h2-margin="base(x.5, 0, x.5, x1)">
          <p>
            {isIAP
              ? intl.formatMessage({
                  defaultMessage:
                    "Successful completion of a standard high school diploma or general education development (GED) equivalent.",
                  id: "60tHBx",
                  description:
                    "Message under radio button in Indigenous apprenticeship application education page.",
                })
              : intl.formatMessage({
                  defaultMessage:
                    "Successful completion of two years of post secondary education in computer science, information technology, information management or another specialty relevant to this advertisement.",
                  id: "socp8t",
                  description:
                    "Message under radio button in application education page.",
                })}
          </p>
        </div>
      ),
    },
  ];

  return (
    <>
      <Heading data-h2-margin="base(0, 0, x2, 0)">{pageInfo.title}</Heading>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(handleSubmit)}>
          <Heading
            level="h6"
            data-h2-margin="base(0, 0, x1, 0)"
            data-h2-font-weight="base(800)"
          >
            {intl.formatMessage({
              defaultMessage: "Select which criteria you meet",
              id: "yJnGeT",
              description:
                "Heading for radio group section in application education page.",
            })}
          </Heading>
          <p data-h2-margin="base(0, 0, x1, 0)">
            {intl.formatMessage({
              defaultMessage:
                "To help us understand how you meet the minimum experience or education criteria, please identify which of the options you meet, as well as which experiences in your résumé apply. If both apply to you, that’s great! Feel free to select the option that best reflects your qualifications.",
              id: "qEYoGS",
              description:
                "Description for radio group section in application education page.",
            })}
          </p>
          <RadioGroup
            idPrefix="education_requirement"
            legend={intl.formatMessage({
              defaultMessage: "Select the option the applies to you",
              id: "3O0s49",
              description:
                "Legend for the  radio group in the application education page.",
            })}
            name="educationRequirement"
            items={educationRequirementOptions}
            rules={{
              required: intl.formatMessage(errorMessages.required),
            }}
          />
          <LinkResume
            experiences={experiences}
            watchEducationRequirement={watchEducationRequirement}
            previousStepPath={previousStep}
          />
          <Separator
            orientation="horizontal"
            decorative
            data-h2-background="base(black.light)"
            data-h2-margin="base(x2, 0, x2, 0)"
          />
          <div
            data-h2-display="base(flex)"
            data-h2-gap="base(x.25, x.5)"
            data-h2-flex-wrap="base(wrap)"
            data-h2-flex-direction="base(column) l-tablet(row)"
            data-h2-align-items="base(flex-start) l-tablet(center)"
          >
            <Button
              type="submit"
              mode="solid"
              value="continue"
              {...actionProps}
              onClick={() => {
                setValue("action", "continue");
              }}
            >
              {intl.formatMessage(applicationMessages.saveContinue)}
            </Button>
            <Button
              type="submit"
              mode="inline"
              color="secondary"
              value="cancel"
              {...actionProps}
              onClick={() => {
                setValue("action", "cancel");
              }}
            >
              {intl.formatMessage(applicationMessages.saveQuit)}
            </Button>
          </div>
        </form>
      </FormProvider>
    </>
  );
};

const ApplicationEducationPage = () => {
  const { applicationId } = useParams();
  const [
    {
      data: applicationData,
      fetching: applicationFetching,
      error: applicationError,
      stale: applicationStale,
    },
  ] = useGetApplicationQuery({
    variables: {
      id: applicationId || "",
    },
    requestPolicy: "cache-first",
  });
  const [
    {
      data: experienceData,
      fetching: experienceFetching,
      error: experienceError,
    },
  ] = useGetMyExperiencesQuery();

  const application = applicationData?.poolCandidate;
  const experiences = experienceData?.me?.experiences as ExperienceForDate[];

  return (
    <Pending
      fetching={applicationFetching || experienceFetching || applicationStale}
      error={applicationError || experienceError}
    >
      {application?.poolAdvertisement ? (
        <ApplicationEducation
          application={application}
          experiences={experiences}
        />
      ) : (
        <ThrowNotFound />
      )}
    </Pending>
  );
};

export default ApplicationEducationPage;
