import { Section, DefinitionBlock, ImportantBlock, LifehackBlock, CalloutBlock } from "./LessonBlocks";
import { Inline, Block } from "./KaTeX";
import { StepByStep } from "./StepByStep";
import { QuizBlock } from "./QuizBlock";
import { Waves, Atom } from "lucide-react";

const WaveParticleLesson = () => (
  <div className="space-y-2">
    <Section number={1} title="Гипотеза де Бройля" icon={<Waves size={18} className="text-accent" />}>
      <DefinitionBlock>
        <p>Любая движущаяся частица обладает волновыми свойствами. Длина волны де Бройля:</p>
        <Block>{"\\lambda = \\frac{h}{mv} = \\frac{h}{p}"}</Block>
        <p>где <Inline>{"p = mv"}</Inline> — импульс частицы.</p>
      </DefinitionBlock>
      <ImportantBlock>
        <p>Для макроскопических тел длина волны де Бройля настолько мала, что волновые свойства ненаблюдаемы.
        Они проявляются только у микрочастиц (электроны, нейтроны).</p>
      </ImportantBlock>
    </Section>

    <Section number={2} title="Вероятностная интерпретация" icon={<Atom size={18} className="text-accent" />}>
      <p>Вероятность обнаружить частицу в области <Inline>{"[a, b]"}</Inline>:</p>
      <Block>{"P = \\int_{a}^{b} |\\psi(x)|^2\\, dx"}</Block>
      <p>Для частицы в «ящике» длиной <Inline>{"L"}</Inline>:</p>
      <Block>{"\\psi_n(x) = \\sqrt{\\frac{2}{L}} \\sin\\left(\\frac{n\\pi x}{L}\\right)"}</Block>

      <StepByStep
        title="Пример: вероятность в первой половине ящика (n=1)"
        steps={[
          {
            title: "Волновая функция",
            content: <p><Inline>{"\\psi(x) = \\sqrt{\\frac{2}{L}} \\sin\\left(\\frac{\\pi x}{L}\\right)"}</Inline></p>,
          },
          {
            title: "Подставляем в интеграл",
            content: <p><Inline>{"P = \\int_0^{L/2} \\frac{2}{L} \\sin^2\\left(\\frac{\\pi x}{L}\\right) dx"}</Inline></p>,
          },
          {
            title: "Используем формулу понижения степени",
            content: <p><Inline>{"\\sin^2 \\alpha = \\frac{1 - \\cos 2\\alpha}{2}"}</Inline></p>,
          },
          {
            title: "Вычисляем",
            content: <p><Inline>{"P = \\frac{2}{L} \\cdot \\frac{L}{2} \\cdot \\frac{1}{2} \\left[x - \\frac{L}{2\\pi}\\sin\\frac{2\\pi x}{L}\\right]_0^{L/2} = \\frac{1}{2}"}</Inline></p>,
          },
          {
            title: "Ответ",
            content: <p><Inline>{"P = 0{,}5"}</Inline> — частица с равной вероятностью находится в каждой половине ящика.</p>,
          },
        ]}
      />

      <LifehackBlock>
        <p>Условие нормировки: <Inline>{"\\int_{-\\infty}^{+\\infty} |\\psi|^2 dx = 1"}</Inline> — частица <strong>точно</strong> где-то существует!</p>
      </LifehackBlock>
    </Section>

    <CalloutBlock title="📐 Межпредметная задача: Математика + Физика" variant="info">
      <p>Вычислите вероятность нахождения частицы в области <Inline>{"[0, L/4]"}</Inline>:</p>
      <Block>{"P = \\int_0^{L/4} \\frac{2}{L} \\sin^2\\left(\\frac{\\pi x}{L}\\right) dx"}</Block>
      <p className="mt-1">Подсказка: используйте формулу <Inline>{"\\sin^2 \\alpha = \\frac{1 - \\cos 2\\alpha}{2}"}</Inline>.</p>
    </CalloutBlock>

    <QuizBlock
      questions={[
        {
          question: "Чему равна длина волны де Бройля?",
          options: [
            { text: "λ = h/E", correct: false },
            { text: "λ = h/p", correct: true },
            { text: "λ = hν", correct: false, explanation: "hν — это энергия фотона, а не длина волны частицы." },
          ],
        },
        {
          question: "Что показывает |ψ(x)|²?",
          options: [
            { text: "Энергию частицы", correct: false },
            { text: "Плотность вероятности обнаружения частицы", correct: true },
            { text: "Импульс частицы", correct: false },
          ],
        },
        {
          question: "Для какой частицы волновые свойства наиболее заметны?",
          options: [
            { text: "Футбольный мяч", correct: false },
            { text: "Электрон", correct: true },
            { text: "Автомобиль", correct: false },
          ],
        },
      ]}
    />
  </div>
);

export default WaveParticleLesson;
