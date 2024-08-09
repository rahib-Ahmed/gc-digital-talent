import { defineMessage, defineMessages, MessageDescriptor } from "react-intl";

import {
  WorkRegion,
  SkillCategory,
  GenericJobTitleKey,
  OperationalRequirement,
  GovEmployeeType,
  CitizenshipStatus,
  ArmedForcesStatus,
  EducationRequirementOption,
  SkillLevel,
} from "@gc-digital-talent/graphql";
import { hasKey } from "@gc-digital-talent/helpers";
import { defaultLogger } from "@gc-digital-talent/logger";

import commonMessages from "./commonMessages";

const enumNotFound = defineMessage({
  defaultMessage: "Enum not found",
  id: "kQTtt9",
  description: "Error message when human readable message not found",
});

/**
 * Returns the value at the specified key. If the key is not present, throws an error.
 * @param object
 * @param key
 * @param errorMessage
 */
function getOrDisplayError<T>(
  object: { [key: string]: T },
  key: string | number,
  msg: string,
): T | MessageDescriptor {
  if (!hasKey(object, key)) {
    defaultLogger.error(msg);
    return enumNotFound;
  }
  return object[key];
}

const employmentEquityGroups = defineMessages({
  woman: {
    defaultMessage: "Woman",
    id: "TO/Q6I",
    description: "Group for when someone indicates they are a woman",
  },
  indigenous: {
    defaultMessage: "Indigenous identity",
    id: "ghhKNZ",
    description: "Group for when someone indicates they are indigenous",
  },
  minority: {
    defaultMessage: "Visible minority",
    id: "/sSeis",
    description: "Group for when someone indicates they are a visible minority",
  },
  disability: {
    defaultMessage: "Person with a disability",
    id: "QZpZQh",
    description: "Group for when someone indicates they have a disability",
  },
});

export const getEmploymentEquityGroup = (
  equityGroup: keyof typeof employmentEquityGroups,
): MessageDescriptor =>
  getOrDisplayError(
    employmentEquityGroups,
    equityGroup,
    `Invalid equity group '${equityGroup}'`,
  );

const employmentEquityStatements = defineMessages({
  woman: {
    defaultMessage: "I identify as a woman.",
    id: "+9VBmQ",
    description: "Statement for when someone indicates they are a woman",
  },
  indigenous: {
    defaultMessage:
      "I affirm that I am First Nations (status or non-status), Inuk (Inuit), or a Métis person.",
    id: "RgCSri",
    description: "Text for the option to self-declare as Indigenous",
  },
  minority: {
    defaultMessage: "I identify as a member of a visible minority.",
    id: "T7IoJU",
    description:
      "Statement for when someone indicates they are a visible minority",
  },
  disability: {
    defaultMessage: "I identify as a person with a disability.",
    id: "JD0G28",
    description: "Statement for when someone indicates they have a disability",
  },
});

export const getEmploymentEquityStatement = (
  equityStatement: keyof typeof employmentEquityStatements,
): MessageDescriptor =>
  getOrDisplayError(
    employmentEquityStatements,
    equityStatement,
    `Invalid equity statement '${equityStatement}'`,
  );

const citizenshipStatusesProfile = defineMessages({
  [CitizenshipStatus.Citizen]: {
    defaultMessage: "I am a Canadian citizen.",
    id: "l4wLn9",
    description: "declaring one to be a Canadian citizen",
  },
  [CitizenshipStatus.PermanentResident]: {
    defaultMessage: "I am a permanent resident of Canada.",
    id: "OaB49n",
    description: "declaring one to be a permanent resident",
  },
  [CitizenshipStatus.Other]: commonMessages.other,
});

export const getCitizenshipStatusesProfile = (
  citizenshipId: string | number,
): MessageDescriptor =>
  getOrDisplayError(
    citizenshipStatusesProfile,
    citizenshipId,
    `Invalid Language '${citizenshipId}'`,
  );

