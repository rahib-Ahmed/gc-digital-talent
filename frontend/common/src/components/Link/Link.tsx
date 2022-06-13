import React from "react";
import { navigate } from "../../helpers/router";
import type { Color } from "../Button";
import { colorMap } from "../Button/Button";

export interface LinkProps extends React.HTMLProps<HTMLAnchorElement> {
  /** The style colour of the link */
  color?: Color;
  /** The style mode of the element. */
  mode?: "solid" | "outline" | "inline";
  block?: boolean;
  type?: "button" | "link";
  /** For use when linking to a domain outside of the application */
  external?: boolean;
}

const Link: React.FC<LinkProps> = ({
  href,
  title,
  color,
  mode = "solid",
  block = false,
  external = false,
  type = "link",
  children,
  className,
  ...rest
}): React.ReactElement => (
  <a
    href={href}
    title={title}
    className={`${type === "button" && `button `}${className}`}
    {...(type === "button"
      ? {
          "data-h2-radius": "b(s)",
          "data-h2-padding": "b(x.25, x.5)",
          "data-h2-font-size": "b(caption) m(copy)",
          ...(color && mode ? { ...colorMap[color][mode] } : {}),
          ...(block
            ? {
                "data-h2-display": "b(block)",
                "data-h2-text-align": "b(center)",
              }
            : { "data-h2-display": "b(inline-block)" }),
        }
      : {})}
    {...rest}
    onClick={
      !external
        ? (event): void => {
            event.preventDefault();
            if (href) navigate(href);
          }
        : undefined
    }
  >
    {children}
  </a>
);

export default Link;
