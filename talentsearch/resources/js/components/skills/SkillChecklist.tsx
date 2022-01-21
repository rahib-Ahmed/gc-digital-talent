import React from "react";
import groupBy from "lodash/groupBy";
import sum from "lodash/sum";
import { useIntl } from "react-intl";
import { getLocale } from "@common/helpers/localize";
import { SkillCategory, SkillFamily } from "@common/api/generated";
import {
  getSkillCategoryText,
  getSkillCategoryImage,
} from "@common/constants/localizedConstants";

interface FamilyProps {
  family: SkillFamily;
  checked: boolean;
  callback: (family: SkillFamily, checked: boolean) => void;
}

const Family: React.FunctionComponent<FamilyProps> = ({
  family,
  checked,
  callback,
}) => {
  const intl = useIntl();
  const locale = getLocale(intl);

  const uncheckedStyle = { "data-h2-font-weight": "b(400)" };
  const checkedStyle = { "data-h2-font-weight": "b(700)" };

  return (
    <div
      {...(checked ? checkedStyle : uncheckedStyle)}
      data-h2-padding="b(all, xxs)"
      key={family.key}
    >
      <input
        type="checkbox"
        id={family.id}
        onChange={(e) => {
          callback(family, e.target.checked);
        }}
      />
      &nbsp;
      <label htmlFor={family.id}>
        {family.name?.[locale]} ({family.skills ? family.skills.length : 0})
      </label>
    </div>
  );
};

interface CategoryProps {
  category: SkillCategory;
  skillFamilies: SkillFamily[];
  callback: (selected: SkillFamily, added: boolean) => void;
}

const Category: React.FunctionComponent<CategoryProps> = ({
  category,
  skillFamilies,
  callback,
}) => {
  const intl = useIntl();

  // The app currently crashes if no description is specified for the category.
  // Do we want to avoid this?
  const categoryName = intl.formatMessage(getSkillCategoryText(category));
  const skillCount = sum(
    skillFamilies.map((family) => (family.skills ? family.skills.length : 0)),
  );
  const title = `${categoryName} (${skillCount})`;
  const image = getSkillCategoryImage(category);

  const [selectedFamilies, setSelectedFamilies] = React.useState<SkillFamily[]>(
    [],
  );

  const handleChecked = (family: SkillFamily, checked: boolean) => {
    if (checked) {
      setSelectedFamilies([...selectedFamilies, family]);
    } else {
      setSelectedFamilies(
        selectedFamilies.filter((elem) => elem.id !== family.id),
      );
    }
    callback(family, checked);
  };

  return (
    <div data-h2-flex-item="s(1of2)">
      <p data-h2-font-weight="b(800)">
        &nbsp;
        {image}
        &nbsp;&nbsp;{title}
      </p>
      {skillFamilies.map((family) => {
        const checked = selectedFamilies.some(
          (selectedFamily) => selectedFamily.id === family.id,
        );
        return (
          <Family
            key={family.key}
            family={family}
            checked={checked}
            callback={handleChecked}
          />
        );
      })}
    </div>
  );
};

export interface SkillChecklistProps {
  skillFamilies: SkillFamily[];
  callback: (selected: SkillFamily[]) => void;
}

const SkillChecklist: React.FunctionComponent<SkillChecklistProps> = ({
  skillFamilies,
  callback,
}) => {
  // Divide the list of SkillFamilies by associated SkillCategory
  const skillCategories = groupBy(skillFamilies, "category");

  const [selected, setSelected] = React.useState<SkillFamily[]>([]);

  React.useEffect(() => {
    callback(selected);
  });

  const handleSelection = (newSelection: SkillFamily, added: boolean) => {
    if (added) {
      setSelected([...selected, newSelection]);
    } else {
      setSelected(selected.filter((elem) => elem.id !== newSelection.id));
    }
  };

  return (
    <div
      data-h2-flex-grid="b(normal, expanded, flush, m)"
      data-testid="skillChecklist"
    >
      {Object.keys(skillCategories).map((category) => {
        return (
          <Category
            key={category}
            category={category as SkillCategory}
            skillFamilies={skillCategories[category]}
            callback={handleSelection}
          />
        );
      })}
    </div>
  );
};

export default SkillChecklist;
