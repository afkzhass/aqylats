import { Section, DefinitionBlock, ImportantBlock, LifehackBlock, CalloutBlock } from "./LessonBlocks";
import { Inline, Block } from "./KaTeX";
import { StepByStep } from "./StepByStep";
import { QuizBlock } from "./QuizBlock";
import { Droplets, FlaskConical } from "lucide-react";

const AlcoholsLesson = () => (
  <div className="space-y-2">
    <Section number={1} title="Спирты: строение и классификация" icon={<Droplets size={18} className="text-accent" />}>
      <DefinitionBlock>
        <p><strong>Спирты</strong> — органические соединения, содержащие гидроксильную группу <Inline>{"-OH"}</Inline>,
        связанную с углеводородным радикалом.</p>
        <Block>{"C_nH_{2n+1}OH"}</Block>
      </DefinitionBlock>
      <p>Классификация по числу ОН-групп:</p>
      <ul className="list-disc list-inside space-y-1 mt-1">
        <li><strong>Одноатомные:</strong> метанол (<Inline>{"CH_3OH"}</Inline>), этанол (<Inline>{"C_2H_5OH"}</Inline>)</li>
        <li><strong>Многоатомные:</strong> этиленгликоль (<Inline>{"HOCH_2CH_2OH"}</Inline>), глицерин</li>
      </ul>
    </Section>

    <Section number={2} title="Химические свойства" icon={<FlaskConical size={18} className="text-accent" />}>
      <p>Окисление первичного спирта до альдегида:</p>
      <Block>{"R{-}CH_2OH \\xrightarrow{[O]} R{-}CHO + H_2O"}</Block>
      <p>Дальнейшее окисление до карбоновой кислоты:</p>
      <Block>{"R{-}CHO \\xrightarrow{[O]} R{-}COOH"}</Block>

      <ImportantBlock title="Токсичность метанола">
        <p>Метанол (<Inline>{"CH_3OH"}</Inline>) — сильнейший яд! В организме окисляется до формальдегида и муравьиной кислоты.
        10 мл могут вызвать слепоту, 30 мл — смерть. Не путайте с этанолом!</p>
      </ImportantBlock>

      <StepByStep
        title="Реакция этерификации"
        steps={[
          {
            title: "Исходные вещества",
            content: <p>Спирт + Карбоновая кислота</p>,
          },
          {
            title: "Условия",
            content: <p>Кислотный катализатор (<Inline>{"H_2SO_4"}</Inline>), нагревание</p>,
          },
          {
            title: "Продукты",
            content: <p><Block>{"R{-}OH + R'{-}COOH \\rightleftharpoons R'{-}COOR + H_2O"}</Block></p>,
          },
          {
            title: "Результат",
            content: <p>Образуется <strong>сложный эфир</strong> — основа жиров и ароматизаторов.</p>,
          },
        ]}
      />

      <LifehackBlock>
        <p><strong>Функциональная группа определяет свойства!</strong> Запомните цепочку окисления: спирт → альдегид → кислота (—OH → —CHO → —COOH).</p>
      </LifehackBlock>
    </Section>

    <Section number={3} title="Фенолы" icon={<FlaskConical size={18} className="text-accent" />}>
      <DefinitionBlock>
        <p><strong>Фенолы</strong> — соединения, в которых группа <Inline>{"-OH"}</Inline> связана
        непосредственно с бензольным кольцом: <Inline>{"C_6H_5OH"}</Inline>.</p>
      </DefinitionBlock>
      <p>Качественная реакция на фенол:</p>
      <Block>{"C_6H_5OH + FeCl_3 \\to \\text{фиолетовое окрашивание}"}</Block>
    </Section>

    <CalloutBlock title="🔬 Межпредметная задача: Физика + Химия" variant="info">
      <p>
        УФ-излучение (<Inline>{"\\nu = 2 \\cdot 10^{15}"}</Inline> Гц) падает на поверхность, покрытую метанолом.
        Работа выхода <Inline>{"A = 4{,}5"}</Inline> эВ.
      </p>
      <p className="mt-2">
        <strong>1.</strong> Вычислите макс. кинетическую энергию фотоэлектронов по уравнению: <Inline>{"h\\nu = A + E_k"}</Inline>.
      </p>
      <p>
        <strong>2.</strong> При достаточной энергии кванта для разрыва связи <Inline>{"C{-}H"}</Inline>,
        какой продукт образуется при окислении <Inline>{"CH_3OH"}</Inline>?
      </p>
    </CalloutBlock>

    <QuizBlock
      questions={[
        {
          question: "Какая функциональная группа характерна для спиртов?",
          options: [
            { text: "Карбонильная (C=O)", correct: false },
            { text: "Гидроксильная (−OH)", correct: true },
            { text: "Карбоксильная (−COOH)", correct: false },
          ],
        },
        {
          question: "Что образуется при окислении первичного спирта?",
          options: [
            { text: "Кетон", correct: false, explanation: "Кетоны образуются при окислении вторичных спиртов." },
            { text: "Альдегид", correct: true },
            { text: "Эфир", correct: false },
          ],
        },
        {
          question: "Качественная реакция на фенол:",
          options: [
            { text: "Реакция с FeCl₃ (фиолетовое окрашивание)", correct: true },
            { text: "Реакция с NaOH", correct: false },
            { text: "Горение", correct: false },
          ],
        },
      ]}
    />
  </div>
);

export default AlcoholsLesson;
