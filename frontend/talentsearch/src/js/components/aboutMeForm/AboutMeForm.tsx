import React from "react";
import { useIntl } from "react-intl";
import { toast } from "react-toastify";
import { BasicForm, Input, RadioGroup, Select } from "@common/components/form";
import { commonMessages, errorMessages } from "@common/messages";
import { ProvinceOrTerritory, Language } from "@common/api/generated";
import { enumToOptions } from "@common/helpers/formUtils";
import { getLocale } from "@common/helpers/localize";
import { navigate } from "@common/helpers/router";
import {
  getProvinceOrTerritory,
  getLanguage,
} from "@common/constants/localizedConstants";
import { SubmitHandler } from "react-hook-form";
import ProfileFormWrapper from "../applicantProfile/ProfileFormWrapper";
import ProfileFormFooter from "../applicantProfile/ProfileFormFooter";
import {
  useUpdateUserAsUserMutation,
  useGetAboutMeQuery,
  UpdateUserAsUserMutation,
} from "../../api/generated";
import type { User, UpdateUserAsUserInput } from "../../api/generated";
import applicantProfileRoutes from "../../applicantProfileRoutes";

export type FormValues = Pick<
  User,
  | "preferredLang"
  | "currentProvince"
  | "currentCity"
  | "telephone"
  | "firstName"
  | "lastName"
  | "email"
>;

export type AboutMeUpdateHandler = (
  id: string,
  data: UpdateUserAsUserInput,
) => Promise<UpdateUserAsUserMutation["updateUserAsUser"]>;

export interface AboutMeFormProps {
  initialUser: User;
  onUpdateAboutMe: AboutMeUpdateHandler;
}

