-- Language enum
DO $$ BEGIN
  CREATE TYPE public.app_language AS ENUM ('kk', 'ru', 'en');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Add preferred_language to existing profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS preferred_language public.app_language NOT NULL DEFAULT 'kk';

-- COURSES (structural)
CREATE TABLE public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(100) UNIQUE NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.courses TO authenticated;
GRANT ALL ON public.courses TO service_role;

ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated view courses" ON public.courses
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Teachers/admins create courses" ON public.courses
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(),'teacher') OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "Teachers/admins update courses" ON public.courses
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'teacher') OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins delete courses" ON public.courses
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'admin'));

CREATE TRIGGER trg_courses_updated_at
  BEFORE UPDATE ON public.courses
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- COURSE TRANSLATIONS
CREATE TABLE public.course_translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  language public.app_language NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(course_id, language)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.course_translations TO authenticated;
GRANT ALL ON public.course_translations TO service_role;

ALTER TABLE public.course_translations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated view course translations" ON public.course_translations
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Teachers/admins manage course translations insert" ON public.course_translations
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(),'teacher') OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "Teachers/admins manage course translations update" ON public.course_translations
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'teacher') OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins delete course translations" ON public.course_translations
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'admin'));

CREATE TRIGGER trg_course_translations_updated_at
  BEFORE UPDATE ON public.course_translations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- LESSON TRANSLATIONS (attached to existing public.lessons)
CREATE TABLE public.lesson_translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  language public.app_language NOT NULL,
  title VARCHAR(255) NOT NULL,
  theory_content TEXT NOT NULL DEFAULT '',
  task_description TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(lesson_id, language)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.lesson_translations TO authenticated;
GRANT ALL ON public.lesson_translations TO service_role;

ALTER TABLE public.lesson_translations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated view lesson translations" ON public.lesson_translations
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Teachers/admins insert lesson translations" ON public.lesson_translations
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(),'teacher') OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "Teachers/admins update lesson translations" ON public.lesson_translations
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'teacher') OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins delete lesson translations" ON public.lesson_translations
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'admin'));

CREATE TRIGGER trg_lesson_translations_updated_at
  BEFORE UPDATE ON public.lesson_translations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- STUDENT LESSON STATES (AI hint state machine)
CREATE TABLE public.student_lesson_states (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL,
  lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  hint_level INT NOT NULL DEFAULT 1 CHECK (hint_level BETWEEN 1 AND 3),
  is_completed BOOLEAN NOT NULL DEFAULT false,
  error_history JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(student_id, lesson_id)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.student_lesson_states TO authenticated;
GRANT ALL ON public.student_lesson_states TO service_role;

ALTER TABLE public.student_lesson_states ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students manage own lesson state" ON public.student_lesson_states
  FOR ALL TO authenticated
  USING (student_id = auth.uid())
  WITH CHECK (student_id = auth.uid());

CREATE POLICY "Admins view all lesson states" ON public.student_lesson_states
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));

CREATE POLICY "Teachers view group student states" ON public.student_lesson_states
  FOR SELECT TO authenticated USING (
    EXISTS (
      SELECT 1 FROM public.group_members gm
      JOIN public.groups g ON g.id = gm.group_id
      WHERE gm.student_id = student_lesson_states.student_id
        AND g.teacher_id = auth.uid()
    )
  );

CREATE TRIGGER trg_student_lesson_states_updated_at
  BEFORE UPDATE ON public.student_lesson_states
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_student_lesson_states_student ON public.student_lesson_states(student_id);
CREATE INDEX idx_lesson_translations_lesson_lang ON public.lesson_translations(lesson_id, language);
CREATE INDEX idx_course_translations_course_lang ON public.course_translations(course_id, language);