import { useNavigate, useLocation } from "react-router-dom";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useIntl } from "react-intl";
import { useMutation, useQuery } from "urql";
import { ReactNode } from "react";

import {
  Checkbox,
  Input,
  RadioGroup,
  Select,
  Submit,
  TextArea,
  localizedEnumToOptions,
  objectsToSortedOptions,
} from "@gc-digital-talent/forms";
import { Heading, Link, Pending, Separator } from "@gc-digital-talent/ui";
import {
  errorMessages,
  enumInputToLocalizedEnum,
  sortPoolCandidateSearchRequestReason,
} from "@gc-digital-talent/i18n";
import { notEmpty, unpackMaybes } from "@gc-digital-talent/helpers";
import { toast } from "@gc-digital-talent/toast";
import {
  getFromSessionStorage,
  removeFromSessionStorage,
  setInSessionStorage,
} from "@gc-digital-talent/storage";
import {
  EquitySelections,
  CreatePoolCandidateSearchRequestInput,
  Maybe,
  DepartmentBelongsTo,
  Classification,
  OperationalRequirement,
  Pool,
  Skill,
  ApplicantFilter,
  ApplicantFilterInput,
  PoolCandidateSearchPositionType,
  type RequestForm_CreateRequestMutation as CreateRequestMutation,
  graphql,
  FragmentType,
  getFragment,
  PoolStream,
} from "@gc-digital-talent/graphql";

import SEO from "~/components/SEO/SEO";
import SearchRequestFilters from "~/components/SearchRequestFilters/SearchRequestFilters";
import useRoutes from "~/hooks/useRoutes";
import {
  BrowserHistoryState,
  FormValues as SearchFormValues,
} from "~/types/searchRequest";

const directiveLink = (chunks: ReactNode, href: string) => (
  <Link href={href} newTab>
    {chunks}
  </Link>
);
// Have to explicitly define this type since the backing object of the form has to be fully nullable.
type FormValues = {
  fullName?: CreatePoolCandidateSearchRequestInput["fullName"];
  email?: CreatePoolCandidateSearchRequestInput["email"];
  jobTitle?: CreatePoolCandidateSearchRequestInput["jobTitle"];
  managerJobTitle?: CreatePoolCandidateSearchRequestInput["managerJobTitle"];
  positionType?: boolean;
  reason: CreatePoolCandidateSearchRequestInput["reason"];
  additionalComments?: CreatePoolCandidateSearchRequestInput["additionalComments"];
  hrAdvisorEmail?: CreatePoolCandidateSearchRequestInput["hrAdvisorEmail"];
  applicantFilter?: {
    qualifiedClassifications?: {
      sync?: Array<Maybe<Classification["id"]>>;
    };
    qualifiedStreams?: ApplicantFilterInput["qualifiedStreams"];
    skills?: {
      sync?: Array<Maybe<Skill["id"]>>;
    };
    hasDiploma?: ApplicantFilterInput["hasDiploma"];
    positionDuration?: ApplicantFilterInput["positionDuration"];
    equity?: EquitySelections;
    languageAbility?: ApplicantFilter["languageAbility"];
    operationalRequirements?: Array<Maybe<OperationalRequirement>>;
    pools?: {
      sync?: Array<Maybe<Pool["id"]>>;
    };
    locationPreferences?: ApplicantFilterInput["locationPreferences"];
  };
  department?: DepartmentBelongsTo["connect"];
};

export const RequestFormClassification_Fragment = graphql(/* GraphQL */ `
  fragment RequestFormClassification on Classification {
    id
    group
    level
  }
`);

export const RequestFormDepartment_Fragment = graphql(/* GraphQL */ `
  fragment RequestFormDepartment on Department {
    id
    departmentNumber
    name {
      en
      fr
    }
  }
`);

const RequestFormCommunity_Fragment = graphql(/* GraphQL */ `
  fragment RequestFormCommunity on Community {
    id
    key
  }
`);

