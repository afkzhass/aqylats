import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, BookOpen, Clock, CheckCircle2, Circle, ChevronRight, GraduationCap } from "lucide-react";
import { courses } from "@/data/courses";
import LessonContent from "@/components/LessonContent";
import AIChatPanel from "@/components/AIChatPanel";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const CourseLessons = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const course = courses.find((c) => c.id === courseId);
  const { user } = useAuth();

  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());
  const [activeLesson, setActiveLesson] = useState<string | null>(null);

  // Load progress from DB
  useEffect(() => {
    const load = async () => {
      if (!user || !course) return;
      const { data } = await supabase
        .from("lesson_progress")
        .select("lesson_id, completed")
        .eq("student_id", user.id)
        .eq("course_id", course.id);
      if (data) {
        setCompletedLessons(new Set(data.filter((r) => r.completed).map((r) => r.lesson_id)));
      }
    };
    load();
  }, [user, course]);

  // Track when a lesson is opened
  useEffect(() => {
    const track = async () => {
      if (!user || !course || !activeLesson) return;
      await supabase.from("lesson_progress").upsert(
        {
          student_id: user.id,
          course_id: course.id,
          lesson_id: activeLesson,
          progress_pct: completedLessons.has(activeLesson) ? 100 : 50,
          completed: completedLessons.has(activeLesson),
          last_viewed_at: new Date().toISOString(),
        },
        { onConflict: "student_id,lesson_id" }
      );
      await supabase
        .from("profiles")
        .update({ last_lesson_id: activeLesson, last_course_id: course.id })
        .eq("user_id", user.id);
    };
    track();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeLesson, user?.id, course?.id]);

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

  const toggleComplete = async (lessonId: string) => {
    const isCurrentlyDone = completedLessons.has(lessonId);
    setCompletedLessons((prev) => {
      const next = new Set(prev);
      if (next.has(lessonId)) next.delete(lessonId);
      else next.add(lessonId);
      return next;
    });
    if (user) {
      await supabase.from("lesson_progress").upsert(
        {
          student_id: user.id,
          course_id: course.id,
          lesson_id: lessonId,
          progress_pct: !isCurrentlyDone ? 100 : 50,
          completed: !isCurrentlyDone,
          last_viewed_at: new Date().toISOString(),
        },
        { onConflict: "student_id,lesson_id" }
      );
    }
  };

  const activeLessonData = activeLesson ? course.lessonList.find((l) => l.id === activeLesson) : null;
  const activeLessonIndex = activeLesson ? course.lessonList.findIndex((l) => l.id === activeLesson) : -1;

  const lessonContext = activeLessonData
    ? `Курс: ${course.name} (${course.subject}, ${course.grade})\nТекущий урок: ${activeLessonData.title}`
    : `Курс: ${course.name} (${course.subject}, ${course.grade}). Ученик просматривает список уроков.`;

  const progressText = `Пройдено ${completedLessons.size} из ${course.lessonList.length} уроков (${progress}%).`;

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
          <div className="md:text-right min-w-[120px]">
            <div className="text-sm font-medium text-foreground mb-1">Прогресс: {progress}%</div>
            <div className="w-full h-2 bg-foreground/10 rounded-full overflow-hidden">
              <div className="h-full bg-accent rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
            </div>
            <div className="text-[11px] text-muted-foreground mt-1">{completedLessons.size} из {course.lessonList.length} уроков</div>
          </div>
        </div>

        {/* Lesson content or list */}
        {activeLesson && activeLessonData ? (
          <LessonContent
            courseId={course.id}
            lessonId={activeLesson}
            lessonTitle={activeLessonData.title}
            onComplete={() => toggleComplete(activeLesson)}
            isCompleted={completedLessons.has(activeLesson)}
            hasPrev={activeLessonIndex > 0}
            hasNext={activeLessonIndex < course.lessonList.length - 1}
            onPrev={() => setActiveLesson(course.lessonList[activeLessonIndex - 1].id)}
            onNext={() => setActiveLesson(course.lessonList[activeLessonIndex + 1].id)}
          />
        ) : (
          <div className="space-y-2">
            <h2 className="text-lg font-serif font-medium text-foreground mb-4">Список уроков</h2>
            {course.lessonList.map((lesson, index) => {
              const done = completedLessons.has(lesson.id);
              return (
                <div
                  key={lesson.id}
                  className={`flex items-center gap-3 p-4 rounded-xl border transition-all cursor-pointer group ${
                    done ? "bg-green-50 border-green-200" : "bg-card border-border hover:border-accent/40 hover:shadow-sm"
                  }`}
                  onClick={() => setActiveLesson(lesson.id)}
                >
                  <button onClick={(e) => { e.stopPropagation(); toggleComplete(lesson.id); }} className="shrink-0">
                    {done ? <CheckCircle2 size={22} className="text-green-600" /> : <Circle size={22} className="text-border group-hover:text-accent/60" />}
                  </button>
                  <span className="text-xs font-medium text-muted-foreground w-6 text-center shrink-0">{index + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm ${done ? "text-muted-foreground line-through" : "text-foreground"}`}>{lesson.title}</p>
                  </div>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
                    <Clock size={12} />{lesson.duration}
                  </span>
                  <ChevronRight size={16} className="text-muted-foreground group-hover:text-accent shrink-0" />
                </div>
              );
            })}
          </div>
        )}
      </div>

      <AIChatPanel lessonContext={lessonContext} progress={progressText} />
    </div>
  );
};

export default CourseLessons;
