import * as React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useIntl } from "react-intl";

import { toast } from "@gc-digital-talent/toast";
import { Input, Submit } from "@gc-digital-talent/forms";
import { errorMessages } from "@gc-digital-talent/i18n";

import SEO from "~/components/SEO/SEO";
import useRoutes from "~/hooks/useRoutes";
import {
  CreateDepartmentInput,
  CreateDepartmentMutation,
  useCreateDepartmentMutation,
} from "~/api/generated";
import AdminContentWrapper from "~/components/AdminContentWrapper/AdminContentWrapper";
import adminMessages from "~/messages/adminMessages";
import AdminHero from "~/components/Hero/AdminHero";

type FormValues = CreateDepartmentInput;

interface CreateDepartmentProps {
  handleCreateDepartment: (
    data: FormValues,
  ) => Promise<CreateDepartmentMutation["createDepartment"]>;
}

export const CreateDepartmentForm = ({
  handleCreateDepartment,
}: CreateDepartmentProps) => {
  const intl = useIntl();
  const navigate = useNavigate();
  const paths = useRoutes();
  const methods = useForm<FormValues>();
  const { handleSubmit } = methods;

  const { state } = useLocation();
  const navigateTo = state?.from ?? paths.departmentTable();

  const onSubmit: SubmitHandler<FormValues> = async (data: FormValues) => {
    return handleCreateDepartment({
      departmentNumber: Number(data.departmentNumber),
      name: data.name,
    })
      .then(() => {
        navigate(navigateTo);
        toast.success(
          intl.formatMessage({
            defaultMessage: "Department created successfully!",
            id: "yGlG9e",
            description:
              "Message displayed to user after department is created successfully.",
          }),
        );
      })
      .catch(() => {
        toast.error(
          intl.formatMessage({
            defaultMessage: "Error: creating department failed",
            id: "VaVo2t",
            description:
              "Message displayed to user after department fails to get created.",
          }),
        );
      });
  };

  return (
    <section data-h2-container="base(left, s)">
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          data-h2-display="base(flex)"
          data-h2-flex-direction="base(column)"
          data-h2-gap="base(x.5 0)"
        >
          <Input
            id="departmentNumber"
            name="departmentNumber"
            label={intl.formatMessage({
              defaultMessage: "Department #",
              id: "/YiBdv",
              description:
                "Label displayed on the create a department form department number field.",
            })}
            type="number"
            rules={{
              required: intl.formatMessage(errorMessages.required),
            }}
            min="0"
          />
          <Input
            id="name_en"
            name="name.en"
            label={intl.formatMessage({
              defaultMessage: "Name (English)",
              id: "4boO/6",
              description:
                "Label displayed on the create a department form name (English) field.",
            })}
            type="text"
            rules={{
              required: intl.formatMessage(errorMessages.required),
            }}
          />
          <Input
            id="name_fr"
            name="name.fr"
            label={intl.formatMessage({
              defaultMessage: "Name (French)",
              id: "c0n+2j",
              description:
                "Label displayed on the create a department form name (French) field.",
            })}
            type="text"
            rules={{
              required: intl.formatMessage(errorMessages.required),
            }}
          />
          <div data-h2-align-self="base(flex-start)">
            <Submit />
          </div>
        </form>
      </FormProvider>
    </section>
  );
};

const CreateDepartmentPage = () => {
  const intl = useIntl();
  const routes = useRoutes();
  const [, executeMutation] = useCreateDepartmentMutation();
  const handleCreateDepartment = (data: CreateDepartmentInput) =>
    executeMutation({ department: data }).then((result) => {
      if (result.data?.createDepartment) {
        return result.data?.createDepartment;
      }
      return Promise.reject(result.error);
    });

  const navigationCrumbs = [
    {
      label: intl.formatMessage({
        defaultMessage: "Home",
        id: "EBmWyo",
        description: "Link text for the home link in breadcrumbs.",
      }),
      url: routes.adminDashboard(),
    },
    {
      label: intl.formatMessage(adminMessages.departments),
      url: routes.departmentTable(),
    },
    {
      label: intl.formatMessage({
        defaultMessage: "Create<hidden> department</hidden>",
        id: "1XaX86",
        description: "Breadcrumb title for the create department page link.",
      }),
      url: routes.departmentCreate(),
    },
  ];

  const pageTitle = intl.formatMessage({
    defaultMessage: "Create department",
    id: "PRrRRN",
    description: "Page title for the department creation page",
  });

  return (
    <>
      <SEO title={pageTitle} />
      <AdminHero
        title={pageTitle}
        nav={{ mode: "crumbs", items: navigationCrumbs }}
      />
      <AdminContentWrapper>
        <CreateDepartmentForm handleCreateDepartment={handleCreateDepartment} />
      </AdminContentWrapper>
    </>
  );
};

export default CreateDepartmentPage;
