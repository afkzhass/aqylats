import { Section, DefinitionBlock, ImportantBlock, LifehackBlock, CalloutBlock } from "./LessonBlocks";
import { Inline, Block } from "./KaTeX";
import { QuizBlock } from "./QuizBlock";
import { FlaskConical, Droplets, Flame } from "lucide-react";

const HydrocarbonsLesson = () => (
  <div className="space-y-2">
    <Section number={1} title="Классификация углеводородов" icon={<FlaskConical size={18} className="text-accent" />}>
      <DefinitionBlock>
        <p><strong>Углеводороды</strong> — органические соединения, состоящие только из атомов углерода и водорода.</p>
      </DefinitionBlock>
      <p>Основные классы:</p>
      <ul className="list-disc list-inside space-y-1 mt-1">
        <li><strong>Алканы</strong> (предельные): <Inline>{"C_nH_{2n+2}"}</Inline> — метан, этан, пропан</li>
        <li><strong>Алкены</strong> (непредельные, =): <Inline>{"C_nH_{2n}"}</Inline> — этилен, пропилен</li>
        <li><strong>Алкины</strong> (непредельные, ≡): <Inline>{"C_nH_{2n-2}"}</Inline> — ацетилен</li>
        <li><strong>Арены</strong> (ароматические): <Inline>{"C_6H_6"}</Inline> — бензол</li>
      </ul>
    </Section>

    <Section number={2} title="Алканы: свойства и реакции" icon={<Flame size={18} className="text-accent" />}>
      <p>Реакция горения метана:</p>
      <Block>{"CH_4 + 2O_2 \\to CO_2 + 2H_2O"}</Block>
      <p>Реакция замещения (галогенирование):</p>
      <Block>{"CH_4 + Cl_2 \\xrightarrow{h\\nu} CH_3Cl + HCl"}</Block>

      <ImportantBlock title="Свободнорадикальный механизм">
        <p>Галогенирование алканов идёт по цепному механизму: инициирование → рост цепи → обрыв цепи.
        Для начала реакции необходим <strong>свет (hν)</strong> или <strong>нагревание</strong>.</p>
      </ImportantBlock>

      <LifehackBlock>
        <p>Гомологический ряд алканов: <strong>Ме-Эт-Пр-Бу-Пент</strong> (метан, этан, пропан, бутан, пентан). Каждый следующий отличается на группу <Inline>{"CH_2"}</Inline>.</p>
      </LifehackBlock>
    </Section>

    <QuizBlock
      questions={[
        {
          question: "Какова общая формула алканов?",
          options: [
            { text: "CₙH₂ₙ", correct: false, explanation: "Это формула алкенов." },
            { text: "CₙH₂ₙ₊₂", correct: true },
            { text: "CₙH₂ₙ₋₂", correct: false },
          ],
        },
        {
          question: "Какой тип реакции характерен для алканов?",
          options: [
            { text: "Присоединение", correct: false, explanation: "Присоединение характерно для непредельных углеводородов." },
            { text: "Замещение", correct: true },
            { text: "Полимеризация", correct: false },
          ],
        },
        {
          question: "Что необходимо для галогенирования метана?",
          options: [
            { text: "Катализатор", correct: false },
            { text: "Свет или нагревание", correct: true },
            { text: "Вода", correct: false },
          ],
        },
      ]}
    />
  </div>
);

export default HydrocarbonsLesson;
