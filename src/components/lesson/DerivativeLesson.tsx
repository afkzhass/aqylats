import { Section, DefinitionBlock, ImportantBlock, LifehackBlock } from "./LessonBlocks";
import { Inline, Block } from "./KaTeX";
import { DerivativeTable } from "./DerivativeTable";
import { QuizBlock } from "./QuizBlock";
import { FlaskConical, Zap, BookOpen } from "lucide-react";

const DerivativeLesson = () => (
  <div className="space-y-2">
    <Section number={1} title="Определение производной" icon={<BookOpen size={18} className="text-accent" />}>
      <DefinitionBlock>
        <p>Производная функции <Inline>{"f(x)"}</Inline> в точке <Inline>{"x_0"}</Inline> — это предел:</p>
        <Block>{"f'(x_0) = \\lim_{\\Delta x \\to 0} \\frac{f(x_0 + \\Delta x) - f(x_0)}{\\Delta x}"}</Block>
        <p>Производная показывает <strong>скорость изменения</strong> функции в данной точке.</p>
      </DefinitionBlock>
    </Section>

    <Section number={2} title="Геометрический смысл" icon={<Zap size={18} className="text-accent" />}>
      <p>
        Производная <Inline>{"f'(x_0)"}</Inline> равна <strong>угловому коэффициенту касательной</strong> к графику
        функции в точке <Inline>{"(x_0, f(x_0))"}</Inline>:
      </p>
      <Block>{"y = f(x_0) + f'(x_0)(x - x_0)"}</Block>
      
      <ImportantBlock title="Физический смысл">
        <p>Если <Inline>{"s(t)"}</Inline> — путь, пройденный за время <Inline>{"t"}</Inline>, то 
        <Inline>{"s'(t) = v(t)"}</Inline> — мгновенная скорость, а <Inline>{"v'(t) = a(t)"}</Inline> — ускорение.</p>
      </ImportantBlock>
    </Section>

    <Section number={3} title="Таблица производных" icon={<FlaskConical size={18} className="text-accent" />}>
      <p>Наведите курсор на любую строку таблицы, чтобы увидеть пример применения:</p>
      <DerivativeTable />
      
      <LifehackBlock>
        <p>Мнемоника для тригонометрических производных: <strong>«Синус рождает косинус, а косинус рождает 
        минус-синус»</strong>. Представьте цепочку: sin → cos → −sin → −cos → sin ...</p>
      </LifehackBlock>
    </Section>

    <Section number={4} title="Примеры вычисления" icon={<Zap size={18} className="text-accent" />}>
      <p>Найдём производную <Inline>{"f(x) = 3x^4 - 2x^2 + 5x - 1"}</Inline>:</p>
      <Block>{"f'(x) = 12x^3 - 4x + 5"}</Block>
      <p>Найдём производную <Inline>{"g(x) = e^x \\cdot \\sin x"}</Inline> (понадобится правило произведения из следующего урока):</p>
      <Block>{"g'(x) = e^x \\sin x + e^x \\cos x = e^x(\\sin x + \\cos x)"}</Block>
    </Section>

    <QuizBlock
      questions={[
        {
          question: "Чему равна производная f(x) = x⁵?",
          options: [
            { text: "5x⁴", correct: true },
            { text: "x⁴", correct: false, explanation: "Не забывайте умножать на показатель степени." },
            { text: "4x⁵", correct: false },
          ],
        },
        {
          question: "Что показывает производная в точке?",
          options: [
            { text: "Площадь под графиком", correct: false, explanation: "Это описание интеграла, а не производной." },
            { text: "Скорость изменения функции", correct: true },
            { text: "Максимум функции", correct: false },
          ],
        },
        {
          question: "Чему равна производная cos x?",
          options: [
            { text: "sin x", correct: false },
            { text: "−sin x", correct: true },
            { text: "−cos x", correct: false },
          ],
        },
      ]}
    />
  </div>
);

export default DerivativeLesson;
