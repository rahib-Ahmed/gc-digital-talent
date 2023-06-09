/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";
import React from "react";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "@gc-digital-talent/jest-helpers";
import MagnifyingGlassIcon from "@heroicons/react/24/solid/MagnifyingGlassIcon";
import SideMenu from "./SideMenu";
import type { SideMenuProps } from "./SideMenu";
import SideMenuItem from "./SideMenuItem";

const defaultProps = {
  open: true,
  label: "Main Menu",
  onToggle: jest.fn(() => null),
};

const icon = MagnifyingGlassIcon;
const openClass = "side-menu--open";

const renderSideMenu = (props: SideMenuProps) => {
  return renderWithProviders(
    <SideMenu {...props}>
      <SideMenuItem href="#" icon={icon}>
        Test
      </SideMenuItem>
    </SideMenu>,
  );
};

describe("SideMenu", () => {
  it("Should be closed if isOpen false", async () => {
    renderSideMenu({
      ...defaultProps,
      open: false,
    });

    const container = await screen.getByRole("navigation", {
      name: /main menu/i,
    }).parentElement?.parentElement;

    expect(container).not.toHaveClass(openClass);
  });

  it("Should be open if isOpen true", async () => {
    renderSideMenu(defaultProps);

    const container = await screen.getByRole("navigation", {
      name: /main menu/i,
    }).parentElement?.parentElement;

    expect(container).toHaveClass(openClass);
  });
});
