import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useUserRole } from "@/hooks/useUserRole";
import { Plus, Users, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";

interface Group {
  id: string;
  class_name: string;
  teacher_id: string;
  created_at: string;
  member_count?: number;
}

const GroupsPage = () => {
  const { user } = useAuth();
  const { isAdmin, isTeacher } = useUserRole();
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [newClassName, setNewClassName] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [studentEmail, setStudentEmail] = useState("");

  const canManage = isAdmin || isTeacher;

  const fetchGroups = async () => {
    const { data } = await supabase.from("groups").select("*");
    if (data) setGroups(data);
    setLoading(false);
  };

  useEffect(() => { fetchGroups(); }, []);

  const createGroup = async () => {
    if (!newClassName.trim() || !user) return;
    const { error } = await supabase.from("groups").insert({
      class_name: newClassName.trim(),
      teacher_id: user.id,
    });
    if (error) {
      toast({ title: "Ошибка", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Группа создана" });
      setNewClassName("");
      setDialogOpen(false);
      fetchGroups();
    }
  };

  const deleteGroup = async (id: string) => {
    const { error } = await supabase.from("groups").delete().eq("id", id);
    if (!error) {
      toast({ title: "Группа удалена" });
      fetchGroups();
    }
  };

  const fetchMembers = async (groupId: string) => {
    const { data } = await supabase
      .from("group_members")
      .select("id, student_id, joined_at")
      .eq("group_id", groupId);
    
    if (data && data.length > 0) {
      const studentIds = data.map(m => m.student_id);
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, full_name, email")
        .in("user_id", studentIds);
      
      const enriched = data.map(m => ({
        ...m,
        profile: profiles?.find(p => p.user_id === m.student_id),
      }));
      setMembers(enriched);
    } else {
      setMembers([]);
    }
  };

  const addStudent = async () => {
    if (!studentEmail.trim() || !selectedGroup) return;
    const { data: profile } = await supabase
      .from("profiles")
      .select("user_id")
      .eq("email", studentEmail.trim())
      .single();
    
    if (!profile) {
      toast({ title: "Ученик не найден", variant: "destructive" });
      return;
    }

    const { error } = await supabase.from("group_members").insert({
      group_id: selectedGroup.id,
      student_id: profile.user_id,
    });

    if (error) {
      toast({ title: "Ошибка", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Ученик добавлен" });
      setStudentEmail("");
      fetchMembers(selectedGroup.id);
    }
  };

  const removeMember = async (memberId: string) => {
    await supabase.from("group_members").delete().eq("id", memberId);
    if (selectedGroup) fetchMembers(selectedGroup.id);
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="max-w-[1000px] mx-auto px-4 md:px-8 py-8 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-serif font-semibold text-foreground">Группы</h1>
          <p className="text-sm text-muted-foreground">Управление классами и учениками</p>
        </div>
        {canManage && (
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2"><Plus size={16} /> Новая группа</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Создать группу</DialogTitle></DialogHeader>
              <Input
                placeholder="Название класса, напр. 9 'Б'"
                value={newClassName}
                onChange={e => setNewClassName(e.target.value)}
              />
              <Button onClick={createGroup}>Создать</Button>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {groups.map(g => (
          <div
            key={g.id}
            className="bg-card border border-border rounded-xl p-5 cursor-pointer hover:shadow-md transition-all"
            onClick={() => { setSelectedGroup(g); fetchMembers(g.id); }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Users size={20} className="text-accent" />
                </div>
                <div>
                  <p className="font-medium text-foreground">{g.class_name}</p>
                  <p className="text-xs text-muted-foreground">Создана {new Date(g.created_at).toLocaleDateString("ru")}</p>
                </div>
              </div>
              {isAdmin && (
                <button onClick={e => { e.stopPropagation(); deleteGroup(g.id); }} className="text-muted-foreground hover:text-destructive">
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          </div>
        ))}
        {groups.length === 0 && <p className="text-muted-foreground col-span-2 text-center py-8">Нет групп</p>}
      </div>

      {selectedGroup && (
        <div className="mt-8 bg-card border border-border rounded-xl p-6">
          <h2 className="text-lg font-serif font-medium text-foreground mb-4">
            Ученики: {selectedGroup.class_name}
          </h2>
          {canManage && (
            <div className="flex gap-2 mb-4">
              <Input
                placeholder="Email ученика"
                value={studentEmail}
                onChange={e => setStudentEmail(e.target.value)}
                className="max-w-xs"
              />
              <Button onClick={addStudent} size="sm">Добавить</Button>
            </div>
          )}
          <div className="space-y-2">
            {members.map(m => (
              <div key={m.id} className="flex items-center justify-between py-2 px-3 rounded-lg bg-muted/50">
                <div>
                  <p className="text-sm font-medium text-foreground">{m.profile?.full_name || "—"}</p>
                  <p className="text-xs text-muted-foreground">{m.profile?.email}</p>
                </div>
                {canManage && (
                  <button onClick={() => removeMember(m.id)} className="text-muted-foreground hover:text-destructive">
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            ))}
            {members.length === 0 && <p className="text-sm text-muted-foreground">Нет учеников в группе</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupsPage;
