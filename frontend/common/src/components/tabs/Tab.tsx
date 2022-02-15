import React from "react";

export type TabColor = "primary" | "secondary";
type TabAppearance = "active" | "inactive";

const styleMap: Record<
  TabColor,
  Record<TabAppearance, Record<string, string>>
> = {
  primary: {
    active: {
      "data-h2-font-color": "b(lightpurple)",
      "data-h2-font-weight": "b(bold)",
    },
    inactive: {
      "data-h2-font-color": "b(black)",
    },
  },
  secondary: {
    active: {
      "data-h2-font-color": "b(lightnavy)",
      "data-h2-font-weight": "b(bold)",
    },
    inactive: {
      "data-h2-font-color": "b(black)",
    },
  },
};
export interface TabProps extends React.HTMLProps<HTMLElement> {
  icon?: JSX.Element;
  iconOpen?: JSX.Element;
  iconClosed?: JSX.Element;
  iconPosition?: "left" | "right";
  text?: string;
  variant?: "normal" | "close" | "label";
  placement?: "default" | "end";
  /* below props are injected by parent TabSet  */
  isTabSetOpen?: boolean;
  isTabSelected?: boolean;
  onSelect?: VoidFunction;
  onToggleOpen?: VoidFunction;
  color?: TabColor;
}

export const Tab: React.FC<TabProps> = ({
  icon,
  iconOpen,
  iconClosed,
  iconPosition = "left",
  text,
  variant = "normal",
  placement = "default",
  isTabSetOpen,
  isTabSelected,
  onSelect,
  onToggleOpen,
  color = "primary",
}): React.ReactElement => {
  // start by calculating the icon to show
  let effectiveIcon;
  if (isTabSetOpen && iconOpen) {
    effectiveIcon = iconOpen;
  } else if (!isTabSetOpen && iconClosed) {
    effectiveIcon = iconClosed;
  } else {
    effectiveIcon = icon;
  }

  // arrange the contents of the label
  let label;
  if (!effectiveIcon) {
    label = text;
  } else if (iconPosition === "left") {
    label = (
      <div data-h2-display="b(flex)">
        {effectiveIcon}
        &nbsp;
        {text}
      </div>
    );
  } else if (iconPosition === "right") {
    label = (
      <div data-h2-display="b(flex)">
        {text}
        &nbsp;
        {effectiveIcon}
      </div>
    );
  }

  // active tabs will be bold and colored, otherwise they have plain text
  const tabAppearance =
    variant === "normal" && isTabSelected && isTabSetOpen
      ? "active"
      : "inactive";

  // build the data attribute collection for this tab
  const tabAttributes: Record<string, unknown> = {
    // margin & padding same for each tab
    "data-h2-padding": "b(top-bottom, xs) b(right-left, s)",
    // the *end* layout needs this margin to push it to the right
    ...(placement === "end" && { "data-h2-margin": "b(left, auto)" }),
    // styles based on color prop and active/inactive
    ...styleMap[color][tabAppearance],
  };

  let assembledTab: React.ReactElement;
  switch (variant) {
    case "normal":
      // open selected tab is not clickable
      if (isTabSetOpen && isTabSelected)
        assembledTab = <div {...tabAttributes}>{label}</div>;
      // otherwise, *normal* tabs are clickable
      else
        assembledTab = (
          <a
            role="tab"
            tabIndex={0}
            onClick={onSelect}
            onKeyPress={onSelect}
            style={{ cursor: "pointer" }}
            {...tabAttributes}
          >
            {label}
          </a>
        );
      break;

    case "close": // close tabs are always clickable
      assembledTab = (
        <a
          role="tab"
          tabIndex={0}
          onClick={onToggleOpen}
          onKeyPress={onToggleOpen}
          style={{ cursor: "pointer" }}
          {...tabAttributes}
        >
          {label}
        </a>
      );
      break;

    default:
      // just a text label
      assembledTab = <div {...tabAttributes}>{label}</div>;
  }

  return assembledTab;
};
export default Tab;
