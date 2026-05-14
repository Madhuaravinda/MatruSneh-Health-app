/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "@/src/components/layout/Layout";
import ErrorBoundary from "@/src/components/ui/ErrorBoundary";
import React from "react";
import { UserProvider, useUser } from "@/src/contexts/UserContext";

// Regular imports for better offline reliability
import HomePage from "./pages/HomePage";
import KickCounterPage from "./pages/KickCounterPage";
import NutritionPage from "./pages/NutritionPage";
import JourneyPage from "./pages/JourneyPage";
import MorePage from "./pages/MorePage";
import HealthAlertsPage from "./pages/HealthAlertsPage";
import OnboardingPage from "./pages/OnboardingPage";
import HealthSummaryPage from "./pages/HealthSummaryPage";
import SettingsPage from "./pages/SettingsPage";
import KickHistoryPage from "./pages/KickHistoryPage";
import AppointmentsPage from "./pages/AppointmentsPage";
import EmergencyContactsPage from "./pages/EmergencyContactsPage";

function AppRoutes() {
  const { user } = useUser();

  // If user hasn't completed onboarding, show onboarding
  if (!user.onboardingComplete) {
    return (
      <Routes>
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="*" element={<Navigate to="/onboarding" replace />} />
      </Routes>
    );
  }

  // User has completed onboarding, show main app routes
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/kick-counter" element={<KickCounterPage />} />
        <Route path="/kick-history" element={<KickHistoryPage />} />
        <Route path="/nutrition" element={<NutritionPage />} />
        <Route path="/journey" element={<JourneyPage />} />
        <Route path="/more" element={<MorePage />} />
        <Route path="/health-alerts" element={<HealthAlertsPage />} />
        <Route path="/health-summary" element={<HealthSummaryPage />} />
        <Route path="/appointment" element={<AppointmentsPage />} />
        <Route path="/emergency-contacts" element={<EmergencyContactsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <UserProvider>
        <Router>
          <AppRoutes />
        </Router>
      </UserProvider>
    </ErrorBoundary>
  );
}