const PoolsInFilter_Query = graphql(/* GraphQL */ `
  query PoolsInFilter($includeIds: [UUID!]) {
    poolsPaginated(includeIds: $includeIds, first: 1000) {
      data {
        id
        name {
          en
          fr
        }
        classification {
          id
          group
          level
        }
        stream {
          value
          label {
            en
            fr
          }
        }
      }
    }
  }
`);

const RequestOptions_Query = graphql(/* GraphQL */ `
  query RequestOptions {
    requestReasons: localizedEnumStrings(
      enumName: "PoolCandidateSearchRequestReason"
    ) {
      value
      label {
        en
        fr
      }
    }
    languageAbilities: localizedEnumStrings(enumName: "LanguageAbility") {
      value
      label {
        en
        fr
      }
    }
    workRegions: localizedEnumStrings(enumName: "WorkRegion") {
      value
      label {
        en
        fr
      }
    }
    operationalRequirements: localizedEnumStrings(
      enumName: "OperationalRequirement"
    ) {
      value
      label {
        en
        fr
      }
    }
    streams: localizedEnumStrings(enumName: "PoolStream") {
      value
      label {
        en
        fr
      }
    }
  }
`);

export interface RequestFormProps {
  departmentsQuery: FragmentType<typeof RequestFormDepartment_Fragment>[];
  skills: Skill[];
  classificationsQuery: FragmentType<
    typeof RequestFormClassification_Fragment
  >[];
  communitiesQuery: FragmentType<typeof RequestFormCommunity_Fragment>[];
  applicantFilter: Maybe<ApplicantFilterInput>;
  candidateCount: Maybe<number>;
  searchFormInitialValues?: SearchFormValues;
  selectedClassifications?: Maybe<Pick<Classification, "group" | "level">>[];
  handleCreatePoolCandidateSearchRequest: (
    data: CreatePoolCandidateSearchRequestInput,
  ) => Promise<CreateRequestMutation["createPoolCandidateSearchRequest"]>;
}

