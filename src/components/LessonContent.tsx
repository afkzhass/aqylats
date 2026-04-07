import { useState } from "react";
import {
  CheckCircle2,
  Circle,
  Lightbulb,
  FlaskConical,
  Sun,
  Eye,
  AlertTriangle,
  Play,
  ClipboardCheck,
} from "lucide-react";

interface Props {
  onComplete: () => void;
  isCompleted: boolean;
}

const LessonContent = ({ onComplete, isCompleted }: Props) => {
  const [showQuiz, setShowQuiz] = useState(false);

  return (
    <article className="animate-fade-in space-y-6">
      {/* Title bar */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h2 className="text-xl md:text-2xl font-serif font-semibold text-foreground mb-1">
          Фотоэлектрический эффект и квантовая природа света
        </h2>
        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
          <span>Физика</span>
          <span>·</span>
          <span>11 класс</span>
          <span>·</span>
          <span>45 минут</span>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* LEFT — Video / Illustration */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-gradient-to-br from-blue-900 to-blue-700 rounded-xl aspect-video flex flex-col items-center justify-center text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMSIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIvPjwvc3ZnPg==')] opacity-50" />
            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-3 cursor-pointer hover:bg-white/30 transition-colors z-10">
              <Play size={28} className="text-white ml-1" />
            </div>
            <p className="text-sm text-white/70 z-10">Видео: Фотоэффект</p>
          </div>

          {/* Callout — Важно знать */}
          <Callout icon={<AlertTriangle size={18} />} title="Важно знать!">
            Фотоэффект доказывает <strong>корпускулярную природу света</strong>. Классическая волновая теория не может объяснить,
            почему ниже определённой частоты электроны не вылетают, какой бы яркой ни была лампа.
          </Callout>

          {/* Callout — Формулы */}
          <Callout icon={<Lightbulb size={18} />} title="Запомни формулы" variant="accent">
            <div className="space-y-2 font-mono text-sm">
              <p>E = h · ν</p>
              <p>hν = A<sub>вых</sub> + mv² / 2</p>
              <p>h = 6.626 · 10⁻³⁴ Дж·с</p>
            </div>
          </Callout>
        </div>

        {/* RIGHT — Theory text */}
        <div className="lg:col-span-3 space-y-0">
          <div className="bg-card border border-border rounded-xl p-5 md:p-6 space-y-7">
            <Section number={1} title="Введение" icon={<Lightbulb size={18} className="text-accent" />}>
              <p>
                Представьте, что свет — это не плавная волна, как в океане, а поток крошечных «пуль» или мячиков.
                Если эти мячики ударяются о металл, они могут «выбивать» из него электроны.
                Именно на этом принципе работают солнечные батареи и датчики в ваших смартфонах.
              </p>
            </Section>

            <Section number={2} title="Ключевые понятия" icon={<FlaskConical size={18} className="text-accent" />}>
              <ul className="list-disc list-inside space-y-2">
                <li><strong>Фотоны</strong> — элементарные частицы света, порции энергии.</li>
                <li><strong>Энергия кванта (E)</strong>: описывается формулой Планка:</li>
              </ul>
              <Formula>E = h · ν</Formula>
              <p className="text-muted-foreground text-xs mt-1">
                h — постоянная Планка, ν — частота света.
              </p>
              <ul className="list-disc list-inside mt-3">
                <li>
                  <strong>Работа выхода (A<sub>вых</sub>)</strong> — минимальная энергия для вылета электрона из металла.
                </li>
              </ul>
            </Section>

            <Section number={3} title="Уравнение Эйнштейна" icon={<Sun size={18} className="text-accent" />}>
              <p>Закон сохранения энергии для одного фотона:</p>
              <Formula>hν = A<sub>вых</sub> + mv² / 2</Formula>
              <p className="mt-2">
                <strong>Простыми словами:</strong> Энергия фотона тратится на «вытаскивание» электрона (A<sub>вых</sub>) и придание ему скорости.
              </p>
            </Section>

            <Section number={4} title="Практическое применение" icon={<FlaskConical size={18} className="text-accent" />}>
              <ul className="list-disc list-inside space-y-2">
                <li><strong>Солнечные панели:</strong> преобразование энергии фотонов в ток.</li>
                <li><strong>Ночное видение:</strong> усиление слабого потока фотонов.</li>
              </ul>
            </Section>
          </div>
        </div>
      </div>

      {/* Quiz section */}
      {!showQuiz ? (
        <div className="flex justify-center">
          <button
            onClick={() => setShowQuiz(true)}
            className="flex items-center gap-2 px-6 py-3 bg-accent text-accent-foreground rounded-xl text-sm font-sans font-medium hover:bg-accent/90 transition-colors shadow-md"
          >
            <ClipboardCheck size={18} />
            Проверить знания
          </button>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-xl p-5 md:p-6 animate-fade-in">
          <div className="flex items-center gap-2 mb-5">
            <Eye size={20} className="text-accent" />
            <h3 className="text-lg font-serif font-semibold text-foreground">Мини-квиз</h3>
          </div>
          <QuizBlock
            number={1}
            question="Что произойдет, если энергия фотона меньше работы выхода?"
            options={[
              { text: "Электроны вылетят медленно.", correct: false },
              { text: "Фотоэффект не произойдет.", correct: true },
              { text: "Металл нагреется, но ток не пойдет.", correct: false },
            ]}
          />
          <QuizBlock
            number={2}
            question="От чего зависит максимальная скорость вылетевших электронов?"
            options={[
              { text: "От яркости света.", correct: false },
              { text: "От частоты (цвета) света.", correct: true },
            ]}
          />
          <QuizBlock
            number={3}
            question="Кто предложил уравнение фотоэффекта?"
            options={[
              { text: "Макс Планк", correct: false },
              { text: "Альберт Эйнштейн", correct: true },
              { text: "Нильс Бор", correct: false },
            ]}
          />
        </div>
      )}

      {/* Complete button */}
      <div className="flex justify-center pb-4">
        <button
          onClick={onComplete}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-sans font-medium transition-all shadow-sm ${
            isCompleted
              ? "bg-green-50 text-success border border-green-200"
              : "bg-primary text-primary-foreground hover:bg-accent"
          }`}
        >
          {isCompleted ? <CheckCircle2 size={18} /> : <Circle size={18} />}
          {isCompleted ? "Урок пройден ✓" : "Отметить как пройденный"}
        </button>
      </div>
    </article>
  );
};

/* ---------- Sub-components ---------- */

const Section = ({
  number,
  title,
  icon,
  children,
}: {
  number: number;
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) => (
  <section>
    <div className="flex items-center gap-2 mb-3">
      {icon}
      <h3 className="text-base font-serif font-semibold text-foreground">
        {number}. {title}
      </h3>
    </div>
    <div className="text-sm leading-relaxed text-foreground/85 space-y-2 pl-1">
      {children}
    </div>
  </section>
);

const Formula = ({ children }: { children: React.ReactNode }) => (
  <div className="my-3 mx-auto max-w-sm bg-muted/60 border border-border rounded-lg py-3 px-5 text-center font-mono text-base text-foreground tracking-wide">
    {children}
  </div>
);

const Callout = ({
  icon,
  title,
  children,
  variant = "warning",
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  variant?: "warning" | "accent";
}) => {
  const styles =
    variant === "accent"
      ? "bg-accent/5 border-accent/30"
      : "bg-amber-50 border-amber-300";
  const iconColor = variant === "accent" ? "text-accent" : "text-amber-600";

  return (
    <div className={`border-l-4 rounded-xl p-4 ${styles}`}>
      <div className="flex items-center gap-2 mb-2">
        <span className={iconColor}>{icon}</span>
        <span className="text-sm font-semibold text-foreground">{title}</span>
      </div>
      <div className="text-sm leading-relaxed text-foreground/80">
        {children}
      </div>
    </div>
  );
};

const QuizBlock = ({
  number,
  question,
  options,
}: {
  number: number;
  question: string;
  options: { text: string; correct: boolean }[];
}) => {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <div className="mb-5 last:mb-0">
      <p className="text-sm font-medium text-foreground mb-3">
        <span className="text-accent font-semibold mr-1">{number}.</span> {question}
      </p>
      <div className="space-y-2 pl-1">
        {options.map((opt, i) => {
          const letter = String.fromCharCode(65 + i);
          let style = "bg-muted/40 border-border hover:border-accent/40";
          if (selected === i) {
            style = opt.correct
              ? "bg-green-50 border-green-300 text-success"
              : "bg-red-50 border-red-300 text-destructive";
          }
          return (
            <button
              key={i}
              onClick={() => setSelected(i)}
              className={`w-full text-left px-3 py-2.5 rounded-lg border text-sm transition-all ${style}`}
            >
              <span className="font-medium mr-2">{letter})</span>
              {opt.text}
              {selected === i && opt.correct && (
                <span className="ml-2 text-success">✓</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default LessonContent;