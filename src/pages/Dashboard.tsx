import { BookOpen, Trophy, Clock, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { courses } from "@/data/courses";
import { useAuth } from "@/contexts/AuthContext";
import { useUserRole } from "@/hooks/useUserRole";
import { useMemo } from "react";

const Dashboard = () => {
  const navigate = useNavigate();
  const { profile, user } = useAuth();
  const { isTeacher } = useUserRole();

  const firstName = profile?.full_name?.split(" ")[0] || user?.email?.split("@")[0] || "Ученик";

  // Sort courses: teacher's subject first
  const sortedCourses = useMemo(() => {
    if (!isTeacher || !profile?.subject) return courses;
    const subj = profile.subject;
    return [...courses].sort((a, b) => {
      const aMatch = a.subject === subj ? 0 : 1;
      const bMatch = b.subject === subj ? 0 : 1;
      return aMatch - bMatch;
    });
  }, [isTeacher, profile?.subject]);

  const greeting = isTeacher ? `Сәлем, ${firstName}! 📚` : `Сәлем, ${firstName}! 👋`;
  const subtitle = isTeacher
    ? `Ваш предмет: ${profile?.subject || "не указан"}. Материалы по вашей дисциплине — в приоритете.`
    : "Добро пожаловать в вашу образовательную платформу. Продолжайте обучение!";

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
          { icon: Trophy, label: "Пройдено", value: "12%", color: "text-accent bg-accent/10" },
          { icon: Clock, label: "Часов", value: "4.5", color: "text-purple-600 bg-purple-50" },
          { icon: TrendingUp, label: "Стрик", value: "3 дня", color: "text-success bg-green-50" },
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

      {/* Teacher highlight for their subject */}
      {isTeacher && profile?.subject && (
        <div className="mb-6 p-4 bg-accent/10 border border-accent/20 rounded-xl">
          <h2 className="text-base font-serif font-medium text-foreground mb-2">
            📌 Углубленные материалы: {profile.subject}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {sortedCourses.filter(c => c.subject === profile.subject).map((course) => (
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

      <h2 className="text-lg font-serif font-medium text-foreground mb-4">
        {isTeacher ? "Все курсы" : "Продолжить обучение"}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {(isTeacher ? sortedCourses.filter(c => c.subject !== profile?.subject) : sortedCourses).slice(0, 4).map((course) => (
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
                <div className="h-full bg-accent rounded-full" style={{ width: "15%" }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