const armedForcesStatusesProfile = defineMessages({
  [ArmedForcesStatus.Veteran]: {
    defaultMessage:
      "I am a <strong>veteran</strong> of the Canadian Armed Forces.",
    id: "ZpTNbt",
    description: "declare self to be a CAF veteran",
  },
  [ArmedForcesStatus.Member]: {
    defaultMessage:
      "I am an <strong>active member</strong> of the Canadian Armed Forces.",
    id: "iYNLo1",
    description: "declare self to be a CAF member",
  },
  [ArmedForcesStatus.NonCaf]: {
    defaultMessage:
      "I am <strong>not a member</strong> of the Canadian Armed Forces.",
    id: "bAaDat",
    description: "declare self to not be in the CAF",
  },
});

const armedForcesStatusesProfileNoBold = defineMessages({
  [ArmedForcesStatus.Veteran]: {
    defaultMessage: "I am a veteran of the Canadian Armed Forces.",
    id: "jqyjFm",
    description: "declare self to be a CAF veteran without bolding",
  },
  [ArmedForcesStatus.Member]: {
    defaultMessage: "I am an active member of the Canadian Armed Forces.",
    id: "TRDfnp",
    description: "declare self to be a CAF member without bolding",
  },
  [ArmedForcesStatus.NonCaf]: {
    defaultMessage: "I am not a member of the Canadian Armed Forces.",
    id: "vPDtGU",
    description: "declare self to not be in the CAF without bolding",
  },
});

export const getArmedForcesStatusesProfile = (
  armedForcesId: string | number,
  bold = true,
): MessageDescriptor =>
  getOrDisplayError(
    bold ? armedForcesStatusesProfile : armedForcesStatusesProfileNoBold,
    armedForcesId,
    `Invalid status '${armedForcesId}'`,
  );

const educationRequirementOptions = (classificationGroup?: string) =>
  classificationGroup === "EX"
    ? defineMessages({
        [EducationRequirementOption.AppliedWork]: {
          defaultMessage: "Applied work experience",
          description: "Title for the applied work experience requirements",
          id: "dwYJOo",
        },
        [EducationRequirementOption.Education]: {
          defaultMessage: "Graduation with degree",
          id: "aTHtqQ",
          description:
            "Option for education requirement, graduation with degree",
        },
        [EducationRequirementOption.ProfessionalDesignation]: {
          defaultMessage: "Professional designation",
          id: "TblXEE",
          description:
            "Option for education requirement, professional designation",
        },
      })
    : defineMessages({
        [EducationRequirementOption.AppliedWork]: {
          defaultMessage: "Applied work experience",
          description: "Title for the applied work experience requirements",
          id: "dwYJOo",
        },
        [EducationRequirementOption.Education]: {
          defaultMessage: "2-year post-secondary",
          description:
            "Option for education requirement, 2-year post-secondary",
          id: "TiIkSF",
        },
        [EducationRequirementOption.ProfessionalDesignation]: {
          defaultMessage: "Professional designation",
          id: "TblXEE",
          description:
            "Option for education requirement, professional designation",
        },
      });

export const getEducationRequirementOption = (
  educationRequirementOptionId: string,
  classificationGroup?: string,
): MessageDescriptor =>
  getOrDisplayError(
    educationRequirementOptions(classificationGroup),
    educationRequirementOptionId,
    `Invalid Education Requirement Option '${educationRequirementOptionId}'`,
  );

export const EmploymentDuration = {
  Term: "TERM",
  Indeterminate: "INDETERMINATE",
};
const employmentDurationShort = defineMessages({
  [EmploymentDuration.Term]: {
    defaultMessage: "Term",
    id: "jwPlv1",
    description:
      "Duration of a non-permanent length (short-form for limited space)",
  },
  [EmploymentDuration.Indeterminate]: {
    defaultMessage: "Indeterminate",
    id: "FqsPMv",
    description: "Duration that is permanent (short-form for limited space)",
  },
});

