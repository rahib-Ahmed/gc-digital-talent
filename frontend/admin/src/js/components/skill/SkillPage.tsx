import React from "react";
import { useIntl } from "react-intl";
import { Link } from "@common/components";
import { useAdminRoutes } from "../../adminRoutes";
import { SkillTableApi } from "./SkillTable";

export const SkillPage: React.FC = () => {
  const intl = useIntl();
  const paths = useAdminRoutes();
  return (
    <div>
      <header
        data-h2-background-color="b(dt-linear)"
        data-h2-padding="b(x2, x3)"
      >
        <div data-h2-flex-grid="b(center, 0, x2)">
          <div data-h2-flex-item="b(1of1) m(3of5)">
            <h1
              data-h2-color="b(dt-white)"
              data-h2-font-weight="b(800)"
              data-h2-margin="b(0)"
              style={{ letterSpacing: "-2px" }}
            >
              {intl.formatMessage({
                defaultMessage: "Skills",
                description:
                  "Heading displayed above the Skill Table component.",
              })}
            </h1>
          </div>
          <div
            data-h2-flex-item="b(1of1) m(2of5)"
            data-h2-text-align="m(right)"
          >
            <Link
              href={paths.skillCreate()}
              color="white"
              mode="outline"
              type="button"
            >
              {intl.formatMessage({
                defaultMessage: "Create Skill",
                description: "Heading displayed above the Create Skill form.",
              })}
            </Link>
          </div>
        </div>
      </header>
      <SkillTableApi />
    </div>
  );
};

export default SkillPage;
