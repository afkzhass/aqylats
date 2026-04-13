import { Section, DefinitionBlock, ImportantBlock, LifehackBlock } from "./LessonBlocks";
import { QuizBlock } from "./QuizBlock";
import { Globe, BookOpen } from "lucide-react";

const EvolutionLesson = () => (
  <div className="space-y-2">
    <Section number={1} title="Эволюционная теория Дарвина" icon={<Globe size={18} className="text-accent" />}>
      <DefinitionBlock>
        <p><strong>Эволюция</strong> — необратимый процесс исторического развития живых организмов,
        сопровождающийся изменением их генетического состава.</p>
      </DefinitionBlock>
      <p>Движущие силы эволюции по Дарвину:</p>
      <ul className="list-disc list-inside space-y-1 mt-1">
        <li><strong>Наследственная изменчивость</strong> — материал для отбора</li>
        <li><strong>Борьба за существование</strong> — внутривидовая, межвидовая, с абиотическими факторами</li>
        <li><strong>Естественный отбор</strong> — выживание наиболее приспособленных</li>
      </ul>
    </Section>

    <Section number={2} title="Синтетическая теория эволюции" icon={<BookOpen size={18} className="text-accent" />}>
      <p>Дополнения к классическому дарвинизму:</p>
      <ul className="list-disc list-inside space-y-1 mt-1">
        <li>Элементарная единица эволюции — <strong>популяция</strong></li>
        <li>Элементарный материал — <strong>мутации</strong></li>
        <li>Дрейф генов (генетико-автоматические процессы)</li>
        <li>Изоляция как фактор видообразования</li>
      </ul>

      <ImportantBlock>
        <p>Микроэволюция — изменения внутри вида (приводит к новым подвидам и видам).
        Макроэволюция — образование крупных таксонов (родов, семейств, отрядов). Механизмы одинаковы!</p>
      </ImportantBlock>

      <LifehackBlock>
        <p>Запомните формы отбора: <strong>Д</strong>вижущий (изменяет среднее), <strong>С</strong>табилизирующий (сохраняет среднее),
        <strong>Д</strong>изруптивный (разрывающий — два крайних варианта). <strong>«ДСД»</strong>.</p>
      </LifehackBlock>
    </Section>

    <QuizBlock
      questions={[
        {
          question: "Что является элементарной единицей эволюции?",
          options: [
            { text: "Организм", correct: false },
            { text: "Популяция", correct: true },
            { text: "Вид", correct: false, explanation: "Вид — результат эволюции, а не единица." },
          ],
        },
        {
          question: "Какая форма отбора сохраняет среднее значение признака?",
          options: [
            { text: "Движущий", correct: false },
            { text: "Стабилизирующий", correct: true },
            { text: "Дизруптивный", correct: false },
          ],
        },
        {
          question: "Что является элементарным материалом для эволюции?",
          options: [
            { text: "Модификации", correct: false, explanation: "Модификации не наследуются!" },
            { text: "Мутации", correct: true },
            { text: "Фенотипы", correct: false },
          ],
        },
      ]}
    />
  </div>
);

export default EvolutionLesson;
