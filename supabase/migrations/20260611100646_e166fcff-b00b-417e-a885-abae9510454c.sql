
-- Break RLS recursion between groups <-> group_members using SECURITY DEFINER helpers.
CREATE OR REPLACE FUNCTION public.is_group_teacher(_group_id uuid, _user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.groups WHERE id = _group_id AND teacher_id = _user_id
  )
$$;

CREATE OR REPLACE FUNCTION public.is_group_member(_group_id uuid, _user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.group_members
    WHERE group_id = _group_id AND student_id = _user_id
  )
$$;

REVOKE EXECUTE ON FUNCTION public.is_group_teacher(uuid, uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.is_group_member(uuid, uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_group_teacher(uuid, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_group_member(uuid, uuid) TO authenticated;

-- Recreate offending SELECT policies using the helpers.
DROP POLICY IF EXISTS "View groups" ON public.groups;
CREATE POLICY "View groups" ON public.groups
FOR SELECT TO authenticated
USING (
  teacher_id = auth.uid()
  OR public.has_role(auth.uid(), 'admin'::app_role)
  OR public.is_group_member(id, auth.uid())
);

DROP POLICY IF EXISTS "View group members" ON public.group_members;
CREATE POLICY "View group members" ON public.group_members
FOR SELECT TO authenticated
USING (
  student_id = auth.uid()
  OR public.has_role(auth.uid(), 'admin'::app_role)
  OR public.is_group_teacher(group_id, auth.uid())
);

-- Same recursion risk for INSERT/DELETE policies on group_members that reference groups:
-- they're WITH CHECK / USING expressions that read groups; safe to switch to helper too.
DROP POLICY IF EXISTS "Add group members" ON public.group_members;
CREATE POLICY "Add group members" ON public.group_members
FOR INSERT TO authenticated
WITH CHECK (
  public.has_role(auth.uid(), 'admin'::app_role)
  OR public.is_group_teacher(group_id, auth.uid())
);

DROP POLICY IF EXISTS "Remove group members" ON public.group_members;
CREATE POLICY "Remove group members" ON public.group_members
FOR DELETE TO authenticated
USING (
  public.has_role(auth.uid(), 'admin'::app_role)
  OR public.is_group_teacher(group_id, auth.uid())
);

-- group_codes policies also EXISTS into groups; rewrite via helper for consistency.
DROP POLICY IF EXISTS "Teachers and admins view group codes" ON public.group_codes;
CREATE POLICY "Teachers and admins view group codes" ON public.group_codes
FOR SELECT TO authenticated
USING (
  public.has_role(auth.uid(), 'admin'::app_role)
  OR public.is_group_teacher(group_id, auth.uid())
);

DROP POLICY IF EXISTS "Teachers and admins manage group codes insert" ON public.group_codes;
CREATE POLICY "Teachers and admins manage group codes insert" ON public.group_codes
FOR INSERT TO authenticated
WITH CHECK (
  public.has_role(auth.uid(), 'admin'::app_role)
  OR public.is_group_teacher(group_id, auth.uid())
);

DROP POLICY IF EXISTS "Teachers and admins manage group codes update" ON public.group_codes;
CREATE POLICY "Teachers and admins manage group codes update" ON public.group_codes
FOR UPDATE TO authenticated
USING (
  public.has_role(auth.uid(), 'admin'::app_role)
  OR public.is_group_teacher(group_id, auth.uid())
);
