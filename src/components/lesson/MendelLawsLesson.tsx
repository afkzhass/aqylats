import { Section, DefinitionBlock, ImportantBlock, LifehackBlock, CalloutBlock } from "./LessonBlocks";
import { Inline, Block } from "./KaTeX";
import { StepByStep } from "./StepByStep";
import { QuizBlock } from "./QuizBlock";
import { Dna, FlaskConical } from "lucide-react";

const MendelLawsLesson = () => (
  <div className="space-y-2">
    <Section number={1} title="Первый закон Менделя (единообразие)" icon={<Dna size={18} className="text-accent" />}>
      <DefinitionBlock>
        <p>При скрещивании двух гомозиготных организмов, отличающихся по одному признаку,
        все потомки первого поколения (<Inline>{"F_1"}</Inline>) <strong>единообразны</strong> по этому признаку.</p>
        <Block>{"AA \\times aa \\to Aa \\;(100\\%)"}</Block>
      </DefinitionBlock>
    </Section>

    <Section number={2} title="Второй закон Менделя (расщепление)" icon={<Dna size={18} className="text-accent" />}>
      <p>При скрещивании гетерозигот (<Inline>{"Aa \\times Aa"}</Inline>) во втором поколении:</p>
      <Block>{"F_2: \\; 1\\,AA : 2\\,Aa : 1\\,aa"}</Block>
      <p>Фенотипическое расщепление: <strong>3:1</strong></p>
      
      <StepByStep
        title="Решётка Пеннета для Aa × Aa"
        steps={[
          {
            title: "Гаметы родителей",
            content: <p>Каждый родитель образует гаметы <Inline>{"A"}</Inline> и <Inline>{"a"}</Inline></p>,
          },
          {
            title: "Комбинации",
            content: <p><Inline>{"AA"}</Inline> (25%) + <Inline>{"Aa"}</Inline> (50%) + <Inline>{"aa"}</Inline> (25%)</p>,
          },
          {
            title: "Фенотипы",
            content: <p>Доминантный признак: 75%, рецессивный: <strong>25%</strong> (¼)</p>,
          },
          {
            title: "Ответ",
            content: <p>Вероятность рецессивного признака в <Inline>{"F_2"}</Inline> = <Inline>{"\\frac{1}{4} = 25\\%"}</Inline></p>,
          },
        ]}
      />

      <ImportantBlock>
        <p>Закон расщепления выполняется при условиях: полное доминирование, большая выборка,
        равная жизнеспособность всех генотипов.</p>
      </ImportantBlock>
    </Section>

    <Section number={3} title="Третий закон Менделя (независимое наследование)" icon={<FlaskConical size={18} className="text-accent" />}>
      <p>При дигибридном скрещивании (<Inline>{"AaBb \\times AaBb"}</Inline>):</p>
      <Block>{"F_2: \\; 9:3:3:1"}</Block>
      <p>Признаки наследуются <strong>независимо</strong> друг от друга (при условии, что гены расположены в разных хромосомах).</p>
      
      <LifehackBlock>
        <p>Формула для расчёта числа типов гамет: <Inline>{"2^n"}</Inline>, где <Inline>{"n"}</Inline> — число гетерозиготных пар.
        Для <Inline>{"AaBb"}</Inline>: <Inline>{"2^2 = 4"}</Inline> типа гамет (AB, Ab, aB, ab).</p>
      </LifehackBlock>
    </Section>

    <CalloutBlock title="🧬 Межпредметная задача: Генетика + Генетический код" variant="info">
      <p>У растения ген кодирует белок последовательностью нуклеотидов. Произошла точечная мутация (замена одного нуклеотида).</p>
      <p className="mt-1"><strong>1.</strong> Используя таблицу генетического кода, определите, изменится ли аминокислота.</p>
      <p><strong>2.</strong> Если это растение (<Inline>{"Aa"}</Inline>) скрестить по второму закону Менделя (<Inline>{"Aa \\times Aa"}</Inline>),
      какова вероятность появления рецессивного признака в <Inline>{"F_2"}</Inline>?</p>
    </CalloutBlock>

    <QuizBlock
      questions={[
        {
          question: "Каково фенотипическое расщепление во втором поколении при моногибридном скрещивании?",
          options: [
            { text: "1:1", correct: false, explanation: "1:1 — при анализирующем скрещивании." },
            { text: "3:1", correct: true },
            { text: "9:3:3:1", correct: false, explanation: "Это расщепление при дигибридном скрещивании." },
          ],
        },
        {
          question: "Какова вероятность рецессивного фенотипа при Aa × Aa?",
          options: [
            { text: "50%", correct: false },
            { text: "25%", correct: true },
            { text: "75%", correct: false },
          ],
        },
        {
          question: "Сколько типов гамет образует организм AaBbCc?",
          options: [
            { text: "4", correct: false },
            { text: "8", correct: true },
            { text: "6", correct: false, explanation: "Формула: 2ⁿ, где n — число гетерозиготных пар. 2³ = 8." },
          ],
        },
      ]}
    />
  </div>
);

export default MendelLawsLesson;
