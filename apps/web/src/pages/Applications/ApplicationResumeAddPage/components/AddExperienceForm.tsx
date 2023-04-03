import React from "react";
import { useIntl } from "react-intl";
import { useNavigate } from "react-router-dom";
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";

import { toast } from "@gc-digital-talent/toast";
import { Button, Heading, Link, Separator } from "@gc-digital-talent/ui";
import { Select } from "@gc-digital-talent/forms";
import { errorMessages } from "@gc-digital-talent/i18n";
import { useAuthorization } from "@gc-digital-talent/auth";

import useRoutes from "~/hooks/useRoutes";
import { useExperienceMutations } from "~/hooks/useExperienceMutations";
import { Scalars } from "~/api/generated";
import { formValuesToSubmitData } from "~/utils/experienceUtils";
import {
  FormValues,
  AllFormValues,
  ExperienceType,
} from "~/pages/Profile/ExperienceFormPage/types";
import TasksAndResponsibilities from "~/components/ExperienceFormFields/TasksAndResponsibilities";
import ExperienceDetails from "~/components/ExperienceFormFields/ExperienceDetails";

import { experienceTypeTitles } from "../messages";

type FormAction = "return" | "add-another";
type ExperienceFormValues = FormValues<AllFormValues> & {
  type: ExperienceType | "";
  action: FormAction | "";
};
export interface AddExperienceFormProps {
  applicationId: Scalars["ID"];
}

const AddExperienceForm = ({ applicationId }: AddExperienceFormProps) => {
  const intl = useIntl();
  const navigate = useNavigate();
  const paths = useRoutes();
  const { user } = useAuthorization();
  const methods = useForm<ExperienceFormValues>();
  const {
    watch,
    register,
    setValue,
    formState: { isSubmitSuccessful },
    reset,
  } = methods;
  const [type, action] = watch(["type", "action"]);
  const { executeMutation, getMutationArgs } = useExperienceMutations(
    "create",
    type,
  );
  const actionProps = register("action");

  const handleSubmit: SubmitHandler<ExperienceFormValues> = async (
    formValues,
  ) => {
    const submitData = formValuesToSubmitData(type, formValues, []);
    const args = getMutationArgs(user?.id || "", submitData);
    if (executeMutation) {
      executeMutation(args)
        .then((res) => {
          if (res.data) {
            toast.success(
              intl.formatMessage({
                defaultMessage: "Successfully added experience!",
                id: "DZ775N",
                description:
                  "Success message displayed after adding experience to profile",
              }),
            );
            if (formValues.action !== "add-another") {
              navigate(paths.applicationResume(applicationId));
            }
          }
        })
        .catch(() => {
          toast.error(
            intl.formatMessage({
              defaultMessage: "Error: adding experience failed",
              id: "moKAQP",
              description:
                "Message displayed to user after experience fails to be created.",
            }),
          );
        });
    }
  };

  React.useEffect(() => {
    if (action === "add-another" && isSubmitSuccessful) {
      window.scrollTo(0, 0);
      reset();
    }
  }, [isSubmitSuccessful, reset, action]);

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(handleSubmit)}>
        <Heading level="h3">
          {intl.formatMessage({
            defaultMessage: "Select a type of experience",
            id: "jw6Umr",
            description:
              "Heading for the experience type section fo the experience form",
          })}
        </Heading>
        <Select
          label={intl.formatMessage({
            defaultMessage: "Experience type",
            id: "chnoRd",
            description: "Label for the type of experience a user is creating",
          })}
          name="type"
          id="type"
          doNotSort
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
        <ExperienceDetails />
        <TasksAndResponsibilities />
        <Separator
          orientation="horizontal"
          decorative
          data-h2-background="base(black.light)"
          data-h2-margin="base(x2, 0)"
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
            value="return"
            {...actionProps}
            onClick={() => setValue("action", "return")}
          >
            {intl.formatMessage({
              defaultMessage: "Save and go back",
              id: "CuHYqt",
              description: "Text for save button on profile form.",
            })}
          </Button>
          <Button
            type="submit"
            mode="inline"
            {...actionProps}
            onClick={() => setValue("action", "add-another")}
          >
            {intl.formatMessage({
              defaultMessage: "Save and add another",
              id: "+7v9Dq",
              description:
                "Text for save button and add another button on experience form.",
            })}
          </Button>
          <Link
            type="button"
            mode="inline"
            color="secondary"
            href={paths.applicationResume(applicationId)}
          >
            {intl.formatMessage({
              defaultMessage: "Cancel and go back",
              id: "rMYmPd",
              description: "Label for cancel button on profile form.",
            })}
          </Link>
        </div>
      </form>
    </FormProvider>
  );
};

export default AddExperienceForm;
