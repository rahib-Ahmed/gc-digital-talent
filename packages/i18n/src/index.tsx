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
  getGenericJobTitlesWithClassification,
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
  getBilingualEvaluation,
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
  getTechnicalSkillLevel,
  getTechnicalSkillLevelDefinition,
  getBehaviouralSkillLevel,
  getBehaviouralSkillLevelDefinition,
  getEvaluatedLanguageAbility,
} from "./messages/localizedConstants";
import { STORED_LOCALE } from "./const";
import type { Locales, Messages } from "./types";

export {
  richTextElements,
  isLocale,
  getLocale,
  oppositeLocale,
  changeLocale,
  localizePath,
  localeRedirect,
  getLocalizedName,
  localizeCurrency,
  localizeSalaryRange,
  STORED_LOCALE,
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
  getGenericJobTitlesWithClassification,
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
  getBilingualEvaluation,
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
  getTechnicalSkillLevel,
  getTechnicalSkillLevelDefinition,
  getBehaviouralSkillLevel,
  getBehaviouralSkillLevelDefinition,
  getEvaluatedLanguageAbility,
};

export type { Locales, Messages };
export { fr };