const employmentDurationLong = defineMessages({
  [EmploymentDuration.Term]: {
    defaultMessage: "Term duration (short term, long term)",
    id: "S9BRBL",
    description: "Duration of a non-permanent length",
  },
  [EmploymentDuration.Indeterminate]: {
    defaultMessage: "Indeterminate duration (permanent)",
    id: "rYodJu",
    description: "Duration that is permanent",
  },
});

export const getEmploymentDuration = (
  employmentDurationId: string | number,
  format: "long" | "short" = "long",
): MessageDescriptor => {
  const messageDictionary = {
    long: employmentDurationLong,
    short: employmentDurationShort,
  };

  return getOrDisplayError(
    messageDictionary[format],
    employmentDurationId,
    `Invalid Employment Duration '${employmentDurationId}'`,
  );
};

const workRegionsDetailed = defineMessages({
  [WorkRegion.Telework]: {
    defaultMessage:
      "<strong>Virtual</strong> (work from home, anywhere in Canada)",
    id: "pmoexB",
    description: "The work region of Canada described as Telework.",
  },
  [WorkRegion.NationalCapital]: {
    defaultMessage:
      "<strong>National Capital Region</strong> (Ottawa, Ontario and Gatineau, Quebec)",
    id: "8JxN4A",
    description: "The work region of Canada described as National Capital.",
  },
  [WorkRegion.Atlantic]: {
    defaultMessage:
      "<strong>Atlantic Region</strong> (New Brunswick, Newfoundland and Labrador, Nova Scotia and Prince Edward Island)",
    id: "3f6YzQ",
    description: "The work region of Canada described as Atlantic.",
  },
  [WorkRegion.Quebec]: {
    defaultMessage: "<strong>Quebec Region</strong> (excluding Gatineau)",
    id: "ZoFcYn",
    description: "The work region of Canada described as Quebec.",
  },
  [WorkRegion.Ontario]: {
    defaultMessage: "<strong>Ontario Region</strong> (excluding Ottawa)",
    id: "3agw4G",
    description: "The work region of Canada described as Ontario.",
  },
  [WorkRegion.Prairie]: {
    defaultMessage:
      "<strong>Prairie Region</strong> (Manitoba, Saskatchewan, Alberta)",
    id: "suvoSt",
    description: "The work region of Canada described as Prairie.",
  },
  [WorkRegion.BritishColumbia]: {
    defaultMessage: "<strong>British Columbia Region</strong>",
    id: "tgt0og",
    description: "The work region of Canada described as British Columbia.",
  },
  [WorkRegion.North]: {
    defaultMessage:
      "<strong>North Region</strong> (Yukon, Northwest Territories and Nunavut)",
    id: "us8fY4",
    description: "The work region of Canada described as North.",
  },
});

const workRegionsDetailedNoBold = defineMessages({
  [WorkRegion.Telework]: {
    defaultMessage: "Virtual (work from home, anywhere in Canada)",
    id: "x8v6Qp",
    description: "The work region of Canada described as Telework.",
  },
  [WorkRegion.NationalCapital]: {
    defaultMessage:
      "National Capital Region (Ottawa, Ontario and Gatineau, Quebec)",
    id: "dxjUnU",
    description: "The work region of Canada described as National Capital.",
  },
  [WorkRegion.Atlantic]: {
    defaultMessage:
      "Atlantic Region (New Brunswick, Newfoundland and Labrador, Nova Scotia and Prince Edward Island)",
    id: "ChFxsM",
    description: "The work region of Canada described as Atlantic.",
  },
  [WorkRegion.Quebec]: {
    defaultMessage: "Quebec Region (excluding Gatineau)",
    id: "Jpq6MK",
    description: "The work region of Canada described as Quebec.",
  },
  [WorkRegion.Ontario]: {
    defaultMessage: "Ontario Region (excluding Ottawa)",
    id: "CGNfbu",
    description: "The work region of Canada described as Ontario.",
  },
  [WorkRegion.Prairie]: {
    defaultMessage: "Prairie Region (Manitoba, Saskatchewan, Alberta)",
    id: "oPhurq",
    description: "The work region of Canada described as Prairie.",
  },
  [WorkRegion.BritishColumbia]: {
    defaultMessage: "British Columbia Region",
    id: "qtJrUr",
    description: "The work region of Canada described as British Columbia.",
  },
  [WorkRegion.North]: {
    defaultMessage: "North Region (Yukon, Northwest Territories and Nunavut)",
    id: "P9roJ7",
    description: "The work region of Canada described as North.",
  },
});

