import { Section, DefinitionBlock, ImportantBlock, LifehackBlock, CalloutBlock } from "./LessonBlocks";
import { Inline, Block } from "./KaTeX";
import { StepByStep } from "./StepByStep";
import { QuizBlock } from "./QuizBlock";
import { Atom, Zap, Sun } from "lucide-react";

const PhotoeffectLesson = () => (
  <div className="space-y-2">
    <Section number={1} title="Квантовая природа света" icon={<Sun size={18} className="text-accent" />}>
      <p>
        Свет излучается и поглощается дискретными порциями — <strong>квантами</strong> (фотонами).
        Энергия одного кванта определяется частотой излучения:
      </p>
      <Block>{"E = h\\nu"}</Block>
      <p>
        где <Inline>{"h = 6{,}626 \\cdot 10^{-34}"}</Inline> Дж·с — постоянная Планка,{" "}
        <Inline>{"\\nu"}</Inline> — частота света.
      </p>
      <DefinitionBlock title="Фотоэффект">
        <p>
          <strong>Фотоэлектрический эффект</strong> — явление вырывания электронов с поверхности
          вещества под действием света. Открыт Г. Герцем (1887), объяснён А. Эйнштейном (1905).
        </p>
      </DefinitionBlock>
    </Section>

    <Section number={2} title="Уравнение Эйнштейна для фотоэффекта" icon={<Atom size={18} className="text-accent" />}>
      <p>Энергия фотона расходуется на работу выхода электрона и его кинетическую энергию:</p>
      <Block>{"h\\nu = A_{\\text{вых}} + \\frac{mv^2}{2}"}</Block>
      
      <ImportantBlock title="Красная граница фотоэффекта">
        <p>
          Фотоэффект возможен только при <Inline>{"h\\nu \\geq A_{\\text{вых}}"}</Inline>.
          Минимальная частота: <Inline>{"\\nu_0 = \\frac{A_{\\text{вых}}}{h}"}</Inline>.
          При <Inline>{"\\nu < \\nu_0"}</Inline> фотоэффект <strong>не наблюдается</strong>,
          независимо от интенсивности света!
        </p>
      </ImportantBlock>

      <StepByStep
        title="Пример: вычисление кинетической энергии фотоэлектрона"
        steps={[
          {
            title: "Дано",
            content: <p>Частота света <Inline>{"\\nu = 1{,}5 \\cdot 10^{15}"}</Inline> Гц. Работа выхода <Inline>{"A = 3{,}3"}</Inline> эВ.</p>,
          },
          {
            title: "Переводим в СИ",
            content: <p><Inline>{"A = 3{,}3 \\cdot 1{,}6 \\cdot 10^{-19} = 5{,}28 \\cdot 10^{-19}"}</Inline> Дж</p>,
          },
          {
            title: "Энергия фотона",
            content: <p><Inline>{"E = h\\nu = 6{,}626 \\cdot 10^{-34} \\cdot 1{,}5 \\cdot 10^{15} = 9{,}94 \\cdot 10^{-19}"}</Inline> Дж</p>,
          },
          {
            title: "Кинетическая энергия",
            content: <p><Inline>{"E_k = h\\nu - A = 9{,}94 \\cdot 10^{-19} - 5{,}28 \\cdot 10^{-19} = 4{,}66 \\cdot 10^{-19}"}</Inline> Дж ≈ 2,9 эВ</p>,
          },
        ]}
      />
    </Section>

    <Section number={3} title="Интенсивность излучения (интеграл)" icon={<Zap size={18} className="text-accent" />}>
      <p>Полная мощность (интенсивность) излучения по всем длинам волн:</p>
      <Block>{"P = \\int_{0}^{\\infty} \\Phi(\\lambda)\\, d\\lambda"}</Block>
      <p>
        где <Inline>{"\\Phi(\\lambda)"}</Inline> — спектральная плотность потока излучения.
      </p>
      <LifehackBlock>
        <p>Запомните три закона фотоэффекта Столетова:</p>
        <ol className="list-decimal list-inside space-y-1 mt-1">
          <li>Сила фототока пропорциональна интенсивности света</li>
          <li>Кинетическая энергия зависит от частоты, а не от интенсивности</li>
          <li>Существует красная граница фотоэффекта</li>
        </ol>
      </LifehackBlock>
    </Section>

    <CalloutBlock title="🔬 Межпредметная задача: Физика + Химия" variant="info">
      <p>
        УФ-излучение падает на поверхность, покрытую метанолом (<Inline>{"CH_3OH"}</Inline>).
        Работа выхода <Inline>{"A_{\\text{вых}} = 4{,}5"}</Inline> эВ.
      </p>
      <p className="mt-2">
        <strong>1.</strong> Вычислите макс. кинетическую энергию фотоэлектронов, если <Inline>{"\\nu = 2 \\cdot 10^{15}"}</Inline> Гц.
      </p>
      <p>
        <strong>2.</strong> Как изменится структура спирта при окислении, если энергия кванта достаточна для разрыва связи <Inline>{"C{-}H"}</Inline>?
      </p>
    </CalloutBlock>

    <QuizBlock
      questions={[
        {
          question: "В чём заключается квантовая природа света?",
          options: [
            { text: "Свет — это непрерывная волна", correct: false, explanation: "Свет имеет двойственную природу, но испускается порциями." },
            { text: "Свет излучается порциями (квантами)", correct: true },
            { text: "Свет распространяется только прямолинейно", correct: false },
          ],
        },
        {
          question: "Формула энергии фотона:",
          options: [
            { text: "E = mc²", correct: false, explanation: "Это формула эквивалентности массы и энергии." },
            { text: "E = hν", correct: true },
            { text: "E = kT", correct: false },
          ],
        },
        {
          question: "Что определяет красная граница фотоэффекта?",
          options: [
            { text: "Максимальную скорость электрона", correct: false },
            { text: "Минимальную частоту, при которой возможен фотоэффект", correct: true },
            { text: "Интенсивность падающего света", correct: false, explanation: "Красная граница зависит от частоты, а не от интенсивности." },
          ],
        },
      ]}
    />
  </div>
);

export default PhotoeffectLesson;
