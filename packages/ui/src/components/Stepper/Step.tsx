import React from "react";
import { useIntl } from "react-intl";

import { IconType } from "../../types";
import { StepState } from "./types";
import { linkStyleMap, getIconFromState, messageMap } from "./utils";
import Link from "../Link";

interface StepLinkProps {
  children: React.ReactNode;
  href: string;
  state: StepState;
  preventDisable?: boolean;
}

const StepLink = ({
  children,
  href,
  state,
  preventDisable,
  ...rest
}: StepLinkProps) => {
  const linkStyles = linkStyleMap.get(state);

  // Return a disabled Link
  if (state === "disabled" && !preventDisable) {
    return (
      // NOTE: This is a custom disabled link component
      // eslint-disable-next-line react/forbid-elements
      <a role="link" aria-disabled="true" {...(linkStyles || {})} {...rest}>
        {children}
      </a>
    );
  }

  return (
    <Link
      aria-current={state === "active" ? "step" : undefined}
      href={href}
      mode="text"
      {...(linkStyles || {})}
      {...rest}
    >
      {children}
    </Link>
  );
};
interface StepProps extends Omit<StepLinkProps, "children"> {
  icon?: IconType;
  last?: boolean;
  label: React.ReactNode;
}

const Step = ({
  label,
  href,
  icon,
  preventDisable,
  last = false,
  state,
}: StepProps) => {
  const intl = useIntl();
  const Icon = getIconFromState(state, icon);
  const message = messageMap.get(state);

  return (
    <li>
      <StepLink
        href={href}
        state={state}
        preventDisable={preventDisable}
        data-h2-display="base(block)"
        data-h2-width="base(100%)"
        data-h2-padding-left="base(x1.5)"
        data-h2-position="base(relative)"
        data-h2-outline="base(none)"
      >
        <span
          data-h2-position="base(absolute)"
          data-h2-location="base(x.1, auto, auto, 0)"
          data-h2-width="base(x1.5)"
          data-h2-height="base(100%)"
        >
          {!last && (
            <div
              className="Step__Tail Step__Flair"
              data-h2-position="base(absolute)"
              data-h2-location="base(-x.1, auto, auto, 50%)"
              data-h2-transform="base(translate(-50%, 0))"
              data-h2-height="base(calc(100% + x1))"
              data-h2-width="base(x.15)"
            />
          )}

          <span
            className="Step__Icon Step__Flair"
            data-h2-position="base(absolute)"
            data-h2-location="base(-x.1, auto, auto, 50%)"
            data-h2-transform="base(translate(-50%, 0))"
            data-h2-background="base(primary.light)"
            data-h2-radius="base(circle)"
            data-h2-height="base(x1.15)"
            data-h2-width="base(x1.15)"
          >
            {Icon && (
              <Icon
                data-h2-position="base(absolute)"
                data-h2-location="base(50%, auto, auto, 50%)"
                data-h2-transform="base(translate(-50%, -50%))"
                data-h2-height="base(x.65)"
                data-h2-width="base(x.65)"
              />
            )}
          </span>
        </span>
        <span
          className="Step__Text"
          data-h2-display="base(inline-block)"
          data-h2-margin-left="base(x.25)"
        >
          {message ? intl.formatMessage(message, { label }) : label}
        </span>
      </StepLink>
    </li>
  );
};

export default Step;
