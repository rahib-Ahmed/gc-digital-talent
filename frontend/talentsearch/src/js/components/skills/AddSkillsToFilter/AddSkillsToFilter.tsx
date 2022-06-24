import React from "react";
import { useIntl } from "react-intl";

import {
  Scalars,
  Skill,
  SkillCategory,
  SkillFamily,
} from "@common/api/generated";
import Pagination, { usePaginationVars } from "@common/components/Pagination";
import { matchStringCaseDiacriticInsensitive } from "@common/helpers/formUtils";
import { getLocale } from "@common/helpers/localize";
import { Tab, TabSet } from "@common/components/tabs";
import { invertSkillTree } from "@common/helpers/skillUtils";
import SkillResults from "../SkillResults";
import SkillFamiliesRadioList from "../SkillFamiliesRadioList/SkillFamiliesRadioList";
import AddedSkills from "../AddedSkills";

export interface AddSkillsToFilterProps {
  allSkills: Skill[];
  addedSkillIds: Scalars["ID"][];
  onAddSkill: (id: Scalars["ID"]) => void;
  onRemoveSkill: (id: Scalars["ID"]) => void;
}

const AddSkillsToFilter: React.FC<AddSkillsToFilterProps> = ({
  allSkills,
  addedSkillIds,
  onAddSkill,
  onRemoveSkill,
}) => {
  const intl = useIntl();
  const locale = getLocale(intl);

  const [technicalSkills, setTechnicalSkills] = React.useState<Skill[]>([]);
  const [filteredTechnicalSkills, setFilteredTechnicalSkills] = React.useState<
    Skill[]
  >([]);
  const [transferableSkills, setTransferableSkills] = React.useState<Skill[]>(
    [],
  );
  const [filteredTransferableSkills, setFilteredTransferableSkills] =
    React.useState<Skill[]>([]);
  const [searchSkills, setSearchSkills] = React.useState<Skill[]>([]);

  const addedSkills = addedSkillIds
    .map((id) => allSkills.find((skill) => skill.id === id))
    .filter((skill) => typeof skill !== "undefined") as Skill[];

  React.useEffect(() => {
    const technical = allSkills.filter((skill) => {
      return skill.families?.some((family) => {
        return family.category === SkillCategory.Technical;
      });
    });
    setTechnicalSkills(technical);
    const transferable = allSkills.filter((skill) => {
      return skill.families?.some((family) => {
        return family.category === SkillCategory.Behavioural;
      });
    });
    setTransferableSkills(transferable);
  }, [allSkills, setTechnicalSkills, setTransferableSkills]);

  const resultsPaginationPageSize = 5;
  const technicalSkillsPagination = usePaginationVars<Skill>(
    resultsPaginationPageSize,
    filteredTechnicalSkills,
  );
  const transferableSkillsPagination = usePaginationVars<Skill>(
    resultsPaginationPageSize,
    filteredTransferableSkills,
  );
  const searchSkillsPagination = usePaginationVars<Skill>(
    resultsPaginationPageSize,
    searchSkills,
  );

  /**
   * A handler which takes a list of skill families and filters the allSkills list to
   * any skills that are a part of those families.  Applies the filter
   * internally using the useState hook.
   * @param {SkillFamily[]} checkedFamilies - The selected skill families to filter against.
   */
  const handleSkillFamilyChange = (
    checkedFamily: SkillFamily | null,
    category: SkillCategory,
  ): void => {
    let skills = technicalSkills;
    let set = setFilteredTechnicalSkills;
    if (category === SkillCategory.Behavioural) {
      skills = transferableSkills;
      set = setFilteredTransferableSkills;
    }
    if (!checkedFamily) {
      set(skills);
    }

    const matchingSkills = skills.filter((skill) =>
      // https://stackoverflow.com/a/39893636
      skill.families?.some(
        (skillFamily) => checkedFamily?.id === skillFamily.id,
      ),
    );
    set(matchingSkills);
    technicalSkillsPagination.setCurrentPage(1); // just in case the new list of matched skills requires fewer pages
    transferableSkillsPagination.setCurrentPage(1); // just in case the new list of matched skills requires fewer pages
  };

  /**
   * A handler which takes a search query and uses a matching function to filter
   * a list of skills.  Applies the filter internally using the useState hook.
   * @param {string} searchQuery - The search text to filter against.
   */
  const handleSearch = (searchQuery: string): Promise<void> => {
    return new Promise<void>((resolve) => {
      const matchedSkills = allSkills.filter((skill) =>
        matchStringCaseDiacriticInsensitive(
          searchQuery,
          skill.name[locale] ?? "",
        ),
      );
      setSearchSkills(matchedSkills);
      searchSkillsPagination.setCurrentPage(1); // just in case the new list of matched skills requires fewer pages
      resolve();
    });
  };

  // this function can be a bit heavy
  const technicalSkillFamilies = React.useMemo(
    () => invertSkillTree(technicalSkills),
    [technicalSkills],
  );

  return (
    <>
      <h3
        data-h2-font-size="b(h4)"
        data-h2-font-weight="b(700)"
        data-h2-margin="b(bottom, m)"
      >
        {intl.formatMessage({
          defaultMessage: "Skills as filters",
          description: "Title for the skill filters on search page.",
        })}
      </h3>
      <p>
        {intl.formatMessage({
          defaultMessage:
            "Find candidates with the right skills for the job. Use the following tabs to find skills that are necessary for the job and select them to use them as filters for matching candidates.",
          description:
            "Describing how to use the skill filters on search page, paragraph one.",
        })}
      </p>
      <p>
        {intl.formatMessage({
          defaultMessage:
            " Why are there a limited number of skills? It’s important that applicants and managers are pulling from the same list of skills in order to create matches.",
          description:
            "Describing how to use the skill filters on search page, paragraph two.",
        })}
      </p>
      <h4>
        {intl.formatMessage({
          defaultMessage: "Find and select skills",
          description: "Subtitle for the skills filter on the search form.",
        })}
      </h4>
      <TabSet>
        <Tab
          text={intl.formatMessage({
            defaultMessage: "Technical skills",
            description:
              "Button text for the technical skills tab on skills filter",
          })}
        >
          <SkillFamiliesRadioList
            skillFamilies={technicalSkillFamilies}
            callback={(checked) =>
              handleSkillFamilyChange(checked, SkillCategory.Technical)
            }
          />
          <SkillResults
            title={intl.formatMessage(
              {
                defaultMessage: "Results ({skillCount})",
                description: "A title for a skill list of results",
              },
              { skillCount: filteredTechnicalSkills.length },
            )}
            skills={technicalSkillsPagination.currentTableData}
            addedSkills={addedSkills}
            handleAddSkill={onAddSkill}
            handleRemoveSkill={onRemoveSkill}
          />
          <Pagination
            ariaLabel={intl.formatMessage({
              defaultMessage: "Technical skills results",
              description: "Title for technical skills pagination",
            })}
            color="primary"
            mode="outline"
            currentPage={technicalSkillsPagination.currentPage}
            pageSize={resultsPaginationPageSize}
            totalCount={filteredTechnicalSkills.length}
            handlePageChange={(page: number) =>
              technicalSkillsPagination.setCurrentPage(page)
            }
            handlePageSize={technicalSkillsPagination.setPageSize}
          />
        </Tab>
        <Tab
          text={intl.formatMessage({
            defaultMessage: "Transferable skills",
            description:
              "Button text for the transferable skills tab on skills filter",
          })}
        >
          Transferable Skills
        </Tab>
        <Tab
          text={intl.formatMessage({
            defaultMessage: "By keyword",
            description:
              "Button text for the search skills tab on skills filter",
          })}
        >
          Search Skills
        </Tab>
      </TabSet>
      <AddedSkills
        skills={addedSkills}
        onRemoveSkill={onRemoveSkill}
        showHighAlert={false}
      />
    </>
  );
};

export default AddSkillsToFilter;
