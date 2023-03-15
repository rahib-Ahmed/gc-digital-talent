import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useIntl } from "react-intl";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import pick from "lodash/pick";
import sortBy from "lodash/sortBy";

import { toast } from "@gc-digital-talent/toast";
import {
  Select,
  Submit,
  Input,
  MultiSelectField,
  TextArea,
  unpackIds,
  enumToOptions,
} from "@gc-digital-talent/forms";
import { notEmpty } from "@gc-digital-talent/helpers";
import {
  getLocale,
  errorMessages,
  commonMessages,
  getSkillCategory,
} from "@gc-digital-talent/i18n";
import { Pending, NotFound, Heading } from "@gc-digital-talent/ui";

import SEO from "~/components/SEO/SEO";
import useRoutes from "~/hooks/useRoutes";
import {
  Skill,
  SkillFamily,
  SkillCategory,
  UpdateSkillFamilyInput,
  UpdateSkillFamilyMutation,
  useUpdateSkillFamilyMutation,
  useGetUpdateSkillFamilyDataQuery,
  Scalars,
} from "~/api/generated";
import AdminContentWrapper from "~/components/AdminContentWrapper/AdminContentWrapper";

type Option<V> = { value: V; label: string };

type FormValues = Pick<SkillFamily, "name" | "description"> & {
  skills: string[];
};

interface UpdateSkillFamilyFormProps {
  initialSkillFamily: SkillFamily;
  skills: Skill[];
  handleUpdateSkillFamily: (
    id: string,
    data: UpdateSkillFamilyInput,
  ) => Promise<UpdateSkillFamilyMutation["updateSkillFamily"]>;
}

export const UpdateSkillFamilyForm: React.FunctionComponent<
  UpdateSkillFamilyFormProps
> = ({ initialSkillFamily, skills, handleUpdateSkillFamily }) => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const navigate = useNavigate();
  const paths = useRoutes();
  const sortedSkills = sortBy(skills, (skill) => {
    return skill.name?.[locale]?.toLocaleUpperCase();
  });

  const dataToFormValues = (data: SkillFamily): FormValues => ({
    ...data,
    skills: unpackIds(data?.skills),
  });

  const formValuesToSubmitData = (
    values: FormValues,
  ): UpdateSkillFamilyInput => ({
    ...values,
    skills: {
      sync: values.skills,
    },
    name: {
      en: values.name?.en,
      fr: values.name?.fr,
    },
    description: {
      en: values.description?.en,
      fr: values.description?.fr,
    },
  });

  const methods = useForm<FormValues>({
    defaultValues: dataToFormValues(initialSkillFamily),
  });
  const { handleSubmit } = methods;

  const onSubmit: SubmitHandler<FormValues> = async (data: FormValues) => {
    return handleUpdateSkillFamily(
      initialSkillFamily.id,
      formValuesToSubmitData(data),
    )
      .then(() => {
        navigate(paths.skillFamilyTable());
        toast.success(
          intl.formatMessage({
            defaultMessage: "Skill family updated successfully!",
            id: "2ekC5r",
            description:
              "Message displayed to user after skillFamily is updated successfully.",
          }),
        );
      })
      .catch(() => {
        toast.error(
          intl.formatMessage({
            defaultMessage: "Error: updating skill family failed",
            id: "zpwZSQ",
            description:
              "Message displayed to user after skillFamily fails to get updated.",
          }),
        );
      });
  };

  const skillOptions: Option<string>[] = sortedSkills.map(({ id, name }) => ({
    value: id,
    label: name?.[locale] || "",
  }));

  return (
    <section data-h2-container="base(left, s)">
      <Heading level="h1" size="h2">
        {intl.formatMessage({
          defaultMessage: "Update Skill Family",
          id: "GQskY1",
          description: "Title displayed on the update a skillFamily form.",
        })}
      </Heading>
      <div>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Input
              id="name_en"
              name="name.en"
              label={intl.formatMessage({
                defaultMessage: "Name (English)",
                id: "2wo24b",
                description:
                  "Label displayed on the create a skill family form name (English) field.",
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
                id: "0oqRIl",
                description:
                  "Label displayed on the create a skill family form name (French) field.",
              })}
              type="text"
              rules={{
                required: intl.formatMessage(errorMessages.required),
              }}
            />
            <TextArea
              id="description_en"
              name="description.en"
              label={intl.formatMessage({
                defaultMessage: "Description (English)",
                id: "luZnRG",
                description:
                  "Label displayed on the create a skill family form description (English) field.",
              })}
              rules={{
                required: intl.formatMessage(errorMessages.required),
              }}
            />
            <TextArea
              id="description_fr"
              name="description.fr"
              label={intl.formatMessage({
                defaultMessage: "Description (French)",
                id: "Q0gIlv",
                description:
                  "Label displayed on the create a skill family form description (French) field.",
              })}
              rules={{
                required: intl.formatMessage(errorMessages.required),
              }}
            />
            <Select
              id="category"
              name="category"
              label={intl.formatMessage({
                defaultMessage: "Category",
                id: "KZR3ad",
                description:
                  "Label displayed on the skill family form category field.",
              })}
              nullSelection={intl.formatMessage({
                defaultMessage: "Select a category...",
                id: "rna1rM",
                description:
                  "Placeholder displayed on the skill family form category field.",
              })}
              rules={{
                required: intl.formatMessage(errorMessages.required),
              }}
              options={enumToOptions(SkillCategory).map(({ value }) => ({
                value,
                label: intl.formatMessage(getSkillCategory(value)),
              }))}
            />
            <div data-h2-margin="base(x1, 0)">
              <MultiSelectField
                id="skills"
                name="skills"
                label={intl.formatMessage({
                  defaultMessage: "Skills",
                  id: "F2Rs/C",
                  description:
                    "Label displayed on the skill family form skills field.",
                })}
                placeholder={intl.formatMessage({
                  defaultMessage: "Select one or more skills...",
                  id: "7Cx7lp",
                  description:
                    "Placeholder displayed on the skill family form skills field.",
                })}
                options={skillOptions}
              />
            </div>
            <Submit />
          </form>
        </FormProvider>
      </div>
    </section>
  );
};

