
-- Lessons table for DB-backed simple lessons (alongside existing static interactive courses)
CREATE TABLE public.lessons (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL DEFAULT '',
  subject TEXT NOT NULL,
  grade INTEGER NOT NULL,
  video_url TEXT,
  language TEXT NOT NULL DEFAULT 'ru',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated can view lessons"
  ON public.lessons FOR SELECT TO authenticated USING (true);

CREATE POLICY "Teachers and admins create lessons"
  ON public.lessons FOR INSERT TO authenticated
  WITH CHECK (has_role(auth.uid(), 'teacher'::app_role) OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Teachers and admins update lessons"
  ON public.lessons FOR UPDATE TO authenticated
  USING (has_role(auth.uid(), 'teacher'::app_role) OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins delete lessons"
  ON public.lessons FOR DELETE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_lessons_updated_at
  BEFORE UPDATE ON public.lessons
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_lessons_subject_grade_lang ON public.lessons(subject, grade, language);

-- Seed test lessons (RU + KZ)
INSERT INTO public.lessons (title, content, subject, grade, language, video_url) VALUES
('Введение в химию: атомы и молекулы', '# Атомы и молекулы

Атом — наименьшая частица химического элемента. Молекула состоит из двух или более атомов, связанных химическими связями.

## Ключевые понятия
- Химический элемент
- Молекулярная формула
- Валентность', 'Химия', 7, 'ru', NULL),
('Химияға кіріспе: атомдар мен молекулалар', '# Атомдар мен молекулалар

Атом — химиялық элементтің ең кіші бөлшегі. Молекула — химиялық байланыспен біріктірілген екі немесе одан көп атомнан тұрады.

## Негізгі ұғымдар
- Химиялық элемент
- Молекулалық формула
- Валенттілік', 'Химия', 7, 'kz', NULL),
('Механика: законы Ньютона', '# Три закона Ньютона

1. Закон инерции
2. F = m·a
3. Действие равно противодействию

Эти законы — основа классической механики.', 'Физика', 8, 'ru', NULL),
('Механика: Ньютон заңдары', '# Ньютонның үш заңы

1. Инерция заңы
2. F = m·a
3. Әсер мен қарсы әсер тең

Бұл заңдар — классикалық механиканың негізі.', 'Физика', 8, 'kz', NULL),
('Клетка: строение и функции', '# Строение клетки

Клетка — структурная и функциональная единица всех живых организмов.

## Основные органоиды
- Ядро
- Митохондрии
- Рибосомы
- Эндоплазматическая сеть', 'Биология', 9, 'ru', NULL),
('Жасуша: құрылысы мен қызметтері', '# Жасуша құрылысы

Жасуша — барлық тірі ағзалардың құрылымдық және функционалдық бірлігі.

## Негізгі органоидтар
- Ядро
- Митохондриялар
- Рибосомалар
- Эндоплазмалық тор', 'Биология', 9, 'kz', NULL);
