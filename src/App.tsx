import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import Calendar from "./pages/Calendar";
import Bag from "./pages/Bag";
import Login from "./pages/Login";
import { useEffect, useState } from "react";
import { supabase } from "./integrations/supabase/client";
import { Session } from "@supabase/supabase-js";

const queryClient = new QueryClient();

const App = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load and apply saved preferences
    const backgroundColor = localStorage.getItem("backgroundColor");
    const fontColor = localStorage.getItem("fontColor");
    const backgroundUrl = localStorage.getItem("backgroundUrl");

    if (backgroundColor) {
      document.body.style.backgroundColor = backgroundColor;
    }
    if (fontColor) {
      document.body.style.color = fontColor;
    }
    if (backgroundUrl) {
      document.body.style.backgroundImage = `url(${backgroundUrl})`;
      document.body.style.backgroundSize = 'cover';
      document.body.style.backgroundPosition = 'center';
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen flex flex-col">
            <div className="flex-1">
              <Routes>
                <Route
                  path="/login"
                  element={
                    session ? <Navigate to="/" replace /> : <Login />
                  }
                />
                <Route
                  path="/"
                  element={
                    session ? (
                      <Calendar />
                    ) : (
                      <Navigate to="/login" replace />
                    )
                  }
                />
                <Route
                  path="/bag"
                  element={
                    session ? <Bag /> : <Navigate to="/login" replace />
                  }
                />
              </Routes>
            </div>
            {session && <Navbar />}
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;