import { languages } from "./constants";
import { createI18n } from "@sveltebase/i18n";

export const i18n = createI18n(languages, "locale");
