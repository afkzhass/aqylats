import { useLocation } from "react-router-dom";
import { Home, BookOpen, Library, User } from "lucide-react";
import { NavLink } from "@/components/NavLink";
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

  const isActive = (path: string) => {
    if (path === "/") return currentPath === "/";
    return currentPath.startsWith(path);
  };

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
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.url)}
                    tooltip={item.title}
                  >
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

      <SidebarFooter className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-accent-foreground text-xs font-medium shrink-0">
            АБ
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <p className="text-sidebar-foreground text-sm font-sans font-medium truncate">Айдар Бекетов</p>
              <p className="text-sidebar-foreground/50 text-[10px] font-sans">11 класс</p>
            </div>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}