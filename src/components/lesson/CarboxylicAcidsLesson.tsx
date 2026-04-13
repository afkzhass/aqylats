import { Section, DefinitionBlock, ImportantBlock, LifehackBlock } from "./LessonBlocks";
import { Inline, Block } from "./KaTeX";
import { QuizBlock } from "./QuizBlock";
import { FlaskConical } from "lucide-react";

const CarboxylicAcidsLesson = () => (
  <div className="space-y-2">
    <Section number={1} title="Строение карбоновых кислот" icon={<FlaskConical size={18} className="text-accent" />}>
      <DefinitionBlock>
        <p><strong>Карбоновые кислоты</strong> содержат карбоксильную группу <Inline>{"-COOH"}</Inline>:</p>
        <Block>{"R{-}COOH"}</Block>
      </DefinitionBlock>
      <p>Примеры: муравьиная (<Inline>{"HCOOH"}</Inline>), уксусная (<Inline>{"CH_3COOH"}</Inline>),
      олеиновая (<Inline>{"C_{17}H_{33}COOH"}</Inline>).</p>
    </Section>

    <Section number={2} title="Химические свойства" icon={<FlaskConical size={18} className="text-accent" />}>
      <p>Диссоциация в воде (слабые кислоты):</p>
      <Block>{"CH_3COOH \\rightleftharpoons CH_3COO^- + H^+"}</Block>
      <p>Реакция с металлами:</p>
      <Block>{"2CH_3COOH + Mg \\to (CH_3COO)_2Mg + H_2 \\uparrow"}</Block>

      <ImportantBlock>
        <p>Сила кислоты зависит от электроноакцепторных заместителей: <Inline>{"CF_3COOH"}</Inline> значительно сильнее <Inline>{"CH_3COOH"}</Inline>.</p>
      </ImportantBlock>

      <LifehackBlock>
        <p>Цепочка превращений: <strong>алкан → спирт → альдегид → кислота</strong>. Каждый шаг — окисление на одну ступень.</p>
      </LifehackBlock>
    </Section>

    <QuizBlock
      questions={[
        {
          question: "Какая группа определяет карбоновые кислоты?",
          options: [
            { text: "−OH", correct: false },
            { text: "−COOH", correct: true },
            { text: "−CHO", correct: false, explanation: "−CHO — альдегидная группа." },
          ],
        },
        {
          question: "Уксусная кислота — это...",
          options: [
            { text: "HCOOH", correct: false, explanation: "HCOOH — муравьиная кислота." },
            { text: "CH₃COOH", correct: true },
            { text: "C₂H₅COOH", correct: false },
          ],
        },
        {
          question: "Карбоновые кислоты в воде — это:",
          options: [
            { text: "Сильные кислоты", correct: false },
            { text: "Слабые кислоты", correct: true },
            { text: "Не диссоциируют", correct: false },
          ],
        },
      ]}
    />
  </div>
);

export default CarboxylicAcidsLesson;
