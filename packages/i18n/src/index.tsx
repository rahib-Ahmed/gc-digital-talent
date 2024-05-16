import * as fr from "./lang/frCompiled.json";
import richTextElements from "./components/richTextElements";
import LanguageProvider from "./components/LanguageProvider";
import LocaleProvider from "./components/LocaleProvider";
import NestedLanguageProvider from "./components/NestedLanguageProvider";
import useIntlLanguages from "./hooks/useIntlMessages";
import useLocale from "./hooks/useLocale";
import {
  isLocale,
  getLocale,
  oppositeLocale,
  changeLocale,
  localizePath,
  localeRedirect,
  getLocalizedName,
  localizeCurrency,
  localizeSalaryRange,
  getLocalizedArray,
} from "./utils/localize";
import {
  apiMessages,
  commonMessages,
  dateMessages,
  errorMessages,
  navigationMessages,
  tryFindMessageDescriptor,
  uiMessages,
  formMessages,
  richTextMessages,
} from "./messages";
import {
  getEmploymentEquityGroup,
  getEmploymentEquityStatement,
  getLanguageProficiency,
  getLanguage,
  getCitizenshipStatusesProfile,
  getCitizenshipStatusesAdmin,
  getArmedForcesStatusesAdmin,
  getArmedForcesStatusesProfile,
  getEducationRequirementOption,
  EmploymentDuration,
  getEmploymentDuration,
  getLanguageAbility,
  getLanguageRequirement,
  getWorkRegionsDetailed,
  getWorkRegion,
  getPoolCandidateStatus,
  getPoolCandidateSearchStatus,
  getPoolCandidateSearchPositionType,
  getSkillCategory,
  getGenericJobTitles,
  getAwardedTo,
  getAwardedScope,
  getEducationStatus,
  getEducationType,
  getOperationalRequirement,
  getProvinceOrTerritory,
  getPoolStream,
  getGovEmployeeType,
  getSimpleGovEmployeeType,
  getPoolStatus,
  getSecurityClearance,
  getPoolCandidatePriorities,
  getPublishingGroup,
  getAbbreviations,
  getIndigenousCommunity,
  OperationalRequirementV1,
  OperationalRequirementV2,
  GenericJobTitlesSorted,
  poolCandidatePriorities,
  getCandidateExpiryFilterStatus,
  getCandidateSuspendedFilterStatus,
  getSkillLevelName,
  getSkillLevelDefinition,
  getSkillLevelMessages,
  getEvaluatedLanguageAbility,
  getPoolSkillType,
  getAssessmentStepType,
  getAssessmentDecision,
  getAssessmentDecisionLevel,
  getAssessmentJustification,
  getTableAssessmentDecision,
  getSearchRequestReason,
  getPoolOpportunityLength,
  getPlacementType,
  getCandidateRemovalReason,
} from "./messages/localizedConstants";
import type { LocalizedArray } from "./utils/localize";
import type { Locales, Messages } from "./types";

export {
  richTextElements,
  isLocale,
  getLocale,
  getLocalizedArray,
  oppositeLocale,
  changeLocale,
  localizePath,
  localeRedirect,
  getLocalizedName,
  localizeCurrency,
  localizeSalaryRange,
  apiMessages,
  commonMessages,
  errorMessages,
  dateMessages,
  navigationMessages,
  uiMessages,
  formMessages,
  richTextMessages,
  tryFindMessageDescriptor,
  LanguageProvider,
  LocaleProvider,
  NestedLanguageProvider,
  useIntlLanguages,
  useLocale,
};

export {
  getEmploymentEquityGroup,
  getEmploymentEquityStatement,
  getLanguageProficiency,
  getLanguage,
  getCitizenshipStatusesProfile,
  getCitizenshipStatusesAdmin,
  getArmedForcesStatusesAdmin,
  getArmedForcesStatusesProfile,
  getEducationRequirementOption,
  EmploymentDuration,
  getEmploymentDuration,
  getLanguageAbility,
  getLanguageRequirement,
  getWorkRegionsDetailed,
  getWorkRegion,
  getPoolCandidateStatus,
  getPoolCandidateSearchStatus,
  getPoolCandidateSearchPositionType,
  getSkillCategory,
  getGenericJobTitles,
  getAwardedTo,
  getAwardedScope,
  getEducationStatus,
  getEducationType,
  getOperationalRequirement,
  getProvinceOrTerritory,
  getPoolStream,
  getGovEmployeeType,
  getSimpleGovEmployeeType,
  getPoolStatus,
  getSecurityClearance,
  getPoolCandidatePriorities,
  getPublishingGroup,
  getIndigenousCommunity,
  OperationalRequirementV1,
  OperationalRequirementV2,
  GenericJobTitlesSorted,
  poolCandidatePriorities,
  getAbbreviations,
  getCandidateExpiryFilterStatus,
  getCandidateSuspendedFilterStatus,
  getSkillLevelName,
  getSkillLevelDefinition,
  getSkillLevelMessages,
  getEvaluatedLanguageAbility,
  getPoolSkillType,
  getAssessmentStepType,
  getAssessmentDecision,
  getSearchRequestReason,
  getPoolOpportunityLength,
  getPlacementType,
  getAssessmentDecisionLevel,
  getAssessmentJustification,
  getTableAssessmentDecision,
  getCandidateRemovalReason,
};

export type { Locales, Messages, LocalizedArray };
export { fr };
