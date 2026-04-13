import { useLanguage, Language } from "@/contexts/LanguageContext";
import { Globe } from "lucide-react";

const labels: Record<Language, string> = {
  kz: "Қазақша",
  ru: "Русский",
  en: "English",
};

const LanguagePicker = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-1.5">
      <Globe size={14} className="text-muted-foreground" />
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value as Language)}
        className="bg-card border border-border text-foreground text-xs px-2 py-1 rounded-full hover:border-accent/40 transition cursor-pointer focus:outline-none focus:ring-1 focus:ring-accent"
      >
        {(Object.keys(labels) as Language[]).map((lang) => (
          <option key={lang} value={lang}>{labels[lang]}</option>
        ))}
      </select>
    </div>
  );
};

export default LanguagePicker;
