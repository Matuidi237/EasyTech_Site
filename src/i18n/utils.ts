import fr from "./fr.json";
import en from "./en.json";
import chatbotFr from "./chatbot.fr.json";
import chatbotEn from "./chatbot.en.json";

export const languages = {
  fr: "Français",
  en: "English"
};

export const defaultLang = "fr";

const translations = { fr, en };
const chatbotTranslations = { fr: chatbotFr, en: chatbotEn };

export type Lang = keyof typeof translations;

export function getLangFromUrl(url: URL): Lang {
  const [, lang] = url.pathname.split("/");
  if (lang === "en") return "en";
  return "fr";
}

export function useTranslations(lang: Lang) {
  return translations[lang] ?? translations[defaultLang];
}

export function useChatbotTranslations(lang: Lang) {
  return chatbotTranslations[lang] ?? chatbotTranslations[defaultLang];
}

export function getOtherLang(lang: Lang): Lang {
  return lang === "fr" ? "en" : "fr";
}

export function highlightBrand(text: string): string {
  return text.replace(/ThinkTech Solutions/g, '<strong class="brand-highlight">ThinkTech Solutions</strong>');
}
