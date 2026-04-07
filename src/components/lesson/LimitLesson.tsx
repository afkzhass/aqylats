import { Section, DefinitionBlock, ImportantBlock, LifehackBlock } from "./LessonBlocks";
import { Inline, Block } from "./KaTeX";
import { StepByStep } from "./StepByStep";
import { LimitGraph } from "./FunctionGraph";
import { QuizBlock } from "./QuizBlock";
import { FlaskConical, Sun, Target } from "lucide-react";

const LimitLesson = () => (
  <div className="space-y-2">
    <Section number={1} title="Что такое предел?" icon={<Target size={18} className="text-accent" />}>
      <p>
        Предел функции — это значение, к которому стремится <Inline>{"f(x)"}</Inline>, когда аргумент <Inline>{"x"}</Inline> приближается
        к некоторой точке <Inline>{"a"}</Inline>.
      </p>
      <DefinitionBlock>
        <p>Предел функции <Inline>{"f(x)"}</Inline> при <Inline>{"x \\to a"}</Inline> — это число <Inline>{"L"}</Inline>, такое что:</p>
        <Block>{"\\lim_{x \\to a} f(x) = L"}</Block>
        <p>Для любого <Inline>{"\\varepsilon > 0"}</Inline> существует <Inline>{"\\delta > 0"}</Inline>, 
        при котором <Inline>{"|f(x) - L| < \\varepsilon"}</Inline> для всех <Inline>{"0 < |x - a| < \\delta"}</Inline>.</p>
      </DefinitionBlock>
    </Section>

    <Section number={2} title="Определение производной через предел" icon={<FlaskConical size={18} className="text-accent" />}>
      <p>Производная — это предел отношения приращения функции к приращению аргумента:</p>
      <Block>{"f'(x) = \\lim_{\\Delta x \\to 0} \\frac{f(x + \\Delta x) - f(x)}{\\Delta x}"}</Block>
      
      <ImportantBlock title="Когда предел не существует">
        <p>Предел не существует, если:</p>
        <ul className="list-disc list-inside space-y-1 mt-1">
          <li>Левый и правый пределы различны: <Inline>{"\\lim_{x \\to a^-} f(x) \\neq \\lim_{x \\to a^+} f(x)"}</Inline></li>
          <li>Функция неограниченно растёт: <Inline>{"f(x) \\to \\pm\\infty"}</Inline></li>
          <li>Функция колеблется (например, <Inline>{"\\sin(1/x)"}</Inline> при <Inline>{"x \\to 0"}</Inline>)</li>
        </ul>
      </ImportantBlock>
    </Section>

    <Section number={3} title="Раскрытие неопределенности 0/0" icon={<Sun size={18} className="text-accent" />}>
      <p>Рассмотрим пример: найдём <Inline>{"\\lim_{x \\to 1} \\frac{x^2 - 1}{x - 1}"}</Inline></p>
      <StepByStep
        title="Пошаговое раскрытие неопределённости 0/0"
        steps={[
          {
            title: "Подставляем x = 1",
            content: <p>Получаем <Inline>{"\\frac{1-1}{1-1} = \\frac{0}{0}"}</Inline> — неопределённость!</p>,
          },
          {
            title: "Раскладываем числитель",
            content: <p>Используем формулу разности квадратов: <Inline>{"x^2 - 1 = (x-1)(x+1)"}</Inline></p>,
          },
          {
            title: "Сокращаем",
            content: <p><Inline>{"\\frac{(x-1)(x+1)}{x-1} = x + 1"}</Inline> (при <Inline>{"x \\neq 1"}</Inline>)</p>,
          },
          {
            title: "Подставляем x = 1",
            content: <p><Inline>{"\\lim_{x \\to 1} (x + 1) = 1 + 1 = 2"}</Inline></p>,
          },
          {
            title: "Ответ",
            content: <p><Block>{"\\lim_{x \\to 1} \\frac{x^2 - 1}{x - 1} = 2"}</Block></p>,
          },
        ]}
      />
    </Section>

    <Section number={4} title="График с выколотой точкой" icon={<Target size={18} className="text-accent" />}>
      <p>
        На графике <Inline>{"f(x) = \\frac{x^2-1}{x-1}"}</Inline> видно, что функция совпадает с <Inline>{"y = x+1"}</Inline>,
        кроме точки <Inline>{"x = 1"}</Inline>, где она не определена.
      </p>
      <LimitGraph />
      <LifehackBlock>
        <p>Запомните: предел — это то, <strong>куда стремится</strong> функция, а не значение в самой точке.
        Функция может даже не быть определена в точке, но предел всё равно существует!</p>
      </LifehackBlock>
    </Section>

    <QuizBlock
      questions={[
        {
          question: "Чему равен предел lim(x→2) (x² − 4)/(x − 2)?",
          options: [
            { text: "0", correct: false, explanation: "Подсказка: разложите числитель по формуле разности квадратов." },
            { text: "4", correct: true },
            { text: "Не существует", correct: false, explanation: "Неопределённость 0/0 можно раскрыть." },
          ],
        },
        {
          question: "Когда предел функции НЕ существует?",
          options: [
            { text: "Когда левый и правый пределы равны", correct: false },
            { text: "Когда левый и правый пределы различны", correct: true },
            { text: "Когда функция непрерывна", correct: false },
          ],
        },
        {
          question: "Какова формула производной через предел?",
          options: [
            { text: "f'(x) = f(x+1) − f(x)", correct: false, explanation: "Это конечная разность, а не производная." },
            { text: "f'(x) = lim(Δx→0) [f(x+Δx) − f(x)] / Δx", correct: true },
            { text: "f'(x) = f(x) / x", correct: false },
          ],
        },
      ]}
    />
  </div>
);

export default LimitLesson;
