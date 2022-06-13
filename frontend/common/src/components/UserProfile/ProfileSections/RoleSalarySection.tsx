import React from "react";
import { useIntl } from "react-intl";
import { Applicant } from "../../../api/generated";
import { getSalaryRange } from "../../../constants";

const RoleSalarySection: React.FunctionComponent<{
  applicant: Pick<Applicant, "expectedSalary">;
}> = ({ applicant }) => {
  const intl = useIntl();
  const { expectedSalary } = applicant;
  // generate array of  expectedSalary
  const expectedSalaryArray = expectedSalary
    ? expectedSalary.map((es) => (
        <li data-h2-font-weight="b(700)" key={es}>
          {es ? getSalaryRange(es) : ""}
        </li>
      ))
    : null;

  return (
    <div id="role-and-salary-expectations">
      <div
        data-h2-background-color="b(light.dt-gray)"
        data-h2-padding="b(x1)"
        data-h2-radius="b(s)"
      >
        {expectedSalaryArray !== null && expectedSalaryArray.length > 0 && (
          <p>
            {intl.formatMessage({
              defaultMessage:
                "I would like to be referred for jobs at the following levels:",
              description: "Label for Role and salary expectations sections",
            })}
          </p>
        )}
        <ul data-h2-padding="b(0, 0, 0, x2)">{expectedSalaryArray}</ul>
      </div>
    </div>
  );
};

export default RoleSalarySection;
