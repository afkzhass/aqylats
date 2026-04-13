import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Outlet } from "react-router-dom";
import LanguagePicker from "@/components/LanguagePicker";
import { useLanguage } from "@/contexts/LanguageContext";

const AppLayout = () => {
  const { t } = useLanguage();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background font-sans">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-12 flex items-center border-b border-border px-4 bg-card sticky top-0 z-40">
            <SidebarTrigger className="mr-3" />
            <span className="text-xs text-muted-foreground font-sans flex-1">{t("platform.name")}</span>
            <LanguagePicker />
          </header>
          <main className="flex-1 overflow-y-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AppLayout;
