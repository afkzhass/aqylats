import { GraduationCap, Mail, Award, BarChart3 } from "lucide-react";
import { courses } from "@/data/courses";

const ProfilePage = () => {
  return (
    <div className="max-w-[800px] mx-auto px-4 md:px-8 py-8 animate-fade-in">
      <h1 className="text-2xl md:text-3xl font-serif font-semibold text-foreground mb-6">Профиль</h1>

      {/* Profile card */}
      <div className="bg-card border border-border rounded-xl p-6 mb-6 flex flex-col sm:flex-row items-center gap-5">
        <div className="w-20 h-20 rounded-full bg-accent flex items-center justify-center text-accent-foreground text-2xl font-serif font-semibold shrink-0">
          АБ
        </div>
        <div className="text-center sm:text-left">
          <h2 className="text-lg font-serif font-semibold text-foreground">Айдар Бекетов</h2>
          <div className="flex flex-wrap justify-center sm:justify-start gap-3 text-xs text-muted-foreground mt-2">
            <span className="flex items-center gap-1"><GraduationCap size={14} />11 класс</span>
            <span className="flex items-center gap-1"><Mail size={14} />aidar@school.kz</span>
          </div>
        </div>
      </div>

      {/* Achievements */}
      <h3 className="text-base font-serif font-medium text-foreground mb-3 flex items-center gap-2">
        <Award size={18} className="text-accent" /> Достижения
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
        {[
          { emoji: "🚀", label: "Первый урок" },
          { emoji: "🔥", label: "Стрик 3 дня" },
          { emoji: "🧪", label: "Квиз-мастер" },
        ].map((a) => (
          <div key={a.label} className="bg-card border border-border rounded-xl p-4 text-center">
            <div className="text-2xl mb-1">{a.emoji}</div>
            <p className="text-xs font-medium text-foreground">{a.label}</p>
          </div>
        ))}
      </div>

      {/* Course progress */}
      <h3 className="text-base font-serif font-medium text-foreground mb-3 flex items-center gap-2">
        <BarChart3 size={18} className="text-accent" /> Прогресс по курсам
      </h3>
      <div className="space-y-3">
        {courses.map((c) => {
          const pct = Math.floor(Math.random() * 30);
          return (
            <div key={c.id} className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">{c.name}</span>
                <span className="text-xs text-muted-foreground">{pct}%</span>
              </div>
              <div className="w-full h-2 bg-border rounded-full overflow-hidden">
                <div className="h-full bg-accent rounded-full transition-all" style={{ width: `${pct}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProfilePage;