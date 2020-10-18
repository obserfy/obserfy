/* global GATSBY_THEME_I18N_LINGUI */
import * as React from "react";
import { I18nProvider } from "@lingui/react";
import { setupI18n } from "@lingui/core";

const wrapPageElement = ({ element, props }) => {
  let locale = props.pageContext.locale;
  if (locale === undefined) {
    locale = "en";
  }

  const catalog = require(`${GATSBY_THEME_I18N_LINGUI}/${locale}/messages.js`);
  const i18n = setupI18n();
  i18n.load(locale, catalog.messages);
  i18n.activate(locale);

  return <I18nProvider i18n={i18n}>{element}</I18nProvider>;
};

export { wrapPageElement };
