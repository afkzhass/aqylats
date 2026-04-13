import { Section, DefinitionBlock, ImportantBlock, LifehackBlock, CalloutBlock } from "./LessonBlocks";
import { QuizBlock } from "./QuizBlock";
import { BookOpen, Shield } from "lucide-react";

const KazakhstanWWIILesson = () => (
  <div className="space-y-2">
    <Section number={1} title="Казахстан в годы ВОВ (1941–1945)" icon={<Shield size={18} className="text-accent" />}>
      <DefinitionBlock>
        <p>В годы Великой Отечественной войны Казахстан стал важнейшим тылом страны:
        сюда были эвакуированы сотни предприятий, здесь формировались воинские соединения.</p>
      </DefinitionBlock>
      <p>Вклад Казахстана в победу:</p>
      <ul className="list-disc list-inside space-y-1 mt-1">
        <li>На фронт ушли более <strong>1,2 млн</strong> казахстанцев</li>
        <li><strong>500+</strong> казахстанцев удостоены звания Героя Советского Союза</li>
        <li>Сформированы: 316-я стрелковая дивизия (Панфиловская), 100-я и 101-я нац. бригады</li>
      </ul>
    </Section>

    <Section number={2} title="Герои и подвиги" icon={<BookOpen size={18} className="text-accent" />}>
      <p>Ключевые имена:</p>
      <ul className="list-disc list-inside space-y-1 mt-1">
        <li><strong>Бауыржан Момышулы</strong> — герой обороны Москвы, командир батальона 316-й дивизии</li>
        <li><strong>Маншук Маметова</strong> — первая казашка, Герой Советского Союза (пулемётчица)</li>
        <li><strong>Алия Молдагулова</strong> — снайпер, Герой Советского Союза</li>
        <li><strong>Талгат Бегельдинов</strong> — дважды Герой Советского Союза, лётчик-штурмовик</li>
      </ul>

      <ImportantBlock title="Подвиг панфиловцев">
        <p>16 ноября 1941 года — бой у разъезда Дубосеково. 28 героев-панфиловцев из 316-й дивизии
        остановили наступление немецких танков на Москву. Политрук В. Клочков:
        «Велика Россия, а отступать некуда — позади Москва!»</p>
      </ImportantBlock>

      <LifehackBlock>
        <p>Запомните «ММБ» — <strong>М</strong>аметова, <strong>М</strong>олдагулова, <strong>Б</strong>егельдинов — три Героя Советского Союза из Казахстана.</p>
      </LifehackBlock>
    </Section>

    <CalloutBlock title="📝 Межпредметная задача: История + Анализ" variant="info">
      <p>Проанализируйте отрывок из письма солдата-казахстанца с фронта:</p>
      <p className="italic mt-1 text-foreground/70">«...Мы стоим под Москвой. Морозы страшные, но дух крепок.
      Вспоминаю родные степи и знаю — мы победим...»</p>
      <p className="mt-2"><strong>1.</strong> К какому периоду войны относится описание?</p>
      <p><strong>2.</strong> Свяжите цели национально-освободительного движения начала XX века
      с социально-политической обстановкой 1940-х годов.</p>
    </CalloutBlock>

    <QuizBlock
      questions={[
        {
          question: "Какая дивизия прославилась в битве за Москву?",
          options: [
            { text: "316-я (Панфиловская)", correct: true },
            { text: "100-я бригада", correct: false },
            { text: "101-я бригада", correct: false },
          ],
        },
        {
          question: "Кто стала первой казашкой — Героем Советского Союза?",
          options: [
            { text: "Алия Молдагулова", correct: false, explanation: "Молдагулова тоже Герой, но Маметова была первой." },
            { text: "Маншук Маметова", correct: true },
            { text: "Хиуаз Доспанова", correct: false },
          ],
        },
        {
          question: "Сколько казахстанцев ушло на фронт?",
          options: [
            { text: "Около 500 тысяч", correct: false },
            { text: "Более 1,2 миллиона", correct: true },
            { text: "Около 2 миллионов", correct: false },
          ],
        },
      ]}
    />
  </div>
);

export default KazakhstanWWIILesson;
