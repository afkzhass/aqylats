import { Section, DefinitionBlock, ImportantBlock, LifehackBlock, CalloutBlock } from "./LessonBlocks";
import { QuizBlock } from "./QuizBlock";
import { BookOpen, Scroll } from "lucide-react";

const KazakhstanEarlyXXLesson = () => (
  <div className="space-y-2">
    <Section number={1} title="Социально-экономическое положение" icon={<Scroll size={18} className="text-accent" />}>
      <DefinitionBlock>
        <p>В начале XX века Казахстан входил в состав <strong>Российской империи</strong>.
        Основные проблемы: массовое переселение крестьян, изъятие земель у казахов,
        разрушение кочевого уклада жизни.</p>
      </DefinitionBlock>
      <p>Ключевые события:</p>
      <ul className="list-disc list-inside space-y-1 mt-1">
        <li><strong>1906–1912:</strong> Столыпинская аграрная реформа — массовое переселение</li>
        <li><strong>1916:</strong> Восстание казахов против мобилизации на тыловые работы</li>
        <li><strong>1917:</strong> Февральская и Октябрьская революции</li>
      </ul>
    </Section>

    <Section number={2} title="Алаш и национальная интеллигенция" icon={<BookOpen size={18} className="text-accent" />}>
      <p>Партия «<strong>Алаш</strong>» (1917) объединила казахскую интеллигенцию:</p>
      <ul className="list-disc list-inside space-y-1 mt-1">
        <li><strong>Алихан Бокейханов</strong> — лидер партии, экономист</li>
        <li><strong>Ахмет Байтурсынов</strong> — просветитель, реформатор казахского алфавита</li>
        <li><strong>Миржакып Дулатов</strong> — поэт, автор «Оян, қазақ!»</li>
      </ul>

      <ImportantBlock>
        <p>Правительство Алаш-Орды (1917–1920) — первая попытка создания казахской государственности.
        Было ликвидировано большевиками.</p>
      </ImportantBlock>

      <LifehackBlock>
        <p>Запомните «БДБ» — <strong>Б</strong>окейханов, <strong>Б</strong>айтурсынов, <strong>Д</strong>улатов — три ключевые фигуры движения Алаш.</p>
      </LifehackBlock>
    </Section>

    <QuizBlock
      questions={[
        {
          question: "В каком году произошло крупное восстание казахов против мобилизации?",
          options: [
            { text: "1905", correct: false },
            { text: "1916", correct: true },
            { text: "1917", correct: false, explanation: "В 1917 произошли революции, а восстание — в 1916." },
          ],
        },
        {
          question: "Кто был лидером партии Алаш?",
          options: [
            { text: "Ахмет Байтурсынов", correct: false, explanation: "Байтурсынов — видный деятель, но лидером был Бокейханов." },
            { text: "Алихан Бокейханов", correct: true },
            { text: "Миржакып Дулатов", correct: false },
          ],
        },
        {
          question: "Что стало причиной массового переселения в Казахстан?",
          options: [
            { text: "Столыпинская реформа", correct: true },
            { text: "Гражданская война", correct: false },
            { text: "Индустриализация", correct: false },
          ],
        },
      ]}
    />
  </div>
);

export default KazakhstanEarlyXXLesson;
