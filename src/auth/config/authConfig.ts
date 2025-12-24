/**
 * ============================================================================
 * AUTH CONFIGURATION - authConfig.ts
 * ============================================================================
 * 
 * This file contains all OIDC/OAuth2 configuration settings.
 * It defines how the app connects to the Identity Server.
 * 
 * ملف تكوين المصادقة - authConfig.ts
 * يحتوي هذا الملف على جميع إعدادات تكوين OIDC/OAuth2.
 * يحدد كيفية اتصال التطبيق بخادم الهوية.
 * 
 * ============================================================================
 * CONFIGURATION EXPLANATION:
 * 
 * authority: Identity Server URL (where authentication happens)
 * client_id: Application identifier registered on Identity Server
 * redirect_uri: Where Identity Server redirects after login
 * post_logout_redirect_uri: Where Identity Server redirects after logout
 * silent_redirect_uri: Where Identity Server redirects for silent token renewal
 * response_type: 'code' = Authorization Code flow (most secure)
 * scope: What permissions/claims the app requests
 * automaticSilentRenew: Automatically refresh tokens before they expire
 * loadUserInfo: Load user profile information
 * userStore: Where to store tokens (localStorage)
 * 
 * شرح التكوين:
 * 
 * authority: عنوان URL لخادم الهوية (حيث تحدث المصادقة)
 * client_id: معرف التطبيق المسجل على خادم الهوية
 * redirect_uri: المكان الذي يعيد خادم الهوية التوجيه إليه بعد تسجيل الدخول
 * post_logout_redirect_uri: المكان الذي يعيد خادم الهوية التوجيه إليه بعد تسجيل الخروج
 * silent_redirect_uri: المكان الذي يعيد خادم الهوية التوجيه إليه لتحديث الرمز المميز الصامت
 * response_type: 'code' = تدفق رمز التفويض (الأكثر أماناً)
 * scope: ما هي الأذونات/المطالبات التي يطلبها التطبيق
 * automaticSilentRenew: تحديث الرموز المميزة تلقائياً قبل انتهائها
 * loadUserInfo: تحميل معلومات ملف المستخدم
 * userStore: مكان تخزين الرموز المميزة (localStorage)
 * ============================================================================
 */

import { UserManagerSettings, WebStorageStateStore } from 'oidc-client-ts';

// Identity Server URL - where authentication happens
// عنوان URL لخادم الهوية - حيث تحدث المصادقة
const IDENTITY_SERVER_URL = 'https://www.sbcsdaia.com';

/**
 * Get Redirect URI
 * Returns the callback URL where Identity Server redirects after login
 * Format: http://localhost:3000/auth/callback (or your domain)
 * 
 * الحصول على عنوان URI لإعادة التوجيه
 * يعيد عنوان URL للاستدعاء حيث يعيد خادم الهوية التوجيه بعد تسجيل الدخول
 * التنسيق: http://localhost:3000/auth/callback (أو نطاقك)
 */
const getRedirectUri = () => {
  return `${window.location.origin}/auth/callback`;
};

/**
 * Get Post Logout Redirect URI
 * Returns the URL where Identity Server redirects after logout
 * Usually the home page
 * 
 * الحصول على عنوان URI لإعادة التوجيه بعد تسجيل الخروج
 * يعيد عنوان URL حيث يعيد خادم الهوية التوجيه بعد تسجيل الخروج
 * عادة الصفحة الرئيسية
 */
const getPostLogoutRedirectUri = () => {
  return `${window.location.origin}/`;
};

/**
 * Get Silent Redirect URI
 * Returns the URL for silent token renewal
 * This is opened in a hidden iframe to refresh tokens without user interaction
 * 
 * الحصول على عنوان URI لإعادة التوجيه الصامت
 * يعيد عنوان URL لتحديث الرمز المميز الصامت
 * يتم فتح هذا في iframe مخفي لتحديث الرموز المميزة دون تفاعل المستخدم
 */
const getSilentRedirectUri = () => {
  return `${window.location.origin}/silent-renew`;
};

