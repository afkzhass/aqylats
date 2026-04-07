import { useState } from "react";
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';

const derivatives = [
  { func: "x^n", deriv: "n \\cdot x^{n-1}", example: "(x^5)' = 5x^4" },
  { func: "\\sin x", deriv: "\\cos x", example: "(\\sin 3x)' = 3\\cos 3x" },
  { func: "\\cos x", deriv: "-\\sin x", example: "(\\cos 2x)' = -2\\sin 2x" },
  { func: "e^x", deriv: "e^x", example: "(e^{2x})' = 2e^{2x}" },
  { func: "\\ln x", deriv: "\\frac{1}{x}", example: "(\\ln 5x)' = \\frac{1}{x}" },
  { func: "\\tan x", deriv: "\\frac{1}{\\cos^2 x}", example: "(\\tan x)' = \\sec^2 x" },
  { func: "a^x", deriv: "a^x \\ln a", example: "(2^x)' = 2^x \\ln 2" },
];

export const DerivativeTable = () => {
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

  return (
    <div className="bg-card border border-border rounded-xl p-5 my-4 overflow-x-auto">
      <h4 className="text-sm font-semibold text-foreground mb-4">📋 Таблица производных элементарных функций</h4>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            <th className="py-2 px-3 text-left text-muted-foreground font-medium">Функция f(x)</th>
            <th className="py-2 px-3 text-left text-muted-foreground font-medium">Производная f'(x)</th>
          </tr>
        </thead>
        <tbody>
          {derivatives.map((d, i) => (
            <tr
              key={i}
              className="border-b border-border/50 hover:bg-accent/5 transition-colors relative"
              onMouseEnter={() => setHoveredRow(i)}
              onMouseLeave={() => setHoveredRow(null)}
            >
              <td className="py-3 px-3"><InlineMath math={d.func} /></td>
              <td className="py-3 px-3 relative">
                <InlineMath math={d.deriv} />
                {hoveredRow === i && (
                  <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 z-10 bg-primary text-primary-foreground text-xs px-3 py-2 rounded-lg shadow-lg whitespace-nowrap animate-fade-in">
                    Пример: <InlineMath math={d.example} />
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="text-xs text-muted-foreground mt-3">💡 Наведите на строку, чтобы увидеть пример</p>
    </div>
  );
};
