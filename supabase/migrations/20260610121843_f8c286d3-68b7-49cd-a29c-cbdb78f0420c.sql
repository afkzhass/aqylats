
-- Lock down user_roles: explicit restrictive policy preventing non-admin inserts/updates/deletes
CREATE POLICY "Only admins can insert roles"
  ON public.user_roles FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can update roles"
  ON public.user_roles FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can delete roles"
  ON public.user_roles FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Homework storage: add UPDATE/DELETE policies scoped to owner or assignment teacher/admin
CREATE POLICY "Owners and teachers can update homework files"
  ON storage.objects FOR UPDATE TO authenticated
  USING (
    bucket_id = 'homework'
    AND (
      (auth.uid())::text = (storage.foldername(name))[1]
      OR public.has_role(auth.uid(), 'admin'::app_role)
      OR EXISTS (
        SELECT 1 FROM public.homework_submissions hs
        JOIN public.homework_assignments ha ON ha.id = hs.assignment_id
        WHERE hs.file_url IS NOT NULL
          AND ha.teacher_id = auth.uid()
          AND POSITION(objects.name IN hs.file_url) > 0
      )
    )
  );

CREATE POLICY "Owners and teachers can delete homework files"
  ON storage.objects FOR DELETE TO authenticated
  USING (
    bucket_id = 'homework'
    AND (
      (auth.uid())::text = (storage.foldername(name))[1]
      OR public.has_role(auth.uid(), 'admin'::app_role)
      OR EXISTS (
        SELECT 1 FROM public.homework_submissions hs
        JOIN public.homework_assignments ha ON ha.id = hs.assignment_id
        WHERE hs.file_url IS NOT NULL
          AND ha.teacher_id = auth.uid()
          AND POSITION(objects.name IN hs.file_url) > 0
      )
    )
  );

-- Restrict has_role EXECUTE to only the roles that need it (authenticated for RLS).
-- Revoke from PUBLIC and anon so it cannot be invoked via the API by unauthenticated callers.
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO authenticated;
