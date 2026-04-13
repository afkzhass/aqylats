import { createContext, useContext, useState, ReactNode } from "react";

export type Language = "kz" | "ru" | "en";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<string, Record<Language, string>> = {
  "nav.courses": { kz: "Курстар", ru: "Курсы", en: "Courses" },
  "nav.dashboard": { kz: "Басты бет", ru: "Главная", en: "Dashboard" },
  "nav.library": { kz: "Кітапхана", ru: "Библиотека", en: "Library" },
  "nav.profile": { kz: "Профиль", ru: "Профиль", en: "Profile" },
  "nav.groups": { kz: "Топтар", ru: "Группы", en: "Groups" },
  "nav.homework": { kz: "Тапсырмалар", ru: "Задания", en: "Homework" },
  "nav.admin": { kz: "Әкімшілік", ru: "Админ", en: "Admin" },
  "lesson.prev": { kz: "← Алдыңғы сабақ", ru: "← Предыдущий урок", en: "← Previous lesson" },
  "lesson.next": { kz: "Келесі сабақ →", ru: "Следующий урок →", en: "Next lesson →" },
  "lesson.complete": { kz: "Өтілді деп белгілеу", ru: "Отметить как пройденный", en: "Mark as completed" },
  "lesson.completed": { kz: "Сабақ өтілді ✓", ru: "Урок пройден ✓", en: "Lesson completed ✓" },
  "quiz.title": { kz: "Блиц-сұрақ", ru: "Блиц-опрос", en: "Quick Quiz" },
  "platform.name": { kz: "Aqyl AI — Білім беру платформасы", ru: "Aqyl AI — Образовательная платформа", en: "Aqyl AI — Education Platform" },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem("aqyl_lang");
    return (saved as Language) || "ru";
  });

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("aqyl_lang", lang);
  };

  const t = (key: string) => translations[key]?.[language] || key;

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
};