export const getWorkRegionsDetailed = (
  workRegionId: string | number,
  showBold = true,
): MessageDescriptor =>
  getOrDisplayError(
    showBold ? workRegionsDetailed : workRegionsDetailedNoBold,
    workRegionId,
    `Invalid Work Region '${workRegionId}'`,
  );

const operationalRequirementLabelFirstPerson = defineMessages({
  [OperationalRequirement.ShiftWork]: {
    defaultMessage: "has <strong>shift-work</strong>.",
    id: "9rn/MG",
    description: "The operational requirement described as shift work.",
  },
  [OperationalRequirement.OnCall]: {
    defaultMessage: "has <strong>24/7 on-call shifts</strong>.",
    id: "0gInkY",
    description: "The operational requirement described as 24/7 on-call.",
  },
  [OperationalRequirement.Travel]: {
    defaultMessage: "requires me to <strong>travel</strong>.",
    id: "qnYbyw",
    description: "The operational requirement described as travel as required.",
  },
  [OperationalRequirement.TransportEquipment]: {
    defaultMessage:
      "requires me to <strong>transport, lift and set down equipment weighing up to 20kg</strong>.",
    id: "dIZ4oj",
    description:
      "The operational requirement described as transport equipment up to 20kg.",
  },
  [OperationalRequirement.DriversLicense]: {
    defaultMessage:
      "requires me to <strong>have a valid driver's license</strong> or personal mobility to the degree normally associated with the possession of a valid driver's license.",
    id: "duwt+A",
    description: "The operational requirement described as driver's license.",
  },
  [OperationalRequirement.OvertimeOccasional]: {
    defaultMessage: "requires me to work <strong>occasional overtime</strong>.",
    id: "sfhO+5",
    description:
      "The operational requirement described as occasional overtime.",
  },
  [OperationalRequirement.OvertimeRegular]: {
    defaultMessage: "requires me to work <strong>regular overtime</strong>.",
    id: "4dD2mf",
    description: "The operational requirement described as regular overtime.",
  },
});

const operationalRequirementLabelFirstPersonNoBold = defineMessages({
  [OperationalRequirement.ShiftWork]: {
    defaultMessage: "has shift-work.",
    id: "jHYaw8",
    description: "The operational requirement described as shift work.",
  },
  [OperationalRequirement.OnCall]: {
    defaultMessage: "has 24/7 on-call shifts.",
    id: "aAMp6e",
    description: "The operational requirement described as 24/7 on-call.",
  },
  [OperationalRequirement.Travel]: {
    defaultMessage: "requires me to travel.",
    id: "9ZyJZq",
    description: "The operational requirement described as travel as required.",
  },
  [OperationalRequirement.TransportEquipment]: {
    defaultMessage:
      "requires me to transport, lift and set down equipment weighing up to 20kg.",
    id: "VYbDJk",
    description:
      "The operational requirement described as transport equipment up to 20kg.",
  },
  [OperationalRequirement.DriversLicense]: {
    defaultMessage:
      "requires me to have a valid driver's license or personal mobility to the degree normally associated with the possession of a valid driver's license.",
    id: "TmCCgR",
    description: "The operational requirement described as driver's license.",
  },
  [OperationalRequirement.OvertimeOccasional]: {
    defaultMessage: "requires me to work occasional overtime.",
    id: "4mMU7Q",
    description:
      "The operational requirement described as occasional overtime.",
  },
  [OperationalRequirement.OvertimeRegular]: {
    defaultMessage: "requires me to work regular overtime.",
    id: "hWMUFx",
    description: "The operational requirement described as regular overtime.",
  },
});

