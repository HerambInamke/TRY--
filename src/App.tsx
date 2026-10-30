import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { HelmetProvider } from "react-helmet-async";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { ThemeProvider } from "@/hooks/use-theme";
import { AuthProvider } from "@/hooks/use-auth";
import Preloader from "@/components/Preloader";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import HerTechEraSite from "./hte/HerTechEraSite";
import { initFirebase, trackPageView } from "@/lib/firebase";
import NotificationPrompt from "@/components/NotificationPrompt";
import ProfileCompletionModal from "@/components/ProfileCompletionModal";
import EventMarquee from "@/components/EventMarquee";
import ScrollProgress from "@/components/ScrollProgress";
import GlobalCursorTrail from "@/components/GlobalCursorTrail";
import { useAuth } from "@/hooks/use-auth";

const queryClient = new QueryClient();

/**
 * Pages still on the previous design. They keep the old global chrome
 * (preloader, events ticker, scroll bar, cursor trail); the new story pages bring their own.
 */
const LEGACY_PATHS = ['/dashboard'];
const isLegacyPath = (pathname: string) =>
  LEGACY_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`));

/** Tracks page views on every route change via Firebase Analytics */
const RouteTracker = () => {
  const location = useLocation();

  useEffect(() => {
    trackPageView(location.pathname);
  }, [location]);

  return null;
};

const App = () => {
  const [showPreloader, setShowPreloader] = useState(true);
  const [hasSeenPreloader, setHasSeenPreloader] = useState(false);

  useEffect(() => {
    // Check if user has already seen the preloader in this session
    const seen = sessionStorage.getItem('preloaderSeen');
    // The story pages open straight onto their first chapter, with no loading screen
    if (seen || !isLegacyPath(window.location.pathname)) {
      setShowPreloader(false);
      setHasSeenPreloader(true);
    }
  }, []);

  // Initialise Firebase services once on mount
  useEffect(() => {
    initFirebase();
  }, []);

  const handlePreloaderComplete = () => {
    setShowPreloader(false);
    setHasSeenPreloader(true);
    sessionStorage.setItem('preloaderSeen', 'true');
  };

  return (
    <HelmetProvider>
      <ThemeProvider>
        <AuthProvider>
          <QueryClientProvider client={queryClient}>
            <TooltipProvider>
              {showPreloader && !hasSeenPreloader && (
                <Preloader onComplete={handlePreloaderComplete} />
              )}
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <RouteTracker />
                <AppShell />
              </BrowserRouter>
              <NotificationPrompt preloaderDone={hasSeenPreloader} />
            </TooltipProvider>
          </QueryClientProvider>
        </AuthProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
};

/** Inner shell that has access to AuthProvider context */
const AppShell = () => {
  const { needsProfileCompletion, user } = useAuth();
  const [showProfileModal, setShowProfileModal] = useState(false);

  // Show profile completion modal after login if needed
  useEffect(() => {
    if (user && needsProfileCompletion) {
      // Small delay so it doesn't flash on page load
      const timer = setTimeout(() => setShowProfileModal(true), 1000);
      return () => clearTimeout(timer);
    } else {
      setShowProfileModal(false);
    }
  }, [user, needsProfileCompletion]);

  const location = useLocation();
  const legacy = isLegacyPath(location.pathname);

  return (
    <>
      {legacy && <EventMarquee />}
      {legacy && <ScrollProgress />}
      {legacy && <GlobalCursorTrail />}
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Index />} />
          <Route path="/her-tech-era" element={<HerTechEraSite />} />
          <Route path="/dashboard/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AnimatePresence>
      <ProfileCompletionModal
        open={showProfileModal}
        onClose={() => setShowProfileModal(false)}
      />
    </>
  );
};

export default App;

