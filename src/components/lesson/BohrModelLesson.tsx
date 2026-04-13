import { Section, DefinitionBlock, ImportantBlock, LifehackBlock } from "./LessonBlocks";
import { Inline, Block } from "./KaTeX";
import { StepByStep } from "./StepByStep";
import { QuizBlock } from "./QuizBlock";
import { Atom, Zap } from "lucide-react";

const BohrModelLesson = () => (
  <div className="space-y-2">
    <Section number={1} title="Постулаты Бора" icon={<Atom size={18} className="text-accent" />}>
      <DefinitionBlock title="Первый постулат (стационарные состояния)">
        <p>
          Электрон в атоме может находиться только на определённых орбитах, на которых он
          <strong> не излучает</strong> энергию. Эти орбиты называются <strong>стационарными</strong>.
        </p>
        <Block>{"m v r = n\\hbar, \\quad n = 1, 2, 3, \\ldots"}</Block>
      </DefinitionBlock>
      <DefinitionBlock title="Второй постулат (правило частот)">
        <p>При переходе между уровнями атом излучает или поглощает фотон:</p>
        <Block>{"h\\nu = |E_n - E_m|"}</Block>
      </DefinitionBlock>
    </Section>

    <Section number={2} title="Энергетические уровни водорода" icon={<Zap size={18} className="text-accent" />}>
      <p>Энергия электрона на n-м уровне атома водорода:</p>
      <Block>{"E_n = -\\frac{13{,}6}{n^2} \\text{ эВ}"}</Block>
      
      <ImportantBlock>
        <p>Отрицательное значение означает, что электрон <strong>связан</strong> с ядром.
        Чтобы оторвать его, нужно затратить энергию <Inline>{"E_{\\text{ион}} = 13{,}6"}</Inline> эВ (для основного состояния).</p>
      </ImportantBlock>

      <StepByStep
        title="Пример: длина волны при переходе 3→2"
        steps={[
          {
            title: "Энергии уровней",
            content: <p><Inline>{"E_3 = -\\frac{13{,}6}{9} = -1{,}51"}</Inline> эВ, <Inline>{"E_2 = -\\frac{13{,}6}{4} = -3{,}4"}</Inline> эВ</p>,
          },
          {
            title: "Энергия фотона",
            content: <p><Inline>{"\\Delta E = |E_3 - E_2| = 1{,}89"}</Inline> эВ = <Inline>{"3{,}02 \\cdot 10^{-19}"}</Inline> Дж</p>,
          },
          {
            title: "Длина волны",
            content: <p><Inline>{"\\lambda = \\frac{hc}{\\Delta E} = \\frac{6{,}626 \\cdot 10^{-34} \\cdot 3 \\cdot 10^8}{3{,}02 \\cdot 10^{-19}} \\approx 656"}</Inline> нм (красная линия Hα)</p>,
          },
        ]}
      />

      <LifehackBlock>
        <p>Серии спектра водорода: <strong>Лайман</strong> (→1, УФ), <strong>Бальмер</strong> (→2, видимый), <strong>Пашен</strong> (→3, ИК). Запомните: «ЛБП» — порядок по номеру конечного уровня.</p>
      </LifehackBlock>
    </Section>

    <QuizBlock
      questions={[
        {
          question: "На каком уровне энергия электрона в атоме водорода минимальна (по модулю)?",
          options: [
            { text: "n = 1", correct: false, explanation: "На первом уровне энергия максимальна по модулю (−13,6 эВ)." },
            { text: "n = ∞", correct: true },
            { text: "n = 2", correct: false },
          ],
        },
        {
          question: "Что происходит при переходе электрона с высокого уровня на низкий?",
          options: [
            { text: "Атом поглощает фотон", correct: false },
            { text: "Атом излучает фотон", correct: true },
            { text: "Ничего не происходит", correct: false },
          ],
        },
        {
          question: "Чему равна энергия ионизации атома водорода из основного состояния?",
          options: [
            { text: "1,51 эВ", correct: false },
            { text: "13,6 эВ", correct: true },
            { text: "3,4 эВ", correct: false, explanation: "3,4 эВ — это |E₂|, второй уровень." },
          ],
        },
      ]}
    />
  </div>
);

export default BohrModelLesson;
