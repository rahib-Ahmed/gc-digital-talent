import React from "react";
import { MessageDescriptor, defineMessages, useIntl } from "react-intl";

import {
  commonMessages,
  getEvaluatedLanguageAbility,
  getLanguage,
  getLanguageProficiency,
} from "@gc-digital-talent/i18n";
import { getOrThrowError } from "@gc-digital-talent/helpers";

import { getEvaluatedLanguageLevels } from "~/utils/userUtils";

import FieldDisplay from "../FieldDisplay";
import { PartialUser } from "./types";
import { getExamValidityOptions, getLabels } from "./utils";

// A workaround is required to show the deprecated bilingual evaluation in the profile snapshot.
// These changes will be removed a year from now. (Remove snapshot workaround for the bilingual evaluation field #9905)
enum BilingualEvaluation {
  CompletedEnglish = "COMPLETED_ENGLISH",
  CompletedFrench = "COMPLETED_FRENCH",
  NotCompleted = "NOT_COMPLETED",
}

const bilingualEvaluations = defineMessages({
  [BilingualEvaluation.CompletedEnglish]: {
    defaultMessage: "Yes, completed English evaluation",
    id: "2ohWuK",
    description: "Completed an English language evaluation",
  },
  [BilingualEvaluation.CompletedFrench]: {
    defaultMessage: "Yes, completed French evaluation",
    id: "DUuisY",
    description: "Completed a French language evaluation",
  },
  [BilingualEvaluation.NotCompleted]: commonMessages.no,
});

export const getBilingualEvaluation = (
  bilingualEvaluationId: string | number,
): MessageDescriptor =>
  getOrThrowError(
    bilingualEvaluations,
    bilingualEvaluationId,
    `Invalid Language Ability '${bilingualEvaluationId}'`,
  );

interface DisplayProps {
  user: PartialUser & { bilingualEvaluation?: BilingualEvaluation };
  context?: "admin" | "default" | "print";
}

