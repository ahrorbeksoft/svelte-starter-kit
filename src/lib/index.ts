import { languages } from "./constants";
import { Translator } from "./core/translator.svelte";

export const i18n = new Translator(languages, "uz");

export { State, PersistentState } from "./core/state.svelte";
