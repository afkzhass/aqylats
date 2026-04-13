import { CheckCircle2, Circle, Play } from "lucide-react";
import LimitLesson from "./lesson/LimitLesson";
import DerivativeLesson from "./lesson/DerivativeLesson";
import DifferentiationRulesLesson from "./lesson/DifferentiationRulesLesson";
import PhotoeffectLesson from "./lesson/PhotoeffectLesson";
import BohrModelLesson from "./lesson/BohrModelLesson";
import WaveParticleLesson from "./lesson/WaveParticleLesson";
import HydrocarbonsLesson from "./lesson/HydrocarbonsLesson";
import AlcoholsLesson from "./lesson/AlcoholsLesson";
import CarboxylicAcidsLesson from "./lesson/CarboxylicAcidsLesson";
import MendelLawsLesson from "./lesson/MendelLawsLesson";
import GeneticCodeLesson from "./lesson/GeneticCodeLesson";
import EvolutionLesson from "./lesson/EvolutionLesson";
import KazakhstanEarlyXXLesson from "./lesson/KazakhstanEarlyXXLesson";
import NationalLiberationLesson from "./lesson/NationalLiberationLesson";
import KazakhstanWWIILesson from "./lesson/KazakhstanWWIILesson";
import JaiSoilemLesson from "./lesson/JaiSoilemLesson";
import KurmalasSoilemLesson from "./lesson/KurmalasSoilemLesson";
import TynysBelgileriLesson from "./lesson/TynysBelgileriLesson";

interface Props {
  courseId: string;
  lessonId: string;
  lessonTitle: string;
  onComplete: () => void;
  isCompleted: boolean;
  onPrev?: () => void;
  onNext?: () => void;
  hasPrev: boolean;
  hasNext: boolean;
}

const lessonComponents: Record<string, Record<string, React.FC>> = {
  algebra: {
    "1": LimitLesson,
    "2": DerivativeLesson,
    "3": DifferentiationRulesLesson,
  },
  "quantum-physics": {
    "1": PhotoeffectLesson,
    "2": BohrModelLesson,
    "3": WaveParticleLesson,
  },
  chemistry: {
    "1": HydrocarbonsLesson,
    "2": AlcoholsLesson,
    "3": CarboxylicAcidsLesson,
  },
  biology: {
    "1": MendelLawsLesson,
    "2": GeneticCodeLesson,
    "3": EvolutionLesson,
  },
  "history-kz": {
    "1": KazakhstanEarlyXXLesson,
    "2": NationalLiberationLesson,
    "3": KazakhstanWWIILesson,
  },
  "kazakh-language": {
    "1": JaiSoilemLesson,
    "2": KurmalasSoilemLesson,
    "3": TynysBelgileriLesson,
  },
};

const LessonContent = ({ courseId, lessonId, lessonTitle, onComplete, isCompleted, onPrev, onNext, hasPrev, hasNext }: Props) => {
  const LessonBody = lessonComponents[courseId]?.[lessonId];

  return (
    <article className="animate-fade-in space-y-6">
      {/* Title bar */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h2 className="text-xl md:text-2xl font-serif font-semibold text-foreground mb-1">
          {lessonTitle}
        </h2>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* LEFT — Video */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-gradient-to-br from-[hsl(214,46%,19%)] to-[hsl(214,46%,33%)] rounded-xl aspect-video flex flex-col items-center justify-center text-primary-foreground relative overflow-hidden">
            <div className="w-16 h-16 rounded-full bg-primary-foreground/20 backdrop-blur-sm flex items-center justify-center mb-3 cursor-pointer hover:bg-primary-foreground/30 transition-colors z-10">
              <Play size={28} className="text-primary-foreground ml-1" />
            </div>
            <p className="text-sm text-primary-foreground/70 z-10">Видео: {lessonTitle}</p>
          </div>
        </div>

        {/* RIGHT — Theory */}
        <div className="lg:col-span-3">
          <div className="bg-card border border-border rounded-xl p-5 md:p-6">
            {LessonBody ? <LessonBody /> : (
              <p className="text-muted-foreground text-sm">Содержание урока в разработке...</p>
            )}
          </div>
        </div>
      </div>

      {/* Complete button */}
      <div className="flex justify-center pb-2">
        <button
          onClick={onComplete}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium transition-all shadow-sm ${
            isCompleted
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-primary text-primary-foreground hover:bg-accent"
          }`}
        >
          {isCompleted ? <CheckCircle2 size={18} /> : <Circle size={18} />}
          {isCompleted ? "Урок пройден ✓" : "Отметить как пройденный"}
        </button>
      </div>

      {/* Prev / Next navigation */}
      <div className="flex justify-between items-center pb-6">
        {hasPrev ? (
          <button onClick={onPrev} className="flex items-center gap-1 text-sm text-accent hover:underline">
            ← Предыдущий урок
          </button>
        ) : <span />}
        {hasNext ? (
          <button onClick={onNext} className="flex items-center gap-1 text-sm text-accent hover:underline">
            Следующий урок →
          </button>
        ) : <span />}
      </div>
    </article>
  );
};

export default LessonContent;
