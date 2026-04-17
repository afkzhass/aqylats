import { BookOpen, Trophy, Clock, TrendingUp, PlayCircle, Sparkles, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { courses } from "@/data/courses";
import { useAuth } from "@/contexts/AuthContext";
import { useUserRole } from "@/hooks/useUserRole";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Progress } from "@/components/ui/progress";

interface LessonProgressRow {
  course_id: string;
  lesson_id: string;
  progress_pct: number;
  completed: boolean;
  last_viewed_at: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { profile, user } = useAuth();
  const { isTeacher, isStudent } = useUserRole();

  const firstName =
    profile?.full_name?.split(" ")[0] || user?.email?.split("@")[0] || "Ученик";

  const [progressRows, setProgressRows] = useState<LessonProgressRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      const { data } = await supabase
        .from("lesson_progress")
        .select("course_id, lesson_id, progress_pct, completed, last_viewed_at")
        .eq("student_id", user.id)
        .order("last_viewed_at", { ascending: false });
      setProgressRows((data as LessonProgressRow[]) || []);
      setLoading(false);
    };
    load();
  }, [user]);

  // Sort courses: teacher's subject first; for students — assigned class info
  const sortedCourses = useMemo(() => {
    if (isTeacher && profile?.subject) {
      const subj = profile.subject;
      return [...courses].sort((a, b) => {
        const aMatch = a.subject === subj ? 0 : 1;
        const bMatch = b.subject === subj ? 0 : 1;
        return aMatch - bMatch;
      });
    }
    return courses;
  }, [isTeacher, profile?.subject]);

  // Per-course aggregate progress
  const courseProgress = useMemo(() => {
    const map: Record<string, { sum: number; count: number; total: number }> = {};
    courses.forEach((c) => {
      map[c.id] = { sum: 0, count: 0, total: c.lessonList.length };
    });
    progressRows.forEach((r) => {
      if (!map[r.course_id]) return;
      map[r.course_id].sum += r.progress_pct || 0;
      map[r.course_id].count += 1;
    });
    const out: Record<string, number> = {};
    Object.entries(map).forEach(([k, v]) => {
      out[k] = v.total > 0 ? Math.min(100, Math.round((v.sum / 100) * (1 / v.total) * 100)) : 0;
    });
    return out;
  }, [progressRows]);

  // Last opened lesson
  const lastLesson = useMemo(() => {
    if (!progressRows.length) return null;
    const r = progressRows[0];
    const course = courses.find((c) => c.id === r.course_id);
    if (!course) return null;
    const lesson = course.lessonList.find((l) => l.id === r.lesson_id);
    if (!lesson) return null;
    return { course, lesson, progress: r.progress_pct };
  }, [progressRows]);

  // Total lessons completed
  const completedCount = progressRows.filter((r) => r.completed).length;
  const totalLessons = courses.reduce((s, c) => s + c.lessonList.length, 0);
  const overallPct = totalLessons ? Math.round((completedCount / totalLessons) * 100) : 0;

  // AI Recommendations: based on subject (teacher) or assigned_class+unfinished (student)
  const aiRecommendations = useMemo(() => {
    let pool = courses;
    if (isTeacher && profile?.subject) {
      pool = courses.filter((c) => c.subject === profile.subject);
      if (pool.length < 3) pool = [...pool, ...courses.filter((c) => c.subject !== profile.subject)];
    }
    if (isStudent) {
      // Suggest courses with low progress first
      pool = [...courses].sort((a, b) => (courseProgress[a.id] || 0) - (courseProgress[b.id] || 0));
    }
    return pool.slice(0, 3);
  }, [isTeacher, isStudent, profile?.subject, courseProgress]);

  const greeting = isTeacher
    ? `Сәлем, ${firstName}! 📚`
    : `Сәлем, ${firstName}! 👋`;
  const subtitle = isTeacher
    ? `Ваш предмет: ${profile?.subject || "не указан"}. Материалы по вашей дисциплине — в приоритете.`
    : profile?.assigned_class
    ? `${profile.assigned_class} класс. Продолжайте обучение!`
    : "Добро пожаловать в Aqyl AI. Продолжайте обучение!";

  return (
    <div className="max-w-[1000px] mx-auto px-4 md:px-8 py-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-serif font-semibold text-foreground">
          {greeting}
        </h1>
        <p className="text-muted-foreground text-sm mt-1 font-sans">{subtitle}</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { icon: BookOpen, label: "Курсов", value: courses.length, color: "text-blue-600 bg-blue-50" },
          { icon: Trophy, label: "Пройдено уроков", value: completedCount, color: "text-accent bg-accent/10" },
          { icon: TrendingUp, label: "Общий прогресс", value: `${overallPct}%`, color: "text-success bg-green-50" },
          { icon: Clock, label: "Активных", value: progressRows.length, color: "text-purple-600 bg-purple-50" },
        ].map((s) => (
          <div key={s.label} className="bg-card border border-border rounded-xl p-4">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-2 ${s.color}`}>
              <s.icon size={18} />
            </div>
            <div className="text-xl font-semibold text-foreground font-sans">{s.value}</div>
            <div className="text-xs text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Continue last lesson */}
      {lastLesson && (
        <div
          onClick={() => navigate(`/course/${lastLesson.course.id}/lesson/${lastLesson.lesson.id}`)}
          className="mb-6 group cursor-pointer bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20 rounded-xl p-5 hover:shadow-md transition-all"
        >
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 min-w-0">
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${lastLesson.course.gradient} flex items-center justify-center text-2xl shrink-0`}>
                <PlayCircle className="text-foreground" size={28} />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Продолжить</p>
                <p className="text-base font-medium text-foreground truncate">{lastLesson.lesson.title}</p>
                <p className="text-xs text-muted-foreground">{lastLesson.course.name}</p>
                <Progress value={lastLesson.progress} className="h-1.5 mt-2 max-w-[280px]" />
              </div>
            </div>
            <ArrowRight className="text-accent shrink-0 group-hover:translate-x-1 transition-transform" size={20} />
          </div>
        </div>
      )}

      {/* Teacher highlight for their subject */}
      {isTeacher && profile?.subject && (
        <div className="mb-6 p-4 bg-accent/10 border border-accent/20 rounded-xl">
          <h2 className="text-base font-serif font-medium text-foreground mb-2">
            📌 Углубленные материалы: {profile.subject}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {sortedCourses
              .filter((c) => c.subject === profile.subject)
              .map((course) => (
                <div
                  key={course.id}
                  onClick={() => navigate(`/course/${course.id}`)}
                  className="flex items-center gap-3 bg-card border border-border rounded-xl p-3 cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all"
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${course.gradient} flex items-center justify-center text-xl shrink-0`}>
                    {course.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{course.name}</p>
                    <p className="text-xs text-muted-foreground">{course.lessons} уроков · {course.grade}</p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* AI Recommendations */}
      <h2 className="text-lg font-serif font-medium text-foreground mb-3 flex items-center gap-2">
        <Sparkles size={18} className="text-accent" /> Рекомендовано AI
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
        {aiRecommendations.map((course) => (
          <div
            key={`rec-${course.id}`}
            onClick={() => navigate(`/course/${course.id}`)}
            className="bg-card border border-border rounded-xl p-4 cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all"
          >
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${course.gradient} flex items-center justify-center text-xl mb-3`}>
              {course.emoji}
            </div>
            <p className="text-sm font-medium text-foreground line-clamp-2">{course.name}</p>
            <p className="text-xs text-muted-foreground mt-1">{course.subject}</p>
          </div>
        ))}
      </div>

      <h2 className="text-lg font-serif font-medium text-foreground mb-4">
        {isTeacher ? "Все курсы" : "Мои курсы"}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {(isTeacher
          ? sortedCourses.filter((c) => c.subject !== profile?.subject)
          : sortedCourses
        )
          .slice(0, 4)
          .map((course) => {
            const pct = courseProgress[course.id] || 0;
            return (
              <div
                key={course.id}
                onClick={() => navigate(`/course/${course.id}`)}
                className="flex items-center gap-4 bg-card border border-border rounded-xl p-4 cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all group"
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${course.gradient} flex items-center justify-center text-2xl shrink-0`}>
                  {course.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{course.name}</p>
                  <p className="text-xs text-muted-foreground">{course.subject} · {course.grade}</p>
                  <div className="w-full h-1.5 bg-border rounded-full mt-2 overflow-hidden">
                    <div className="h-full bg-accent rounded-full transition-all" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              </div>
            );
          })}
      </div>

      {loading && (
        <div className="text-center text-xs text-muted-foreground mt-4">Загрузка прогресса...</div>
      )}
    </div>
  );
};

export default Dashboard;
