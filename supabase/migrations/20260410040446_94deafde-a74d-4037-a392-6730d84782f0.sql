
-- 1. Create enums
CREATE TYPE public.app_role AS ENUM ('admin', 'teacher', 'student');
CREATE TYPE public.submission_status AS ENUM ('submitted', 'ai_reviewed', 'pending_review', 'graded');

-- 2. Create ALL tables first
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

CREATE TABLE public.groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_name TEXT NOT NULL,
  teacher_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.group_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (group_id, student_id)
);

CREATE TABLE public.homework_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id TEXT NOT NULL,
  teacher_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  group_id UUID REFERENCES public.groups(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  deadline TIMESTAMPTZ,
  ai_evaluation_criteria TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.homework_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id UUID NOT NULL REFERENCES public.homework_assignments(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  file_url TEXT,
  answer_text TEXT DEFAULT '',
  ai_score INTEGER,
  ai_comment TEXT DEFAULT '',
  teacher_grade INTEGER,
  teacher_comment TEXT DEFAULT '',
  status submission_status NOT NULL DEFAULT 'submitted',
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  reviewed_at TIMESTAMPTZ,
  UNIQUE (assignment_id, student_id)
);

-- 3. Enable RLS on all tables
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.homework_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.homework_submissions ENABLE ROW LEVEL SECURITY;

-- 4. Triggers
CREATE TRIGGER update_groups_updated_at
  BEFORE UPDATE ON public.groups
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_homework_assignments_updated_at
  BEFORE UPDATE ON public.homework_assignments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 5. Security definer function
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

-- 6. RLS policies: user_roles
CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles"
  ON public.user_roles FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- 7. RLS policies: groups
CREATE POLICY "View groups"
  ON public.groups FOR SELECT TO authenticated
  USING (
    teacher_id = auth.uid()
    OR public.has_role(auth.uid(), 'admin')
    OR EXISTS (SELECT 1 FROM public.group_members gm WHERE gm.group_id = id AND gm.student_id = auth.uid())
  );

CREATE POLICY "Create groups"
  ON public.groups FOR INSERT TO authenticated
  WITH CHECK (
    (teacher_id = auth.uid() AND public.has_role(auth.uid(), 'teacher'))
    OR public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Update groups"
  ON public.groups FOR UPDATE TO authenticated
  USING (
    (teacher_id = auth.uid() AND public.has_role(auth.uid(), 'teacher'))
    OR public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Delete groups"
  ON public.groups FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- 8. RLS policies: group_members
CREATE POLICY "View group members"
  ON public.group_members FOR SELECT TO authenticated
  USING (
    student_id = auth.uid()
    OR public.has_role(auth.uid(), 'admin')
    OR EXISTS (SELECT 1 FROM public.groups g WHERE g.id = group_id AND g.teacher_id = auth.uid())
  );

CREATE POLICY "Add group members"
  ON public.group_members FOR INSERT TO authenticated
  WITH CHECK (
    public.has_role(auth.uid(), 'admin')
    OR EXISTS (SELECT 1 FROM public.groups g WHERE g.id = group_id AND g.teacher_id = auth.uid())
  );

CREATE POLICY "Remove group members"
  ON public.group_members FOR DELETE TO authenticated
  USING (
    public.has_role(auth.uid(), 'admin')
    OR EXISTS (SELECT 1 FROM public.groups g WHERE g.id = group_id AND g.teacher_id = auth.uid())
  );

-- 9. RLS policies: homework_assignments
CREATE POLICY "View assignments"
  ON public.homework_assignments FOR SELECT TO authenticated
  USING (
    teacher_id = auth.uid()
    OR public.has_role(auth.uid(), 'admin')
    OR EXISTS (SELECT 1 FROM public.group_members gm WHERE gm.group_id = homework_assignments.group_id AND gm.student_id = auth.uid())
  );

CREATE POLICY "Create assignments"
  ON public.homework_assignments FOR INSERT TO authenticated
  WITH CHECK (
    (teacher_id = auth.uid() AND public.has_role(auth.uid(), 'teacher'))
    OR public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Update assignments"
  ON public.homework_assignments FOR UPDATE TO authenticated
  USING (teacher_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Delete assignments"
  ON public.homework_assignments FOR DELETE TO authenticated
  USING (teacher_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

-- 10. RLS policies: homework_submissions
CREATE POLICY "View submissions"
  ON public.homework_submissions FOR SELECT TO authenticated
  USING (
    student_id = auth.uid()
    OR public.has_role(auth.uid(), 'admin')
    OR EXISTS (SELECT 1 FROM public.homework_assignments ha WHERE ha.id = assignment_id AND ha.teacher_id = auth.uid())
  );

CREATE POLICY "Submit homework"
  ON public.homework_submissions FOR INSERT TO authenticated
  WITH CHECK (student_id = auth.uid());

CREATE POLICY "Update submissions"
  ON public.homework_submissions FOR UPDATE TO authenticated
  USING (
    student_id = auth.uid()
    OR public.has_role(auth.uid(), 'admin')
    OR EXISTS (SELECT 1 FROM public.homework_assignments ha WHERE ha.id = assignment_id AND ha.teacher_id = auth.uid())
  );

-- 11. Storage bucket for homework files
INSERT INTO storage.buckets (id, name, public) VALUES ('homework', 'homework', false);

CREATE POLICY "Upload homework files"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'homework' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "View homework files"
  ON storage.objects FOR SELECT TO authenticated
  USING (
    bucket_id = 'homework'
    AND (
      auth.uid()::text = (storage.foldername(name))[1]
      OR public.has_role(auth.uid(), 'teacher')
      OR public.has_role(auth.uid(), 'admin')
    )
  );

-- 12. Update handle_new_user to assign student role
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, email)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', ''), COALESCE(NEW.email, ''));
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'student');
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
