import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, GraduationCap, ArrowRight } from "lucide-react";
import { courses, subjects, type Subject } from "@/data/courses";

const CoursesPage = () => {
  const [active, setActive] = useState<Subject>("Все");

  const filtered = active === "Все" ? courses : courses.filter((c) => c.subject === active);

  return (
    <div className="max-w-[1100px] mx-auto px-4 md:px-8 py-8 animate-fade-in">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-serif font-medium text-foreground">
          Учебные курсы
        </h1>
        <p className="text-muted-foreground text-sm mt-1">Выберите курс для начала обучения</p>
      </div>

      {/* Filter */}
      <div className="flex gap-2 flex-wrap mb-8">
        {subjects.map((s) => (
          <button
            key={s}
            onClick={() => setActive(s)}
            className={`px-4 py-1.5 rounded-full text-sm font-sans transition-all border ${
              active === s
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card text-foreground border-border hover:bg-primary hover:text-primary-foreground hover:border-primary"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((course) => (
          <div
            key={course.name}
            className="bg-card border border-border rounded-xl overflow-hidden hover:-translate-y-1 hover:shadow-lg transition-all duration-200 group"
          >
            {/* Thumbnail */}
            <div className={`h-[120px] bg-gradient-to-br ${course.gradient} flex items-center justify-center text-4xl relative`}>
              {course.emoji}
              <span className="absolute top-2 right-2 bg-green-50 text-success text-[10px] font-medium px-2 py-0.5 rounded-full">
                Открыт
              </span>
            </div>

            {/* Body */}
            <div className="p-4">
              <span className={`inline-block text-[11px] font-medium px-2.5 py-0.5 rounded-full mb-2 ${course.badgeColor}`}>
                {course.subject}
              </span>
              <h3 className="font-serif text-[15px] font-medium text-foreground mb-3">
                {course.name}
              </h3>
              <div className="flex items-center gap-4 text-muted-foreground text-xs mb-4">
                <span className="flex items-center gap-1">
                  <GraduationCap size={14} />
                  {course.grade}
                </span>
                <span className="flex items-center gap-1">
                  <BookOpen size={14} />
                  {course.lessons} уроков
                </span>
              </div>
              <button className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground text-sm py-2.5 rounded-lg hover:bg-accent transition-colors font-sans">
              <button
                onClick={() => navigate(`/course/${course.id}`)}
                className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground text-sm py-2.5 rounded-lg hover:bg-accent transition-colors font-sans"
              >
                Перейти к урокам
                <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CoursesPage;
