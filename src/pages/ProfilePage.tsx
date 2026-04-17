import { useEffect, useState } from "react";
import { GraduationCap, Mail, Award, BarChart3, Save, Loader2, BookOpen } from "lucide-react";
import { courses } from "@/data/courses";
import { useAuth } from "@/contexts/AuthContext";
import { useUserRole } from "@/hooks/useUserRole";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { JoinClassCard } from "@/components/JoinClassCard";
import { TeacherClassCodes } from "@/components/TeacherClassCodes";

const ProfilePage = () => {
  const { profile, user, refreshProfile } = useAuth();
  const { isTeacher, isStudent, isAdmin } = useUserRole();
  const [editing, setEditing] = useState(false);
  const [fullName, setFullName] = useState(profile?.full_name || "");
  const [saving, setSaving] = useState(false);
  const [progressMap, setProgressMap] = useState<Record<string, number>>({});

  useEffect(() => {
    const loadProgress = async () => {
      if (!user) return;
      const { data } = await supabase
        .from("lesson_progress")
        .select("course_id, progress_pct")
        .eq("student_id", user.id);
      if (!data) return;
      const acc: Record<string, { sum: number; count: number }> = {};
      data.forEach((r) => {
        if (!acc[r.course_id]) acc[r.course_id] = { sum: 0, count: 0 };
        acc[r.course_id].sum += r.progress_pct || 0;
        acc[r.course_id].count += 1;
      });
      const result: Record<string, number> = {};
      Object.entries(acc).forEach(([k, v]) => {
        result[k] = Math.round(v.sum / v.count);
      });
      setProgressMap(result);
    };
    loadProgress();
  }, [user]);

  const initials = profile?.full_name
    ? profile.full_name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()
    : "?";

  const roleLabel = isAdmin ? "Администратор" : isTeacher ? "Учитель" : "Ученик";

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({ full_name: fullName })
      .eq("user_id", user.id);
    if (error) {
      toast.error("Ошибка сохранения");
    } else {
      toast.success("Профиль обновлён!");
      await refreshProfile();
      setEditing(false);
    }
    setSaving(false);
  };

  return (
    <div className="max-w-[800px] mx-auto px-4 md:px-8 py-8 animate-fade-in">
      <h1 className="text-2xl md:text-3xl font-serif font-semibold text-foreground mb-6">Профиль</h1>

      <div className="bg-card border border-border rounded-xl p-6 mb-6 flex flex-col sm:flex-row items-center gap-5">
        <div className="w-20 h-20 rounded-full bg-accent flex items-center justify-center text-accent-foreground text-2xl font-serif font-semibold shrink-0">
          {initials}
        </div>
        <div className="text-center sm:text-left flex-1">
          {editing ? (
            <div className="space-y-3">
              <div>
                <Label className="text-xs">Полное имя</Label>
                <Input value={fullName} onChange={e => setFullName(e.target.value)} className="mt-1" />
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={handleSave} disabled={saving}>
                  {saving ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Save className="h-4 w-4 mr-1" />}
                  Сохранить
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setEditing(false)}>Отмена</Button>
              </div>
            </div>
          ) : (
            <>
              <h2 className="text-lg font-serif font-semibold text-foreground">{profile?.full_name || "Имя не указано"}</h2>
              <div className="flex flex-wrap justify-center sm:justify-start gap-3 text-xs text-muted-foreground mt-2">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-accent/10 text-accent rounded-full font-medium">
                  {isTeacher ? <BookOpen size={12} /> : <GraduationCap size={12} />}
                  {roleLabel}
                </span>
                {isStudent && profile?.assigned_class && (
                  <span className="flex items-center gap-1"><GraduationCap size={14} />{profile.assigned_class} класс</span>
                )}
                {isTeacher && (profile as any)?.subject && (
                  <span className="flex items-center gap-1"><BookOpen size={14} />{(profile as any).subject}</span>
                )}
                <span className="flex items-center gap-1"><Mail size={14} />{profile?.email || user?.email}</span>
              </div>
              <button onClick={() => { setFullName(profile?.full_name || ""); setEditing(true); }} className="text-xs text-accent hover:underline mt-2">
                Редактировать
              </button>
            </>
          )}
        </div>
      </div>

      {/* Teacher: show class codes; Student: join-by-code form */}
      {user && isTeacher && <TeacherClassCodes teacherId={user.id} />}
      {user && isStudent && <JoinClassCard userId={user.id} />}

      <h3 className="text-base font-serif font-medium text-foreground mb-3 flex items-center gap-2">
        <Award size={18} className="text-accent" /> Достижения
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
        {[
          { emoji: "🚀", label: "Первый урок" },
          { emoji: "🔥", label: "Стрик 3 дня" },
          { emoji: "🧪", label: "Квиз-мастер" },
        ].map((a) => (
          <div key={a.label} className="bg-card border border-border rounded-xl p-4 text-center">
            <div className="text-2xl mb-1">{a.emoji}</div>
            <p className="text-xs font-medium text-foreground">{a.label}</p>
          </div>
        ))}
      </div>

      <h3 className="text-base font-serif font-medium text-foreground mb-3 flex items-center gap-2">
        <BarChart3 size={18} className="text-accent" /> Прогресс по курсам
      </h3>
      <div className="space-y-3">
        {courses.map((c) => {
          const pct = Math.floor(Math.random() * 30);
          return (
            <div key={c.id} className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">{c.name}</span>
                <span className="text-xs text-muted-foreground">{pct}%</span>
              </div>
              <div className="w-full h-2 bg-border rounded-full overflow-hidden">
                <div className="h-full bg-accent rounded-full transition-all" style={{ width: `${pct}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProfilePage;
