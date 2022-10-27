import React from "react";
import { useIntl } from "react-intl";
import { useFieldArray, useFormContext } from "react-hook-form";

import SkillPicker from "@common/components/SkillPicker";
import { notEmpty } from "@common/helpers/util";
import SkillBlock from "@common/components/SkillPicker/SkillBlock";
import Separator from "@common/components/Separator";
import type { PoolAdvertisement, Skill } from "../../api/generated";
import SkillsInDetail from "../skills/SkillsInDetail/SkillsInDetail";

import type { FormSkill, FormSkills } from "./types";

export interface ExperienceSkillsProps {
  skills: Skill[];
  poolAdvertisement?: PoolAdvertisement;
}

const ExperienceSkills: React.FC<ExperienceSkillsProps> = ({
  skills,
  poolAdvertisement,
}) => {
  const intl = useIntl();
  const { control, watch } = useFormContext();
  const [addedSkills, setAddedSkills] = React.useState<Skill[]>([]);
  const watchedSkills: FormSkills = watch("skills");
  const { fields, remove, replace, append } = useFieldArray({
    control,
    name: "skills",
  });

  React.useEffect(() => {
    const newSkills = notEmpty(watchedSkills)
      ? watchedSkills
          .map((watchedSkill: FormSkill) => {
            const newSkill = skills.find((s) => s.id === watchedSkill.skillId);
            return newSkill || undefined;
          })
          .filter(notEmpty)
      : [];
    setAddedSkills(notEmpty(newSkills) ? newSkills : []);
  }, [watchedSkills, setAddedSkills, skills]);

  const handleChange = (newSkills: Skill[]) => {
    const massagedSkills = newSkills.map((newSkill) => {
      const existing = watchedSkills.find(
        (skill) => skill.skillId === newSkill.id,
      );

      return {
        skillId: newSkill.id,
        name: newSkill.name,
        details: existing ? existing.details : "",
      };
    });

    replace(massagedSkills);
  };

  const handleAddSkill = (id: string) => {
    const skillToAdd = skills.find((skill) => skill.id === id);

    if (skillToAdd) {
      append({
        skillId: skillToAdd.id,
        name: skillToAdd.name,
        details: "",
      });
    }
  };

  const handleRemoveSkill = (id: string) => {
    const index = watchedSkills.findIndex(
      (field: FormSkill) => field.skillId === id,
    );
    if (index >= 0) {
      remove(index);
    }
  };

  return (
    <>
      <h2 data-h2-font-size="base(h3, 1)" data-h2-margin="base(x2, 0, x1, 0)">
        {intl.formatMessage({
          defaultMessage: "2. Skills displayed during this experience",
          id: "pYGf4h",
          description: "Title for skills on Experience form",
        })}
      </h2>
      <p>
        {intl.formatMessage({
          defaultMessage:
            "Select skills that match the abilities you displayed during this experience period. You will explain how you used them in the next step.",
          id: "csD/wq",
          description: "Description blurb for skills on Experience form",
        })}
      </p>
      {poolAdvertisement ? (
        <>
          {poolAdvertisement.essentialSkills && (
            <div
              data-h2-radius="base(rounded)"
              data-h2-shadow="base(s)"
              data-h2-padding="base(x.5, x1, x.5, x.5)"
              data-h2-margin="base(x2, 0, x1, 0)"
            >
              <span data-h2-font-weight="base(700)">
                {intl.formatMessage({
                  defaultMessage: "Need-to-have skills",
                  id: "PXlO7h",
                  description:
                    "Title text for group of need-to-have skills for pool advertisement on experience forms",
                })}
              </span>
              <Separator
                color="black"
                data-h2-margin="base(x.5, 0)"
                orientation="horizontal"
              />
              {poolAdvertisement.essentialSkills.map((skill, index: number) => (
                <div key={skill.id} data-h2-padding="base(x0, x0, x0, x.5)">
                  <SkillBlock
                    skill={skill}
                    isAdded={
                      !!addedSkills.find((selected) => selected.id === skill.id)
                    }
                    onAddSkill={handleAddSkill}
                    onRemoveSkill={handleRemoveSkill}
                  />
                  {poolAdvertisement.essentialSkills &&
                  index + 1 !== poolAdvertisement.essentialSkills.length ? (
                    <Separator
                      color="black"
                      data-h2-margin="base(x.5, 0)"
                      orientation="horizontal"
                    />
                  ) : null}
                </div>
              ))}
            </div>
          )}
          {poolAdvertisement.nonessentialSkills && (
            <div
              data-h2-radius="base(rounded)"
              data-h2-shadow="base(s)"
              data-h2-padding="base(x.5, x1, x.5, x.5)"
            >
              <span data-h2-font-weight="base(700)">
                {intl.formatMessage({
                  defaultMessage: "Nice-to-have skills",
                  id: "xQ2Vfi",
                  description:
                    "Title text for group of nice-to-have skills for pool advertisement on experience forms",
                })}
              </span>
              <Separator
                color="black"
                data-h2-margin="base(x.5, 0)"
                orientation="horizontal"
              />
              {poolAdvertisement.nonessentialSkills.map(
                (skill, index: number) => (
                  <div key={skill.id} data-h2-padding="base(x0, x0, x0, x.5)">
                    <SkillBlock
                      skill={skill}
                      isAdded={
                        !!addedSkills.find(
                          (selected) => selected.id === skill.id,
                        )
                      }
                      onAddSkill={handleAddSkill}
                      onRemoveSkill={handleRemoveSkill}
                    />
                    {poolAdvertisement.essentialSkills &&
                    index + 1 !== poolAdvertisement.essentialSkills.length ? (
                      <Separator
                        color="black"
                        data-h2-margin="base(x.5, 0)"
                        orientation="horizontal"
                      />
                    ) : null}
                  </div>
                ),
              )}
            </div>
          )}
        </>
      ) : (
        <SkillPicker
          skills={skills || []}
          onUpdateSelectedSkills={handleChange}
          selectedSkills={addedSkills || []}
        />
      )}
      <SkillsInDetail
        skills={fields as FormSkills}
        onDelete={handleRemoveSkill}
      />
    </>
  );
};

export default ExperienceSkills;
