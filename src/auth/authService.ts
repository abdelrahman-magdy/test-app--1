/**
 * ============================================================================
 * AUTH SERVICE - authService.ts
 * ============================================================================
 * 
 * This is a wrapper around oidc-client-ts UserManager.
 * It provides a clean API for authentication operations:
 * - Login/Logout
 * - Token management
 * - User state management
 * - Silent token renewal
 * 
 * This service is a singleton - only one instance exists for the entire app.
 * 
 * خدمة المصادقة - authService.ts
 * هذا غلاف حول oidc-client-ts UserManager.
 * يوفر واجهة برمجة تطبيقات نظيفة لعمليات المصادقة:
 * - تسجيل الدخول/الخروج
 * - إدارة الرموز المميزة
 * - إدارة حالة المستخدم
 * - التجديد الصامت للرموز المميزة
 * 
 * هذه الخدمة هي singleton - يوجد مثيل واحد فقط للتطبيق بالكامل.
 * 
 * ============================================================================
 * FLOW:
 * 1. AuthService initializes → creates UserManager with authConfig
 * 2. Sets up event handlers for OIDC events
 * 3. Login: signinRedirect() → redirects browser to Identity Server
 * 4. Complete Login: signinRedirectCallback() → processes callback, gets tokens
 * 5. Logout: signoutRedirect() → redirects to Identity Server logout
 * 6. Silent Renew: automatically handled by UserManager when token expires
 * 
 * التدفق:
 * 1. AuthService يتم تهيئته → ينشئ UserManager مع authConfig
 * 2. يعد معالجات الأحداث لأحداث OIDC
 * 3. تسجيل الدخول: signinRedirect() → يعيد توجيه المتصفح إلى خادم الهوية
 * 4. إكمال تسجيل الدخول: signinRedirectCallback() → يعالج الاستدعاء، يحصل على الرموز المميزة
 * 5. تسجيل الخروج: signoutRedirect() → يعيد التوجيه إلى تسجيل خروج خادم الهوية
 * 6. التجديد الصامت: يتم التعامل معه تلقائياً بواسطة UserManager عندما ينتهي الرمز المميز
 * ============================================================================
 */

import { UserManager, User } from 'oidc-client-ts';
import { authConfig } from './config/authConfig';

/**
 * AuthService Class
 * Wraps oidc-client-ts UserManager to provide authentication functionality
 * 
 * فئة AuthService
 * تغلف oidc-client-ts UserManager لتوفير وظائف المصادقة
 */
class AuthService {
  private userManager: UserManager;

  constructor() {
    // Initialize UserManager with configuration from authConfig.ts
    // تهيئة UserManager مع التكوين من authConfig.ts
    this.userManager = new UserManager(authConfig);
    this.setupEventHandlers();
  }

  /**
   * Setup Event Handlers
   * Registers listeners for OIDC events (user loaded, token expired, etc.)
   * These events are used by AuthContext to update React state
   * 
   * إعداد معالجات الأحداث
   * يسجل مستمعي أحداث OIDC (تحميل المستخدم، انتهاء الرمز المميز، إلخ)
   * يتم استخدام هذه الأحداث بواسطة AuthContext لتحديث حالة React
   */
  private setupEventHandlers() {
    // User loaded event - fired after successful login or token refresh
    // حدث تحميل المستخدم - يتم تشغيله بعد تسجيل الدخول الناجح أو تحديث الرمز المميز
    this.userManager.events.addUserLoaded((user) => {
      console.log('User loaded:', user.profile);
    });

    // User unloaded event - fired after logout
    // حدث إلغاء تحميل المستخدم - يتم تشغيله بعد تسجيل الخروج
    this.userManager.events.addUserUnloaded(() => {
      console.log('User unloaded');
    });

    // Silent renew error - fired if silent token renewal fails
    // خطأ التجديد الصامت - يتم تشغيله إذا فشل تحديث الرمز المميز الصامت
    this.userManager.events.addSilentRenewError((error) => {
      console.error('Silent renew error:', error);
    });

    // Access token expiring - fired before token expires (for warnings)
    // انتهاء رمز الوصول - يتم تشغيله قبل انتهاء الرمز المميز (للتحذيرات)
    this.userManager.events.addAccessTokenExpiring(() => {
      console.log('Access token expiring...');
    });

    // Access token expired - fired when token has expired
    // When this happens, automatically logout user
    // انتهت صلاحية رمز الوصول - يتم تشغيله عندما ينتهي الرمز المميز
    // عندما يحدث هذا، قم بتسجيل خروج المستخدم تلقائياً
    this.userManager.events.addAccessTokenExpired(() => {
      console.log('Access token expired');
      this.logout();
    });
  }

