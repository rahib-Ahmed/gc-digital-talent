import React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { useIntl } from "react-intl";

import Button from "../Button/Button";
import Dialog from "../Dialog/Dialog";

import { Scalars, Skill, SkillCategory } from "../../api/generated";
import { commonMessages } from "../../messages";

import SkillSelection from "./SkillSelection";
import ProficiencySelection, { Proficiency } from "./ProficiencySelection";
import AddExperiences, { AnyExperienceType } from "./AddExperiences";

interface FormExperience {
  experience: Scalars["ID"];
  details: string;
}

export interface FormValues {
  category?: SkillCategory | "";
  family?: Scalars["ID"];
  skill?: Scalars["ID"];
  proficiency?: Proficiency | "";
  experiences: FormExperience[];
}

const defaultFormValues: FormValues = {
  category: "",
  family: "",
  skill: "",
  proficiency: "",
  experiences: [],
};

export interface SkillDialogProps {
  skills: Skill[];
  onSave: (values: FormValues) => Promise<void>;
  experiences?: AnyExperienceType[];
}

const AddASkillToLibraryDialog = ({
  skills,
  experiences,
  onSave,
}: SkillDialogProps) => {
  const intl = useIntl();
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const [selectedSkill, setSelectedSkill] = React.useState<Skill | null>(null);
  const methods = useForm<FormValues>({
    defaultValues: defaultFormValues,
  });

  const {
    handleSubmit,
    watch,
    reset,
    formState: { isSubmitting },
  } = methods;

  const [skill] = watch(["skill"]);

  const handleAddSkill = async (values: FormValues) => {
    await onSave(values).then(() => setIsOpen(false));
  };

  const handleOpenChange = (newIsOpen: boolean) => {
    if (!newIsOpen) {
      reset();
    }
    setIsOpen(newIsOpen);
  };

  const title = intl.formatMessage({
    defaultMessage: "Claim a new skill",
    id: "0jmnfM",
    description: "Title for the skill picker dialog",
  });

  return (
    <Dialog.Root open={isOpen} onOpenChange={handleOpenChange}>
      <Dialog.Trigger>
        <Button color="blue" mode="solid">
          {title}
        </Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(handleAddSkill)}>
            <Dialog.Header color="blue">{title}</Dialog.Header>
            <SkillSelection skills={skills} onSelectSkill={setSelectedSkill} />
            <ProficiencySelection selectedSkill={selectedSkill} />
            <AddExperiences
              selectedSkill={selectedSkill}
              experiences={experiences}
            />
            <Dialog.Footer
              data-h2-justify-content="base(flex-start)"
              data-h2-align-items="base(flex-start)"
            >
              <div>
                <Button
                  type="submit"
                  {...(skill
                    ? {
                        disabled: isSubmitting,
                        color: "blue",
                        mode: "solid",
                        "aria-describedby": undefined,
                      }
                    : {
                        disabled: true,
                        color: "black",
                        mode: "outline",
                        "aria-describedby": "skill-submit-help",
                      })}
                >
                  {isSubmitting
                    ? intl.formatMessage(commonMessages.saving)
                    : intl.formatMessage({
                        defaultMessage: "Save this skill",
                        id: "UK7YPO",
                        description:
                          "Button text for skill dialog submit button",
                      })}
                </Button>
                {!skill && (
                  <p
                    id="skill-submit-help"
                    data-h2-font-size="base(caption)"
                    data-h2-margin="base(x.5, 0, 0, 0)"
                  >
                    {intl.formatMessage({
                      id: "ZrUAVI",
                      defaultMessage: "Please, select a skill to continue",
                      description:
                        "Help text to explain why skill dialog submit button is disabled",
                    })}
                  </p>
                )}
              </div>
              <Dialog.Close>
                <Button
                  type="button"
                  mode="inline"
                  color="blue"
                  data-h2-padding="base(x.5, 0)"
                >
                  {intl.formatMessage({
                    defaultMessage: "Cancel",
                    id: "OVBFto",
                    description:
                      "Button text to cancel and close the skill dialog",
                  })}
                </Button>
              </Dialog.Close>
            </Dialog.Footer>
          </form>
        </FormProvider>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default AddASkillToLibraryDialog;
