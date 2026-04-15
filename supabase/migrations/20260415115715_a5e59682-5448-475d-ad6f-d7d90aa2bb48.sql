
-- Add subject column to profiles for teachers
ALTER TABLE public.profiles ADD COLUMN subject text DEFAULT NULL;

-- Allow admins to view all profiles (for leaderboard, admin panel)
CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Teachers can view profiles of students in their groups
CREATE POLICY "Teachers can view group student profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (
  public.has_role(auth.uid(), 'teacher'::app_role)
  AND EXISTS (
    SELECT 1 FROM public.group_members gm
    JOIN public.groups g ON g.id = gm.group_id
    WHERE gm.student_id = profiles.user_id
    AND g.teacher_id = auth.uid()
  )
);

-- Create teacher_stats table for leaderboard
CREATE TABLE public.teacher_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id uuid NOT NULL,
  avg_student_score numeric DEFAULT 0,
  topics_covered_pct numeric DEFAULT 0,
  interactive_lessons_count integer DEFAULT 0,
  updated_at timestamp with time zone DEFAULT now(),
  UNIQUE(teacher_id)
);

ALTER TABLE public.teacher_stats ENABLE ROW LEVEL SECURITY;

-- Anyone authenticated can view teacher stats (depersonalized leaderboard)
CREATE POLICY "Authenticated users can view teacher stats"
ON public.teacher_stats
FOR SELECT
TO authenticated
USING (true);

-- Teachers can update their own stats
CREATE POLICY "Teachers update own stats"
ON public.teacher_stats
FOR UPDATE
TO authenticated
USING (teacher_id = auth.uid());

-- Admins can manage all stats
CREATE POLICY "Admins manage all stats"
ON public.teacher_stats
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Insert policy for teacher stats
CREATE POLICY "Teachers insert own stats"
ON public.teacher_stats
FOR INSERT
TO authenticated
WITH CHECK (teacher_id = auth.uid() OR public.has_role(auth.uid(), 'admin'::app_role));
