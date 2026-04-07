import { useState } from "react";
import { Eye } from "lucide-react";

interface QuizQuestion {
  question: string;
  options: { text: string; correct: boolean; explanation?: string }[];
}

export const QuizBlock = ({ questions }: { questions: QuizQuestion[] }) => {
  const [showQuiz, setShowQuiz] = useState(false);

  if (!showQuiz) {
    return (
      <div className="flex justify-center my-6">
        <button
          onClick={() => setShowQuiz(true)}
          className="flex items-center gap-2 px-6 py-3 bg-accent text-accent-foreground rounded-xl text-sm font-medium hover:bg-accent/90 transition-colors shadow-md"
        >
          <Eye size={18} />
          Блиц-опрос
        </button>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-xl p-5 md:p-6 animate-fade-in my-6">
      <div className="flex items-center gap-2 mb-5">
        <Eye size={20} className="text-accent" />
        <h3 className="text-lg font-serif font-semibold text-foreground">Блиц-опрос</h3>
      </div>
      {questions.map((q, idx) => (
        <QuizItem key={idx} number={idx + 1} {...q} />
      ))}
    </div>
  );
};

const QuizItem = ({
  number,
  question,
  options,
}: {
  number: number;
  question: string;
  options: { text: string; correct: boolean; explanation?: string }[];
}) => {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <div className="mb-5 last:mb-0">
      <p className="text-sm font-medium text-foreground mb-3">
        <span className="text-accent font-semibold mr-1">{number}.</span> {question}
      </p>
      <div className="space-y-2 pl-1">
        {options.map((opt, i) => {
          const letter = String.fromCharCode(65 + i);
          let style = "bg-muted/40 border-border hover:border-accent/40";
          if (selected === i) {
            style = opt.correct
              ? "bg-green-50 border-green-300 text-green-700"
              : "bg-red-50 border-red-300 text-red-700";
          }
          return (
            <div key={i}>
              <button
                onClick={() => setSelected(i)}
                className={`w-full text-left px-3 py-2.5 rounded-lg border text-sm transition-all ${style}`}
              >
                <span className="font-medium mr-2">{letter})</span>
                {opt.text}
                {selected === i && opt.correct && <span className="ml-2">✓</span>}
                {selected === i && !opt.correct && <span className="ml-2">✗</span>}
              </button>
              {selected === i && !opt.correct && opt.explanation && (
                <p className="text-xs text-muted-foreground mt-1 ml-3 italic">{opt.explanation}</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
