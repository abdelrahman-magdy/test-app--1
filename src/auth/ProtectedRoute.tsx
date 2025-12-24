/**
 * ============================================================================
 * PROTECTED ROUTE COMPONENT - ProtectedRoute.tsx
 * ============================================================================
 * 
 * This component protects routes that require authentication.
 * It checks if the user is authenticated before allowing access to protected content.
 * If not authenticated, it saves the attempted URL and redirects to login.
 * After login, user is redirected back to the original URL they tried to access.
 * 
 * مكون المسار المحمي - ProtectedRoute.tsx
 * يحمي هذا المكون المسارات التي تتطلب المصادقة.
 * يتحقق من أن المستخدم مصادق عليه قبل السماح بالوصول إلى المحتوى المحمي.
 * إذا لم يكن مصادقاً، يحفظ عنوان URL المحاول ويوجه إلى تسجيل الدخول.
 * بعد تسجيل الدخول، يتم إعادة توجيه المستخدم إلى عنوان URL الأصلي الذي حاول الوصول إليه.
 * 
 * ============================================================================
 * FLOW:
 * 1. User tries to access protected route (e.g., /game)
 * 2. ProtectedRoute checks isAuthenticated from AuthContext
 * 3. If loading → show loading spinner
 * 4. If not authenticated → save current URL to sessionStorage as 'returnUrl'
 * 5. Redirect to /login
 * 6. After login → AuthCallback reads returnUrl and redirects user back
 * 7. If authenticated → render the protected content
 * 
 * التدفق:
 * 1. المستخدم يحاول الوصول إلى مسار محمي (مثل /game)
 * 2. ProtectedRoute يتحقق من isAuthenticated من AuthContext
 * 3. إذا كان التحميل → عرض مؤشر التحميل
 * 4. إذا لم يكن مصادقاً → حفظ عنوان URL الحالي في sessionStorage كـ 'returnUrl'
 * 5. إعادة التوجيه إلى /login
 * 6. بعد تسجيل الدخول → AuthCallback يقرأ returnUrl ويعيد توجيه المستخدم
 * 7. إذا كان مصادقاً → عرض المحتوى المحمي
 * ============================================================================
 */

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * ProtectedRoute Component
 * Wraps protected content and checks authentication before rendering
 * 
 * مكون ProtectedRoute
 * يغلف المحتوى المحمي ويتحقق من المصادقة قبل العرض
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  // Get authentication state from AuthContext
  // الحصول على حالة المصادقة من AuthContext
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication status
  // عرض مؤشر التحميل أثناء التحقق من حالة المصادقة
  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh'
      }}>
        <div className="spinner" style={{
          border: '4px solid #f3f3f3',
          borderTop: '4px solid #3498db',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          animation: 'spin 1s linear infinite',
          marginBottom: '16px'
        }}></div>
        <p style={{ color: '#666' }}>Loading...</p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // If not authenticated, save the URL user was trying to access
  // Then redirect to login page
  // After login, AuthCallback will read returnUrl and redirect back here
  // 
  // إذا لم يكن مصادقاً، احفظ عنوان URL الذي كان المستخدم يحاول الوصول إليه
  // ثم أعد التوجيه إلى صفحة تسجيل الدخول
  // بعد تسجيل الدخول، سوف يقرأ AuthCallback returnUrl ويعيد التوجيه هنا
  if (!isAuthenticated) {
    // Save the attempted URL for redirecting after login
    // حفظ عنوان URL المحاول لإعادة التوجيه بعد تسجيل الدخول
    sessionStorage.setItem('returnUrl', location.pathname + location.search);
    return <Navigate to="/login" replace />;
  }

  // User is authenticated - render the protected content
  // المستخدم مصادق عليه - عرض المحتوى المحمي
  return <>{children}</>;
};

export default ProtectedRoute;
