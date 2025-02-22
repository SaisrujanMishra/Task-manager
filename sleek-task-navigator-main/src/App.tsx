
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Index from "./pages/Index";
import Track from "./pages/Track";
import Settings from "./pages/Settings";
import Help from "./pages/Help";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Only show loading state on initial load
  if (isAuthenticated === null) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <SidebarProvider>
            <div className="flex min-h-screen w-full">
              {isAuthenticated && <AppSidebar />}
              <main className="flex-1">
                <Routes>
                  <Route 
                    path="/" 
                    element={
                      isAuthenticated ? <Navigate to="/track" replace /> : <Index />
                    } 
                  />
                  <Route 
                    path="/track" 
                    element={
                      isAuthenticated ? <Track /> : <Navigate to="/auth" replace />
                    } 
                  />
                  <Route 
                    path="/settings" 
                    element={
                      isAuthenticated ? <Settings /> : <Navigate to="/auth" replace />
                    } 
                  />
                  <Route 
                    path="/help" 
                    element={
                      isAuthenticated ? <Help /> : <Navigate to="/auth" replace />
                    } 
                  />
                  <Route 
                    path="/auth" 
                    element={
                      !isAuthenticated ? <Auth /> : <Navigate to="/track" replace />
                    } 
                  />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
            </div>
          </SidebarProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