export const OperationalRequirements = [
  OperationalRequirement.OvertimeOccasional,
  OperationalRequirement.OvertimeRegular,
  OperationalRequirement.ShiftWork,
  OperationalRequirement.OnCall,
  OperationalRequirement.Travel,
  OperationalRequirement.TransportEquipment,
  OperationalRequirement.DriversLicense,
];

export const GenericJobTitlesSorted = [
  GenericJobTitleKey.TechnicianIt01,
  GenericJobTitleKey.AnalystIt02,
  GenericJobTitleKey.TechnicalAdvisorIt03,
  GenericJobTitleKey.TeamLeaderIt03,
  GenericJobTitleKey.SeniorAdvisorIt04,
  GenericJobTitleKey.ManagerIt04,
];

const operationalRequirementLabelFull = defineMessages({
  [OperationalRequirement.ShiftWork]: {
    defaultMessage: "Availability, willingness and ability to work shift-work.",
    id: "Gc9PeN",
    description: "The operational requirement described as shift work.",
  },
  [OperationalRequirement.OnCall]: {
    defaultMessage:
      "Availability, willingness and ability to work 24/7 on-call status.",
    id: "vDrJp6",
    description: "The operational requirement described as 24/7 on-call.",
  },
  [OperationalRequirement.Travel]: {
    defaultMessage:
      "Availability, willingness and ability to travel as required.",
    id: "4pZrst",
    description: "The operational requirement described as travel as required.",
  },
  [OperationalRequirement.TransportEquipment]: {
    defaultMessage:
      "Availability, willingness and ability to transport, lift and set down equipment weighing up to 20kg.",
    id: "XpK4rL",
    description:
      "The operational requirement described as transport equipment up to 20kg.",
  },
  [OperationalRequirement.DriversLicense]: {
    defaultMessage:
      "Must possess a valid driver's license or personal mobility to the degree normally associated with possession of a valid driver's license.",
    id: "QhRU19",
    description: "The operational requirement described as driver's license.",
  },
  [OperationalRequirement.OvertimeRegular]: {
    defaultMessage:
      "Availability, willingness and ability to work overtime (Regularly).",
    id: "vvtqRv",
    description: "The operational requirement described as regular overtime.",
  },
  [OperationalRequirement.OvertimeOccasional]: {
    defaultMessage:
      "Availability, willingness and ability to work overtime (Occasionally).",
    id: "KzhnAz",
    description:
      "The operational requirement described as occasional overtime.",
  },
});

export const getOperationalRequirement = (
  operationalRequirementId: string | number,
  format: "firstPerson" | "firstPersonNoBold" | "full" = "full",
): MessageDescriptor => {
  const messageDictionary = {
    firstPerson: operationalRequirementLabelFirstPerson,
    firstPersonNoBold: operationalRequirementLabelFirstPersonNoBold,
    full: operationalRequirementLabelFull,
  };

  return getOrDisplayError(
    messageDictionary[format],
    operationalRequirementId,
    `Invalid Operational Requirement '${operationalRequirementId}'`,
  );
};

const govEmployeeType = defineMessages({
  [GovEmployeeType.Student]: {
    defaultMessage: '"I am a student."',
    id: "faMBJc",
    description: "Student selection for government employee type.",
  },
  [GovEmployeeType.Casual]: {
    defaultMessage: '"I have a casual contract."',
    id: "bE1GJ9",
    description: "Casual selection for government employee type.",
  },
  [GovEmployeeType.Term]: {
    defaultMessage: '"I have a term position."',
    id: "k8NLSx",
    description: "Term selection for government employee type.",
  },
  [GovEmployeeType.Indeterminate]: {
    defaultMessage: '"I am an indeterminate employee."',
    id: "ZX5gv1",
    description: "Indeterminate selection for government employee type.",
  },
});

