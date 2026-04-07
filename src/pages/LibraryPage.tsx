import { FileText, Download, ExternalLink } from "lucide-react";

const materials = [
  { title: "Справочник формул по физике", type: "PDF", subject: "Физика", size: "2.4 МБ" },
  { title: "Таблица производных и интегралов", type: "PDF", subject: "Математика", size: "1.1 МБ" },
  { title: "Хронология истории Казахстана", type: "PDF", subject: "История", size: "3.7 МБ" },
  { title: "Қазақ тілі грамматика — справочник", type: "PDF", subject: "Қазақ тілі", size: "1.8 МБ" },
  { title: "Периодическая таблица Менделеева", type: "Изображение", subject: "Химия", size: "0.5 МБ" },
  { title: "Генетический код — таблица кодонов", type: "PDF", subject: "Биология", size: "0.9 МБ" },
];

const LibraryPage = () => {
  return (
    <div className="max-w-[1000px] mx-auto px-4 md:px-8 py-8 animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-serif font-semibold text-foreground">Библиотека</h1>
        <p className="text-muted-foreground text-sm mt-1">Дополнительные материалы и справочники</p>
      </div>

      <div className="space-y-3">
        {materials.map((m) => (
          <div
            key={m.title}
            className="flex items-center gap-4 bg-card border border-border rounded-xl p-4 hover:shadow-sm hover:border-accent/30 transition-all group"
          >
            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
              <FileText size={20} className="text-accent" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{m.title}</p>
              <p className="text-xs text-muted-foreground">{m.subject} · {m.type} · {m.size}</p>
            </div>
            <button className="shrink-0 w-9 h-9 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-accent hover:border-accent/40 transition-colors">
              <Download size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LibraryPage;