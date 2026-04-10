import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useUserRole } from "@/hooks/useUserRole";
import { Shield, Users, BookOpen } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Navigate } from "react-router-dom";

interface UserWithRole {
  user_id: string;
  full_name: string;
  email: string;
  roles: string[];
}

const AdminPage = () => {
  const { isAdmin, loading: roleLoading } = useUserRole();
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ users: 0, groups: 0, assignments: 0 });

  const fetchUsers = async () => {
    const { data: profiles } = await supabase.from("profiles").select("user_id, full_name, email");
    const { data: roles } = await supabase.from("user_roles").select("user_id, role");

    if (profiles) {
      const mapped = profiles.map(p => ({
        ...p,
        roles: (roles || []).filter(r => r.user_id === p.user_id).map(r => r.role),
      }));
      setUsers(mapped);
      setStats(prev => ({ ...prev, users: mapped.length }));
    }
    setLoading(false);
  };

  const fetchStats = async () => {
    const [{ count: gc }, { count: ac }] = await Promise.all([
      supabase.from("groups").select("*", { count: "exact", head: true }),
      supabase.from("homework_assignments").select("*", { count: "exact", head: true }),
    ]);
    setStats(prev => ({ ...prev, groups: gc || 0, assignments: ac || 0 }));
  };

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
      fetchStats();
    }
  }, [isAdmin]);

  const changeRole = async (userId: string, newRole: string) => {
    // Remove old roles, add new one
    await supabase.from("user_roles").delete().eq("user_id", userId);
    const { error } = await supabase.from("user_roles").insert({ user_id: userId, role: newRole as any });
    if (error) {
      toast({ title: "Ошибка", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Роль обновлена" });
      fetchUsers();
    }
  };

  if (roleLoading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin" /></div>;
  if (!isAdmin) return <Navigate to="/" replace />;

  return (
    <div className="max-w-[1000px] mx-auto px-4 md:px-8 py-8 animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-serif font-semibold text-foreground">Панель администратора</h1>
        <p className="text-sm text-muted-foreground">Управление пользователями и платформой</p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { icon: Users, label: "Пользователи", value: stats.users },
          { icon: Users, label: "Группы", value: stats.groups },
          { icon: BookOpen, label: "Задания", value: stats.assignments },
        ].map(s => (
          <div key={s.label} className="bg-card border border-border rounded-xl p-4">
            <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center mb-2">
              <s.icon size={18} className="text-accent" />
            </div>
            <div className="text-xl font-semibold text-foreground">{s.value}</div>
            <div className="text-xs text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>

      <h2 className="text-lg font-serif font-medium text-foreground mb-4">Пользователи</h2>
      {loading ? (
        <div className="flex justify-center py-8"><div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin" /></div>
      ) : (
        <div className="space-y-2">
          {users.map(u => (
            <div key={u.user_id} className="flex items-center justify-between bg-card border border-border rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-accent/10 flex items-center justify-center">
                  <Shield size={16} className="text-accent" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{u.full_name || "—"}</p>
                  <p className="text-xs text-muted-foreground">{u.email}</p>
                </div>
              </div>
              <Select value={u.roles[0] || "student"} onValueChange={v => changeRole(u.user_id, v)}>
                <SelectTrigger className="w-36">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">Ученик</SelectItem>
                  <SelectItem value="teacher">Учитель</SelectItem>
                  <SelectItem value="admin">Администратор</SelectItem>
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminPage;
