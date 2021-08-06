import React from "react";
import { defineMessages, useIntl } from "react-intl";
import { Link } from "../helpers/router";
import { CmoAssetTableApi } from "./CmoAssetTable";
import Button from "./H2Components/Button";

const messages = defineMessages({
  cmoAssetCreateHeading: {
    id: "cmoAssetPage.cmoAssetCreateHeading",
    defaultMessage: "Create CMO Asset",
    description: "Heading displayed above the CMO Asset Table component.",
  },
});

export const CmoAssetPage: React.FC = () => {
  const intl = useIntl();
  return (
    <div>
      <header
        data-h2-bg-color="b(linear-70[lightpurple][lightnavy])"
        data-h2-padding="b(top-bottom, l) b(right-left, xl)">
        <div data-h2-flex-grid="b(middle, expanded, flush, l)">
          <div data-h2-flex-item="b(1of1) m(3of5)">
            <h1
              data-h2-font-color="b(white)"
              data-h2-font-weight="b(800)"
              data-h2-margin="b(all, none)"
              style={{ letterSpacing: "-2px" }}>CMO Assets</h1>
          </div>
          <div data-h2-flex-item="b(1of1) m(2of5)" data-h2-text-align="m(right)">
            <Button
              color="white"
              mode="outline">
              <Link href="/cmo-assets/create" title="">
                {intl.formatMessage(messages.cmoAssetCreateHeading)}
              </Link>
            </Button>
          </div>
        </div>
      </header>
      <CmoAssetTableApi />
    </div>
  );
};

export default CmoAssetPage;
