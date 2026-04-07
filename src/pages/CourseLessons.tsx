import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, BookOpen, Clock, CheckCircle2, Circle, ChevronRight, GraduationCap } from "lucide-react";
import { courses } from "@/data/courses";
import LessonContent from "@/components/LessonContent";
import AIChatPanel from "@/components/AIChatPanel";

const CourseLessons = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const course = courses.find((c) => c.id === courseId);

  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());
  const [activeLesson, setActiveLesson] = useState<string | null>(null);

  if (!course) {
    return (
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-center">
            <p className="text-muted-foreground text-lg">Курс не найден</p>
            <button onClick={() => navigate("/")} className="mt-4 text-accent hover:underline text-sm">
              Вернуться к курсам  
            </button>
          </div>
        </div>
    );
  }

  const progress = course.lessonList.length > 0
    ? Math.round((completedLessons.size / course.lessonList.length) * 100)
    : 0;

  const toggleComplete = (lessonId: string) => {
    setCompletedLessons((prev) => {
      const next = new Set(prev);
      if (next.has(lessonId)) next.delete(lessonId);
      else next.add(lessonId);
      return next;
    });
  };

  // Show full lesson content for quantum physics lesson 1
  const showLessonContent = course.id === "quantum-physics" && activeLesson === "1";

  // Build context for AI chat
  const lessonContext = showLessonContent
    ? `Курс: ${course.name} (${course.subject}, ${course.grade})
Текущий урок: Фотоэлектрический эффект и квантовая природа света
Содержание урока:
1. Фотоны — элементарные частицы света, порции энергии. Энергия кванта E = h·ν (h = 6.626·10⁻³⁴ Дж·с).
2. Работа выхода (A_вых) — минимальная энергия для вылета электрона из металла.
3. Уравнение Эйнштейна: hν = A_вых + mv²/2.
4. Если энергия фотона < работы выхода, фотоэффект не происходит.
5. Максимальная скорость электронов зависит от частоты (цвета) света, а не от яркости.
6. Применения: солнечные панели, ночное видение.`
    : `Курс: ${course.name} (${course.subject}, ${course.grade}). Ученик просматривает список уроков.`;

  const progressText = `Пройдено ${completedLessons.size} из ${course.lessonList.length} уроков (${progress}%). Завершённые уроки: ${
    completedLessons.size > 0
      ? course.lessonList.filter((l) => completedLessons.has(l.id)).map((l) => l.title).join(", ")
      : "нет"
  }.`;

  return (
    <div className="animate-fade-in">
      <div className="max-w-[1100px] mx-auto px-4 md:px-8 py-6">
        {/* Back button */}
        <button
          onClick={() => {
            if (activeLesson) setActiveLesson(null);
          else navigate("/courses");
          }}
          className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground text-sm mb-5 transition-colors"
        >
          <ArrowLeft size={16} />
          {activeLesson ? "К списку уроков" : "К курсам"}
        </button>

        {/* Course header */}
        <div className={`rounded-xl bg-gradient-to-br ${course.gradient} p-6 mb-6 flex flex-col md:flex-row md:items-center gap-4`}>
          <div className="text-5xl">{course.emoji}</div>
          <div className="flex-1">
            <span className={`inline-block text-[11px] font-medium px-2.5 py-0.5 rounded-full mb-2 ${course.badgeColor}`}>
              {course.subject}
            </span>
            <h1 className="text-xl md:text-2xl font-serif font-medium text-foreground">{course.name}</h1>
            <div className="flex items-center gap-4 text-muted-foreground text-xs mt-2">
              <span className="flex items-center gap-1"><GraduationCap size={14} />{course.grade}</span>
              <span className="flex items-center gap-1"><BookOpen size={14} />{course.lessons} уроков</span>
            </div>
          </div>
          {/* Progress */}
          <div className="md:text-right min-w-[120px]">
            <div className="text-sm font-medium text-foreground mb-1">Прогресс: {progress}%</div>
            <div className="w-full h-2 bg-foreground/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-accent rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="text-[11px] text-muted-foreground mt-1">
              {completedLessons.size} из {course.lessonList.length} уроков
            </div>
          </div>
        </div>

        {/* Lesson content or list */}
        {showLessonContent ? (
          <LessonContent onComplete={() => toggleComplete("1")} isCompleted={completedLessons.has("1")} />
        ) : (
          <div className="space-y-2">
            <h2 className="text-lg font-serif font-medium text-foreground mb-4">Список уроков</h2>
            {course.lessonList.map((lesson, index) => {
              const done = completedLessons.has(lesson.id);
              return (
                <div
                  key={lesson.id}
                  className={`flex items-center gap-3 p-4 rounded-xl border transition-all cursor-pointer group ${
                    done
                      ? "bg-green-50 border-green-200"
                      : "bg-card border-border hover:border-accent/40 hover:shadow-sm"
                  }`}
                  onClick={() => {
                    if (course.id === "quantum-physics" && lesson.id === "1") {
                      setActiveLesson(lesson.id);
                    }
                  }}
                >
                  {/* Status icon */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleComplete(lesson.id);
                    }}
                    className="shrink-0"
                  >
                    {done ? (
                      <CheckCircle2 size={22} className="text-success" />
                    ) : (
                      <Circle size={22} className="text-border group-hover:text-accent/60" />
                    )}
                  </button>

                  {/* Number */}
                  <span className="text-xs font-medium text-muted-foreground w-6 text-center shrink-0">
                    {index + 1}
                  </span>

                  {/* Title */}
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-sans ${done ? "text-muted-foreground line-through" : "text-foreground"}`}>
                      {lesson.title}
                    </p>
                  </div>

                  {/* Duration */}
                  <span className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
                    <Clock size={12} />
                    {lesson.duration}
                  </span>

                  {/* Arrow */}
                  {course.id === "quantum-physics" && lesson.id === "1" && (
                    <ChevronRight size={16} className="text-muted-foreground group-hover:text-accent shrink-0" />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* AI Chat */}
      <AIChatPanel lessonContext={lessonContext} progress={progressText} />
    </div>
  );
};

export default CourseLessons;