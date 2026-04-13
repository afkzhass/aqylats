import { Section, DefinitionBlock, ImportantBlock, LifehackBlock } from "./LessonBlocks";
import { Inline, Block } from "./KaTeX";
import { QuizBlock } from "./QuizBlock";
import { Dna } from "lucide-react";

const GeneticCodeLesson = () => (
  <div className="space-y-2">
    <Section number={1} title="Генетический код" icon={<Dna size={18} className="text-accent" />}>
      <DefinitionBlock>
        <p><strong>Генетический код</strong> — система записи информации о последовательности аминокислот
        в белке с помощью последовательности нуклеотидов в ДНК (и мРНК).</p>
      </DefinitionBlock>
      <p>Свойства генетического кода:</p>
      <ul className="list-disc list-inside space-y-1 mt-1">
        <li><strong>Триплетность:</strong> каждая аминокислота кодируется тройкой нуклеотидов (кодоном)</li>
        <li><strong>Вырожденность:</strong> одну аминокислоту могут кодировать несколько кодонов</li>
        <li><strong>Однозначность:</strong> каждый кодон кодирует только одну аминокислоту</li>
        <li><strong>Универсальность:</strong> код одинаков для всех живых организмов</li>
      </ul>
    </Section>

    <Section number={2} title="Транскрипция и трансляция" icon={<Dna size={18} className="text-accent" />}>
      <p>Центральная догма молекулярной биологии:</p>
      <Block>{"\\text{ДНК} \\xrightarrow{\\text{транскрипция}} \\text{мРНК} \\xrightarrow{\\text{трансляция}} \\text{Белок}"}</Block>

      <ImportantBlock title="Мутации">
        <p>Точечная мутация (замена одного нуклеотида) может:</p>
        <ul className="list-disc list-inside space-y-1 mt-1">
          <li><strong>Миссенс:</strong> изменить аминокислоту</li>
          <li><strong>Нонсенс:</strong> превратить кодон в стоп-кодон</li>
          <li><strong>Молчащая:</strong> не изменить аминокислоту (из-за вырожденности кода)</li>
        </ul>
      </ImportantBlock>

      <LifehackBlock>
        <p>Стоп-кодоны: <strong>УАА, УАГ, УГА</strong>. Мнемоника: «<strong>У</strong>же <strong>А</strong>минокислоты <strong>А</strong>бсурд / <strong>Г</strong>лупость / <strong>Г</strong>аснет».</p>
      </LifehackBlock>
    </Section>

    <QuizBlock
      questions={[
        {
          question: "Сколько нуклеотидов кодируют одну аминокислоту?",
          options: [
            { text: "1", correct: false },
            { text: "3 (триплет)", correct: true },
            { text: "4", correct: false },
          ],
        },
        {
          question: "Что означает вырожденность генетического кода?",
          options: [
            { text: "Код содержит ошибки", correct: false },
            { text: "Одну аминокислоту кодируют несколько кодонов", correct: true },
            { text: "Код разный у разных организмов", correct: false },
          ],
        },
        {
          question: "Что такое молчащая мутация?",
          options: [
            { text: "Мутация, которая меняет белок", correct: false },
            { text: "Замена нуклеотида, не меняющая аминокислоту", correct: true },
            { text: "Мутация в интроне", correct: false },
          ],
        },
      ]}
    />
  </div>
);

export default GeneticCodeLesson;
