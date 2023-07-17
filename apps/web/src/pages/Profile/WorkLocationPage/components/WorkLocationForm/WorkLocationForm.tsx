import React from "react";
import { SubmitHandler } from "react-hook-form";
import { useIntl } from "react-intl";
import { useNavigate } from "react-router-dom";

import {
  BasicForm,
  Checklist,
  TextArea,
  enumToOptions,
} from "@gc-digital-talent/forms";
import {
  getWorkRegionsDetailed,
  errorMessages,
  navigationMessages,
} from "@gc-digital-talent/i18n";
import { toast } from "@gc-digital-talent/toast";

import { getFullPoolTitleHtml } from "~/utils/poolUtils";
import {
  CreateWorkLocationMutation,
  WorkRegion,
  UpdateUserAsUserInput,
  User,
  PoolCandidate,
} from "~/api/generated";
import useRoutes from "~/hooks/useRoutes";
import useApplicationInfo from "~/hooks/useApplicationInfo";
import profileMessages from "~/messages/profileMessages";

import ProfileFormWrapper, {
  ProfileFormFooter,
} from "~/components/ProfileFormWrapper/ProfileFormWrapper";

export type FormValues = Pick<
  UpdateUserAsUserInput,
  "locationPreferences" | "locationExemptions"
>;
export interface WorkLocationFormProps {
  initialData: User;
  application?: PoolCandidate;
  handleWorkLocationPreference: (
    id: string,
    data: UpdateUserAsUserInput,
  ) => Promise<CreateWorkLocationMutation["updateUserAsUser"]>;
}

const WorkLocationForm = ({
  initialData,
  application,
  handleWorkLocationPreference,
}: WorkLocationFormProps) => {
  const intl = useIntl();
  const navigate = useNavigate();
  const paths = useRoutes();
  const { id: applicationId, returnRoute } = useApplicationInfo(initialData.id);

  const labels = {
    locationPreferences: intl.formatMessage({
      defaultMessage: "Work location",
      id: "nueuS8",
      description:
        "Legend for optional work preferences check list in work preferences form",
    }),
    locationExemptions: intl.formatMessage({
      defaultMessage: "Work location exceptions",
      id: "OpKC2i",
      description: "Work location exceptions label",
    }),
  };

  const dataToFormValues = (data: User): FormValues => ({
    ...data,
    locationPreferences: data.locationPreferences,
    locationExemptions: data.locationExemptions,
  });
  const formValuesToSubmitData = (
    values: FormValues,
  ): UpdateUserAsUserInput => ({
    locationPreferences: values.locationPreferences,
    locationExemptions: values.locationExemptions,
  });

  const handleSubmit: SubmitHandler<FormValues> = async (data: FormValues) => {
    await handleWorkLocationPreference(
      initialData.id,
      formValuesToSubmitData(data),
    )
      .then(() => {
        navigate(returnRoute);
        toast.success(intl.formatMessage(profileMessages.userUpdated));
      })
      .catch(() => {
        toast.error(intl.formatMessage(profileMessages.updatingFailed));
      });
  };

  const applicationBreadcrumbs = application
    ? [
        {
          label: intl.formatMessage({
            defaultMessage: "My applications",
            id: "bdDvMZ",
            description:
              "My applications breadcrumb from applicant profile wrapper.",
          }),
          url: paths.applications(application.user.id),
        },
        {
          label: getFullPoolTitleHtml(intl, application.pool),
          url: paths.pool(application.pool.id),
        },
        {
          label: intl.formatMessage(navigationMessages.stepOne),
          url: paths.application(applicationId ?? ""),
        },
        {
          label: intl.formatMessage({
            defaultMessage: "Work location",
            id: "5fF50z",
            description:
              "Display Text for the current page in Work location Form Page",
          }),
          url: `${paths.workLocation(initialData.id)}${
            applicationId ? `?applicationId=${applicationId}` : ``
          }`,
        },
      ]
    : [];

  return (
    <ProfileFormWrapper
      description={intl.formatMessage({
        defaultMessage:
          "Indicate all locations where you are willing to work, including your current location (if you are interested in working there).",
        id: "8NJbCH",
        description:
          "Description text for Profile Form wrapper in Work Location Preferences Form",
      })}
      title={intl.formatMessage({
        defaultMessage: "Work location",
        id: "nOE+8s",
        description:
          "Title for Profile Form wrapper  in Work Location Preferences Form",
      })}
      crumbs={
        applicationBreadcrumbs?.length
          ? applicationBreadcrumbs
          : [
              {
                label: intl.formatMessage({
                  defaultMessage: "Work location",
                  id: "5fF50z",
                  description:
                    "Display Text for the current page in Work location Form Page",
                }),
                url: paths.workLocation(initialData.id),
              },
            ]
      }
      prefixBreadcrumbs={!application}
    >
      <BasicForm
        cacheKey="work-location-preference-form"
        onSubmit={handleSubmit}
        labels={labels}
        options={{
          defaultValues: dataToFormValues(initialData),
        }}
      >
        <div>
          <div
            data-h2-flex-item="base(1of1)"
            data-h2-padding="base(x1, 0, 0, 0)"
          >
            <div data-h2-padding="base(0, x2, 0, 0)" data-testid="workLocation">
              <Checklist
                idPrefix="work-location"
                legend={labels.locationPreferences}
                name="locationPreferences"
                id="locationPreferences"
                items={enumToOptions(WorkRegion, [
                  WorkRegion.Telework,
                  WorkRegion.NationalCapital,
                  WorkRegion.Atlantic,
                  WorkRegion.Quebec,
                  WorkRegion.Ontario,
                  WorkRegion.North,
                  WorkRegion.Prairie,
                  WorkRegion.BritishColumbia,
                ]).map(({ value }) => ({
                  value,
                  label: intl.formatMessage(getWorkRegionsDetailed(value)),
                }))}
                rules={{
                  required: intl.formatMessage(errorMessages.required),
                }}
              />
            </div>
          </div>
          <div
            data-h2-flex-item="base(1of1)"
            data-h2-padding="base(x1, 0, 0, 0)"
          >
            <div data-h2-padding="base(0, x2, 0, 0)">
              <p>
                {intl.formatMessage({
                  defaultMessage:
                    "Indicate if there is a city that you would like to exclude from a region.",
                  id: "58x4fO",
                  description:
                    "Explanation text for Work location exceptions field in work location preference form",
                })}
              </p>
              <p data-h2-color="base(gray.dark)">
                {intl.formatMessage({
                  defaultMessage:
                    "E.g.: You want to be considered for the Quebec region, but not for Montréal.",
                  id: "qnaIOA",
                  description:
                    "Example for Work location exceptions field in work location preference form",
                })}
              </p>
            </div>
          </div>
          <div
            data-h2-flex-item="base(1of2)"
            data-h2-padding="base(x1, 0, 0, 0)"
          >
            <div data-h2-padding="base(0, x2, 0, 0)">
              <TextArea
                id="location-exemptions"
                label={labels.locationExemptions}
                name="locationExemptions"
              />
            </div>
          </div>
        </div>
        <ProfileFormFooter
          mode="saveButton"
          cancelLink={{ href: returnRoute }}
        />
      </BasicForm>
    </ProfileFormWrapper>
  );
};

export default WorkLocationForm;