export const AboutMeForm: React.FunctionComponent<AboutMeFormProps> = ({
  initialUser,
  onUpdateAboutMe,
}) => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const paths = applicantProfileRoutes(locale);

  const formValuesToSubmitData = (data: FormValues): UpdateUserAsUserInput => ({
    ...data,
  });

  const handleSubmit: SubmitHandler<FormValues> = async (formValues) => {
    if (!initialUser.id) {
      toast.error(
        intl.formatMessage({
          defaultMessage: "Error: user not found",
          description: "Message displayed to user if user is not found",
        }),
      );
    }

    await onUpdateAboutMe(initialUser.id, formValuesToSubmitData(formValues))
      .then(() => {
        navigate(paths.aboutMe());
        toast.success(
          intl.formatMessage({
            defaultMessage: "User updated successfully!",
            description:
              "Message displayed to user after user is updated successfully.",
          }),
        );
      })
      .catch(() => {
        toast.error(
          intl.formatMessage({
            defaultMessage: "Error: updating user failed",
            description:
              "Message displayed to user after user fails to get updated.",
          }),
        );
      });
  };

  return (
    <BasicForm
      onSubmit={handleSubmit}
      options={{
        defaultValues: initialUser,
      }}
    >
      <h2 data-h2-font-size="b(h3)" data-h2-font-weight="b(700)">
        {intl.formatMessage({
          defaultMessage: "Personal Information",
          description:
            "Title for Personal Information section of the About Me form",
        })}
      </h2>
      <p>
        {intl.formatMessage({
          defaultMessage:
            "This additional personal information will be used only for communication purposes.",
          description:
            "Description for Personal Information section of the About Me form",
        })}
      </p>
      <div data-h2-flex-item="b(1of1)" data-h2-padding="b(top, m)">
        <div data-h2-padding="b(right, xxl)">
          <RadioGroup
            idPrefix="required-lang-preferences"
            legend={intl.formatMessage({
              defaultMessage: "Language preference for communication",
              description:
                "Legend text for required language preference in About Me form",
            })}
            name="preferredLang"
            rules={{ required: intl.formatMessage(errorMessages.required) }}
            items={enumToOptions(Language).map(({ value }) => ({
              value,
              label: intl.formatMessage(getLanguage(value)),
            }))}
          />
          <Select
            id="currentProvince"
            name="currentProvince"
            label={intl.formatMessage({
              defaultMessage: "Current province or territory",
              description:
                "Label for current province or territory field in About Me form",
            })}
            nullSelection={intl.formatMessage({
              defaultMessage: "Select a province or territory...",
              description:
                "Placeholder displayed on the About Me form province or territory field.",
            })}
            options={enumToOptions(ProvinceOrTerritory).map(({ value }) => ({
              value,
              label: intl.formatMessage(getProvinceOrTerritory(value)),
            }))}
            rules={{
              required: intl.formatMessage(errorMessages.required),
            }}
          />
          <Input
            id="currentCity"
            name="currentCity"
            type="text"
            label={intl.formatMessage({
              defaultMessage: "Current city",
              description: "Label for current city field in About Me form",
            })}
            placeholder={intl.formatMessage({
              defaultMessage: "Start writing here...",
              description:
                "Placeholder displayed on the About Me form current city field.",
            })}
            rules={{
              required: intl.formatMessage(errorMessages.required),
            }}
          />
          <Input
            id="telephone"
            name="telephone"
            type="text"
            label={intl.formatMessage({
              defaultMessage: "Telephone",
              description: "Label for telephone field in About Me form",
            })}
            placeholder={intl.formatMessage({
              defaultMessage: "000-000-0000",
              description:
                "Placeholder displayed on the About Me form telephone field.",
            })}
            rules={{
              required: intl.formatMessage(errorMessages.required),
            }}
          />
        </div>
      </div>
      <h2 data-h2-font-size="b(h3)" data-h2-font-weight="b(700)">
        {intl.formatMessage({
          defaultMessage: "Account Details",
          description: "Title for Account Details section of the About Me form",
        })}
      </h2>
      <p>
        {intl.formatMessage({
          defaultMessage:
            "This information is used to manage your account and to communicate.",
          description:
            "Description for Account Details section of the About Me form",
        })}
      </p>
      <div data-h2-flex-item="b(1of1)" data-h2-padding="b(top, m)">
        <div data-h2-padding="b(right, l)">
          <Input
            id="firstName"
            name="firstName"
            type="text"
            label={intl.formatMessage({
              defaultMessage: "First Name and middle Name",
              description:
                "Label for first and middle name field in About Me form",
            })}
            rules={{
              required: intl.formatMessage(errorMessages.required),
            }}
          />
          <Input
            id="lastName"
            name="lastName"
            type="text"
            label={intl.formatMessage({
              defaultMessage: "Last Name(s)",
              description: "Label for last name field in About Me form",
            })}
            rules={{
              required: intl.formatMessage(errorMessages.required),
            }}
          />
          <Input
            id="email"
            name="email"
            type="email"
            label={intl.formatMessage({
              defaultMessage: "Email",
              description: "Label for email field in About Me form",
            })}
            rules={{
              required: intl.formatMessage(errorMessages.required),
            }}
          />
        </div>
      </div>
      <ProfileFormFooter mode="saveButton" />
    </BasicForm>
  );
};

const AboutMeFormContainer: React.FunctionComponent = () => {
  const intl = useIntl();

  const [result] = useGetAboutMeQuery();
  const { data, fetching, error } = result;

  const [_, executeMutation] = useUpdateUserAsUserMutation();

  const handleUpdateUser = (id: string, values: UpdateUserAsUserInput) => {
    return executeMutation({ id, user: values }).then((res) => {
      if (res.data?.updateUserAsUser) {
        return res.data.updateUserAsUser;
      }

      return Promise.reject(res.error);
    });
  };

  if (fetching) {
    return <p>{intl.formatMessage(commonMessages.loadingTitle)}</p>;
  }

  if (error || !data?.me) {
    return (
      <p>
        {intl.formatMessage(commonMessages.loadingError)}
        {error?.message || ""}
      </p>
    );
  }

  return (
    <ProfileFormWrapper
      description={intl.formatMessage({
        defaultMessage:
          "This information is used for account management and communications purposes, it has no impact on the job matching or job recommendations.",
        description:
          "Description text for the Profile Form wrapper in the About Me form",
      })}
      title={intl.formatMessage({
        defaultMessage: "About me",
        description: "Title for Profile Form wrapper in About me form",
      })}
      crumbs={[
        {
          title: intl.formatMessage({
            defaultMessage: "About Me",
            description: "Display text for About Me Form Page Link",
          }),
        },
      ]}
    >
      <AboutMeForm initialUser={data.me} onUpdateAboutMe={handleUpdateUser} />
    </ProfileFormWrapper>
  );
};

export default AboutMeFormContainer;
