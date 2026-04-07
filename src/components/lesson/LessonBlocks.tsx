import { BookOpen, AlertTriangle, Lightbulb, Zap } from "lucide-react";

interface BlockProps {
  title?: string;
  children: React.ReactNode;
}

export const DefinitionBlock = ({ title = "Определение", children }: BlockProps) => (
  <div className="border-l-4 border-primary rounded-xl p-4 bg-primary/5 my-4">
    <div className="flex items-center gap-2 mb-2">
      <BookOpen size={18} className="text-primary" />
      <span className="text-sm font-semibold text-foreground">{title}</span>
    </div>
    <div className="text-sm leading-relaxed text-foreground/85">{children}</div>
  </div>
);

export const ImportantBlock = ({ title = "Важно!", children }: BlockProps) => (
  <div className="border-l-4 border-destructive rounded-xl p-4 bg-destructive/5 my-4">
    <div className="flex items-center gap-2 mb-2">
      <AlertTriangle size={18} className="text-destructive" />
      <span className="text-sm font-semibold text-foreground">{title}</span>
    </div>
    <div className="text-sm leading-relaxed text-foreground/85">{children}</div>
  </div>
);

export const LifehackBlock = ({ title = "Лайфхак", children }: BlockProps) => (
  <div className="border-l-4 border-accent rounded-xl p-4 bg-accent/5 my-4">
    <div className="flex items-center gap-2 mb-2">
      <Lightbulb size={18} className="text-accent" />
      <span className="text-sm font-semibold text-foreground">{title}</span>
    </div>
    <div className="text-sm leading-relaxed text-foreground/85">{children}</div>
  </div>
);

export const CalloutBlock = ({ title, children, variant = "warning" }: BlockProps & { variant?: "warning" | "accent" | "info" }) => {
  const styles = {
    warning: "bg-amber-50 border-amber-400 text-amber-800",
    accent: "bg-accent/5 border-accent/40",
    info: "bg-blue-50 border-blue-400",
  }[variant];

  const icons = {
    warning: <AlertTriangle size={18} className="text-amber-600" />,
    accent: <Lightbulb size={18} className="text-accent" />,
    info: <Zap size={18} className="text-blue-600" />,
  }[variant];

  return (
    <div className={`border-l-4 rounded-xl p-4 my-4 ${styles}`}>
      <div className="flex items-center gap-2 mb-2">
        {icons}
        <span className="text-sm font-semibold text-foreground">{title}</span>
      </div>
      <div className="text-sm leading-relaxed text-foreground/85">{children}</div>
    </div>
  );
};

export const Section = ({
  number,
  title,
  icon,
  children,
}: {
  number: number;
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) => (
  <section className="mb-6">
    <div className="flex items-center gap-2 mb-3">
      {icon}
      <h3 className="text-base font-serif font-semibold text-foreground">
        {number}. {title}
      </h3>
    </div>
    <div className="text-sm leading-relaxed text-foreground/85 space-y-2 pl-1">{children}</div>
  </section>
);
