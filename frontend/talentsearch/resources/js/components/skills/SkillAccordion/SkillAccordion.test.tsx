/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import React from "react";
import { IntlProvider, MessageFormatElement } from "react-intl";
import { fakeSkills } from "@common/fakeData";
import generator from "@common/fakeData/fakeExperienceSkills";
import { generators as experienceGenerator } from "@common/fakeData/fakeExperiences";

import { Skill } from "../../../api/generated";
import SkillAccordion from "./SkillAccordion";

const skills = fakeSkills();
const renderWithReactIntl = (
  component: React.ReactNode,
  locale?: "en" | "fr",
  messages?: Record<string, string> | Record<string, MessageFormatElement[]>,
) => {
  return render(
    <IntlProvider locale={locale || "en"} messages={messages}>
      {component}
    </IntlProvider>,
  );
};
const testSkill = skills[0];
function renderSkillAccordion(skill: Skill) {
  return renderWithReactIntl(<SkillAccordion skill={skill} />);
}

describe("SkillAccordion tests", () => {
  test("It renders Skill Accordion without any issues", () => {
    renderSkillAccordion(testSkill);
    const accordion = screen.getByTestId("skill");
    expect(accordion).not.toBeNull();
  });
  test("It renders proper context and detail when no experience provided", () => {
    renderSkillAccordion(testSkill);
    const accordion = screen.getAllByText("0 Experiences");
    const expectedResult =
      "<p>You do not have any experiences attached to this skill</p>";
    const detail = screen.getAllByTestId("detail");

    expect(accordion).not.toBeNull();
    expect(detail[0].innerHTML).toEqual(expectedResult);
  });

  test("It renders proper context and detail when an award experience is provided", () => {
    const experience = experienceGenerator.generateAward();
    testSkill.experienceSkills = [];
    testSkill.experienceSkills.push(
      generator.generateExperienceSkill(testSkill, experience),
    );
    renderSkillAccordion(testSkill);
    const context = screen.getByText("1 Experience");
    const detail = screen.getByTestId("detail");
    const titleElement = screen.getByTitle("award");
    expect(context).not.toBeNull();
    expect(detail).not.toBeNull();
    expect(titleElement.innerHTML.trim()).toEqual(experience.title);
  });
  test("It renders proper context and detail when a work experience is provided", () => {
    const experience = experienceGenerator.generateWork();
    testSkill.experienceSkills = [];
    testSkill.experienceSkills.push(
      generator.generateExperienceSkill(testSkill, experience),
    );
    renderSkillAccordion(testSkill);
    const context = screen.getByText("1 Experience");
    const detail = screen.getByTestId("detail");
    expect(context).not.toBeNull();
    expect(detail).not.toBeNull();
    expect(detail.innerHTML).toContain(experience.details);
    expect(detail.innerHTML).toContain(experience.division);
    expect(detail.innerHTML).toContain(experience.endDate);
    expect(detail.innerHTML).toContain(experience.organization);
    expect(detail.innerHTML).toContain(experience.role);
  });

  test("It renders proper context and detail when a community experience is provided", () => {
    const experience = experienceGenerator.generateCommunity();
    testSkill.experienceSkills = [];
    testSkill.experienceSkills.push(
      generator.generateExperienceSkill(testSkill, experience),
    );
    renderSkillAccordion(testSkill);
    const context = screen.getByText("1 Experience");
    const detail = screen.getByTestId("detail");
    expect(context).not.toBeNull();
    expect(detail).not.toBeNull();
    expect(detail.innerHTML).toContain(experience.details);
    expect(detail.innerHTML).toContain(experience.organization);
    expect(detail.innerHTML).toContain(experience.project);
    expect(detail.innerHTML).toContain(experience.organization);
    expect(detail.innerHTML).toContain(experience.title);
  });

  test("It renders proper context and detail when a education experience is provided", () => {
    const experience = experienceGenerator.generateEducation();
    testSkill.experienceSkills = [];
    testSkill.experienceSkills.push(
      generator.generateExperienceSkill(testSkill, experience),
    );
    renderSkillAccordion(testSkill);
    const context = screen.getByText("1 Experience");
    const detail = screen.getByTestId("detail");
    expect(context).not.toBeNull();
    expect(detail).not.toBeNull();
    expect(detail.innerHTML).toContain(experience.details);
    expect(detail.innerHTML).toContain(experience.institution);
    expect(detail.innerHTML).toContain(experience.areaOfStudy);
    expect(detail.innerHTML).toContain(experience.thesisTitle);
    expect(detail.innerHTML).toContain(experience.startDate);
  });

  test("It renders proper context and detail when a personal experience is provided", () => {
    const experience = experienceGenerator.generatePersonal();
    testSkill.experienceSkills = [];
    testSkill.experienceSkills.push(
      generator.generateExperienceSkill(testSkill, experience),
    );
    renderSkillAccordion(testSkill);
    const context = screen.getByText("1 Experience");
    const detail = screen.getByTestId("detail");
    expect(context).not.toBeNull();
    expect(detail).not.toBeNull();
    expect(detail.innerHTML).toContain(experience.details);
    expect(detail.innerHTML).toContain(experience.description);
    expect(detail.innerHTML).toContain(experience.startDate);
    expect(detail.innerHTML).toContain(experience.title);
    expect(detail.innerHTML).toContain(experience.endDate);
  });

  test("It renders proper context and detail when more than one experiences provided", () => {
    const experience1 = experienceGenerator.generateWork();
    const experience2 = experienceGenerator.generateEducation();

    testSkill.experienceSkills = [];
    testSkill.experienceSkills.push(
      generator.generateExperienceSkill(testSkill, experience1),
    );
    testSkill.experienceSkills.push(
      generator.generateExperienceSkill(testSkill, experience2),
    );
    renderSkillAccordion(testSkill);
    const accordion = screen.getByText("2 Experiences");
    const detail = screen.getByTestId("detail");
    expect(detail).not.toBeNull();
    expect(detail.innerHTML).toContain(experience1.details);
    expect(detail.innerHTML).toContain(experience2.details);

    expect(accordion).not.toBeNull();
  });
});
