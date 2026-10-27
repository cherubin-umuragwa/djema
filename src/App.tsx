import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastProvider } from '@/components/common/ToastProvider';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';

import { HomePage } from '@/pages/HomePage';
import { PostRequestPage } from '@/pages/PostRequestPage';
import { MatchesPage } from '@/pages/MatchesPage';
import { BoardPage } from '@/pages/BoardPage';
import { RegisterPage } from '@/pages/RegisterPage';
import { LoginPage } from '@/pages/LoginPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { EditProfilePage } from '@/pages/EditProfilePage';
import { ProviderProfilePage } from '@/pages/ProviderProfilePage';
import { NotFoundPage } from '@/pages/NotFoundPage';

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/post-request" element={<PostRequestPage />} />
          <Route path="/matches/:requestId" element={<MatchesPage />} />
          <Route path="/board" element={<BoardPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile/edit"
            element={
              <ProtectedRoute>
                <EditProfilePage />
              </ProtectedRoute>
            }
          />
          <Route path="/providers/:id" element={<ProviderProfilePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        <Footer />
      </ToastProvider>
    </BrowserRouter>
  );
}
