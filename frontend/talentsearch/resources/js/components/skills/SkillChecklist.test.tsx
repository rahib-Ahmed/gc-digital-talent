/**
 * @jest-environment jsdom
 */
import React from "react";
import { fakeSkillFamilies, fakeSkills } from "@common/fakeData";
import { invertSkillTree } from "@common/helpers/skillUtils";
import { render, screen, fireEvent } from "../../tests/testUtils";
import SkillChecklist from "./SkillChecklist";

const skills = fakeSkills(10, fakeSkillFamilies(5));
const testData = invertSkillTree(skills); // the component performs this inversion internally as well
const callback = jest.fn();

const renderSkillChecklist = () => {
  return render(<SkillChecklist skills={skills} callback={callback} />);
};

describe("Skill Checklist Tests", () => {
  test("should display the skill checklist div", async () => {
    renderSkillChecklist();
    const element = screen.getByTestId("skillChecklist");
    expect(element).toBeTruthy();
  });

  test("get correct response after checking one box", async () => {
    renderSkillChecklist();
    fireEvent.click(
      screen.getByLabelText(
        `${testData[1].name.en} (${testData[1].skills?.length})`,
      ),
    );
    expect(callback).toBeCalledWith([testData[1]]);
  });

  test("get correct response after checking all boxes", async () => {
    renderSkillChecklist();
    fireEvent.click(
      screen.getByLabelText(
        `${testData[1].name.en} (${testData[1].skills?.length})`,
      ),
    );
    fireEvent.click(
      screen.getByLabelText(
        `${testData[2].name.en} (${testData[2].skills?.length})`,
      ),
    );
    fireEvent.click(
      screen.getByLabelText(
        `${testData[0].name.en} (${testData[0].skills?.length})`,
      ),
    );
    fireEvent.click(
      screen.getByLabelText(
        `${testData[4].name.en} (${testData[4].skills?.length})`,
      ),
    );
    fireEvent.click(
      screen.getByLabelText(
        `${testData[3].name.en} (${testData[3].skills?.length})`,
      ),
    );
    expect(callback).toHaveBeenLastCalledWith([
      testData[1],
      testData[2],
      testData[0],
      testData[4],
      testData[3],
    ]);
  });

  test("get correct response after checking and unchecking boxes", async () => {
    renderSkillChecklist();
    fireEvent.click(
      screen.getByLabelText(
        `${testData[3].name.en} (${testData[3].skills?.length})`,
      ),
    );
    fireEvent.click(
      screen.getByLabelText(
        `${testData[1].name.en} (${testData[1].skills?.length})`,
      ),
    );
    fireEvent.click(
      screen.getByLabelText(
        `${testData[3].name.en} (${testData[3].skills?.length})`,
      ),
    );
    fireEvent.click(
      screen.getByLabelText(
        `${testData[4].name.en} (${testData[4].skills?.length})`,
      ),
    );
    fireEvent.click(
      screen.getByLabelText(
        `${testData[1].name.en} (${testData[1].skills?.length})`,
      ),
    );
    fireEvent.click(
      screen.getByLabelText(
        `${testData[3].name.en} (${testData[3].skills?.length})`,
      ),
    );
    expect(callback).toHaveBeenLastCalledWith([testData[4], testData[3]]);
  });
});
