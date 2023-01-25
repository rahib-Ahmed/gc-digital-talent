import "../../common/src/css/common.css";
import "../../common/src/css/hydrogen.css";
import "../src/css/app.css"
import { setIntlConfig, withIntl } from 'storybook-addon-intl';
import AdminFrench from "../src/js/lang/frCompiled.json";
import CommonFrench from "../../common/src/lang";
import IndigenousFrench from "../../../apps/web/src/lang/frCompiled.json";
import defaultRichTextElements from "../../common/src/helpers/format";
import MockGraphqlDecorator from "../../common/.storybook/decorators/MockGraphqlDecorator";
import withThemeProvider, { themeKey, themeMode } from "../../common/.storybook/decorators/ThemeDecorator"
import withRouter  from "../../common/.storybook/decorators/RouterDecorator"
import { INITIAL_VIEWPORTS } from "@storybook/addon-viewport";

// CSS files required for building with `MERGE_STORYBOOKS=true`.
import "../../../apps/web/src/assets/css/app.css";

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  backgrounds: {
    // Set default to "light gray" rather that default "white", to better catch
    // components with transparent backgrounds.
    default: 'light',
  },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  viewport: {
    // for possible values: https://github.com/storybookjs/storybook/blob/master/addons/viewport/src/defaults.ts
    viewports: INITIAL_VIEWPORTS
  },
}

const messages = {
  en: null,
  fr: {
    ...AdminFrench,
    ...CommonFrench,
    // Technically only needed when envvar MERGE_STORYBOOKS=true is used.
    ...IndigenousFrench,
  }
};

setIntlConfig({
  locales: ["en", "fr"],
  defaultLocale: "en",
  getMessages: (locale) => messages[locale],
  defaultRichTextElements
})

export const globalTypes = {
  themeKey,
  themeMode
}

export const decorators = [
  MockGraphqlDecorator,
  withIntl,
  withThemeProvider,
  withRouter,
  (Story) => (
    <div data-h2-color="base(black)" data-h2-background="base(background)" data-h2-font-family="base(sans)">
      <Story />
    </div>
  ),
];