/**
 * Auth Configuration Object
 * Contains all settings for OIDC/OAuth2 authentication
 * This is passed to UserManager to configure the OIDC client
 * 
 * كائن تكوين المصادقة
 * يحتوي على جميع الإعدادات لمصادقة OIDC/OAuth2
 * يتم تمرير هذا إلى UserManager لتكوين عميل OIDC
 */
export const authConfig: UserManagerSettings = {
  // Identity Server URL - where to connect for authentication
  // عنوان URL لخادم الهوية - المكان للاتصال للمصادقة
  authority: IDENTITY_SERVER_URL,
  
  // Client ID - registered on Identity Server
  // معرف العميل - مسجل على خادم الهوية
  client_id: 'CalcClient',
  
  // Callback URL after login
  // عنوان URL للاستدعاء بعد تسجيل الدخول
  redirect_uri: getRedirectUri(),
  
  // Callback URL after logout
  // عنوان URL للاستدعاء بعد تسجيل الخروج
  post_logout_redirect_uri: getPostLogoutRedirectUri(),
  
  // Callback URL for silent token renewal
  // عنوان URL للاستدعاء لتحديث الرمز المميز الصامت
  silent_redirect_uri: getSilentRedirectUri(),
  
  // Response type: 'code' = Authorization Code flow (most secure OAuth2 flow)
  // نوع الاستجابة: 'code' = تدفق رمز التفويض (أكثر تدفقات OAuth2 أماناً)
  response_type: 'code',
  
  // Scopes: what permissions/claims the app requests
  // openid: required for OIDC
  // profile: user profile information
  // roles: user roles
  // CalcApi, CalcAttachmentApi: custom API scopes
  // النطاقات: ما هي الأذونات/المطالبات التي يطلبها التطبيق
  // openid: مطلوب لـ OIDC
  // profile: معلومات ملف المستخدم
  // roles: أدوار المستخدم
  // CalcApi، CalcAttachmentApi: نطاقات API مخصصة
  scope: 'openid profile roles CalcApi CalcAttachmentApi',

  // Token management settings
  // إعدادات إدارة الرموز المميزة
  automaticSilentRenew: true,  // Automatically refresh tokens before expiration / تحديث الرموز تلقائياً قبل انتهائها
  loadUserInfo: true,         // Load user profile information / تحميل معلومات ملف المستخدم

  // Token storage - store tokens in browser localStorage
  // تخزين الرموز المميزة - تخزين الرموز في localStorage للمتصفح
  userStore: new WebStorageStateStore({
    store: window.localStorage
  }),

  // Additional settings
  // إعدادات إضافية
  filterProtocolClaims: true,  // Filter OIDC protocol claims / تصفية مطالبات بروتوكول OIDC
  monitorSession: true,        // Monitor session status / مراقبة حالة الجلسة

  // PKCE (Proof Key for Code Exchange) settings for enhanced security
  // إعدادات PKCE (مفتاح الإثبات لتبادل الرمز) لتحسين الأمان
  response_mode: 'query',      // Pass response in URL query parameters / تمرير الاستجابة في معاملات URL
};

/**
 * Identity Server Endpoints
 * Direct URLs to Identity Server endpoints (for reference)
 * These are automatically discovered by oidc-client-ts, but listed here for clarity
 * 
 * نقاط نهاية خادم الهوية
 * عناوين URL المباشرة لنقاط نهاية خادم الهوية (للرجوع إليها)
 * يتم اكتشاف هذه تلقائياً بواسطة oidc-client-ts، ولكن تم سردها هنا للوضوح
 */
export const IDENTITY_CONFIG = {
  authority: IDENTITY_SERVER_URL,
  authorizeEndpoint: `${IDENTITY_SERVER_URL}/connect/authorize`,      // Login endpoint / نقطة نهاية تسجيل الدخول
  tokenEndpoint: `${IDENTITY_SERVER_URL}/connect/token`,             // Token exchange endpoint / نقطة نهاية تبادل الرمز المميز
  userInfoEndpoint: `${IDENTITY_SERVER_URL}/connect/userinfo`,        // User info endpoint / نقطة نهاية معلومات المستخدم
  endSessionEndpoint: `${IDENTITY_SERVER_URL}/connect/endsession`,   // Logout endpoint / نقطة نهاية تسجيل الخروج
};
