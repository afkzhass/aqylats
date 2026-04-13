import { Section, DefinitionBlock, ImportantBlock, LifehackBlock } from "./LessonBlocks";
import { QuizBlock } from "./QuizBlock";
import { BookOpen, Flag } from "lucide-react";

const NationalLiberationLesson = () => (
  <div className="space-y-2">
    <Section number={1} title="Предпосылки и причины" icon={<Flag size={18} className="text-accent" />}>
      <DefinitionBlock>
        <p><strong>Национально-освободительное движение</strong> в Казахстане — борьба казахского народа
        за сохранение земли, культуры и национальной идентичности в условиях колониального гнёта.</p>
      </DefinitionBlock>
      <p>Причины:</p>
      <ul className="list-disc list-inside space-y-1 mt-1">
        <li>Изъятие земель и разрушение кочевого хозяйства</li>
        <li>Налоговый гнёт и произвол колониальной администрации</li>
        <li>Насильственное переселение русских и украинских крестьян</li>
        <li>Мобилизация на тыловые работы (1916)</li>
      </ul>
    </Section>

    <Section number={2} title="Восстание 1916 года" icon={<BookOpen size={18} className="text-accent" />}>
      <p>Крупнейшие очаги восстания:</p>
      <ul className="list-disc list-inside space-y-1 mt-1">
        <li><strong>Тургайский очаг:</strong> лидер — Амангельды Иманов</li>
        <li><strong>Семиреченский очаг:</strong> лидер — Токаш Бокин</li>
      </ul>

      <ImportantBlock title="Последствия восстания 1916 года">
        <p>Восстание было жестоко подавлено. Тысячи казахов бежали в Китай и Монголию.
        Но оно стало важным этапом национального самосознания и предшествовало событиям 1917 года.</p>
      </ImportantBlock>

      <LifehackBlock>
        <p>Связь с последующими событиями: восстание 1916 → революция 1917 → движение Алаш → создание Алаш-Орды.
        Это <strong>единая цепочка</strong> борьбы за национальную независимость.</p>
      </LifehackBlock>
    </Section>

    <QuizBlock
      questions={[
        {
          question: "Кто возглавил Тургайский очаг восстания 1916 года?",
          options: [
            { text: "Токаш Бокин", correct: false, explanation: "Бокин возглавлял Семиреченский очаг." },
            { text: "Амангельды Иманов", correct: true },
            { text: "Алихан Бокейханов", correct: false },
          ],
        },
        {
          question: "Что послужило поводом к восстанию 1916 года?",
          options: [
            { text: "Указ о мобилизации на тыловые работы", correct: true },
            { text: "Запрет казахского языка", correct: false },
            { text: "Столыпинская реформа", correct: false, explanation: "Реформа — причина недовольства, но повод — мобилизация." },
          ],
        },
        {
          question: "Куда бежали казахи после подавления восстания?",
          options: [
            { text: "В Россию", correct: false },
            { text: "В Китай и Монголию", correct: true },
            { text: "В Среднюю Азию", correct: false },
          ],
        },
      ]}
    />
  </div>
);

export default NationalLiberationLesson;
