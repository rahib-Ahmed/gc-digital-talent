import React from "react";
import { useIntl } from "react-intl";

import { Link, Well } from "@gc-digital-talent/ui";
import { commonMessages } from "@gc-digital-talent/i18n";
import { notEmpty } from "@gc-digital-talent/helpers";

import { User } from "~/api/generated";

import ExperienceSection from "../ExperienceSection";

export type PathFunc = (path: void | string, id: void | string) => string;

const SkillExperienceSection = ({
  user,
  editPath,
}: {
  user: Pick<User, "experiences">;
  editPath?: string;
}) => {
  const intl = useIntl();
  const { experiences } = user;

  return !experiences || experiences?.length === 0 ? (
    <Well>
      <div data-h2-flex-grid="base(flex-start, x2, x1)">
        <div data-h2-flex-item="base(1of1)">
          <p>
            {intl.formatMessage({
              defaultMessage: "You haven't added any information here yet.",
              id: "SCCX7B",
              description: "Message for when no data exists for the section",
            })}
          </p>
        </div>
        <div data-h2-flex-item="base(1of1)">
          <p>
            {intl.formatMessage(commonMessages.requiredFieldsMissing)}{" "}
            <Link href={editPath}>
              {intl.formatMessage({
                defaultMessage: "Edit your skill and experience options.",
                id: "hDupu9",
                description:
                  "Link text for editing skills and experiences on profile.",
              })}
            </Link>
          </p>
        </div>
      </div>
    </Well>
  ) : (
    <div data-h2-padding="base(x1)" data-h2-radius="base(s)">
      <ExperienceSection experiences={experiences?.filter(notEmpty)} />
    </div>
  );
};

export default SkillExperienceSection;