export const getGovEmployeeType = (
  govEmployeeTypeId: string | number,
): MessageDescriptor =>
  getOrDisplayError(
    govEmployeeType,
    govEmployeeTypeId,
    `Invalid Government of Employee Type '${govEmployeeTypeId}'`,
  );

const abbreviations = defineMessages({
  AS: {
    defaultMessage: "Administrative Services",
    id: "o9qR1R",
    description: "Full name of abbreviation for AS classification",
  },
  GC: {
    defaultMessage: "Government of Canada",
    id: "sMi0QI",
    description: "Full name of abbreviation for GC",
  },
  EX: {
    defaultMessage: "Executive Group",
    id: "oXrkBM",
    description: "Full name of abbreviation for EX",
  },
  IT: {
    defaultMessage: "Information Technology",
    id: "n3Gt3n",
    description: "Full name of abbreviation for IT",
  },
  PM: {
    defaultMessage: "Programme Administration",
    id: "CF69qZ",
    description: "Full name of abbreviation for PM",
  },
  CS: {
    defaultMessage: "Computer Systems",
    id: "HVMI8t",
    description: "Full name of abbreviation for CS",
  },
  EC: {
    defaultMessage: "Economics and Social Science Services",
    id: "W5Dkd1",
    description: "Full name of abbreviation for EC",
  },
});

export const getAbbreviations = (
  abbreviation: keyof typeof abbreviations,
): MessageDescriptor =>
  getOrDisplayError(
    abbreviations,
    abbreviation,
    `Invalid abbreviation '${abbreviation}'`,
  );

const technicalSkillLevelNames = defineMessages({
  [SkillLevel.Beginner]: {
    defaultMessage: "Entry-level",
    id: "AOJjMk",
    description: "The technical skill level for beginner",
  },
  [SkillLevel.Intermediate]: {
    defaultMessage: "Intermediate",
    id: "rt4mVU",
    description: "The technical skill level for intermediate",
  },
  [SkillLevel.Advanced]: {
    defaultMessage: "Advanced",
    id: "5/C1lJ",
    description: "The technical skill level for expert",
  },
  [SkillLevel.Lead]: {
    defaultMessage: "Lead",
    id: "Glb1Te",
    description: "The technical skill level for lead",
  },
});

const technicalSkillLevelDefinitions = defineMessages({
  [SkillLevel.Beginner]: {
    defaultMessage:
      "Demonstrated ability to consistently deliver on tasks of low complexity under minimal supervision and tasks of moderate complexity under strong supervision or with direct mentoring. Usually associated with junior or entry-level roles.",
    id: "dXiRk8",
    description: "The technical skill level definition for beginner",
  },
  [SkillLevel.Intermediate]: {
    defaultMessage:
      "Demonstrated ability to consistently deliver on tasks of low to moderate complexity under minimal supervision and tasks of higher-level complexity under moderate supervision and mentoring. Usually associated with intermediate roles.",
    id: "/62GQm",
    description: "The technical skill level definition for intermediate",
  },
  [SkillLevel.Advanced]: {
    defaultMessage:
      "Demonstrated ability to scope, undertake, and deliver on tasks of moderate to high complexity under minimal levels of supervision. Demonstrated ability to mentor others in lower levels of skill development, either through direct supervision or by setting examples and providing explanations. Usually associated with senior technical advisor or entry-level supervisory roles.",
    id: "EPEKU2",
    description: "The technical skill level definition for expert",
  },
  [SkillLevel.Lead]: {
    defaultMessage:
      "Demonstrated ability to identify, scope, undertake, and deliver on tasks of significant complexity with wide areas of impact, even in challenging circumstances. Demonstrated ability to lead the development of tasks, and potentially teams, for the organization in this area. Usually associated with manager or technical lead roles.",
    id: "fdv2bM",
    description: "The technical skill level definition for lead",
  },
});