  /**
   * Login Function
   * Initiates OIDC login flow by redirecting browser to Identity Server
   * User will authenticate on Identity Server, then be redirected back to /auth/callback
   * 
   * وظيفة تسجيل الدخول
   * يبدأ تدفق تسجيل الدخول OIDC عن طريق إعادة توجيه المتصفح إلى خادم الهوية
   * سيتم التحقق من المستخدم على خادم الهوية، ثم إعادة توجيهه إلى /auth/callback
   */
  public async login(): Promise<void> {
    try {
      // This redirects the browser - function won't return until callback
      // هذا يعيد توجيه المتصفح - لن تعود الوظيفة حتى الاستدعاء
      await this.userManager.signinRedirect();
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  }

  /**
   * Complete Login Function
   * Processes the OIDC callback after Identity Server redirects back
   * Exchanges authorization code for access token and ID token
   * Stores user in localStorage
   * 
   * وظيفة إكمال تسجيل الدخول
   * يعالج استدعاء OIDC بعد أن يعيد خادم الهوية التوجيه
   * يستبدل رمز التفويض برمز الوصول ورمز الهوية
   * يحفظ المستخدم في localStorage
   */
  public async completeLogin(): Promise<User | null> {
    try {
      // Process callback URL, exchange code for tokens
      // معالجة عنوان URL للاستدعاء، استبدال الرمز بالرموز المميزة
      const user = await this.userManager.signinRedirectCallback();
      console.log('Login completed:', user.profile);
      return user;
    } catch (error) {
      console.error('Error completing login:', error);
      throw error;
    }
  }

  /**
   * Logout Function
   * Initiates OIDC logout flow by redirecting to Identity Server logout endpoint
   * Clears session on Identity Server and redirects back to app
   * 
   * وظيفة تسجيل الخروج
   * يبدأ تدفق تسجيل الخروج OIDC عن طريق إعادة التوجيه إلى نقطة نهاية تسجيل خروج خادم الهوية
   * يمسح الجلسة على خادم الهوية ويعيد التوجيه إلى التطبيق
   */
  public async logout(): Promise<void> {
    try {
      // Redirects browser to Identity Server logout endpoint
      // يعيد توجيه المتصفح إلى نقطة نهاية تسجيل خروج خادم الهوية
      await this.userManager.signoutRedirect();
    } catch (error) {
      console.error('Error during logout:', error);
      throw error;
    }
  }

  /**
   * Complete Logout Function
   * Processes logout callback after Identity Server redirects back
   * Clears user data from localStorage
   * 
   * وظيفة إكمال تسجيل الخروج
   * يعالج استدعاء تسجيل الخروج بعد أن يعيد خادم الهوية التوجيه
   * يمسح بيانات المستخدم من localStorage
   */
  public async completeLogout(): Promise<void> {
    try {
      await this.userManager.signoutRedirectCallback();
    } catch (error) {
      console.error('Error completing logout:', error);
      throw error;
    }
  }

  /**
   * Get User Function
   * Retrieves current authenticated user from localStorage
   * Returns null if no user is stored
   * 
   * وظيفة الحصول على المستخدم
   * يسترجع المستخدم المصادق عليه الحالي من localStorage
   * يعيد null إذا لم يتم تخزين مستخدم
   */
  public async getUser(): Promise<User | null> {
    try {
      return await this.userManager.getUser();
    } catch (error) {
      console.error('Error getting user:', error);
      return null;
    }
  }

  /**
   * Is Authenticated Function
   * Checks if user exists and token is not expired
   * 
   * وظيفة التحقق من المصادقة
   * يتحقق من وجود المستخدم وأن الرمز المميز لم ينته
   */
  public async isAuthenticated(): Promise<boolean> {
    const user = await this.getUser();
    return user !== null && !user.expired;
  }

  /**
   * Get Access Token Function
   * Returns the current access token for making authenticated API calls
   * Returns null if no user or token expired
   * 
   * وظيفة الحصول على رمز الوصول
   * يعيد رمز الوصول الحالي لإجراء استدعاءات API مصادق عليها
   * يعيد null إذا لم يكن هناك مستخدم أو انتهى الرمز المميز
   */
  public async getAccessToken(): Promise<string | null> {
    const user = await this.getUser();
    return user?.access_token || null;
  }

  /**
   * Remove User Function
   * Removes user data from localStorage without network call
   * Used for local logout without Identity Server interaction
   * 
   * وظيفة إزالة المستخدم
   * يزيل بيانات المستخدم من localStorage دون استدعاء الشبكة
   * يُستخدم لتسجيل الخروج المحلي دون تفاعل مع خادم الهوية
   */
  public async removeUser(): Promise<void> {
    await this.userManager.removeUser();
  }

  /**
   * Complete Silent Renew Function
   * Processes silent token renewal callback
   * Called when Identity Server redirects to /silent-renew with new tokens
   * This happens automatically in a hidden iframe when token is about to expire
   * 
   * وظيفة إكمال التجديد الصامت
   * يعالج استدعاء تحديث الرمز المميز الصامت
   * يتم استدعاؤه عندما يعيد خادم الهوية التوجيه إلى /silent-renew مع رموز جديدة
   * يحدث هذا تلقائياً في iframe مخفي عندما يكون الرمز المميز على وشك الانتهاء
   */
  public async completeSilentRenew(): Promise<void> {
    try {
      await this.userManager.signinSilentCallback();
    } catch (error) {
      console.error('Error completing silent renew:', error);
      throw error;
    }
  }

  /**
   * Get User Manager Function
   * Exposes the underlying UserManager instance
   * Used by AuthContext to subscribe to OIDC events
   * 
   * وظيفة الحصول على User Manager
   * يكشف مثيل UserManager الأساسي
   * يُستخدم بواسطة AuthContext للاشتراك في أحداث OIDC
   */
  public getUserManager(): UserManager {
    return this.userManager;
  }
}

// Export a singleton instance - only one AuthService exists for the entire app
// تصدير مثيل singleton - يوجد مثيل واحد فقط من AuthService للتطبيق بالكامل
export const authService = new AuthService();
export default authService;
