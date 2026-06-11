import { useEffect, useState } from "react";
import { Hash, Copy, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface TeacherGroup {
  id: string;
  class_name: string;
  class_code: string | null;
  member_count: number;
}

export const TeacherClassCodes = ({ teacherId }: { teacherId: string }) => {
  const [groups, setGroups] = useState<TeacherGroup[]>([]);

  useEffect(() => {
    const load = async () => {
      const { data: gs } = await supabase
        .from("groups")
        .select("id, class_name")
        .eq("teacher_id", teacherId);
      if (!gs?.length) {
        setGroups([]);
        return;
      }
      const ids = gs.map((g) => g.id);

      const [{ data: members }, { data: codes }] = await Promise.all([
        supabase.from("group_members").select("group_id").in("group_id", ids),
        supabase.from("group_codes").select("group_id, class_code").in("group_id", ids),
      ]);

      const counts = new Map<string, number>();
      members?.forEach((m) => counts.set(m.group_id, (counts.get(m.group_id) || 0) + 1));
      const codeMap = new Map<string, string>();
      codes?.forEach((c) => codeMap.set(c.group_id, c.class_code));

      setGroups(
        gs.map((g) => ({
          id: g.id,
          class_name: g.class_name,
          class_code: codeMap.get(g.id) || null,
          member_count: counts.get(g.id) || 0,
        }))
      );
    };
    load();
  }, [teacherId]);

  const copy = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success(`Код ${code} скопирован`);
  };

  if (!groups.length) {
    return (
      <div className="bg-card border border-border rounded-xl p-5 mb-6">
        <h3 className="text-base font-serif font-medium text-foreground flex items-center gap-2 mb-2">
          <Hash size={16} className="text-accent" /> Коды моих классов
        </h3>
        <p className="text-sm text-muted-foreground">
          У вас пока нет классов. Создайте в разделе «Группы».
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-xl p-5 mb-6">
      <h3 className="text-base font-serif font-medium text-foreground flex items-center gap-2 mb-3">
        <Hash size={16} className="text-accent" /> Коды моих классов
      </h3>
      <p className="text-xs text-muted-foreground mb-3">
        Поделитесь кодом с учениками — они смогут привязаться к классу через свой профиль.
      </p>
      <div className="space-y-2">
        {groups.map((g) => (
          <div key={g.id} className="flex items-center justify-between gap-3 p-3 rounded-lg bg-muted/40 border border-border">
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{g.class_name}</p>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Users size={12} /> {g.member_count} учеников
              </p>
            </div>
            {g.class_code && (
              <button
                onClick={() => copy(g.class_code!)}
                className="font-mono font-semibold text-accent tracking-wider flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-accent/10 hover:bg-accent/20 transition-colors"
              >
                {g.class_code}
                <Copy size={12} />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
