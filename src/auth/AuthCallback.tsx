/**
 * ============================================================================
 * AUTH CALLBACK COMPONENT - AuthCallback.tsx
 * ============================================================================
 * 
 * This component handles the OIDC callback after user authenticates on Identity Server.
 * Identity Server redirects here with an authorization code in the URL.
 * This component processes that code, exchanges it for tokens, and redirects user.
 * 
 * مكون استدعاء المصادقة - AuthCallback.tsx
 * يتعامل هذا المكون مع استدعاء OIDC بعد أن يتم التحقق من المستخدم على خادم الهوية.
 * يعيد خادم الهوية التوجيه هنا مع رمز تفويض في عنوان URL.
 * يعالج هذا المكون هذا الرمز، يستبدله بالرموز المميزة، ويعيد توجيه المستخدم.
 * 
 * ============================================================================
 * FLOW:
 * 1. Identity Server redirects to /auth/callback?code=xxx&state=yyy
 * 2. AuthCallback component mounts
 * 3. Calls authService.completeLogin() → processes callback URL
 * 4. authService exchanges authorization code for access token
 * 5. User is stored in localStorage via AuthContext
 * 6. Redirects to returnUrl (saved in sessionStorage) or home
 * 
 * التدفق:
 * 1. خادم الهوية يعيد التوجيه إلى /auth/callback?code=xxx&state=yyy
 * 2. مكون AuthCallback يتم تحميله
 * 3. يستدعي authService.completeLogin() → يعالج عنوان URL للاستدعاء
 * 4. authService يستبدل رمز التفويض برمز الوصول
 * 5. يتم حفظ المستخدم في localStorage عبر AuthContext
 * 6. يعيد التوجيه إلى returnUrl (المحفوظ في sessionStorage) أو الصفحة الرئيسية
 * ============================================================================
 */

import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from './authService';

/**
 * AuthCallback Component
 * Handles the OIDC callback after authentication
 * Processes the authorization code and redirects user to their destination
 * 
 * مكون AuthCallback
 * يتعامل مع استدعاء OIDC بعد المصادقة
 * يعالج رمز التفويض ويعيد توجيه المستخدم إلى وجهته
 */
const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  
  // Prevent double processing in React Strict Mode (development mode double renders)
  // منع المعالجة المزدوجة في وضع React Strict Mode (وضع التطوير يعرض مرتين)
  const hasProcessed = useRef(false);

  useEffect(() => {
    // Prevent double processing (React Strict Mode can cause double renders)
    // منع المعالجة المزدوجة (وضع React Strict Mode يمكن أن يسبب عرض مزدوج)
    if (hasProcessed.current) return;
    hasProcessed.current = true;

    /**
     * Complete Authentication Flow
     * Processes the OIDC callback and redirects user
     * 
     * إكمال تدفق المصادقة
     * يعالج استدعاء OIDC ويعيد توجيه المستخدم
     */
    const completeAuthentication = async () => {
      try {
        // Process the callback URL: exchange authorization code for tokens
        // This reads the code from URL, exchanges it with Identity Server for tokens
        // معالجة عنوان URL للاستدعاء: استبدال رمز التفويض بالرموز المميزة
        // يقرأ هذا الرمز من عنوان URL، يستبدله مع خادم الهوية بالرموز المميزة
        await authService.completeLogin();

        // Small delay to ensure AuthContext has updated with the new user
        await new Promise(resolve => setTimeout(resolve, 200));

        // Verify authentication succeeded
        const isAuth = await authService.isAuthenticated();
        if (!isAuth) {
          throw new Error('Authentication verification failed');
        }

        // Get return URL and navigate
        const returnUrl = sessionStorage.getItem('returnUrl') || '/';
        sessionStorage.removeItem('returnUrl');
        navigate(returnUrl);
      } catch (err: any) {
        console.error('Authentication callback error:', err);
        
        // Check if user is actually authenticated despite the error
        // This can happen if:
        // 1. Callback was already processed (React Strict Mode double render)
        // 2. URL parameters were already consumed
        const isAuth = await authService.isAuthenticated();
        
        if (isAuth) {
          // User is authenticated - error was likely "already processed"
          // Just redirect to return URL silently
          const returnUrl = sessionStorage.getItem('returnUrl') || '/';
          sessionStorage.removeItem('returnUrl');
          navigate(returnUrl);
        } else {
          // Real authentication error - show error message
          const errorMessage = err.message || err.toString() || 'Authentication failed';
          
          // Check if it's a "no state in response" error (callback already processed)
          if (errorMessage.includes('state') || errorMessage.includes('already')) {
            // Likely already processed, check one more time after delay
            await new Promise(resolve => setTimeout(resolve, 500));
            const retryAuth = await authService.isAuthenticated();
            
            if (retryAuth) {
              const returnUrl = sessionStorage.getItem('returnUrl') || '/';
              sessionStorage.removeItem('returnUrl');
              navigate(returnUrl);
              return;
            }
          }
          
          setError(errorMessage);
          
          // Redirect to home after showing error
          setTimeout(() => {
            navigate('/');
          }, 3000);
        }
      }
    };

    completeAuthentication();
  }, [navigate]);

  if (error) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: '20px'
      }}>
        <h2 style={{ color: '#d32f2f', marginBottom: '16px' }}>Authentication Error</h2>
        <p style={{ color: '#666', marginBottom: '8px' }}>{error}</p>
        <p style={{ color: '#999', fontSize: '14px' }}>Redirecting to home page...</p>
      </div>
    );
  }

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
      <p style={{ color: '#666' }}>Completing authentication...</p>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default AuthCallback;
