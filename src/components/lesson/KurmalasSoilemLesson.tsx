import { Section, DefinitionBlock, ImportantBlock, LifehackBlock, CalloutBlock } from "./LessonBlocks";
import { QuizBlock } from "./QuizBlock";
import { BookOpen, Languages } from "lucide-react";

const KurmalasSoilemLesson = () => (
  <div className="space-y-2">
    <Section number={1} title="Құрмалас сөйлем" icon={<Languages size={18} className="text-accent" />}>
      <DefinitionBlock title="Анықтама">
        <p><strong>Құрмалас сөйлем</strong> — екі немесе одан да көп жай сөйлемнен тұратын,
        мағыналық және грамматикалық жағынан байланысқан сөйлем.</p>
      </DefinitionBlock>
      <p>Түрлері:</p>
      <ul className="list-disc list-inside space-y-1 mt-1">
        <li><strong>Салалас:</strong> тең мүшелі, жалғаулықтар арқылы байланысады (және, бірақ, сондықтан)</li>
        <li><strong>Сабақтас:</strong> бағыныңқы + басыңқы сөйлем</li>
        <li><strong>Аралас:</strong> салалас + сабақтас элементтерден тұрады</li>
      </ul>
    </Section>

    <Section number={2} title="Салалас құрмалас сөйлем" icon={<BookOpen size={18} className="text-accent" />}>
      <p>Мысал: <em>«Күн шықты, <strong>және</strong> құстар сайрай бастады.»</em></p>
      <p>Жалғаулықтар:</p>
      <ul className="list-disc list-inside space-y-1 mt-1">
        <li><strong>Ыңғайлас:</strong> және, да, де, та, те</li>
        <li><strong>Қарсылықты:</strong> бірақ, алайда, дегенмен</li>
        <li><strong>Себеп-салдар:</strong> сондықтан, сол себепті</li>
      </ul>

      <ImportantBlock>
        <p>Салалас сөйлемдердің арасына <strong>үтір</strong> қойылады!</p>
      </ImportantBlock>
    </Section>

    <Section number={3} title="Сабақтас құрмалас сөйлем" icon={<BookOpen size={18} className="text-accent" />}>
      <p>Мысал: <em>«Жаңбыр жауғандықтан, біз үйде қалдық.»</em></p>
      <p>Бағыныңқы сөйлем: «Жаңбыр жауғандықтан» (себеп)</p>
      <p>Басыңқы сөйлем: «біз үйде қалдық» (нәтиже)</p>

      <LifehackBlock>
        <p>Сабақтас сөйлемді тану оңай: бағыныңқы сөйлем <strong>-ғандықтан, -генде, -са, -се</strong> жұрнақтарымен аяқталады.</p>
      </LifehackBlock>
    </Section>

    <CalloutBlock title="📝 Межпредметная задача: Лингвистика + Физика" variant="info">
      <p>Бор атомы моделі туралы мәтін берілген:</p>
      <p className="italic mt-1 text-foreground/70">«Электрон деңгейден деңгейге секіргенде энергия бөлінеді немесе жұтылады»</p>
      <p className="mt-2"><strong>1.</strong> Мәтіндегі жай сөйлемді табыңыз және құрмалас сөйлемге айналдырыңыз.</p>
      <p><strong>2.</strong> Тыныс белгілерін қойыңыз: <em>«Электрон деңгейден деңгейге секіргенде энергия бөлінеді немесе жұтылады»</em></p>
    </CalloutBlock>

    <QuizBlock
      questions={[
        {
          question: "Құрмалас сөйлемде неше грамматикалық негіз болады?",
          options: [
            { text: "Бір", correct: false },
            { text: "Екі немесе одан көп", correct: true },
            { text: "Тек екі", correct: false },
          ],
        },
        {
          question: "«Күн шықты, және құстар сайрай бастады» — бұл қандай сөйлем?",
          options: [
            { text: "Сабақтас", correct: false },
            { text: "Салалас", correct: true },
            { text: "Жай сөйлем", correct: false },
          ],
        },
        {
          question: "Сабақтас сөйлемнің ерекшелігі:",
          options: [
            { text: "Сөйлемдер тең құқықты", correct: false },
            { text: "Бағыныңқы және басыңқы сөйлемнен тұрады", correct: true },
            { text: "Жалғаулықсыз байланысады", correct: false },
          ],
        },
      ]}
    />
  </div>
);

export default KurmalasSoilemLesson;
