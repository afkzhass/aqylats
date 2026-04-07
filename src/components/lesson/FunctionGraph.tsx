import { useEffect, useRef } from "react";

export const LimitGraph = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    const cx = w / 2;
    const cy = h / 2;
    const scale = 40;

    ctx.clearRect(0, 0, w, h);

    // Grid
    ctx.strokeStyle = "hsl(30, 27%, 83%)";
    ctx.lineWidth = 0.5;
    for (let x = 0; x <= w; x += scale) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
    }
    for (let y = 0; y <= h; y += scale) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = "hsl(214, 46%, 19%)";
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(w, cy); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx, 0); ctx.lineTo(cx, h); ctx.stroke();

    // Labels
    ctx.fillStyle = "hsl(214, 46%, 19%)";
    ctx.font = "12px sans-serif";
    ctx.fillText("x", w - 15, cy - 8);
    ctx.fillText("y", cx + 8, 15);
    for (let i = -4; i <= 4; i++) {
      if (i === 0) continue;
      ctx.fillText(String(i), cx + i * scale - 4, cy + 14);
    }

    // f(x) = (x²-1)/(x-1) = x+1, x≠1
    ctx.strokeStyle = "hsl(34, 77%, 47%)";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    let started = false;
    for (let px = 0; px < w; px++) {
      const x = (px - cx) / scale;
      if (Math.abs(x - 1) < 0.02) { started = false; continue; }
      const y = x + 1;
      const py = cy - y * scale;
      if (!started) { ctx.moveTo(px, py); started = true; } else { ctx.lineTo(px, py); }
    }
    ctx.stroke();

    // Hollow point at (1, 2)
    const hx = cx + 1 * scale;
    const hy = cy - 2 * scale;
    ctx.beginPath();
    ctx.arc(hx, hy, 5, 0, Math.PI * 2);
    ctx.strokeStyle = "hsl(0, 63%, 46%)";
    ctx.lineWidth = 2;
    ctx.fillStyle = "hsl(0, 0%, 100%)";
    ctx.fill();
    ctx.stroke();

    // Label
    ctx.fillStyle = "hsl(0, 63%, 46%)";
    ctx.font = "11px sans-serif";
    ctx.fillText("выколотая точка (1, 2)", hx + 10, hy - 8);

    // Arrows showing approach
    ctx.fillStyle = "hsl(34, 77%, 47%)";
    ctx.font = "13px sans-serif";
    ctx.fillText("→ lim = 2", hx + 10, hy + 20);
  }, []);

  return (
    <div className="bg-card border border-border rounded-xl p-4 my-4">
      <h4 className="text-sm font-semibold text-foreground mb-3">
        График f(x) = (x² − 1)/(x − 1) с выколотой точкой
      </h4>
      <canvas ref={canvasRef} width={400} height={320} className="w-full max-w-[400px] mx-auto" />
      <p className="text-xs text-muted-foreground mt-2 text-center">
        Функция стремится к 2 при x → 1, но значение в точке x = 1 не определено
      </p>
    </div>
  );
};
