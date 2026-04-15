import { useEffect, useState } from "react";
import { Trophy, Star, Flame, BookOpen, Filter } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Progress } from "@/components/ui/progress";

interface TeacherRank {
  teacher_id: string;
  full_name: string;
  subject: string | null;
  avg_student_score: number;
  topics_covered_pct: number;
  interactive_lessons_count: number;
  total_score: number;
}

const medals = ["🥇", "🥈", "🥉"];
const subjectFilters = ["Все", "Математика", "Физика", "Химия", "Биология", "История", "Қазақ тілі"];

const LeaderboardPage = () => {
  const [teachers, setTeachers] = useState<TeacherRank[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterSubject, setFilterSubject] = useState("Все");

  useEffect(() => {
    const fetchLeaderboard = async () => {
      // Get teacher stats joined with profile names
      const { data: stats } = await supabase
        .from("teacher_stats")
        .select("*");

      if (!stats || stats.length === 0) {
        // Show demo data
        setTeachers(getDemoData());
        setLoading(false);
        return;
      }

      // Get profiles for teacher names
      const teacherIds = stats.map((s) => s.teacher_id);
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, full_name, subject")
        .in("user_id", teacherIds);

      const profileMap = new Map(profiles?.map((p) => [p.user_id, p]) || []);

      const ranked: TeacherRank[] = stats.map((s) => {
        const prof = profileMap.get(s.teacher_id);
        const total = (Number(s.avg_student_score) || 0) * 0.4 + (Number(s.topics_covered_pct) || 0) * 0.35 + (s.interactive_lessons_count || 0) * 0.25;
        return {
          teacher_id: s.teacher_id,
          full_name: prof?.full_name || "Учитель",
          subject: prof?.subject || null,
          avg_student_score: Number(s.avg_student_score) || 0,
          topics_covered_pct: Number(s.topics_covered_pct) || 0,
          interactive_lessons_count: s.interactive_lessons_count || 0,
          total_score: Math.round(total * 10) / 10,
        };
      });

      ranked.sort((a, b) => b.total_score - a.total_score);
      setTeachers(ranked);
      setLoading(false);
    };

    fetchLeaderboard();
  }, []);

  const filtered = filterSubject === "Все" ? teachers : teachers.filter((t) => t.subject === filterSubject);

  return (
    <div className="max-w-[900px] mx-auto px-4 md:px-8 py-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-serif font-semibold text-foreground flex items-center gap-2">
            <Trophy className="text-accent" size={28} /> Рейтинг преподавателей
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Лучшие учителя по результатам учеников</p>
        </div>
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-muted-foreground" />
          <select
            value={filterSubject}
            onChange={(e) => setFilterSubject(e.target.value)}
            className="bg-card border border-border text-foreground text-sm px-3 py-1.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
          >
            {subjectFilters.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-muted-foreground">Загрузка...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">Нет данных для выбранного фильтра</div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block bg-card border border-border rounded-xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border text-xs text-muted-foreground">
                  <th className="p-3 text-left w-12">#</th>
                  <th className="p-3 text-left">Учитель</th>
                  <th className="p-3 text-center">
                    <span className="flex items-center justify-center gap-1"><Star size={14} /> Ср. балл</span>
                  </th>
                  <th className="p-3 text-center">
                    <span className="flex items-center justify-center gap-1"><BookOpen size={14} /> Темы</span>
                  </th>
                  <th className="p-3 text-center">
                    <span className="flex items-center justify-center gap-1"><Flame size={14} /> Уроки</span>
                  </th>
                  <th className="p-3 text-center">Итого</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((t, i) => (
                  <tr key={t.teacher_id} className={`border-b border-border/50 last:border-0 ${i < 3 ? "bg-accent/5" : ""}`}>
                    <td className="p-3 text-lg text-center">
                      {i < 3 ? medals[i] : <span className="text-sm text-muted-foreground">{i + 1}</span>}
                    </td>
                    <td className="p-3">
                      <div className="font-medium text-sm text-foreground">{t.full_name}</div>
                      {t.subject && <div className="text-xs text-muted-foreground">{t.subject}</div>}
                    </td>
                    <td className="p-3">
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-sm font-semibold text-foreground">{t.avg_student_score}%</span>
                        <Progress value={t.avg_student_score} className="h-1.5 w-20" />
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-sm font-semibold text-foreground">{t.topics_covered_pct}%</span>
                        <Progress value={t.topics_covered_pct} className="h-1.5 w-20" />
                      </div>
                    </td>
                    <td className="p-3 text-center">
                      <span className="text-sm font-semibold text-foreground">{t.interactive_lessons_count}</span>
                    </td>
                    <td className="p-3 text-center">
                      <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-accent/10 text-accent font-bold text-sm">
                        {t.total_score}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-3">
            {filtered.map((t, i) => (
              <div key={t.teacher_id} className={`bg-card border rounded-xl p-4 ${i < 3 ? "border-accent/30" : "border-border"}`}>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">{i < 3 ? medals[i] : `#${i + 1}`}</span>
                  <div className="flex-1">
                    <div className="font-medium text-sm text-foreground">{t.full_name}</div>
                    {t.subject && <div className="text-xs text-muted-foreground">{t.subject}</div>}
                  </div>
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-accent/10 text-accent font-bold text-sm">
                    {t.total_score}
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground flex items-center gap-1"><Star size={12} /> Ср. балл</span>
                    <span className="font-medium text-foreground">{t.avg_student_score}%</span>
                  </div>
                  <Progress value={t.avg_student_score} className="h-1.5" />
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground flex items-center gap-1"><BookOpen size={12} /> Темы</span>
                    <span className="font-medium text-foreground">{t.topics_covered_pct}%</span>
                  </div>
                  <Progress value={t.topics_covered_pct} className="h-1.5" />
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground flex items-center gap-1"><Flame size={12} /> Интерактив</span>
                    <span className="font-medium text-foreground">{t.interactive_lessons_count}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

// Demo data for when the table is empty
function getDemoData(): TeacherRank[] {
  return [
    { teacher_id: "1", full_name: "Сабитова Алия", subject: "Математика", avg_student_score: 92, topics_covered_pct: 88, interactive_lessons_count: 45, total_score: 78.1 },
    { teacher_id: "2", full_name: "Касымов Нурлан", subject: "Физика", avg_student_score: 87, topics_covered_pct: 82, interactive_lessons_count: 38, total_score: 72.0 },
    { teacher_id: "3", full_name: "Жумабаева Айнур", subject: "Химия", avg_student_score: 85, topics_covered_pct: 79, interactive_lessons_count: 35, total_score: 69.4 },
    { teacher_id: "4", full_name: "Оразбеков Мурат", subject: "Биология", avg_student_score: 80, topics_covered_pct: 75, interactive_lessons_count: 30, total_score: 65.0 },
    { teacher_id: "5", full_name: "Ахметова Дана", subject: "История", avg_student_score: 78, topics_covered_pct: 70, interactive_lessons_count: 28, total_score: 62.4 },
  ];
}

export default LeaderboardPage;
