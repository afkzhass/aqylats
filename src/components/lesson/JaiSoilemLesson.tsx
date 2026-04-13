import { Section, DefinitionBlock, ImportantBlock, LifehackBlock, CalloutBlock } from "./LessonBlocks";
import { QuizBlock } from "./QuizBlock";
import { BookOpen, Languages } from "lucide-react";

const JaiSoilemLesson = () => (
  <div className="space-y-2">
    <Section number={1} title="Жай сөйлем" icon={<Languages size={18} className="text-accent" />}>
      <DefinitionBlock title="Анықтама">
        <p><strong>Жай сөйлем</strong> — бір ғана грамматикалық негізі (бастауыш пен баяндауыш) бар сөйлем.</p>
      </DefinitionBlock>
      <p>Мысалдар:</p>
      <ul className="list-disc list-inside space-y-1 mt-1">
        <li><em>«Күн шықты.»</em> — Бастауыш: Күн, Баяндауыш: шықты</li>
        <li><em>«Бала кітап оқиды.»</em> — Бастауыш: Бала, Баяндауыш: оқиды</li>
      </ul>

      <ImportantBlock title="Маңызды!">
        <p>Жай сөйлемнің түрлері:</p>
        <ul className="list-disc list-inside space-y-1 mt-1">
          <li><strong>Жақты:</strong> бастауышы бар (Мен келдім.)</li>
          <li><strong>Жақсыз:</strong> бастауышы жоқ (Кешке қарай суытты.)</li>
          <li><strong>Жалаң:</strong> тек тұрлаулы мүшелерден тұрады</li>
          <li><strong>Жайылма:</strong> тұрлаусыз мүшелері де бар</li>
        </ul>
      </ImportantBlock>
    </Section>

    <Section number={2} title="Жай сөйлемді талдау" icon={<BookOpen size={18} className="text-accent" />}>
      <p>Сөйлемді талдау тәртібі:</p>
      <ol className="list-decimal list-inside space-y-1 mt-1">
        <li>Сөйлемнің мақсаты (хабарлы, сұраулы, бұйрықты)</li>
        <li>Интонациясы (лепті, леппен айтылмаған)</li>
        <li>Құрамы (жалаң, жайылма)</li>
        <li>Мүшелерін анықтау</li>
      </ol>

      <LifehackBlock title="Кеңес">
        <p>Сөйлемді талдағанда алдымен <strong>баяндауышты</strong> табыңыз («Не істеді? Не?»),
        содан соң <strong>бастауышты</strong> («Кім? Не?»). Қалған мүшелер оларға сұрақ қою арқылы табылады.</p>
      </LifehackBlock>
    </Section>

    <QuizBlock
      questions={[
        {
          question: "«Бала кітап оқиды» — бұл қандай сөйлем?",
          options: [
            { text: "Құрмалас сөйлем", correct: false },
            { text: "Жай жайылма сөйлем", correct: true },
            { text: "Жай жалаң сөйлем", correct: false, explanation: "«Кітап» — толықтауыш, яғни тұрлаусыз мүше бар. Бұл жайылма сөйлем." },
          ],
        },
        {
          question: "Жай сөйлемде неше грамматикалық негіз болады?",
          options: [
            { text: "Бір", correct: true },
            { text: "Екі", correct: false },
            { text: "Екіден көп", correct: false },
          ],
        },
        {
          question: "«Кешке қарай суытты» — бұл қандай сөйлем?",
          options: [
            { text: "Жақты", correct: false },
            { text: "Жақсыз", correct: true },
            { text: "Толымсыз", correct: false },
          ],
        },
      ]}
    />
  </div>
);

export default JaiSoilemLesson;
