/**
 * ============================================================================
 * MAIN APPLICATION COMPONENT - App.tsx
 * ============================================================================
 * 
 * This is the root component that sets up routing and authentication.
 * It wraps the entire app with BrowserRouter and AuthProvider.
 * 
 * المكون الرئيسي للتطبيق - App.tsx
 * هذا هو المكون الجذري الذي يقوم بإعداد التوجيه والمصادقة.
 * يقوم بتغليف التطبيق بالكامل بـ BrowserRouter و AuthProvider.
 * 
 * ============================================================================
 * FLOW:
 * 1. App renders → wraps app with BrowserRouter and AuthProvider
 * 2. AuthProvider initializes → loads user from storage, sets up event listeners
 * 3. Routes are defined → public routes (login, callback) and protected routes
 * 4. ProtectedRoute checks auth → redirects to /login if not authenticated
 * 5. Login page → user clicks login → redirects to Identity Server
 * 6. Identity Server → user authenticates → redirects back to /auth/callback
 * 7. AuthCallback → processes callback → redirects to returnUrl
 * 
 * التدفق:
 * 1. App يتم عرضه → يغلف التطبيق بـ BrowserRouter و AuthProvider
 * 2. AuthProvider يتم تهيئته → يحمل المستخدم من التخزين، يعد مستمعي الأحداث
 * 3. يتم تعريف المسارات → مسارات عامة (تسجيل الدخول، الاستدعاء) ومسارات محمية
 * 4. ProtectedRoute يتحقق من المصادقة → يعيد التوجيه إلى /login إذا لم يكن مصادقاً
 * 5. صفحة تسجيل الدخول → المستخدم ينقر على تسجيل الدخول → يعيد التوجيه إلى خادم الهوية
 * 6. خادم الهوية → المستخدم يتم التحقق منه → يعيد التوجيه إلى /auth/callback
 * 7. AuthCallback → يعالج الاستدعاء → يعيد التوجيه إلى returnUrl
 * ============================================================================
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import Login from './auth/Login';
import AuthCallback from './auth/AuthCallback';
import SilentRenew from './auth/SilentRenew';
import ProtectedRoute from './auth/ProtectedRoute';
import { AuthProvider, useAuth } from './auth/contexts/AuthContext';
import Game from './Game';

/**
 * AppHeader Component
 * Displays navigation links and authentication status
 * Shows "Sign in" link if not authenticated, "Sign out" button if authenticated
 * 
 * مكون AppHeader
 * يعرض روابط التنقل وحالة المصادقة
 * يعرض رابط "تسجيل الدخول" إذا لم يكن مصادقاً، زر "تسجيل الخروج" إذا كان مصادقاً
 */
const AppHeader: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();

  return (
    <header style={{ display: 'flex', gap: 12, padding: 12, alignItems: 'center' }}>
      <Link to="/">Home</Link>
      <Link to="/game">Game Demo</Link>
      <div style={{ marginLeft: 'auto' }}>
        {isAuthenticated ? (
          <button onClick={logout}>Sign out</button>
        ) : (
          <Link to="/login">Sign in</Link>
        )}
      </div>
    </header>
  );
};

/**
 * Main App Component
 * Sets up the application structure with routing and authentication
 * 
 * المكون الرئيسي للتطبيق
 * يقوم بإعداد بنية التطبيق مع التوجيه والمصادقة
 */
const App: React.FC = () => (
  <BrowserRouter>
    {/* 
      AuthProvider wraps the entire app to provide authentication context
      All child components can access auth state via useAuth() hook
      
      AuthProvider يغلف التطبيق بالكامل لتوفير سياق المصادقة
      يمكن لجميع المكونات الفرعية الوصول إلى حالة المصادقة عبر hook useAuth()
    */}
    <AuthProvider>
      <div className="App">
        <AppHeader />
        <main className="app-content">
          <Routes>
            {/* 
              PUBLIC ROUTES - No authentication required
              These routes are accessible to everyone
              
              المسارات العامة - لا تتطلب المصادقة
              هذه المسارات متاحة للجميع
            */}
            <Route path="/login" element={<Login />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/silent-renew" element={<SilentRenew />} />

            {/* 
              PROTECTED ROUTES - Require authentication
              ProtectedRoute component checks if user is authenticated
              If not authenticated, redirects to /login and saves returnUrl
              
              المسارات المحمية - تتطلب المصادقة
              مكون ProtectedRoute يتحقق من أن المستخدم مصادق عليه
              إذا لم يكن مصادقاً، يعيد التوجيه إلى /login ويحفظ returnUrl
            */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <div style={{ padding: 24 }}>
                    <h1>Welcome</h1>
                    <p>This area is protected. Use the header to explore.</p>
                  </div>
                </ProtectedRoute>
              }
            />
            <Route
              path="/game"
              element={
                <ProtectedRoute>
                  <Game />
                </ProtectedRoute>
              }
            />

            {/* 
              CATCH-ALL ROUTE - Redirects unknown paths to home
              Any URL that doesn't match above routes will redirect to "/"
              
              مسار شامل - يعيد توجيه المسارات غير المعروفة إلى الصفحة الرئيسية
              أي عنوان URL لا يطابق المسارات أعلاه سيتم إعادة توجيهه إلى "/"
            */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </AuthProvider>
  </BrowserRouter>
);

export default App;