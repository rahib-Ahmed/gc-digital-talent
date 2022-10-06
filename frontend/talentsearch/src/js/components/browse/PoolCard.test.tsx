/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";
import { screen } from "@testing-library/react";
import React from "react";
import { axeTest, render } from "@common/helpers/testUtils";
import { fakePoolAdvertisements } from "@common/fakeData";
import PoolCard, { CardProps } from "./PoolCard";

const fakedPool = fakePoolAdvertisements()[0];

const renderPoolCard = (props: CardProps) => render(<PoolCard {...props} />);

describe("PoolCard", () => {
  it("should have no accessibility errors", async () => {
    const { container } = renderPoolCard({
      pool: fakedPool,
    });

    await axeTest(container);
  });

  it("should render the card", async () => {
    renderPoolCard({ pool: fakedPool });

    expect(screen.getByText(/key skills/i)).toBeInTheDocument();
    expect(screen.getByText(/salary range/i)).toBeInTheDocument();
    expect(screen.getByText(/apply by/i)).toBeInTheDocument();
    expect(screen.getByText(/apply to this recruitment/i)).toBeInTheDocument();

    // check that the skill chips appeared
    expect(screen.getAllByRole("listitem")).toBeTruthy();

    // check the link on the apply button
    const applyLink = screen.getByRole("link", {
      name: /apply to this recruitment/i,
    });
    expect(applyLink).toHaveAttribute(
      "href",
      `/en/browse/pools/${fakedPool.id}`,
    );
  });
});
