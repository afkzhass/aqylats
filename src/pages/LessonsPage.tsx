import { useEffect, useState } from "react";
import { BookOpen, PlayCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useUserRole } from "@/hooks/useUserRole";

interface Lesson {
  id: string;
  title: string;
  content: string;
  subject: string;
  grade: number;
  video_url: string | null;
  language: string;
}

const LessonsPage = () => {
  const { profile } = useAuth();
  const { language } = useLanguage();
  const { isStudent, isTeacher } = useUserRole();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Lesson | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      let q = supabase
        .from("lessons")
        .select("*")
        .eq("language", language === "en" ? "ru" : language)
        .order("grade", { ascending: true });

      // Students: filter by their grade; teachers: by their subject; admin: see all
      if (role === "student" && profile?.assigned_class) {
        q = q.eq("grade", profile.assigned_class);
      } else if (role === "teacher" && profile?.subject) {
        q = q.eq("subject", profile.subject);
      }

      const { data, error } = await q;
      if (!error && data) setLessons(data as Lesson[]);
      setLoading(false);
    };
    load();
  }, [language, role, profile?.assigned_class, profile?.subject]);

  return (
    <div className="max-w-[1000px] mx-auto px-4 md:px-8 py-8 animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-serif font-semibold text-foreground">
          {language === "kz" ? "Сабақтар" : language === "en" ? "Lessons" : "Уроки"}
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          {role === "student" && profile?.assigned_class
            ? `${profile.assigned_class} ${language === "kz" ? "сынып" : "класс"}`
            : role === "teacher" && profile?.subject
            ? profile.subject
            : language === "kz" ? "Барлық сабақтар" : "Все уроки"}
        </p>
      </div>

      {loading ? (
        <div className="text-muted-foreground text-sm">{language === "kz" ? "Жүктелуде..." : "Загрузка..."}</div>
      ) : lessons.length === 0 ? (
        <div className="bg-card border border-border rounded-xl p-8 text-center text-muted-foreground text-sm">
          {language === "kz" ? "Сабақтар табылмады" : "Уроки не найдены"}
        </div>
      ) : (
        <div className="grid gap-3">
          {lessons.map((l) => (
            <button
              key={l.id}
              onClick={() => setSelected(l)}
              className="text-left flex items-center gap-4 bg-card border border-border rounded-xl p-4 hover:shadow-sm hover:border-accent/30 transition-all"
            >
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                {l.video_url ? <PlayCircle size={20} className="text-accent" /> : <BookOpen size={20} className="text-accent" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{l.title}</p>
                <p className="text-xs text-muted-foreground">
                  {l.subject} · {l.grade} {language === "kz" ? "сынып" : "класс"}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}

      {selected && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-card border border-border rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-serif font-semibold text-foreground mb-2">{selected.title}</h2>
            <p className="text-xs text-muted-foreground mb-4">
              {selected.subject} · {selected.grade} {language === "kz" ? "сынып" : "класс"}
            </p>
            <pre className="whitespace-pre-wrap font-sans text-sm text-foreground/90 leading-relaxed">
              {selected.content}
            </pre>
            <button
              onClick={() => setSelected(null)}
              className="mt-6 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm hover:opacity-90"
            >
              {language === "kz" ? "Жабу" : "Закрыть"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LessonsPage;
