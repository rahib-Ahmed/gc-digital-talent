import React, { ReactNode } from "react";
import { IntlShape } from "react-intl";

import { Locales } from "@gc-digital-talent/i18n";
import { CardFlatProps, CardLinkProps } from "@gc-digital-talent/ui";

interface GetFormLinkArgs {
  formName: React.ReactNode;
  files: { en: string; fr: string };
  intl: IntlShape;
}

const getFormLinks = ({
  formName,
  files,
  intl,
}: GetFormLinkArgs): CardFlatProps["links"] => {
  const links: CardFlatProps["links"] = [
    {
      label: intl.formatMessage(
        {
          defaultMessage: "Download <hidden>{formName} </hidden>Form (EN)",
          id: "cPhUHL",
          description: "Link text for an English form download",
        },
        { formName },
      ),
      href: files.en,
      mode: intl.locale === "en" ? "solid" : "outline",
    },
    {
      label: intl.formatMessage(
        {
          defaultMessage: "Download <hidden>{formName} </hidden>Form (FR)",
          id: "W/CsjU",
          description: "Link text for an French form download",
        },
        { formName },
      ),
      href: files.fr,
      mode: intl.locale === "en" ? "outline" : "solid",
    },
  ];

  return intl.locale === "en" ? links : links.reverse();
};

export default getFormLinks;
