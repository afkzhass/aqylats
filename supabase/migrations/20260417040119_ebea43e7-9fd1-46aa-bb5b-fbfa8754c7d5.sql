-- 1. Добавить class_code в groups
ALTER TABLE public.groups
  ADD COLUMN IF NOT EXISTS class_code TEXT UNIQUE;

-- Функция генерации уникального 6-значного кода
CREATE OR REPLACE FUNCTION public.generate_class_code()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  code TEXT;
  exists_check BOOLEAN;
BEGIN
  LOOP
    code := upper(substring(md5(random()::text || clock_timestamp()::text) from 1 for 6));
    SELECT EXISTS(SELECT 1 FROM public.groups WHERE class_code = code) INTO exists_check;
    IF NOT exists_check THEN
      RETURN code;
    END IF;
  END LOOP;
END;
$$;

-- Заполнить class_code для существующих групп
UPDATE public.groups SET class_code = public.generate_class_code() WHERE class_code IS NULL;

-- Триггер: автогенерация кода при создании группы
CREATE OR REPLACE FUNCTION public.set_class_code()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.class_code IS NULL THEN
    NEW.class_code := public.generate_class_code();
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_set_class_code ON public.groups;
CREATE TRIGGER trg_set_class_code
BEFORE INSERT ON public.groups
FOR EACH ROW
EXECUTE FUNCTION public.set_class_code();

-- 2. Расширить profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS last_lesson_id TEXT,
  ADD COLUMN IF NOT EXISTS last_course_id TEXT,
  ADD COLUMN IF NOT EXISTS total_lessons_completed INTEGER NOT NULL DEFAULT 0;

-- 3. Таблица прогресса уроков
CREATE TABLE IF NOT EXISTS public.lesson_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL,
  course_id TEXT NOT NULL,
  lesson_id TEXT NOT NULL,
  progress_pct INTEGER NOT NULL DEFAULT 0,
  completed BOOLEAN NOT NULL DEFAULT false,
  last_viewed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (student_id, lesson_id)
);

ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students manage own progress"
ON public.lesson_progress
FOR ALL
TO authenticated
USING (student_id = auth.uid())
WITH CHECK (student_id = auth.uid());

CREATE POLICY "Admins view all progress"
ON public.lesson_progress
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Teachers view group student progress"
ON public.lesson_progress
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.group_members gm
    JOIN public.groups g ON g.id = gm.group_id
    WHERE gm.student_id = lesson_progress.student_id
      AND g.teacher_id = auth.uid()
  )
);

CREATE TRIGGER update_lesson_progress_updated_at
BEFORE UPDATE ON public.lesson_progress
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- 4. Функция привязки ученика к группе по коду
CREATE OR REPLACE FUNCTION public.join_group_by_code(_code TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _group_id UUID;
  _teacher_id UUID;
  _class_name TEXT;
BEGIN
  IF auth.uid() IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Not authenticated');
  END IF;

  SELECT id, teacher_id, class_name INTO _group_id, _teacher_id, _class_name
  FROM public.groups
  WHERE class_code = upper(_code);

  IF _group_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Неверный код класса');
  END IF;

  IF EXISTS (
    SELECT 1 FROM public.group_members
    WHERE group_id = _group_id AND student_id = auth.uid()
  ) THEN
    RETURN jsonb_build_object('success', false, 'error', 'Вы уже в этом классе');
  END IF;

  INSERT INTO public.group_members (group_id, student_id)
  VALUES (_group_id, auth.uid());

  RETURN jsonb_build_object(
    'success', true,
    'group_id', _group_id,
    'class_name', _class_name
  );
END;
$$;

-- 5. Разрешить ученику самостоятельно вступать в группу (для join_group_by_code)
DROP POLICY IF EXISTS "Students join via code" ON public.group_members;
CREATE POLICY "Students join via code"
ON public.group_members
FOR INSERT
TO authenticated
WITH CHECK (student_id = auth.uid());