export const RequestForm = ({
  departmentsQuery,
  skills,
  classificationsQuery,
  communitiesQuery,
  applicantFilter,
  candidateCount,
  selectedClassifications,
  handleCreatePoolCandidateSearchRequest,
}: RequestFormProps) => {
  const intl = useIntl();
  const paths = useRoutes();
  const navigate = useNavigate();
  const cacheKey = "ts-createRequest";
  const location = useLocation();
  const state = location.state as BrowserHistoryState;
  const [{ data: optionsData }] = useQuery({
    query: RequestOptions_Query,
  });
  const [{ data: poolsData }] = useQuery({
    query: PoolsInFilter_Query,
    variables: {
      includeIds: unpackMaybes(applicantFilter?.pools).map(({ id }) => id),
    },
  });
  const classifications = getFragment(
    RequestFormClassification_Fragment,
    classificationsQuery,
  );
  const departments = getFragment(
    RequestFormDepartment_Fragment,
    departmentsQuery,
  );
  const communities = getFragment(
    RequestFormCommunity_Fragment,
    communitiesQuery,
  );

  const formMethods = useForm<FormValues>({
    defaultValues: getFromSessionStorage(cacheKey, {}),
  });
  const { handleSubmit, watch } = formMethods;

  watch((data) => setInSessionStorage(cacheKey, data));

  const formValuesToSubmitData = (
    values: FormValues,
  ): CreatePoolCandidateSearchRequestInput => {
    // checkbox checked/true means position has supervising duties
    const positionTypeMassaged: PoolCandidateSearchPositionType =
      values?.positionType === true
        ? PoolCandidateSearchPositionType.TeamLead
        : PoolCandidateSearchPositionType.IndividualContributor;
    const qualifiedStreams = applicantFilter?.qualifiedStreams;
    let community = communities?.find((c) => c.key === "digital");
    if (qualifiedStreams?.includes(PoolStream.AccessInformationPrivacy)) {
      community = communities?.find((c) => c.key === "atip");
    }

    return {
      fullName: values.fullName ?? "",
      email: values.email ?? "",
      jobTitle: values.jobTitle ?? "",
      managerJobTitle: values.managerJobTitle ?? "",
      positionType: positionTypeMassaged,
      reason: values.reason,
      additionalComments: values.additionalComments,
      hrAdvisorEmail: values.hrAdvisorEmail ?? "",
      wasEmpty: candidateCount === 0 && !state.allPools,
      community: {
        connect: community?.id ?? communities[0].id,
      },
      applicantFilter: {
        create: {
          positionDuration:
            applicantFilter && applicantFilter.positionDuration
              ? applicantFilter.positionDuration
              : null,
          hasDiploma: applicantFilter?.hasDiploma
            ? applicantFilter?.hasDiploma
            : false,
          equity: applicantFilter?.equity,
          languageAbility: applicantFilter?.languageAbility,
          operationalRequirements: applicantFilter?.operationalRequirements,
          qualifiedStreams,
          community: {
            connect: community?.id ?? communities[0].id,
          },
          pools: {
            sync: applicantFilter?.pools
              ? applicantFilter?.pools?.filter(notEmpty).map(({ id }) => id)
              : [],
          },
          locationPreferences: applicantFilter?.locationPreferences
            ? applicantFilter?.locationPreferences
            : [],
          skills: {
            sync: applicantFilter?.skills
              ? applicantFilter?.skills?.filter(notEmpty).map(({ id }) => id)
              : [],
          },
          qualifiedClassifications: {
            sync: applicantFilter?.qualifiedClassifications
              ? applicantFilter.qualifiedClassifications
                  .filter(notEmpty)
                  .map((qualifiedClassification) => {
                    const cl = classifications.find((classification) => {
                      return (
                        classification.group ===
                          qualifiedClassification?.group &&
                        classification.level === qualifiedClassification.level
                      );
                    });
                    return cl?.id;
                  })
                  .filter(notEmpty)
              : [],
          },
        },
      },
      department: { connect: values.department ?? "" },
    };
  };

  const handleSubmitError = () => {
    toast.error(
      intl.formatMessage({
        defaultMessage: "Error: creating request failed",
        id: "9nIALc",
        description:
          "Message displayed to user after a pool candidate request fails to get created.",
      }),
    );
  };

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    return handleCreatePoolCandidateSearchRequest(formValuesToSubmitData(data))
      .then((res) => {
        if (res) {
          removeFromSessionStorage(cacheKey); // clear the locally saved from once it is successfully submitted
          navigate(paths.requestConfirmation(res.id));
          toast.success(
            intl.formatMessage({
              defaultMessage: "Request created successfully!",
              id: "gUb3PY",
              description:
                "Message displayed to user after a pool candidate request is created successfully.",
            }),
          );
        } else {
          handleSubmitError();
        }
      })
      .catch(() => {
        handleSubmitError();
      });
  };

  // The applicantFilter from the location state needs to be changed from ApplicantFilterInput to the type ApplicantFilter for the SearchRequestFilters visual component.
  const applicantFilterInputToType: ApplicantFilter = {
    __typename: "ApplicantFilter",
    id: "", // Set Id to empty string since the PoolCandidateSearchRequest doesn't exist yet.
    ...applicantFilter,
    languageAbility: enumInputToLocalizedEnum(
      applicantFilter?.languageAbility,
      optionsData?.languageAbilities,
    ),
    locationPreferences: unpackMaybes(
      applicantFilter?.locationPreferences?.map((workRegion) =>
        enumInputToLocalizedEnum(workRegion, optionsData?.workRegions),
      ),
    ),
    operationalRequirements: unpackMaybes(
      applicantFilter?.operationalRequirements?.map((requirement) =>
        enumInputToLocalizedEnum(
          requirement,
          optionsData?.operationalRequirements,
        ),
      ),
    ),
    qualifiedStreams: unpackMaybes(
      applicantFilter?.qualifiedStreams?.map((stream) =>
        enumInputToLocalizedEnum(stream, optionsData?.streams),
      ),
    ),
    qualifiedClassifications:
      applicantFilter?.qualifiedClassifications
        ?.map((qualifiedClassification) => {
          return classifications.find((classification) => {
            return (
              classification.group === qualifiedClassification?.group &&
              classification.level === qualifiedClassification.level
            );
          });
        })
        .filter(notEmpty) ?? [],
    skills:
      applicantFilter?.skills
        ?.map((skillId) => {
          return skills.find((skill) => {
            return skill && skillId && skill.id === skillId.id;
          });
        })
        .filter(notEmpty) ?? [],
    pools: unpackMaybes(poolsData?.poolsPaginated.data),
    community: communities?.find(
      (c) => c.id === applicantFilter?.community?.id,
    ),
  };

  return (
    <section>
      <Heading
        level="h2"
        size="h6"
        data-h2-font-weight="base(700)"
        data-h2-margin="base(0, 0, x.5, 0)"
      >
        {intl.formatMessage({
          defaultMessage: "Your contact information",
          id: "T8J2Lp",
          description:
            "Form header for filling in contact information section.",
        })}
      </Heading>
      <p data-h2-margin-bottom="base(x1)">
        {intl.formatMessage({
          defaultMessage:
            "To submit a request, please provide the following information so we can contact you.",
          id: "GHvRHc",
          description: "Explanation message for request form.",
        })}
      </p>
      <FormProvider {...formMethods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div data-h2-flex-grid="base(flex-start, 0) p-tablet(flex-start, x2, x1)">
            <div data-h2-flex-item="base(1of1) p-tablet(1of2)">
              <Input
                id="fullName"
                type="text"
                name="fullName"
                label={intl.formatMessage({
                  defaultMessage: "Full name",
                  id: "IBc2sp",
                  description: "Label for full name",
                })}
                rules={{
                  required: intl.formatMessage(errorMessages.required),
                }}
              />
            </div>
            <div data-h2-flex-item="base(1of1) p-tablet(1of2)">
              <Select
                id="department"
                name="department"
                label={intl.formatMessage({
                  defaultMessage: "Department / Hiring organization",
                  id: "P7ItrT",
                  description:
                    "Label for department select input in the request form",
                })}
                nullSelection={intl.formatMessage({
                  defaultMessage: "Select a department",
                  id: "y827h2",
                  description:
                    "Null selection for department select input in the request form.",
                })}
                options={objectsToSortedOptions([...departments], intl)}
                rules={{
                  required: intl.formatMessage(errorMessages.required),
                }}
              />
            </div>
            <div data-h2-flex-item="base(1of1) p-tablet(1of2)">
              <Input
                id="email"
                type="email"
                name="email"
                label={intl.formatMessage({
                  defaultMessage: "Government of Canada email",
                  id: "CxZGd2",
                  description:
                    "Label for government of canada email input in the request form",
                })}
                rules={{
                  required: intl.formatMessage(errorMessages.required),
                }}
              />
            </div>
            <div data-h2-flex-item="base(1of1) p-tablet(1of2)">
              <Input
                id="managerJobTitle"
                type="text"
                name="managerJobTitle"
                label={intl.formatMessage({
                  defaultMessage: "What is your job title?",
                  id: "AgUBsQ",
                  description: "Input label asking for the user's job title.",
                })}
                rules={{
                  required: intl.formatMessage(errorMessages.required),
                }}
              />
            </div>
            <div data-h2-flex-item="base(1of1) p-tablet(1of2)">
              <Input
                id="hrAdvisorEmail"
                type="email"
                name="hrAdvisorEmail"
                label={intl.formatMessage({
                  defaultMessage: "HR advisor email",
                  id: "VrLfLw",
                  description:
                    "Input label asking for the HR advisor's email address.",
                })}
              />
            </div>
          </div>
          <Heading
            level="h2"
            size="h6"
            data-h2-font-weight="base(700)"
            data-h2-margin="base(x2, 0, x1, 0)"
          >
            {intl.formatMessage({
              defaultMessage: "Reason for the talent request",
              id: "8EbhWx",
              description:
                "Form header for filling in the reason why the user is submitting the request.",
            })}
          </Heading>
          <RadioGroup
            id="reason"
            name="reason"
            idPrefix="reason"
            legend={intl.formatMessage({
              defaultMessage:
                "Select the option that best represents your reason for submitting this talent request",
              id: "cXszfI",
              description:
                "Legend for the options related to the reason for submitting a request.",
            })}
            rules={{ required: intl.formatMessage(errorMessages.required) }}
            items={localizedEnumToOptions(
              sortPoolCandidateSearchRequestReason(optionsData?.requestReasons),
              intl,
            )}
          />
          <p data-h2-margin="base(x1 0)">
            {intl.formatMessage(
              {
                defaultMessage:
                  "Learn more about the <directiveLink>Directive on Digital Talent</directiveLink>.",
                id: "gZaILA",
                description: "Link to more information on the directive.",
              },
              {
                directiveLink: (chunks: ReactNode) =>
                  directiveLink(chunks, paths.directive()),
              },
            )}
          </p>
          <div>
            <Heading
              level="h2"
              size="h6"
              data-h2-font-weight="base(700)"
              data-h2-margin="base(x2, 0, x1, 0)"
            >
              {intl.formatMessage({
                defaultMessage: "Details about the job opportunity",
                id: "FNgThS",
                description:
                  "Form header for filling in job opportunity information section.",
              })}
            </Heading>
            <div data-h2-flex-grid="base(flex-start, 0) p-tablet(flex-start, x2, x1)">
              <div data-h2-flex-item="base(1of1) p-tablet(1of2)">
                <Checkbox
                  id="positionType"
                  name="positionType"
                  boundingBox
                  boundingBoxLabel={intl.formatMessage({
                    defaultMessage: "Will this position be supervising others?",
                    id: "tKyj1t",
                    description:
                      "Label for input asking whether a job opportunity will have supervising duties.",
                  })}
                  label={intl.formatMessage({
                    defaultMessage: "Yes, this is a supervisory position",
                    id: "mrMxsI",
                    description:
                      "Checkbox selection that confirms a job opportunity will have supervising duties. ",
                  })}
                />
              </div>
              <div data-h2-flex-item="base(1of1) p-tablet(1of2)">
                <Input
                  id="jobTitle"
                  type="text"
                  name="jobTitle"
                  label={intl.formatMessage({
                    defaultMessage: "What is the job title for this position?",
                    id: "7lCUIL",
                    description:
                      "Label for job title input in the request form",
                  })}
                  rules={{
                    required: intl.formatMessage(errorMessages.required),
                  }}
                />
              </div>
            </div>
            <p data-h2-margin="base(x1, 0)">
              {intl.formatMessage({
                defaultMessage:
                  "In this field please include any additional details and qualifications you are seeking from the candidates such as: programming languages, certifications, knowledge, or a specific work location.",
                id: "Zzd/sJ",
                description:
                  "Blurb before additional comments textarea in the request form.",
              })}
            </p>
            {candidateCount === 0 ? (
              <p data-h2-margin="base(x1 0)">
                {intl.formatMessage({
                  defaultMessage:
                    "If you are submitting a form that had zero estimated candidates, let us know more about this request in the comments.",
                  id: "adM1fA",
                  description:
                    "Instructions to provide additional details when submitting a request with no candidates",
                })}
              </p>
            ) : null}

            <TextArea
              id="additionalComments"
              name="additionalComments"
              label={intl.formatMessage({
                defaultMessage: "Additional comments",
                id: "GF8FPy",
                description:
                  "Title for the additional comments block for a search request",
              })}
              rows={8}
            />
          </div>
          <Heading
            level="h2"
            size="h6"
            data-h2-font-weight="base(700)"
            data-h2-margin="base(x2, 0, x1, 0)"
          >
            {intl.formatMessage({
              defaultMessage: "Summary of filters",
              id: "emx1cK",
              description: "Title of Summary of filters section",
            })}
          </Heading>
          <SearchRequestFilters
            filters={applicantFilterInputToType}
            selectedClassifications={selectedClassifications}
          />
          <Separator />
          <p data-h2-font-weight="base(700)" data-h2-margin-bottom="base(x1)">
            {intl.formatMessage(
              {
                defaultMessage:
                  "Request for pool candidates: <primary>{candidateCountNumber, plural, =0 {no candidates} =1 {1 estimated candidate} other {{candidateCountNumber} estimated candidates}}</primary>",
                id: "og5vUB",
                description:
                  "Total estimated candidates message in summary of filters",
              },
              {
                candidateCountNumber: candidateCount || 0,
              },
            )}
          </p>
          <div
            data-h2-display="base(flex)"
            data-h2-flex-direction="base(row)"
            data-h2-flex-wrap="base(wrap)"
            data-h2-gap="base(x1)"
            data-h2-align-items="base(center)"
          >
            <Submit
              text={intl.formatMessage({
                defaultMessage: "Submit request",
                id: "4CLNTw",
                description: "Submit button text on request form.",
              })}
            />
            <Link
              mode="inline"
              color="warning"
              href={paths.search()}
              state={{
                ...state,
              }}
            >
              {intl.formatMessage({
                defaultMessage: "Back",
                id: "L8k+lC",
                description:
                  "Back button located next to the submit button on the request form.",
              })}
            </Link>
          </div>
        </form>
      </FormProvider>
    </section>
  );
};

