
-- Fix 1: teacher_stats - restrict SELECT to own row or admin
DROP POLICY IF EXISTS "Authenticated users can view teacher stats" ON public.teacher_stats;
CREATE POLICY "Teachers view own stats"
  ON public.teacher_stats FOR SELECT TO authenticated
  USING (teacher_id = auth.uid() OR public.has_role(auth.uid(), 'admin'::app_role));

-- Fix 2: Move class_code out of groups so students can't read it
CREATE TABLE IF NOT EXISTS public.group_codes (
  group_id UUID PRIMARY KEY REFERENCES public.groups(id) ON DELETE CASCADE,
  class_code TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.group_codes TO authenticated;
GRANT ALL ON public.group_codes TO service_role;

ALTER TABLE public.group_codes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Teachers and admins view group codes"
  ON public.group_codes FOR SELECT TO authenticated
  USING (
    public.has_role(auth.uid(), 'admin'::app_role)
    OR EXISTS (SELECT 1 FROM public.groups g WHERE g.id = group_codes.group_id AND g.teacher_id = auth.uid())
  );

CREATE POLICY "Teachers and admins manage group codes insert"
  ON public.group_codes FOR INSERT TO authenticated
  WITH CHECK (
    public.has_role(auth.uid(), 'admin'::app_role)
    OR EXISTS (SELECT 1 FROM public.groups g WHERE g.id = group_codes.group_id AND g.teacher_id = auth.uid())
  );

CREATE POLICY "Teachers and admins manage group codes update"
  ON public.group_codes FOR UPDATE TO authenticated
  USING (
    public.has_role(auth.uid(), 'admin'::app_role)
    OR EXISTS (SELECT 1 FROM public.groups g WHERE g.id = group_codes.group_id AND g.teacher_id = auth.uid())
  );

CREATE POLICY "Admins delete group codes"
  ON public.group_codes FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Migrate existing codes
INSERT INTO public.group_codes (group_id, class_code)
SELECT id, class_code FROM public.groups WHERE class_code IS NOT NULL
ON CONFLICT (group_id) DO NOTHING;

-- Update set_class_code trigger function to write to group_codes
CREATE OR REPLACE FUNCTION public.set_class_code()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _code TEXT;
BEGIN
  IF NEW.class_code IS NULL OR NEW.class_code = '' THEN
    _code := public.generate_class_code();
  ELSE
    _code := NEW.class_code;
  END IF;
  INSERT INTO public.group_codes (group_id, class_code) VALUES (NEW.id, _code)
  ON CONFLICT (group_id) DO UPDATE SET class_code = EXCLUDED.class_code, updated_at = now();
  RETURN NEW;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.set_class_code() FROM PUBLIC, anon, authenticated;

-- generate_class_code now checks the new table
CREATE OR REPLACE FUNCTION public.generate_class_code()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  code TEXT;
  exists_check BOOLEAN;
BEGIN
  LOOP
    code := upper(substring(md5(random()::text || clock_timestamp()::text) FROM 1 FOR 6));
    SELECT EXISTS(SELECT 1 FROM public.group_codes WHERE class_code = code) INTO exists_check;
    IF NOT exists_check THEN
      RETURN code;
    END IF;
  END LOOP;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.generate_class_code() FROM PUBLIC, anon, authenticated;

-- Move trigger to AFTER INSERT to use NEW.id
DROP TRIGGER IF EXISTS set_class_code_trigger ON public.groups;
DROP TRIGGER IF EXISTS trg_set_class_code ON public.groups;

CREATE OR REPLACE FUNCTION public.create_group_code()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.group_codes (group_id, class_code)
  VALUES (NEW.id, public.generate_class_code())
  ON CONFLICT (group_id) DO NOTHING;
  RETURN NEW;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.create_group_code() FROM PUBLIC, anon, authenticated;

CREATE TRIGGER trg_create_group_code
AFTER INSERT ON public.groups
FOR EACH ROW EXECUTE FUNCTION public.create_group_code();

-- updated_at trigger on group_codes
CREATE TRIGGER trg_group_codes_updated_at
BEFORE UPDATE ON public.group_codes
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Update join_group_by_code to use group_codes
CREATE OR REPLACE FUNCTION public.join_group_by_code(_code TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _group_id UUID;
  _class_name TEXT;
BEGIN
  IF auth.uid() IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Not authenticated');
  END IF;

  SELECT gc.group_id, g.class_name INTO _group_id, _class_name
  FROM public.group_codes gc
  JOIN public.groups g ON g.id = gc.group_id
  WHERE gc.class_code = upper(_code);

  IF _group_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Неверный код класса');
  END IF;

  IF EXISTS (SELECT 1 FROM public.group_members WHERE group_id = _group_id AND student_id = auth.uid()) THEN
    RETURN jsonb_build_object('success', false, 'error', 'Вы уже в этом классе');
  END IF;

  INSERT INTO public.group_members (group_id, student_id) VALUES (_group_id, auth.uid());

  RETURN jsonb_build_object('success', true, 'group_id', _group_id, 'class_name', _class_name);
END;
$$;

REVOKE EXECUTE ON FUNCTION public.join_group_by_code(TEXT) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.join_group_by_code(TEXT) TO authenticated;

-- Drop class_code column from groups
ALTER TABLE public.groups DROP COLUMN IF EXISTS class_code;

-- Fix 3: Prevent students from modifying AI/teacher fields on their submissions via trigger
CREATE OR REPLACE FUNCTION public.protect_submission_fields()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _is_privileged BOOLEAN;
BEGIN
  SELECT (
    public.has_role(auth.uid(), 'admin'::app_role)
    OR EXISTS (
      SELECT 1 FROM public.homework_assignments ha
      WHERE ha.id = NEW.assignment_id AND ha.teacher_id = auth.uid()
    )
  ) INTO _is_privileged;

  IF NOT _is_privileged THEN
    IF NEW.ai_score IS DISTINCT FROM OLD.ai_score
       OR NEW.ai_comment IS DISTINCT FROM OLD.ai_comment
       OR NEW.teacher_grade IS DISTINCT FROM OLD.teacher_grade
       OR NEW.teacher_comment IS DISTINCT FROM OLD.teacher_comment
       OR NEW.reviewed_at IS DISTINCT FROM OLD.reviewed_at
       OR NEW.status IS DISTINCT FROM OLD.status THEN
      RAISE EXCEPTION 'Students cannot modify graded fields on submissions';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.protect_submission_fields() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS trg_protect_submission_fields ON public.homework_submissions;
CREATE TRIGGER trg_protect_submission_fields
BEFORE UPDATE ON public.homework_submissions
FOR EACH ROW EXECUTE FUNCTION public.protect_submission_fields();
