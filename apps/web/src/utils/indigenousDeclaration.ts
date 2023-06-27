import { IndigenousCommunity } from "@gc-digital-talent/graphql";

// constrained list of community form values to avoid typos
type FormCommunity = "status" | "nonStatus" | "inuk" | "metis" | "other";

interface FormFields {
  communities: Array<FormCommunity>;
}

// for use with forms with a radio button, like the application self-declaration
export interface FormValuesWithYesNo extends FormFields {
  isIndigenous: "yes" | "no" | null;
}

// for use with forms with a checkbox, like the profile dialog
export interface FormValuesWithBoolean extends FormFields {
  isIndigenous: boolean;
}

function apiCommunitiesToFormCommunityFields(
  apiCommunities: Array<IndigenousCommunity>,
): FormFields {
  // array of form communities that will be built and returned
  const formCommunities: Array<FormCommunity> = [];

  if (apiCommunities.includes(IndigenousCommunity.StatusFirstNations))
    formCommunities.push("status");
  if (apiCommunities.includes(IndigenousCommunity.NonStatusFirstNations))
    formCommunities.push("nonStatus");
  if (apiCommunities.includes(IndigenousCommunity.Inuit))
    formCommunities.push("inuk");
  if (apiCommunities.includes(IndigenousCommunity.Metis))
    formCommunities.push("metis");
  if (apiCommunities.includes(IndigenousCommunity.Other))
    formCommunities.push("other");

  // assemble object from pre-computed values
  return {
    communities: formCommunities,
  };
}

export function apiCommunitiesToFormValuesWithYesNo(
  apiCommunities: Array<IndigenousCommunity> | undefined,
): FormValuesWithYesNo {
  let isIndigenous: FormValuesWithYesNo["isIndigenous"];
  if (apiCommunities === undefined) isIndigenous = null;
  else isIndigenous = apiCommunities.length > 0 ? "yes" : "no";
  // assemble object from pre-computed values
  return {
    ...apiCommunitiesToFormCommunityFields(apiCommunities ?? []),
    isIndigenous,
  };
}

export function apiCommunitiesToFormValuesWithBoolean(
  apiCommunities: Array<IndigenousCommunity>,
): FormValuesWithBoolean {
  // assemble object from pre-computed values
  return {
    ...apiCommunitiesToFormCommunityFields(apiCommunities),
    isIndigenous: apiCommunities.length > 0,
  };
}

export function formValuesToApiCommunities(
  formValues: FormValuesWithYesNo | FormValuesWithBoolean,
): Array<IndigenousCommunity> {
  // array of API communities that will be built and returned
  const apiCommunities: Array<IndigenousCommunity> = [];

  if (formValues.communities.includes("status"))
    apiCommunities.push(IndigenousCommunity.StatusFirstNations);
  if (formValues.communities.includes("nonStatus"))
    apiCommunities.push(IndigenousCommunity.NonStatusFirstNations);
  if (formValues.communities.includes("inuk"))
    apiCommunities.push(IndigenousCommunity.Inuit);
  if (formValues.communities.includes("metis"))
    apiCommunities.push(IndigenousCommunity.Metis);
  if (formValues.communities.includes("other"))
    apiCommunities.push(IndigenousCommunity.Other);

  return apiCommunities;
}