type RouteParams = {
  skillFamilyId: Scalars["ID"];
};

const UpdateSkillFamilyPage = () => {
  const intl = useIntl();
  const routes = useRoutes();
  const { skillFamilyId } = useParams<RouteParams>();
  const [{ data: lookupData, fetching, error }] =
    useGetUpdateSkillFamilyDataQuery({
      variables: { id: skillFamilyId || "" },
    });
  const skills: Skill[] | [] = lookupData?.skills.filter(notEmpty) ?? [];

  const [, executeMutation] = useUpdateSkillFamilyMutation();
  const handleUpdateSkillFamily = (
    id: string,
    formData: UpdateSkillFamilyInput,
  ) =>
    /* We must pick only the fields belonging to UpdateSkillFamilyInput, because its possible
       the data object contains other props at runtime, and this will cause the
       graphql operation to fail. */
    executeMutation({
      id,
      skillFamily: pick(formData, [
        "category",
        "description",
        "name",
        "skills",
      ]),
    }).then((result) => {
      if (result.data?.updateSkillFamily) {
        return result.data?.updateSkillFamily;
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
      label: intl.formatMessage({
        defaultMessage: "Skill families",
        id: "yeXUjo",
        description: "Breadcrumb title for the skill families page link.",
      }),
      url: routes.skillFamilyTable(),
    },
    ...(skillFamilyId
      ? [
          {
            label: intl.formatMessage({
              defaultMessage: "Edit",
              id: "c/5Kjx",
              description:
                "Breadcrumb title for the edit skill family page link.",
            }),
            url: routes.skillFamilyUpdate(skillFamilyId),
          },
        ]
      : []),
  ];

  return (
    <AdminContentWrapper crumbs={navigationCrumbs}>
      <SEO
        title={intl.formatMessage({
          defaultMessage: "Edit skill family",
          id: "azdo5+",
          description: "Page title for the skill family edit page",
        })}
      />
      <Pending fetching={fetching} error={error}>
        {lookupData?.skillFamily ? (
          <UpdateSkillFamilyForm
            initialSkillFamily={lookupData?.skillFamily}
            skills={skills}
            handleUpdateSkillFamily={handleUpdateSkillFamily}
          />
        ) : (
          <NotFound
            headingMessage={intl.formatMessage(commonMessages.notFound)}
          >
            <p>
              {intl.formatMessage(
                {
                  defaultMessage: "SkillFamily {skillFamilyId} not found.",
                  id: "ZWnKEJ",
                  description: "Message displayed for skillFamily not found.",
                },
                { skillFamilyId },
              )}
            </p>
          </NotFound>
        )}
      </Pending>
    </AdminContentWrapper>
  );
};

export default UpdateSkillFamilyPage;
