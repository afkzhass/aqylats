import { useLocation } from "react-router-dom";
import { Home, BookOpen, Library, User, LogOut } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useAuth } from "@/contexts/AuthContext";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";

const navItems = [
  { title: "Главная", url: "/", icon: Home },
  { title: "Мои курсы", url: "/courses", icon: BookOpen },
  { title: "Библиотека", url: "/library", icon: Library },
  { title: "Профиль", url: "/profile", icon: User },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const currentPath = location.pathname;
  const { profile, user, signOut } = useAuth();

  const isActive = (path: string) => {
    if (path === "/") return currentPath === "/";
    return currentPath.startsWith(path);
  };

  const initials = profile?.full_name
    ? profile.full_name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()
    : user?.email?.[0]?.toUpperCase() || "?";

  const displayName = profile?.full_name || user?.email || "Ученик";
  const classLabel = profile?.assigned_class ? `${profile.assigned_class} класс` : "";

  return (
    <Sidebar collapsible="icon" className="border-r-0">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-accent rounded-xl flex items-center justify-center text-accent-foreground font-semibold text-sm font-serif shrink-0">
            A
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <div className="text-sidebar-foreground text-base font-serif font-semibold tracking-wide leading-tight">
                Aqyl AI
              </div>
              <span className="text-sidebar-foreground/50 text-[10px] font-sans font-light tracking-widest uppercase">
                Білім платформасы
              </span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)} tooltip={item.title}>
                    <NavLink
                      to={item.url}
                      end={item.url === "/"}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
                      activeClassName="bg-sidebar-accent text-sidebar-foreground font-medium"
                    >
                      <item.icon className="h-5 w-5 shrink-0" />
                      {!collapsed && <span className="text-sm font-sans">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 space-y-2">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-accent-foreground text-xs font-medium shrink-0">
            {initials}
          </div>
          {!collapsed && (
            <div className="overflow-hidden flex-1">
              <p className="text-sidebar-foreground text-sm font-sans font-medium truncate">{displayName}</p>
              {classLabel && <p className="text-sidebar-foreground/50 text-[10px] font-sans">{classLabel}</p>}
            </div>
          )}
        </div>
        {!collapsed && (
          <button
            onClick={signOut}
            className="flex items-center gap-2 text-xs text-sidebar-foreground/50 hover:text-destructive transition-colors w-full px-1"
          >
            <LogOut className="h-3.5 w-3.5" /> Выйти
          </button>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
