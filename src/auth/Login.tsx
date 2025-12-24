/**
 * ============================================================================
 * LOGIN PAGE COMPONENT - Login.tsx
 * ============================================================================
 * 
 * This component displays the login page UI and handles the login initiation.
 * When user clicks "Sign In", it redirects them to the Identity Server.
 * 
 * مكون صفحة تسجيل الدخول - Login.tsx
 * يعرض هذا المكون واجهة صفحة تسجيل الدخول ويتعامل مع بدء تسجيل الدخول.
 * عندما ينقر المستخدم على "تسجيل الدخول"، يعيد توجيهه إلى خادم الهوية.
 * 
 * ============================================================================
 * FLOW:
 * 1. User visits /login page
 * 2. If already authenticated → redirect to returnUrl or home
 * 3. User clicks "Sign In By SBC" button
 * 4. Calls login() from AuthContext → calls authService.login()
 * 5. authService.login() → redirects browser to Identity Server
 * 6. User authenticates on Identity Server
 * 7. Identity Server redirects back to /auth/callback with auth code
 * 
 * التدفق:
 * 1. المستخدم يزور صفحة /login
 * 2. إذا كان مصادقاً بالفعل → إعادة توجيه إلى returnUrl أو الصفحة الرئيسية
 * 3. المستخدم ينقر على زر "تسجيل الدخول بواسطة SBC"
 * 4. يستدعي login() من AuthContext → يستدعي authService.login()
 * 5. authService.login() → يعيد توجيه المتصفح إلى خادم الهوية
 * 6. المستخدم يتم التحقق منه على خادم الهوية
 * 7. خادم الهوية يعيد التوجيه إلى /auth/callback مع رمز المصادقة
 * ============================================================================
 */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import { useAuth } from './contexts/AuthContext';

/**
 * Login Component
 * Displays login UI and initiates OIDC authentication flow
 * 
 * مكون تسجيل الدخول
 * يعرض واجهة تسجيل الدخول ويبدأ تدفق مصادقة OIDC
 */
const Login: React.FC = () => {
  // Get authentication state and login function from AuthContext
  // الحصول على حالة المصادقة ووظيفة تسجيل الدخول من AuthContext
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Effect: Check if user is already authenticated
   * If authenticated, redirect to returnUrl (saved by ProtectedRoute) or home
   * 
   * التأثير: التحقق من أن المستخدم مصادق عليه بالفعل
   * إذا كان مصادقاً، إعادة التوجيه إلى returnUrl (المحفوظ بواسطة ProtectedRoute) أو الصفحة الرئيسية
   */
  useEffect(() => {
    // If already authenticated, redirect to home
    // إذا كان مصادقاً بالفعل، إعادة التوجيه إلى الصفحة الرئيسية
    if (isAuthenticated) {
      // Get the URL user was trying to access before login
      // الحصول على عنوان URL الذي كان المستخدم يحاول الوصول إليه قبل تسجيل الدخول
      const returnUrl = sessionStorage.getItem('returnUrl') || '/';
      sessionStorage.removeItem('returnUrl');
      navigate(returnUrl);
    }
  }, [isAuthenticated, navigate]);

  /**
   * Handle Login Button Click
   * Initiates the OIDC redirect flow by calling authService.login()
   * This will redirect the browser to Identity Server
   * 
   * معالجة النقر على زر تسجيل الدخول
   * يبدأ تدفق إعادة توجيه OIDC عن طريق استدعاء authService.login()
   * سيؤدي هذا إلى إعادة توجيه المتصفح إلى خادم الهوية
   */
  const handleLogin = async () => {
    setIsLoading(true);
    try {
      // This will redirect browser to Identity Server
      // لا يوجد return هنا لأن المتصفح سيتم إعادة توجيهه
      // سيؤدي هذا إلى إعادة توجيه المتصفح إلى خادم الهوية
      await login();
    } catch (error) {
      console.error('Login error:', error);
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* Left Side - Animated Hero Section */}
      <div className="login-hero">
        {/* Floating Particles */}
        {[...Array(9)].map((_, i) => (
          <div key={i} className="particle" />
        ))}

        <div className="hero-content">
          <div className="logo-section">
            <div className="logo-icon">⚡</div>
            <h1 className="system-title">Calc Engine</h1>
            <p className="system-subtitle">Next Generation Calculation Platform</p>
          </div>

          <div className="features-section">
            <div className="animated-text">
              <span>💡 Smart Engine</span>
              <span>🚀 Calculation Engine</span>
              <span>🌟 Future of Development</span>
            </div>

            <div className="feature-grid">
              <div className="feature-card">
                <div className="feature-icon">⚡</div>
                <h3 className="feature-title">Lightning Fast</h3>
              </div>
              <div className="feature-card">
                <div className="feature-icon">🎯</div>
                <h3 className="feature-title">Precision Accuracy</h3>
              </div>
              <div className="feature-card">
                <div className="feature-icon">🔒</div>
                <h3 className="feature-title">Secure & Reliable</h3>
              </div>
              <div className="feature-card">
                <div className="feature-icon">🌐</div>
                <h3 className="feature-title">Scalable Platform</h3>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="login-form-section">
        <div className="login-form-container">
          <div className="login-header">
            <h2 className="login-title">Welcome Back</h2>
            <p className="login-description">
              Sign in to access the admin portal
            </p>
          </div>

          <div className="login-form">
            <button
              onClick={handleLogin}
              className={`login-button ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
            >
              {!isLoading && 'Sign In By SBC'}
            </button>

            <div className="login-divider">
              <span>Secure Authentication</span>
            </div>

            <div className="login-info">
              <h4 className="login-info-title">Authentication Process</h4>
              <p className="login-info-text">
                You will be securely redirected to the Identity Server for authentication.
                Your credentials are never stored on this platform.
              </p>
            </div>
          </div>

          <div className="login-footer">
            <p className="login-footer-text">
              © 2025 Calc Engine. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
