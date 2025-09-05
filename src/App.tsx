import { Outlet } from "react-router-dom";
import { Toaster } from "sonner";
import { SidebarProvider, SidebarTrigger } from "./components/ui/sidebar";
import { Navigation } from "./components/AppSideBar";
import { ThemeProvider } from "./components/ThemeProvider";

export const App = () => {
  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col px-4 sm:px-6 xl:px-8 w-full">
        <SidebarProvider>
          <Navigation />

          <main className="bg-[var(--sidebar)] text-[var(--sidebar-foreground)] rounded-lg px-4 sm:px-6 xl:px-8 grid grid-cols-4 sm:grid-cols-12 xl:grid-cols-24 p-5 gap-4 my-2 w-full">
            <div className="col-span-4 sm:col-span-12 xl:col-span-25 flex flex-col gap-4">
              <SidebarTrigger />

              <Outlet />
            </div>
          </main>
        </SidebarProvider>

        <Toaster />
      </div>
    </ThemeProvider>
  );
}