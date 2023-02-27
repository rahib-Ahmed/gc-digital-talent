import React from "react";

import {
  Heading,
  Breadcrumbs,
  type BreadcrumbsProps,
  Flourish,
} from "@gc-digital-talent/ui";
import BackgroundGraphic from "./BackgroundPattern";

import "./hero.css";

const paddingMap = new Map([
  [
    "default",
    {
      "data-h2-padding": "base(x3, 0)",
    },
  ],
  [
    "image",
    {
      "data-h2-padding":
        "base(x3, 0, 50vh, 0) p-tablet(x3, 0, 60vh, 0) l-tablet(x3, 0)",
    },
  ],
  [
    "overlap",
    {
      "data-h2-padding": "base(x3, 0, x6, 0)",
    },
  ],
]);

export interface HeroProps {
  imgPath?: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  crumbs?: BreadcrumbsProps["crumbs"];
  children?: React.ReactNode;
  centered?: boolean;
  contentAlignment?: "center" | "left" | "right";
}

const Hero = ({
  imgPath,
  title,
  subtitle,
  crumbs,
  children,
  centered = false,
  contentAlignment = "center",
}: HeroProps) => {
  const showImg = imgPath && !centered && !children;
  const breadCrumbs =
    crumbs && crumbs.length > 0 ? <Breadcrumbs crumbs={crumbs} /> : null;
  const textAlignment = centered
    ? {
        "data-h2-text-align": "base(center)",
      }
    : {
        "data-h2-text-align": "base(center) l-tablet(left)",
      };
  let padding = paddingMap.get("default");
  if (showImg) {
    padding = paddingMap.get("image");
  } else if (children) {
    padding = paddingMap.get("overlap");
  }
  let alignment = { "data-h2-text-align": "base(center)" };
  if (contentAlignment && contentAlignment === "left") {
    alignment = { "data-h2-text-align": "base(left)" };
  } else if (contentAlignment && contentAlignment === "right") {
    alignment = { "data-h2-text-align": "base(right)" };
  }
  return (
    <>
      <div
        data-h2-background-color="base(rgba(0, 0, 0, 1))"
        data-h2-overflow="base(hidden)"
        data-h2-position="base(relative)"
        {...padding}
      >
        <div
          data-h2-container="base(center, large, x1) p-tablet(center, large, x2)"
          data-h2-layer="base(3, relative)"
        >
          <div data-h2-color="base(white)" {...textAlignment}>
            <Heading level="h1" data-h2-margin="base(0)">
              {title}
            </Heading>
            {subtitle && (
              <p
                data-h2-font-size="base(h6, 1.4)"
                data-h2-font-weight="base(300)"
                data-h2-margin="base(x1, 0, 0, 0)"
              >
                {subtitle}
              </p>
            )}
          </div>
        </div>
        {showImg ? (
          <div
            data-h2-position="base(absolute)"
            data-h2-location="base(0)"
            data-h2-height="base(auto)"
            data-h2-width="base(100%)"
            data-h2-z-index="base(2)"
            className="header-bg-image"
            style={{ backgroundImage: `url('${imgPath}')` }}
          />
        ) : (
          <BackgroundGraphic
            data-h2-position="base(absolute)"
            data-h2-location="base(0, 0, auto, auto)"
            data-h2-height="base(auto)"
            data-h2-min-width="base(x20)"
            data-h2-width="base(75%)"
            data-h2-z-index="base(1)"
          />
        )}
      </div>
      {children ? (
        <>
          <Flourish />
          <div
            data-h2-container="base(center, large, x1) p-tablet(center, large, x2)"
            data-h2-position="base(relative)"
            data-h2-margin="base(-x4, auto, 0, auto)"
            data-h2-z-index="base(4)"
          >
            {children}
          </div>
        </>
      ) : (
        breadCrumbs
      )}
    </>
  );
};

export default Hero;