const behaviouralSkillLevelNames = defineMessages({
  [SkillLevel.Beginner]: {
    defaultMessage: "In early development",
    id: "K9SPL+",
    description: "The behavioural skill level for beginner",
  },
  [SkillLevel.Intermediate]: {
    defaultMessage: "Moderately developed",
    id: "clDpR4",
    description: "The behavioural skill level for intermediate",
  },
  [SkillLevel.Advanced]: {
    defaultMessage: "Strongly developed",
    id: "zdxy8s",
    description: "The behavioural skill level for expert",
  },
  [SkillLevel.Lead]: {
    defaultMessage: "Deep-level mastery",
    id: "/OQLmo",
    description: "The behavioural skill level for lead",
  },
});

const behaviouralSkillLevelDefinitions = defineMessages({
  [SkillLevel.Beginner]: {
    defaultMessage:
      "Demonstrated, but consistency varies significantly by audience and circumstance. Intermittently demonstrated in daily situations and inconsistently demonstrated with certain audiences or under conditions of stress or in moderately challenging situations. Potential is there, but there is learning to be done.",
    id: "Y3FL2a",
    description: "The behavioural skill level definition for beginner",
  },
  [SkillLevel.Intermediate]: {
    defaultMessage:
      "Frequently demonstrated as well-developed in most daily situations with most audiences, and intermittently demonstrated under conditions of stress and in moderately challenging situations.",
    id: "lYtXQJ",
    description: "The behavioural skill level definition for intermediate",
  },
  [SkillLevel.Advanced]: {
    defaultMessage:
      "Consistently demonstrated as well-developed in daily conditions with all audiences, frequently demonstrated in situations of stress and in moderately challenging situations with most audiences, and intermittently demonstrated under conditions of significant stress and in challenging situations.",
    id: "Ko0JX/",
    description: "The behavioural skill level definition for expert",
  },
  [SkillLevel.Lead]: {
    defaultMessage:
      "Consistently demonstrated as well-developed with all audiences, even under conditions of significant stress and in challenging situations. Behaviour is adapted and nuanced to the situation without drifting away from its core value.",
    id: "CrzH4k",
    description: "The behavioural skill level definition for lead",
  },
});

export const getSkillLevelName = (
  skillLevel: string | SkillLevel,
  skillCategory: SkillCategory,
): MessageDescriptor => {
  if (skillCategory === SkillCategory.Technical) {
    return getOrDisplayError(
      technicalSkillLevelNames,
      skillLevel,
      `Invalid technical skill level '${skillLevel}'`,
    );
  }

  return getOrDisplayError(
    behaviouralSkillLevelNames,
    skillLevel,
    `Invalid behavioural skill level '${skillLevel}'`,
  );
};

export const getSkillLevelDefinition = (
  skillLevel: string | SkillLevel,
  skillCategory: SkillCategory,
): MessageDescriptor => {
  if (skillCategory === SkillCategory.Technical) {
    return getOrDisplayError(
      technicalSkillLevelDefinitions,
      skillLevel,
      `Invalid technical skill level '${skillLevel}'`,
    );
  }

  return getOrDisplayError(
    behaviouralSkillLevelDefinitions,
    skillLevel,
    `Invalid behavioural skill level '${skillLevel}'`,
  );
};

export const getSkillLevelMessages = (
  skillLevel: string | SkillLevel,
  skillCategory: SkillCategory,
): { name: MessageDescriptor; definition: MessageDescriptor } => {
  return {
    name: getSkillLevelName(skillLevel, skillCategory),
    definition: getSkillLevelDefinition(skillLevel, skillCategory),
  };
};
