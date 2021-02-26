/* global GATSBY_THEME_I18N_LINGUI */
import * as React from "react";
import { I18nProvider } from "@lingui/react";
import { i18n } from "@lingui/core";
import { en, id } from "make-plural";

const wrapPageElement = ({ element, props }) => {
  let locale = props.pageContext.locale;
  if (locale === undefined) {
    locale = "en";
  }
  if (locale === "id") {
    i18n.loadLocaleData("id", { plurals: id });
  } else {
    i18n.loadLocaleData("en", { plurals: en });
  }

  const catalog = require(`${GATSBY_THEME_I18N_LINGUI}/${locale}/messages.js`);
  i18n.load(locale, catalog.messages);
  i18n.activate(locale);

  if (typeof window !== "undefined") {
    window.__GATSBY_LOCALE = locale;
  }

  return <I18nProvider i18n={i18n}>{element}</I18nProvider>;
};

export { wrapPageElement };
