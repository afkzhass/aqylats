import { CheckCircle2, Circle, Lightbulb, FlaskConical, Sun, Eye } from "lucide-react";

interface Props {
  onComplete: () => void;
  isCompleted: boolean;
}

const LessonContent = ({ onComplete, isCompleted }: Props) => {
  return (
    <article className="bg-card border border-border rounded-xl p-6 md:p-8 animate-fade-in">
      {/* Title */}
      <h2 className="text-xl md:text-2xl font-serif font-medium text-foreground mb-1">
        Фотоэлектрический эффект и квантовая природа света
      </h2>
      <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mb-6">
        <span>Предмет: Физика</span>
        <span>|</span>
        <span>Класс: 11</span>
        <span>|</span>
        <span>Время изучения: 45 минут</span>
      </div>

      <hr className="border-border mb-6" />

      {/* 1. Введение */}
      <Section number={1} title="Введение (Мотивация)" icon={<Lightbulb size={18} className="text-accent" />}>
        <p>
          Представьте, что свет — это не плавная волна, как в океане, а поток крошечных «пуль» или мячиков.
          Если эти мячики ударяются о металл, они могут «выбивать» из него электроны.
          Именно на этом принципе работают солнечные батареи и датчики в ваших смартфонах.
        </p>
      </Section>

      {/* 2. Ключевые понятия */}
      <Section number={2} title="Ключевые понятия" icon={<FlaskConical size={18} className="text-accent" />}>
        <ul className="list-disc list-inside space-y-2">
          <li>
            <strong>Фотоны</strong> — элементарные частицы света, порции энергии.
          </li>
          <li>
            <strong>Энергия кванта (E)</strong>: описывается формулой Планка:
          </li>
        </ul>
        <Formula>E = h · ν</Formula>
        <p className="text-sm text-muted-foreground mt-1">
          где <em>h</em> — постоянная Планка (6.626 · 10⁻³⁴ Дж·с), а <em>ν</em> — частота света.
        </p>
        <ul className="list-disc list-inside mt-3">
          <li>
            <strong>Работа выхода (A<sub>вых</sub>)</strong> — минимальная энергия, которую нужно передать электрону,
            чтобы он покинул металл.
          </li>
        </ul>
      </Section>

      {/* 3. Уравнение Эйнштейна */}
      <Section number={3} title="Уравнение Эйнштейна для фотоэффекта" icon={<Sun size={18} className="text-accent" />}>
        <p>Это закон сохранения энергии для одного фотона:</p>
        <Formula>hν = A_вых + mv² / 2</Formula>
        <p className="mt-2">
          <strong>Простыми словами:</strong> Энергия прилетевшего фотона тратится на то, чтобы «вытащить» электрон
          из металла (A<sub>вых</sub>) и придать ему скорость (кинетическую энергию).
        </p>
      </Section>

      {/* 4. Мини-тест */}
      <Section number={4} title="Интерактивная проверка (Мини-тест)" icon={<Eye size={18} className="text-accent" />}>
        <QuizBlock
          question="Что произойдет, если энергия фотона меньше работы выхода?"
          options={[
            { text: "Электроны вылетят медленно.", correct: false },
            { text: "Фотоэффект не произойдет.", correct: true },
            { text: "Металл нагреется, но ток не пойдет.", correct: false },
          ]}
        />
        <QuizBlock
          question="От чего зависит максимальная скорость вылетевших электронов?"
          options={[
            { text: "От яркости света.", correct: false },
            { text: "От частоты (цвета) света.", correct: true },
          ]}
        />
      </Section>

      {/* 5. Практическое применение */}
      <Section number={5} title="Практическое применение" icon={<FlaskConical size={18} className="text-accent" />}>
        <ul className="list-disc list-inside space-y-2">
          <li><strong>Солнечные панели:</strong> Прямое преобразование энергии фотонов в электрический ток.</li>
          <li><strong>Ночное видение:</strong> Усиление слабого потока фотонов для создания видимого изображения.</li>
        </ul>
      </Section>

      {/* Complete button */}
      <div className="mt-8 pt-6 border-t border-border flex justify-center">
        <button
          onClick={onComplete}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-sans font-medium transition-all ${
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

const Section = ({ number, title, icon, children }: { number: number; title: string; icon: React.ReactNode; children: React.ReactNode }) => (
  <section className="mb-8">
    <div className="flex items-center gap-2 mb-3">
      {icon}
      <h3 className="text-base md:text-lg font-serif font-medium text-foreground">
        {number}. {title}
      </h3>
    </div>
    <div className="text-sm leading-relaxed text-foreground/90 space-y-2 pl-1">{children}</div>
  </section>
);

const Formula = ({ children }: { children: React.ReactNode }) => (
  <div className="my-3 mx-auto max-w-md bg-muted/60 border border-border rounded-lg py-3 px-5 text-center font-mono text-base text-foreground tracking-wide">
    {children}
  </div>
);

import { useState } from "react";

const QuizBlock = ({ question, options }: { question: string; options: { text: string; correct: boolean }[] }) => {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <div className="bg-muted/40 border border-border rounded-lg p-4 mb-4">
      <p className="text-sm font-medium text-foreground mb-3">{question}</p>
      <div className="space-y-2">
        {options.map((opt, i) => {
          const letter = String.fromCharCode(65 + i);
          let style = "bg-card border-border hover:border-accent/40";
          if (selected === i) {
            style = opt.correct
              ? "bg-green-50 border-green-300 text-success"
              : "bg-red-50 border-red-300 text-destructive";
          }
          return (
            <button
              key={i}
              onClick={() => setSelected(i)}
              className={`w-full text-left px-3 py-2 rounded-lg border text-sm transition-all ${style}`}
            >
              <span className="font-medium mr-2">{letter})</span>
              {opt.text}
              {selected === i && opt.correct && <span className="ml-2">✓</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default LessonContent;