const RequestForm_CreateRequestMutation = graphql(/* GraphQL */ `
  mutation RequestForm_CreateRequest(
    $poolCandidateSearchRequest: CreatePoolCandidateSearchRequestInput!
  ) {
    createPoolCandidateSearchRequest(
      poolCandidateSearchRequest: $poolCandidateSearchRequest
    ) {
      id
      fullName
      email
      department {
        id
      }
      jobTitle
      additionalComments
      hrAdvisorEmail
      poolCandidateFilter {
        id
      }
    }
  }
`);

const RequestForm_SearchRequestDataQuery = graphql(/* GraphQL */ `
  query RequestForm_SearchRequestData {
    departments {
      ...RequestFormDepartment
    }
    skills {
      id
      key
      name {
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
    }
    classifications {
      ...RequestFormClassification
    }
    communities {
      ...RequestFormCommunity
    }
  }
`);

const RequestFormApi = ({
  applicantFilter,
  candidateCount,
  searchFormInitialValues,
  selectedClassifications,
}: {
  applicantFilter: Maybe<ApplicantFilterInput>;
  candidateCount: Maybe<number>;
  searchFormInitialValues?: SearchFormValues;
  selectedClassifications?: Maybe<Pick<Classification, "group" | "level">>[];
}) => {
  const intl = useIntl();
  const [{ data: lookupData, fetching, error }] = useQuery({
    query: RequestForm_SearchRequestDataQuery,
  });

  const skills: Skill[] = unpackMaybes(lookupData?.skills);

  const [, executeMutation] = useMutation(RequestForm_CreateRequestMutation);
  const handleCreatePoolCandidateSearchRequest = (
    data: CreatePoolCandidateSearchRequestInput,
  ) =>
    executeMutation({ poolCandidateSearchRequest: data }).then((result) => {
      if (result.data?.createPoolCandidateSearchRequest) {
        return Promise.resolve(result.data?.createPoolCandidateSearchRequest);
      }
      return Promise.reject(result.error);
    });

  return (
    <>
      <SEO
        title={intl.formatMessage({
          defaultMessage: "Request pool candidates",
          id: "u3eefq",
          description: "Page title for the request candidates form page",
        })}
      />
      <Pending fetching={fetching} error={error}>
        <RequestForm
          classificationsQuery={unpackMaybes(lookupData?.classifications)}
          departmentsQuery={unpackMaybes(lookupData?.departments)}
          communitiesQuery={unpackMaybes(lookupData?.communities)}
          skills={skills}
          applicantFilter={applicantFilter}
          candidateCount={candidateCount}
          searchFormInitialValues={searchFormInitialValues}
          selectedClassifications={selectedClassifications}
          handleCreatePoolCandidateSearchRequest={
            handleCreatePoolCandidateSearchRequest
          }
        />
      </Pending>
    </>
  );
};

export default RequestFormApi;
