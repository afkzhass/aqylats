import { useState } from "react";
import { ChevronRight, RotateCcw } from "lucide-react";

interface Step {
  title: string;
  content: React.ReactNode;
}

export const StepByStep = ({ steps, title = "Пошаговое решение" }: { steps: Step[]; title?: string }) => {
  const [visibleCount, setVisibleCount] = useState(1);

  return (
    <div className="bg-card border border-border rounded-xl p-5 my-4">
      <h4 className="text-sm font-semibold text-foreground mb-4">{title}</h4>
      <div className="space-y-3">
        {steps.slice(0, visibleCount).map((step, i) => (
          <div key={i} className="animate-fade-in flex gap-3">
            <div className="shrink-0 w-7 h-7 rounded-full bg-accent/10 text-accent flex items-center justify-center text-xs font-bold">
              {i + 1}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">{step.title}</p>
              <div className="text-sm text-foreground/80 mt-1">{step.content}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-2 mt-4">
        {visibleCount < steps.length && (
          <button
            onClick={() => setVisibleCount((c) => c + 1)}
            className="flex items-center gap-1 px-4 py-2 bg-accent text-accent-foreground rounded-lg text-xs font-medium hover:bg-accent/90 transition-colors"
          >
            Следующий шаг <ChevronRight size={14} />
          </button>
        )}
        {visibleCount > 1 && (
          <button
            onClick={() => setVisibleCount(1)}
            className="flex items-center gap-1 px-4 py-2 bg-muted text-foreground rounded-lg text-xs font-medium hover:bg-muted/80 transition-colors"
          >
            <RotateCcw size={14} /> Сначала
          </button>
        )}
        {visibleCount === steps.length && (
          <span className="text-xs text-green-600 flex items-center">✓ Все шаги показаны</span>
        )}
      </div>
    </div>
  );
};
