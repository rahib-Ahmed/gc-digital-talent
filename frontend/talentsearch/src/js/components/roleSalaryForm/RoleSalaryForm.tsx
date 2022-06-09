import React from "react";
import { useIntl } from "react-intl";
import { BasicForm, Checklist } from "@common/components/form";
import { SubmitHandler } from "react-hook-form";
import { InformationCircleIcon } from "@heroicons/react/solid";
import { commonMessages, errorMessages } from "@common/messages";
import Button from "@common/components/Button";
import Pending from "@common/components/Pending";
import NotFound from "@common/components/NotFound";
import { toast } from "react-toastify";
import { navigate } from "@common/helpers/router";
import {
  DialogLevelOne,
  DialogLevelTwo,
  DialogLevelThreeLead,
  DialogLevelThreeAdvisor,
  DialogLevelFourLead,
  DialogLevelFourAdvisor,
} from "./dialogs";
import {
  GetRoleSalaryInfoQuery,
  UpdateUserAsUserInput,
  useGetRoleSalaryInfoQuery,
  useUpdateRoleSalaryMutation,
} from "../../api/generated";
import ProfileFormWrapper from "../applicantProfile/ProfileFormWrapper";
import ProfileFormFooter from "../applicantProfile/ProfileFormFooter";
import profileMessages from "../profile/profileMessages";
import { useApplicantProfileRoutes } from "../../applicantProfileRoutes";

export type FormValues = Pick<UpdateUserAsUserInput, "classificationRoles">;

export type RoleSalaryUpdateHandler = (
  id: string,
  data: UpdateUserAsUserInput,
) => void; // replace with Promise<void> when filling API in TODO

export interface RoleSalaryFormProps {
  initialUser: GetRoleSalaryInfoQuery | undefined;
  onUpdateRoleSalary?: RoleSalaryUpdateHandler;
}

