import { useState } from "react";
import 'katex/dist/katex.min.css';
import { BlockMath } from 'react-katex';
import { Wand2 } from "lucide-react";

type Rule = "sum" | "product" | "quotient";

const ruleLabels: Record<Rule, string> = {
  sum: "Сумма: (u + v)' = u' + v'",
  product: "Произведение: (u·v)' = u'·v + u·v'",
  quotient: "Частное: (u/v)' = (u'·v − u·v') / v²",
};

export const DerivativeConstructor = () => {
  const [rule, setRule] = useState<Rule>("sum");
  const [u, setU] = useState("x^2");
  const [v, setV] = useState("\\sin x");
  const [result, setResult] = useState<string | null>(null);

  const compute = () => {
    const uPrime = u === "x^2" ? "2x" : u === "x^3" ? "3x^2" : u === "\\sin x" ? "\\cos x" : u === "\\cos x" ? "-\\sin x" : u === "e^x" ? "e^x" : u === "\\ln x" ? "\\frac{1}{x}" : `(${u})'`;
    const vPrime = v === "x^2" ? "2x" : v === "x^3" ? "3x^2" : v === "\\sin x" ? "\\cos x" : v === "\\cos x" ? "-\\sin x" : v === "e^x" ? "e^x" : v === "\\ln x" ? "\\frac{1}{x}" : `(${v})'`;

    if (rule === "sum") {
      setResult(`(${u} + ${v})' = ${uPrime} + ${vPrime}`);
    } else if (rule === "product") {
      setResult(`(${u} \\cdot ${v})' = ${uPrime} \\cdot ${v} + ${u} \\cdot ${vPrime}`);
    } else {
      setResult(`\\left(\\frac{${u}}{${v}}\\right)' = \\frac{${uPrime} \\cdot ${v} - ${u} \\cdot ${vPrime}}{(${v})^2}`);
    }
  };

  const funcOptions = ["x^2", "x^3", "\\sin x", "\\cos x", "e^x", "\\ln x"];

  return (
    <div className="bg-card border border-border rounded-xl p-5 my-4">
      <div className="flex items-center gap-2 mb-4">
        <Wand2 size={18} className="text-accent" />
        <h4 className="text-sm font-semibold text-foreground">Конструктор производных</h4>
      </div>

      <div className="space-y-3">
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Правило:</label>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(ruleLabels) as Rule[]).map((r) => (
              <button
                key={r}
                onClick={() => { setRule(r); setResult(null); }}
                className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
                  rule === r ? "bg-accent text-accent-foreground border-accent" : "bg-muted/40 border-border hover:border-accent/40"
                }`}
              >
                {r === "sum" ? "Сумма" : r === "product" ? "Произведение" : "Частное"}
              </button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-1">{ruleLabels[rule]}</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Функция u(x):</label>
            <select
              value={u}
              onChange={(e) => { setU(e.target.value); setResult(null); }}
              className="w-full text-sm px-3 py-2 rounded-lg border border-border bg-background"
            >
              {funcOptions.map((f) => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Функция v(x):</label>
            <select
              value={v}
              onChange={(e) => { setV(e.target.value); setResult(null); }}
              className="w-full text-sm px-3 py-2 rounded-lg border border-border bg-background"
            >
              {funcOptions.map((f) => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>
        </div>

        <button
          onClick={compute}
          className="flex items-center gap-2 px-5 py-2 bg-accent text-accent-foreground rounded-lg text-sm font-medium hover:bg-accent/90 transition-colors"
        >
          <Wand2 size={16} />
          Применить формулу
        </button>

        {result && (
          <div className="animate-fade-in bg-accent/5 border border-accent/20 rounded-xl p-4 mt-2">
            <p className="text-xs text-muted-foreground mb-2">Результат:</p>
            <BlockMath math={result} />
          </div>
        )}
      </div>
    </div>
  );
};