const Display = ({
  user: {
    lookingForEnglish,
    lookingForFrench,
    lookingForBilingual,
    firstOfficialLanguage,
    secondLanguageExamCompleted,
    secondLanguageExamValidity,
    estimatedLanguageAbility,
    writtenLevel,
    comprehensionLevel,
    verbalLevel,
    bilingualEvaluation,
  },
  context = "default",
}: DisplayProps) => {
  const intl = useIntl();
  const notProvided = intl.formatMessage(commonMessages.notProvided);
  const labels = getLabels(intl);

  let examValidity = null;
  switch (secondLanguageExamValidity) {
    case true:
      examValidity = getExamValidityOptions(intl).find(
        (option) => option.value === "currently_valid",
      )?.label;
      break;
    case false:
      examValidity = getExamValidityOptions(intl).find(
        (option) => option.value === "expired",
      )?.label;
      break;
    default:
      examValidity = null;
  }

  return (
    <div
      data-h2-display="base(grid)"
      {...(context !== "print" && { "data-h2-gap": "base(x1)" })}
    >
      <FieldDisplay
        hasError={
          !lookingForEnglish && !lookingForFrench && !lookingForBilingual
        }
        label={labels.consideredPositionLanguages}
        context={context}
      >
        {lookingForEnglish || lookingForFrench || lookingForBilingual ? (
          <ul>
            {lookingForEnglish && (
              <li>
                {intl.formatMessage({
                  defaultMessage:
                    "I would like to be considered for English positions",
                  id: "vmj/E4",
                  description: "English Positions message",
                })}
              </li>
            )}
            {lookingForFrench && (
              <li>
                {intl.formatMessage({
                  defaultMessage:
                    "I would like to be considered for French positions",
                  id: "sWBbdX",
                  description: "French Positions message",
                })}
              </li>
            )}
            {lookingForBilingual && (
              <li>
                {intl.formatMessage({
                  defaultMessage:
                    "I would like to be considered for bilingual positions (English and French)",
                  id: "jx7Sf1",
                  description: "Bilingual Positions message",
                })}
              </li>
            )}
          </ul>
        ) : (
          notProvided
        )}
      </FieldDisplay>
      {/* If bilingual evaluation exists then show the old language profile snapshot, otherwise show new view */}
      {bilingualEvaluation ? (
        <>
          <FieldDisplay
            hasError={
              lookingForBilingual &&
              (!bilingualEvaluation ||
                ((bilingualEvaluation ===
                  BilingualEvaluation.CompletedEnglish ||
                  bilingualEvaluation ===
                    BilingualEvaluation.CompletedFrench) &&
                  (!comprehensionLevel || !writtenLevel || !verbalLevel)))
            }
            label={intl.formatMessage({
              defaultMessage: "Language evaluation",
              id: "43xNhn",
              description: "Language evaluation label",
            })}
            context={context}
          >
            {bilingualEvaluation
              ? intl.formatMessage(getBilingualEvaluation(bilingualEvaluation))
              : notProvided}
          </FieldDisplay>
          {(bilingualEvaluation === BilingualEvaluation.CompletedEnglish ||
            bilingualEvaluation === BilingualEvaluation.CompletedFrench) && (
            <FieldDisplay
              label={intl.formatMessage({
                defaultMessage:
                  "Second language level (reading, writing, oral interaction)",
                id: "qOi2J0",
                description:
                  "Second language level (reading, writing, oral interaction) label",
              })}
              context={context}
            >
              {comprehensionLevel || writtenLevel || verbalLevel
                ? getEvaluatedLanguageLevels(
                    intl,
                    comprehensionLevel,
                    writtenLevel,
                    verbalLevel,
                  )
                : notProvided}
            </FieldDisplay>
          )}
          {bilingualEvaluation === BilingualEvaluation.NotCompleted &&
            !!estimatedLanguageAbility && (
              <FieldDisplay
                label={intl.formatMessage({
                  defaultMessage: "Second language proficiency",
                  id: "IexFo4",
                  description: "Second language proficiency label",
                })}
                context={context}
              >
                {estimatedLanguageAbility
                  ? intl.formatMessage(
                      getLanguageProficiency(estimatedLanguageAbility),
                    )
                  : notProvided}
              </FieldDisplay>
            )}
        </>
      ) : (
        <div data-h2-display="base(grid)" data-h2-gap="base(x1)">
          {lookingForBilingual && (
            <>
              <FieldDisplay
                label={labels.firstOfficialLanguage}
                context={context}
              >
                {firstOfficialLanguage
                  ? intl.formatMessage(getLanguage(firstOfficialLanguage))
                  : notProvided}
              </FieldDisplay>
              <FieldDisplay
                label={labels.estimatedLanguageAbility}
                context={context}
              >
                {estimatedLanguageAbility
                  ? intl.formatMessage(
                      getLanguageProficiency(estimatedLanguageAbility),
                    )
                  : notProvided}
              </FieldDisplay>
              {secondLanguageExamCompleted ? (
                <>
                  <FieldDisplay
                    label={labels.secondLanguageExamCompletedBoundingBoxLabel}
                    context={context}
                  >
                    {secondLanguageExamCompleted
                      ? labels.secondLanguageExamCompletedLabel
                      : notProvided}
                  </FieldDisplay>
                  <FieldDisplay
                    label={labels.secondLanguageExamValidityLabel}
                    context={context}
                  >
                    {examValidity}
                  </FieldDisplay>
                  <div
                    data-h2-display="base(grid)"
                    data-h2-grid-template-columns="l-tablet(1fr 1fr 1fr)"
                    data-h2-gap="base(x1, 0) l-tablet(0, x1)"
                    {...(context === "print" && {
                      "data-h2-gap": "base(0, 0)",
                    })}
                  >
                    <FieldDisplay
                      label={labels.comprehensionLevel}
                      context={context}
                    >
                      {comprehensionLevel
                        ? intl.formatMessage(
                            getEvaluatedLanguageAbility(comprehensionLevel),
                          )
                        : notProvided}
                    </FieldDisplay>
                    <FieldDisplay label={labels.writtenLevel} context={context}>
                      {writtenLevel
                        ? intl.formatMessage(
                            getEvaluatedLanguageAbility(writtenLevel),
                          )
                        : notProvided}
                    </FieldDisplay>
                    <FieldDisplay label={labels.verbalLevel} context={context}>
                      {verbalLevel
                        ? intl.formatMessage(
                            getEvaluatedLanguageAbility(verbalLevel),
                          )
                        : notProvided}
                    </FieldDisplay>
                  </div>
                </>
              ) : null}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Display;
