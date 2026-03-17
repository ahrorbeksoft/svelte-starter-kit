import RuFlagIcon from "$lib/components/icons/flags/ru.svelte";
import UsFlagIcon from "$lib/components/icons/flags/us.svelte";
import UzFlagIcon from "$lib/components/icons/flags/uz.svelte";

import en_messages from "$lib/locales/en.json";
import ru_messages from "$lib/locales/ru.json";
import uz_messages from "$lib/locales/uz.json";

export const languages = [
  { code: "uz", label: "O‘zbekcha", icon: UzFlagIcon, messages: uz_messages },
  { code: "ru", label: "Русский", icon: RuFlagIcon, messages: ru_messages },
  { code: "en", label: "English", icon: UsFlagIcon, messages: en_messages }
] as const;

export const siteTitle = "Svelte Starter Kit";
