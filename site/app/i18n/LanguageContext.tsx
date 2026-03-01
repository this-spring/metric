"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Language, Translations, translations } from "./translations";

interface LanguageContextValue {
  lang: Language;
  t: Translations;
  toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: "zh",
  t: translations.zh,
  toggleLanguage: () => {},
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>("zh");

  useEffect(() => {
    const saved = localStorage.getItem("metric-lang") as Language | null;
    if (saved === "zh" || saved === "en") setLang(saved);
  }, []);

  function toggleLanguage() {
    const next = lang === "zh" ? "en" : "zh";
    setLang(next);
    localStorage.setItem("metric-lang", next);
  }

  return (
    <LanguageContext.Provider value={{ lang, t: translations[lang], toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
