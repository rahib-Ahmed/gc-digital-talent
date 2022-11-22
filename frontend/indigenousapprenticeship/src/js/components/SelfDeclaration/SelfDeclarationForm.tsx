import React, { ReactText } from "react";
import { useIntl } from "react-intl";
import { SubmitHandler } from "react-hook-form";

import Heading from "@common/components/Heading";
import { BasicForm, RadioGroup } from "@common/components/form";

import errorMessages from "@common/messages/errorMessages";
import { ExternalLink } from "@common/components/Link";
import { Locales } from "@common/helpers/localize";
import useLocale from "@common/hooks/useLocale";
import Separator from "@common/components/Separator";
import { getSelfDeclarationLabels } from "./utils";

type FormValues = {
  selfDeclaration?: "yes" | "no";
};

interface SelfDeclarationFormProps {
  onSubmit: (data: FormValues) => void;
}

const otherOpportunitiesLink = (chunks: React.ReactNode, locale: Locales) => (
  <ExternalLink href={`/${locale}/browse/pools`}>{chunks}</ExternalLink>
);

const contactLink = (chunks: React.ReactNode, locale: Locales) => (
  <ExternalLink data-h2-color="base(ia-primary)" href={`/${locale}/support`}>
    {chunks}
  </ExternalLink>
);

const whyLink = (chunks: React.ReactNode) => (
  <ExternalLink data-h2-color="base(dt-primary)" href="#">
    {chunks}
  </ExternalLink>
);

const definitionLink = (chunks: React.ReactNode) => (
  <ExternalLink data-h2-color="base(dt-primary)" href="#">
    {chunks}
  </ExternalLink>
);

const SelfDeclarationForm = ({ onSubmit }: SelfDeclarationFormProps) => {
  const intl = useIntl();
  const { locale } = useLocale();
  const labels = getSelfDeclarationLabels(intl);

  const handleSubmit: SubmitHandler<FormValues> = async (formValues) => {
    return onSubmit(formValues);
  };

  return (
    <BasicForm onSubmit={handleSubmit} labels={labels}>
      <div
        data-h2-radius="base(s)"
        data-h2-shadow="base(s)"
        data-h2-padding="base(x2, x3)"
      >
        <Heading
          level="h2"
          data-h2-text-align="base(center)"
          data-h2-margin="base(0, 0, x1, 0)"
        >
          {intl.formatMessage({
            id: "pKACZK",
            defaultMessage: "Indigenous Peoples Self-Declaration Form",
            description: "Title for the indigenous self-declaration form",
          })}
        </Heading>
        <p data-h2-text-align="base(center)" data-h2-margin="base(x1, 0)">
          {intl.formatMessage({
            id: "Ma0UMe",
            defaultMessage:
              "We recognize the importance of Indigenous voices in the federal government. The Program was designed in partnership with Indigenous peoples. By completing and signing the Indigenous Peoples Self-Declaration Form, you are helping to protect the space, agreeing that you are a part of the three distinct Indigenous groups in Canada and are interested in joining the Program!",
            description:
              "Text describing the self-declaration form and its importance",
          })}
        </p>
        <RadioGroup
          idPrefix="isIndigenous"
          id="govEmployeeYesNo"
          name="govEmployeeYesNo"
          legend={labels.isIndigenous}
          rules={{
            required: intl.formatMessage(errorMessages.required),
          }}
          items={[
            {
              value: "yes",
              label: intl.formatMessage({
                defaultMessage:
                  '"I affirm that I am First Nations, Inuk (Inuit), or a Métis person"',
                id: "7STO48",
                description:
                  "Text for the option to self-declare as Indigenous",
              }),
            },
            {
              value: "no",
              label: intl.formatMessage({
                defaultMessage:
                  '"I am not a member of an Indigenous group, and I would like to see other opportunities available to me"',
                id: "//J5ti",
                description:
                  "Text for the option to self-declare as not an Indigenous person",
              }),
            },
          ]}
        />
        <p data-h2-text-align="base(center)" data-h2-margin="base(x1, 0, 0, 0)">
          {intl.formatMessage(
            {
              defaultMessage:
                "Not a member of an Indigenous group? <link>Explore other opportunities in IT within the federal government</link>.",
              id: "yiSRDd",
              description:
                "Text to lead non-indigenous people to browse other opportunities.",
            },
            {
              link: (chunks: React.ReactNode) =>
                otherOpportunitiesLink(chunks, locale),
            },
          )}
        </p>
      </div>
      <Separator
        orientation="horizontal"
        decorative
        data-h2-background-color="base(ia-secondary)"
        data-h2-margin="base(x2, 0)"
      />
      <div data-h2-text-align="base(center)">
        <p>
          {intl.formatMessage(
            {
              id: "YZ/ZhG",
              defaultMessage:
                "If you are unsure about providing your information, or if you have any questions regarding the IT Apprenticeship Program for Indigenous Peoples, please <link>contact us</link> and we would be happy to meet with you.",
              description:
                "Text describing where to get help with the self-declaration form",
            },
            {
              link: (chunks: React.ReactNode) => contactLink(chunks, locale),
            },
          )}
        </p>
        <p data-h2-font-weight="base(700)" data-h2-margin="base(x1, 0)">
          {intl.formatMessage(
            {
              defaultMessage:
                "See <whyLink>why we are asking you to self declare, how this will be verified</whyLink> and the term <definitionLink>Indigenous as defined for this program</definitionLink>.",
              id: "fppFGS",
              description:
                "Links to more information on the self-declaration process and definition of Indigenous",
            },
            {
              whyLink,
              definitionLink,
            },
          )}
        </p>
      </div>
    </BasicForm>
  );
};

export default SelfDeclarationForm;