// accessible button for modals - generate clickable inline elements resembling <a>
interface ModalButtonProps {
  click: (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => void;
  children?: React.ReactNode;
}
const ModalButton: React.FC<ModalButtonProps> = ({ click, children }) => {
  return (
    <Button
      color="black"
      mode="inline"
      data-h2-padding="b(all, none)"
      data-h2-font-size="b(caption)"
      onClick={click}
    >
      <span data-h2-font-style="b(underline)">{children}</span>
    </Button>
  );
};

export const RoleSalaryForm: React.FunctionComponent<RoleSalaryFormProps> = ({
  initialUser,
  onUpdateRoleSalary,
}) => {
  const intl = useIntl();

  // modal logic section
  const [isDialogLevel1Open, setDialogLevel1Open] =
    React.useState<boolean>(false);
  const [isDialogLevel2Open, setDialogLevel2Open] =
    React.useState<boolean>(false);
  const [isDialogLevel3LeadOpen, setDialogLevel3LeadOpen] =
    React.useState<boolean>(false);
  const [isDialogLevel3AdvisorOpen, setDialogLevel3AdvisorOpen] =
    React.useState<boolean>(false);
  const [isDialogLevel4ManagerOpen, setDialogLevel4ManagerOpen] =
    React.useState<boolean>(false);
  const [isDialogLevel4AdvisorOpen, setDialogLevel4AdvisorOpen] =
    React.useState<boolean>(false);

  // form submit logic, to be filled when API ready TODO

  const dataToFormValues = (
    data?: GetRoleSalaryInfoQuery | undefined,
  ): FormValues => {
    return {
      classificationRoles: data?.me?.expectedClassificationRoles,
    };
  };
  const formValuesToSubmitData = (
    values: FormValues,
  ): UpdateUserAsUserInput => {
    return {
      classificationRoles: values.classificationRoles,
    };
  };

  const handleSubmit: SubmitHandler<FormValues> = async (formValues) => {
    await onUpdateRoleSalary;
    return formValuesToSubmitData(formValues);
  };
  // intl styling functions section
  // bolding, adding a link, and to add a button opening modals onto text
  function bold(msg: string) {
    return <span data-h2-font-weight="b(700)">{msg}</span>;
  }
  function link(msg: string, url: string) {
    return <a href={url}>{msg}</a>;
  }
  function openModal(msg: string, setOpenStateFn: (state: boolean) => void) {
    return (
      <ModalButton
        click={(e) => {
          setOpenStateFn(true);
          e?.preventDefault();
        }}
      >
        {msg}
      </ModalButton>
    );
  }
  return (
    <ProfileFormWrapper
      title={intl.formatMessage({
        defaultMessage: "Role and Salary Expectations",
        description: "Title role and salary expectations form",
      })}
      description={intl.formatMessage({
        defaultMessage:
          "Government classifications are labels that the Government of Canada uses to group similar types of work. In the Government of Canada salary is tied to how positions are classified.",
        description: "Description for the role and salary expectation form",
      })}
      crumbs={[
        {
          title: intl.formatMessage({
            defaultMessage: "Role and Salary Expectations",
            description: "Label for role and salary link",
          }),
        },
      ]}
    >
      <BasicForm
        onSubmit={handleSubmit}
        options={{
          defaultValues: dataToFormValues(initialUser),
        }}
      >
        <p data-h2-margin="b(bottom, l)">
          {intl.formatMessage(
            {
              defaultMessage:
                "This platform is focused on hiring digital talent to work in positions classified as IT(Information Technology). Look at the following levels within the IT classification and <bold>select only</bold> the ones that represent the work you want to do.",
              description: "Blurb describing the purpose of the form",
            },
            { bold },
          )}
        </p>
        <Checklist
          idPrefix="roleSalary"
          legend={intl.formatMessage({
            defaultMessage:
              "I would like to be referred for jobs at the following levels:",
            description: "Legend for role and salary checklist form",
          })}
          rules={{
            required: intl.formatMessage(errorMessages.required),
          }}
          name="classificationRoles"
          items={[
            {
              value: "Technician",
              label: intl.formatMessage(
                {
                  defaultMessage:
                    "Level 1: Technician ($60,000 to $78,000). <openModal>Learn about IT-01</openModal>",
                  description:
                    "Checkbox label for Level IT-01 selection, ignore things in <> tags please",
                },
                {
                  openModal: (msg: string) =>
                    openModal(msg, setDialogLevel1Open),
                },
              ),
            },
            {
              value: "Analyst",
              label: intl.formatMessage(
                {
                  defaultMessage:
                    "Level 2: Analyst ($75,000 to $91,000). <openModal>Learn about IT-02</openModal>",
                  description:
                    "Checkbox label for Level IT-02 selection, ignore things in <> tags please",
                },
                {
                  openModal: (msg: string) =>
                    openModal(msg, setDialogLevel2Open),
                },
              ),
            },
            {
              value: "Team Leader",
              label: intl.formatMessage(
                {
                  defaultMessage:
                    "Level 3: Team Leader ($88,000 to $110,000). <openModal>Learn about IT-03</openModal>",
                  description:
                    "Checkbox label for Level IT-03 leader selection, ignore things in <> tags please",
                },
                {
                  openModal: (msg: string) =>
                    openModal(msg, setDialogLevel3LeadOpen),
                },
              ),
            },
            {
              value: "Technical advisor",
              label: intl.formatMessage(
                {
                  defaultMessage:
                    "Level 3: Technical Advisor ($88,000 to $110,000). <openModal>Learn about IT-03</openModal>",
                  description:
                    "Checkbox label for Level IT-03 advisor selection, ignore things in <> tags please",
                },
                {
                  openModal: (msg: string) =>
                    openModal(msg, setDialogLevel3AdvisorOpen),
                },
              ),
            },
            {
              value: "Senior advisor",
              label: intl.formatMessage(
                {
                  defaultMessage:
                    "Level 4: Senior Advisor ($101,000 to $126,000). <openModal>Learn about IT-04</openModal>",
                  description:
                    "Checkbox label for Level IT-04 senior advisor selection, ignore things in <> tags please",
                },
                {
                  openModal: (msg: string) =>
                    openModal(msg, setDialogLevel4AdvisorOpen),
                },
              ),
            },
            {
              value: "Manager",
              label: intl.formatMessage(
                {
                  defaultMessage:
                    "Level 4: Manager ($101,000 to $126,000). <openModal>Learn about IT-04</openModal>",
                  description:
                    "Checkbox label for Level IT-04 manager selection, ignore things in <> tags please",
                },
                {
                  openModal: (msg: string) =>
                    openModal(msg, setDialogLevel4ManagerOpen),
                },
              ),
            },
          ]}
        />
        <div
          data-h2-bg-color="b(lightgray)"
          data-h2-margin="b(top, m)"
          data-h2-radius="b(s)"
        >
          <p data-h2-padding="b(top-bottom, m) b(left, s)">
            <span>
              <InformationCircleIcon style={{ width: "0.9rem" }} />{" "}
              {intl.formatMessage(
                {
                  defaultMessage:
                    "<link>Click here to learn more about classifications in the Government of Canada's Digital Community.</link>",
                  description: "Link to learn more about classifications",
                },
                {
                  link: (msg: string) =>
                    link(
                      msg,
                      "https://www.canada.ca/en/government/system/digital-government/gcdigital-community/careers-digital.html",
                    ),
                },
              )}
            </span>
          </p>
        </div>
        <ProfileFormFooter mode="saveButton" />
      </BasicForm>

      <DialogLevelOne
        isOpen={isDialogLevel1Open}
        onDismiss={() => setDialogLevel1Open(false)}
      />
      <DialogLevelTwo
        isOpen={isDialogLevel2Open}
        onDismiss={() => setDialogLevel2Open(false)}
      />
      <DialogLevelThreeLead
        isOpen={isDialogLevel3LeadOpen}
        onDismiss={() => setDialogLevel3LeadOpen(false)}
      />
      <DialogLevelThreeAdvisor
        isOpen={isDialogLevel3AdvisorOpen}
        onDismiss={() => setDialogLevel3AdvisorOpen(false)}
      />
      <DialogLevelFourAdvisor
        isOpen={isDialogLevel4AdvisorOpen}
        onDismiss={() => setDialogLevel4AdvisorOpen(false)}
      />
      <DialogLevelFourLead
        isOpen={isDialogLevel4ManagerOpen}
        onDismiss={() => setDialogLevel4ManagerOpen(false)}
      />
    </ProfileFormWrapper>
  );
};

const RoleSalaryFormContainer: React.FunctionComponent = () => {
  const intl = useIntl();
  const paths = useApplicantProfileRoutes();

  const [{ data: initialData, fetching, error }] = useGetRoleSalaryInfoQuery();
  const preProfileStatus = initialData?.me?.isProfileComplete;

  const [, executeMutation] = useUpdateRoleSalaryMutation();
  const handleRoleSalary = (id: string, data: UpdateUserAsUserInput) =>
    executeMutation({
      id,
      user: data,
    }).then((result) => {
      if (result.data?.updateUserAsUser) {
        if (result.data?.updateUserAsUser?.isProfileComplete) {
          const currentProfileStatus =
            result.data?.updateUserAsUser?.isProfileComplete;
          const message = intl.formatMessage(profileMessages.profileCompleted);
          if (!preProfileStatus && currentProfileStatus) {
            toast.success(message);
          }
        }
      }
      navigate(paths.home());
      toast.success(intl.formatMessage(profileMessages.userUpdated));
      if (result.data?.updateUserAsUser) {
        return result.data.updateUserAsUser;
      }
      return Promise.reject(result.error);
    });

  if (error) {
    toast.error(intl.formatMessage(profileMessages.updatingFailed));
  }

  return (
    <Pending fetching={fetching} error={error}>
      {initialData?.me ? (
        <RoleSalaryForm
          initialUser={initialData}
          onUpdateRoleSalary={handleRoleSalary}
        />
      ) : (
        <NotFound headingMessage={intl.formatMessage(commonMessages.notFound)}>
          <p>{intl.formatMessage(profileMessages.userNotFound)}</p>
        </NotFound>
      )}
    </Pending>
  );
};

export default RoleSalaryFormContainer;
