/**
 * ============================================================================
 * AUTH CONTEXT PROVIDER - AuthContext.tsx
 * ============================================================================
 * 
 * This component provides authentication state and functions to the entire app
 * via React Context. It wraps the app and manages user authentication state.
 * 
 * It:
 * - Loads user from localStorage on app start
 * - Listens to OIDC events (user loaded, token expired, etc.)
 * - Provides login/logout functions
 * - Exposes authentication state (isAuthenticated, isLoading, user)
 * 
 * مكون موفر سياق المصادقة - AuthContext.tsx
 * يوفر هذا المكون حالة المصادقة والوظائف للتطبيق بالكامل
 * عبر React Context. يغلف التطبيق ويدير حالة مصادقة المستخدم.
 * 
 * يقوم بـ:
 * - تحميل المستخدم من localStorage عند بدء التطبيق
 * - الاستماع إلى أحداث OIDC (تحميل المستخدم، انتهاء الرمز المميز، إلخ)
 * - توفير وظائف تسجيل الدخول/الخروج
 * - كشف حالة المصادقة (isAuthenticated، isLoading، user)
 * 
 * ============================================================================
 * FLOW:
 * 1. App mounts → AuthProvider initializes
 * 2. Loads user from localStorage via authService.getUser()
 * 3. Sets up event listeners for OIDC events
 * 4. When user logs in → AuthCallback calls authService.completeLogin()
 * 5. OIDC events fire → AuthContext updates user state
 * 6. All components using useAuth() get updated authentication state
 * 
 * التدفق:
 * 1. App يتم تحميله → AuthProvider يتم تهيئته
 * 2. يحمل المستخدم من localStorage عبر authService.getUser()
 * 3. يعد مستمعي الأحداث لأحداث OIDC
 * 4. عندما يسجل المستخدم الدخول → AuthCallback يستدعي authService.completeLogin()
 * 5. أحداث OIDC يتم تشغيلها → AuthContext يحدث حالة المستخدم
 * 6. جميع المكونات التي تستخدم useAuth() تحصل على حالة مصادقة محدثة
 * ============================================================================
 */

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from 'oidc-client-ts';
import authService from '../authService';

/**
 * AuthContext Type Definition
 * Defines what authentication data and functions are available via context
 * 
 * تعريف نوع AuthContext
 * يحدد بيانات المصادقة والوظائف المتاحة عبر السياق
 */
interface AuthContextType {
  user: User | null;                    // Current authenticated user / المستخدم المصادق عليه الحالي
  isAuthenticated: boolean;              // Whether user is authenticated / ما إذا كان المستخدم مصادقاً عليه
  isLoading: boolean;                   // Whether auth state is still loading / ما إذا كانت حالة المصادقة لا تزال قيد التحميل
  login: () => Promise<void>;           // Function to initiate login / وظيفة لبدء تسجيل الدخول
  logout: () => Promise<void>;          // Function to logout / وظيفة لتسجيل الخروج
  getAccessToken: () => Promise<string | null>; // Get access token for API calls / الحصول على رمز الوصول لاستدعاءات API
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * AuthProvider Component
 * Provides authentication context to all child components
 * 
 * مكون AuthProvider
 * يوفر سياق المصادقة لجميع المكونات الفرعية
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    /**
     * Load User on Mount
     * Checks if user is already authenticated (stored in localStorage)
     * 
     * تحميل المستخدم عند التحميل
     * يتحقق من أن المستخدم مصادق عليه بالفعل (مخزن في localStorage)
     */
    const loadUser = async () => {
      try {
        const currentUser = await authService.getUser();
        setUser(currentUser);
      } catch (error) {
        console.error('Error loading user:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();

    /**
     * Subscribe to OIDC Events
     * Listen for user loaded, unloaded, and token expiration events
     * These events are fired by oidc-client-ts when authentication state changes
     * 
     * الاشتراك في أحداث OIDC
     * الاستماع لأحداث تحميل المستخدم، إلغاء تحميله، وانتهاء الرمز المميز
     * يتم تشغيل هذه الأحداث بواسطة oidc-client-ts عندما تتغير حالة المصادقة
     */
    const userManager = authService.getUserManager();

    // Event handler: User loaded (after login or token refresh)
    // معالج الحدث: تم تحميل المستخدم (بعد تسجيل الدخول أو تحديث الرمز المميز)
    const handleUserLoaded = (loadedUser: User) => {
      setUser(loadedUser);
    };

    // Event handler: User unloaded (after logout)
    // معالج الحدث: تم إلغاء تحميل المستخدم (بعد تسجيل الخروج)
    const handleUserUnloaded = () => {
      setUser(null);
    };

    // Event handler: Access token expired
    // When token expires, clear user state (will trigger logout)
    // معالج الحدث: انتهت صلاحية رمز الوصول
    // عندما ينتهي الرمز المميز، امسح حالة المستخدم (سيؤدي إلى تسجيل الخروج)
    const handleAccessTokenExpired = () => {
      setUser(null);
    };

    // Register event listeners
    // تسجيل مستمعي الأحداث
    userManager.events.addUserLoaded(handleUserLoaded);
    userManager.events.addUserUnloaded(handleUserUnloaded);
    userManager.events.addAccessTokenExpired(handleAccessTokenExpired);

    // Cleanup: Remove event listeners when component unmounts
    // التنظيف: إزالة مستمعي الأحداث عندما يتم إلغاء تحميل المكون
    return () => {
      userManager.events.removeUserLoaded(handleUserLoaded);
      userManager.events.removeUserUnloaded(handleUserUnloaded);
      userManager.events.removeAccessTokenExpired(handleAccessTokenExpired);
    };
  }, []);

  /**
   * Login Function
   * Initiates OIDC login flow (redirects to Identity Server)
   * 
   * وظيفة تسجيل الدخول
   * يبدأ تدفق تسجيل الدخول OIDC (يعيد التوجيه إلى خادم الهوية)
   */
  const login = async () => {
    await authService.login();
  };

  /**
   * Logout Function
   * Initiates OIDC logout flow (redirects to Identity Server)
   * 
   * وظيفة تسجيل الخروج
   * يبدأ تدفق تسجيل الخروج OIDC (يعيد التوجيه إلى خادم الهوية)
   */
  const logout = async () => {
    await authService.logout();
  };

  /**
   * Get Access Token Function
   * Returns the current access token for API calls
   * 
   * وظيفة الحصول على رمز الوصول
   * يعيد رمز الوصول الحالي لاستدعاءات API
   */
  const getAccessToken = async () => {
    return await authService.getAccessToken();
  };

  // Context value - what gets provided to all child components
  // قيمة السياق - ما يتم توفيره لجميع المكونات الفرعية
  const value: AuthContextType = {
    user,
    isAuthenticated: user !== null && !user.expired, // User exists and token not expired / المستخدم موجود والرمز المميز لم ينته
    isLoading,
    login,
    logout,
    getAccessToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * useAuth Hook
 * Custom hook to access authentication context
 * Must be used within AuthProvider
 * 
 * Hook useAuth
 * Hook مخصص للوصول إلى سياق المصادقة
 * يجب استخدامه داخل AuthProvider
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
