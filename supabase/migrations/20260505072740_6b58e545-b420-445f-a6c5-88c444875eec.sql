
-- 1. Fix homework_submissions INSERT: prevent grade tampering + enforce group membership
DROP POLICY IF EXISTS "Submit homework" ON public.homework_submissions;

CREATE POLICY "Submit homework"
ON public.homework_submissions
FOR INSERT
TO authenticated
WITH CHECK (
  student_id = auth.uid()
  AND ai_score IS NULL
  AND teacher_grade IS NULL
  AND (ai_comment IS NULL OR ai_comment = '')
  AND (teacher_comment IS NULL OR teacher_comment = '')
  AND reviewed_at IS NULL
  AND status = 'submitted'::submission_status
  AND EXISTS (
    SELECT 1
    FROM public.homework_assignments ha
    JOIN public.group_members gm ON gm.group_id = ha.group_id
    WHERE ha.id = homework_submissions.assignment_id
      AND gm.student_id = auth.uid()
  )
);

-- Prevent students from updating grade fields on their own submissions
DROP POLICY IF EXISTS "Update submissions" ON public.homework_submissions;

CREATE POLICY "Teachers and admins update submissions"
ON public.homework_submissions
FOR UPDATE
TO authenticated
USING (
  has_role(auth.uid(), 'admin'::app_role)
  OR EXISTS (
    SELECT 1 FROM public.homework_assignments ha
    WHERE ha.id = homework_submissions.assignment_id
      AND ha.teacher_id = auth.uid()
  )
);

CREATE POLICY "Students update own submission content"
ON public.homework_submissions
FOR UPDATE
TO authenticated
USING (student_id = auth.uid())
WITH CHECK (
  student_id = auth.uid()
  AND ai_score IS NULL
  AND teacher_grade IS NULL
  AND (teacher_comment IS NULL OR teacher_comment = '')
  AND reviewed_at IS NULL
  AND status = 'submitted'::submission_status
);

-- 2. Fix the broken View groups policy
DROP POLICY IF EXISTS "View groups" ON public.groups;

CREATE POLICY "View groups"
ON public.groups
FOR SELECT
TO authenticated
USING (
  teacher_id = auth.uid()
  OR has_role(auth.uid(), 'admin'::app_role)
  OR EXISTS (
    SELECT 1 FROM public.group_members gm
    WHERE gm.group_id = groups.id
      AND gm.student_id = auth.uid()
  )
);

-- 3. Restrict storage View homework files: teachers only see files of their assignments
DROP POLICY IF EXISTS "View homework files" ON storage.objects;

CREATE POLICY "View homework files"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'homework'
  AND (
    (auth.uid())::text = (storage.foldername(name))[1]
    OR has_role(auth.uid(), 'admin'::app_role)
    OR EXISTS (
      SELECT 1
      FROM public.homework_submissions hs
      JOIN public.homework_assignments ha ON ha.id = hs.assignment_id
      WHERE hs.file_url IS NOT NULL
        AND ha.teacher_id = auth.uid()
        AND position(name in hs.file_url) > 0
    )
  )
);
