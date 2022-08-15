import React from "react";
import { useIntl } from "react-intl";
import { XIcon } from "@heroicons/react/outline";

import Overlay from "./Overlay";
import Content from "./Content";

import "@reach/dialog/styles.css";
import "./dialog.css";

export type Color =
  | "ts-primary"
  | "ts-secondary"
  | "ia-primary"
  | "ia-secondary";

export const colorMap: Record<Color, Record<string, string>> = {
  "ts-primary": {
    "data-h2-bg-color": "b(linear-70[lightpurple][lightnavy])",
    "data-h2-font-color": "b(white)",
  },
  "ts-secondary": {
    "data-h2-bg-color": "b(lightnavy)",
    "data-h2-font-color": "b(white)",
  },
  "ia-primary": {
    "data-h2-bg-color": "b(linear-90[ia-lightpurple][ia-darkpurple])",
    "data-h2-font-color": "b(white)",
  },
  "ia-secondary": {
    "data-h2-bg-color": "b(linear-90[ia-pink][ia-darkpink])",
    "data-h2-font-color": "b(white)",
  },
};

interface FooterProps {
  children: React.ReactNode;
}
const Footer = ({ children }: FooterProps) => (
  <div
    className="dialog__footer"
    data-h2-margin="b(top, m)"
    data-h2-padding="b(top, m)"
    data-h2-border="b(darkgray, top, solid, s)"
  >
    {children}
  </div>
);

type HeaderProps = Pick<
  DialogProps,
  "title" | "subtitle" | "onDismiss" | "confirmation" | "color"
>;

const Header = ({
  title,
  subtitle,
  onDismiss,
  confirmation = false,
  color = "ia-primary",
}: HeaderProps) => {
  const intl = useIntl();
  return (
    <div
      className={`dialog__header ${
        confirmation ? `dialog__header--confirmation` : null
      }`}
      data-h2-radius="b(s, s, none, none)"
      data-h2-padding="b(all, m)"
      data-h2-position="b(relative)"
      {...(!confirmation
        ? { ...colorMap[color] }
        : {
            "data-h2-bg-color": "b(white)",
          })}
    >
      <button
        type="button"
        onClick={onDismiss}
        className="dialog-close"
        data-h2-padding="b(all, xs)"
        data-h2-position="b(absolute)"
        data-h2-location="b(top-right, s)"
        {...(confirmation
          ? {
              "data-h2-font-color": "b(black)",
            }
          : {
              "data-h2-font-color": "b(white)",
            })}
      >
        <span data-h2-visibility="b(invisible)">
          {intl.formatMessage({
            defaultMessage: "Close dialog",
            description: "Text for the button to close a modal dialog.",
          })}
        </span>
        <XIcon className="dialog-close__icon" />
      </button>
      <div
        className="dialog__title dialog__title--standard"
        data-h2-position="b(relative)"
      >
        <h1
          id="dialog-title"
          data-h2-font-weight="b(700)"
          data-h2-font-size="b(h3)"
          data-h2-margin="b(all, none)"
        >
          {title}
        </h1>
        {subtitle && (
          <p
            data-h2-margin="b(top, xs) b(bottom, none)"
            {...(confirmation
              ? {
                  "data-h2-font-color": "b(lightpurple)",
                }
              : null)}
          >
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
};

export interface DialogProps {
  isOpen: boolean;
  color?: Color;
  onDismiss: (e: React.MouseEvent | React.KeyboardEvent) => void;
  title: string;
  subtitle?: string;
  confirmation?: boolean;
  centered?: boolean;
  children: React.ReactNode;
}

const Dialog = ({
  title,
  subtitle,
  onDismiss,
  isOpen,
  color = "ia-primary",
  confirmation = false,
  centered = false,
  children,
}: DialogProps) => {
  return (
    <Overlay {...{ isOpen, onDismiss }} data-h2-font-family="b(sans)">
      <Content
        aria-labelledby="dialog-title"
        className={centered ? `dialog--centered` : undefined}
      >
        <Header {...{ title, subtitle, onDismiss, confirmation, color }} />
        <div className="dialog__content">{children}</div>
      </Content>
    </Overlay>
  );
};

Dialog.Overlay = Overlay;
Dialog.Content = Content;
Dialog.Header = Header;
Dialog.Footer = Footer;
export default Dialog;
