import { useEffect, useState } from "react";
import { Hash, Loader2, Users, LogIn } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface JoinedGroup {
  id: string;
  class_name: string;
  teacher_name: string | null;
}

export const JoinClassCard = ({ userId }: { userId: string }) => {
  const [code, setCode] = useState("");
  const [joining, setJoining] = useState(false);
  const [groups, setGroups] = useState<JoinedGroup[]>([]);

  const loadGroups = async () => {
    const { data: members } = await supabase
      .from("group_members")
      .select("group_id")
      .eq("student_id", userId);

    if (!members?.length) {
      setGroups([]);
      return;
    }
    const groupIds = members.map((m) => m.group_id);
    const { data: gs } = await supabase
      .from("groups")
      .select("id, class_name, teacher_id")
      .in("id", groupIds);

    if (!gs?.length) {
      setGroups([]);
      return;
    }

    const teacherIds = gs.map((g) => g.teacher_id);
    const { data: profs } = await supabase
      .from("profiles")
      .select("user_id, full_name")
      .in("user_id", teacherIds);

    setGroups(
      gs.map((g) => ({
        id: g.id,
        class_name: g.class_name,
        teacher_name: profs?.find((p) => p.user_id === g.teacher_id)?.full_name || null,
      }))
    );
  };

  useEffect(() => {
    loadGroups();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const handleJoin = async () => {
    const trimmed = code.trim().toUpperCase();
    if (trimmed.length !== 6) {
      toast.error("Код должен быть 6 символов");
      return;
    }
    setJoining(true);
    const { data, error } = await supabase.rpc("join_group_by_code", { _code: trimmed });
    setJoining(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    const result = data as { success: boolean; error?: string; class_name?: string };
    if (!result.success) {
      toast.error(result.error || "Не удалось присоединиться");
      return;
    }
    toast.success(`Вы присоединились к классу: ${result.class_name}`);
    setCode("");
    loadGroups();
  };

  return (
    <div className="bg-card border border-border rounded-xl p-5 mb-6">
      <h3 className="text-base font-serif font-medium text-foreground flex items-center gap-2 mb-2">
        <Hash size={16} className="text-accent" /> Присоединиться к классу
      </h3>
      <p className="text-xs text-muted-foreground mb-3">
        Введите 6-значный код, который дал учитель.
      </p>
      <div className="flex gap-2 mb-4">
        <Input
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="ABC123"
          maxLength={6}
          className="font-mono uppercase tracking-widest"
        />
        <Button onClick={handleJoin} disabled={joining || code.length !== 6} className="gap-1">
          {joining ? <Loader2 size={14} className="animate-spin" /> : <LogIn size={14} />}
          Войти
        </Button>
      </div>

      {groups.length > 0 && (
        <div className="border-t border-border pt-3">
          <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
            <Users size={12} /> Мои классы
          </p>
          <div className="space-y-1.5">
            {groups.map((g) => (
              <div key={g.id} className="flex items-center justify-between text-sm py-1">
                <span className="font-medium text-foreground">{g.class_name}</span>
                {g.teacher_name && (
                  <span className="text-xs text-muted-foreground">учитель: {g.teacher_name}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
