import { Section, DefinitionBlock, ImportantBlock, LifehackBlock } from "./LessonBlocks";
import { Inline, Block } from "./KaTeX";
import { DerivativeConstructor } from "./DerivativeConstructor";
import { QuizBlock } from "./QuizBlock";
import { FlaskConical, Zap, BookOpen } from "lucide-react";

const DifferentiationRulesLesson = () => (
  <div className="space-y-2">
    <Section number={1} title="Правило суммы и разности" icon={<BookOpen size={18} className="text-accent" />}>
      <DefinitionBlock>
        <p>Производная суммы (разности) равна сумме (разности) производных:</p>
        <Block>{"(u \\pm v)' = u' \\pm v'"}</Block>
        <p>Константу можно вынести: <Inline>{"(C \\cdot u)' = C \\cdot u'"}</Inline></p>
      </DefinitionBlock>
      <p>Пример: <Inline>{"(3x^2 + 5x)' = 6x + 5"}</Inline></p>
    </Section>

    <Section number={2} title="Правило произведения" icon={<Zap size={18} className="text-accent" />}>
      <Block>{"(u \\cdot v)' = u' \\cdot v + u \\cdot v'"}</Block>
      <p>Пример: <Inline>{"(x^2 \\cdot \\sin x)' = 2x \\cdot \\sin x + x^2 \\cdot \\cos x"}</Inline></p>
      
      <LifehackBlock>
        <p>Запомните правило произведения как <strong>«первый штрих на второй + первый на второй штрих»</strong>. 
        Работает как рукопожатие: по очереди «дифференцируем» каждого участника.</p>
      </LifehackBlock>
    </Section>

    <Section number={3} title="Правило частного" icon={<FlaskConical size={18} className="text-accent" />}>
      <Block>{"\\left(\\frac{u}{v}\\right)' = \\frac{u' \\cdot v - u \\cdot v'}{v^2}"}</Block>
      
      <ImportantBlock title="Не забудьте!">
        <p>В правиле частного порядок важен: <Inline>{"u'v - uv'"}</Inline>, а не наоборот! 
        Знаменатель всегда возводится в квадрат. Знаменатель <Inline>{"v(x) \\neq 0"}</Inline>.</p>
      </ImportantBlock>

      <p>Пример: <Inline>{"\\left(\\frac{x}{\\sin x}\\right)' = \\frac{\\sin x - x \\cos x}{\\sin^2 x}"}</Inline></p>
    </Section>

    <Section number={4} title="Конструктор производных" icon={<Zap size={18} className="text-accent" />}>
      <p>Выберите правило и функции — система покажет пошаговое применение формулы:</p>
      <DerivativeConstructor />
    </Section>

    <QuizBlock
      questions={[
        {
          question: "По какому правилу вычисляется (x² · eˣ)'?",
          options: [
            { text: "Правило суммы", correct: false },
            { text: "Правило произведения", correct: true },
            { text: "Правило частного", correct: false },
          ],
        },
        {
          question: "Чему равна (x³ + cos x)'?",
          options: [
            { text: "3x² − sin x", correct: true },
            { text: "3x² + sin x", correct: false, explanation: "Производная cos x = −sin x, не забудьте минус!" },
            { text: "x² − sin x", correct: false },
          ],
        },
        {
          question: "Что стоит в знаменателе формулы производной частного?",
          options: [
            { text: "v", correct: false },
            { text: "v²", correct: true },
            { text: "u²", correct: false },
          ],
        },
      ]}
    />
  </div>
);

export default DifferentiationRulesLesson;
