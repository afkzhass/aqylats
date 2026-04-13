import { Section, DefinitionBlock, ImportantBlock, LifehackBlock } from "./LessonBlocks";
import { QuizBlock } from "./QuizBlock";
import { BookOpen, Languages } from "lucide-react";

const TynysBelgileriLesson = () => (
  <div className="space-y-2">
    <Section number={1} title="Тыныс белгілерінің түрлері" icon={<Languages size={18} className="text-accent" />}>
      <DefinitionBlock title="Анықтама">
        <p><strong>Тыныс белгілері</strong> — жазба тілдегі сөйлемдердің мағынасын, интонациясын
        және грамматикалық құрылысын дұрыс жеткізу үшін қолданылатын арнайы белгілер.</p>
      </DefinitionBlock>
      <p>Негізгі тыныс белгілері:</p>
      <ul className="list-disc list-inside space-y-1 mt-1">
        <li><strong>Нүкте (.)</strong> — хабарлы сөйлемнің соңында</li>
        <li><strong>Сұрақ белгісі (?)</strong> — сұраулы сөйлемде</li>
        <li><strong>Леп белгісі (!)</strong> — леп сөйлемінде</li>
        <li><strong>Үтір (,)</strong> — тізбектеу, қаратпа, қыстырма сөздер</li>
        <li><strong>Нүктелі үтір (;)</strong> — салалас сөйлемдерде</li>
        <li><strong>Қос нүкте (:)</strong> — санамалаудан бұрын</li>
        <li><strong>Сызықша (—)</strong> — бастауыш пен баяндауыш арасында</li>
      </ul>
    </Section>

    <Section number={2} title="Үтір қойылатын жағдайлар" icon={<BookOpen size={18} className="text-accent" />}>
      <ImportantBlock title="Маңызды ережелер">
        <p>Үтір қойылады:</p>
        <ul className="list-disc list-inside space-y-1 mt-1">
          <li>Біріңғай мүшелердің арасында: <em>«Алма, алмұрт, шие — жеміс.»</em></li>
          <li>Қаратпа сөздерден кейін: <em>«Балалар, кіріңдер.»</em></li>
          <li>Қыстырма сөздерді бөліп: <em>«Шынында, ол дұрыс.»</em></li>
          <li>Салалас сөйлемдер арасында</li>
        </ul>
      </ImportantBlock>

      <LifehackBlock>
        <p>Тыныс белгілерін қоймас бұрын, сөйлемді <strong>дауыстап оқып көріңіз</strong>.
        Тоқтаған жерде — үтір, ұзақ тоқтаған жерде — нүкте немесе сызықша.</p>
      </LifehackBlock>
    </Section>

    <QuizBlock
      questions={[
        {
          question: "«Балалар кіріңдер» — бұл сөйлемге қандай тыныс белгі керек?",
          options: [
            { text: "Нүкте", correct: false },
            { text: "Қаратпа сөзден кейін үтір: «Балалар, кіріңдер.»", correct: true },
            { text: "Сызықша", correct: false },
          ],
        },
        {
          question: "Бастауыш пен баяндауыш арасында қандай белгі қойылады?",
          options: [
            { text: "Үтір", correct: false },
            { text: "Сызықша", correct: true },
            { text: "Қос нүкте", correct: false },
          ],
        },
        {
          question: "Санамалаудан бұрын қандай белгі қойылады?",
          options: [
            { text: "Нүктелі үтір", correct: false },
            { text: "Қос нүкте", correct: true },
            { text: "Үтір", correct: false },
          ],
        },
      ]}
    />
  </div>
);

export default TynysBelgileriLesson;
