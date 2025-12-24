# Authentication Flow Map / خريطة تدفق المصادقة

## Overview / نظرة عامة

This document explains how the authentication system works and how all components interact with each other.

هذا المستند يشرح كيفية عمل نظام المصادقة وكيف تتفاعل جميع المكونات مع بعضها البعض.

---

## File Structure / هيكل الملفات

```
src/
├── App.tsx                          # Main app component with routing
│                                      # المكون الرئيسي للتطبيق مع التوجيه
├── auth/
│   ├── Login.tsx                    # Login page component
│   │                                 # مكون صفحة تسجيل الدخول
│   ├── AuthCallback.tsx             # OIDC callback handler
│   │                                 # معالج استدعاء OIDC
│   ├── SilentRenew.tsx              # Silent token renewal handler
│   │                                 # معالج تحديث الرمز المميز الصامت
│   ├── ProtectedRoute.tsx           # Route protection component
│   │                                 # مكون حماية المسار
│   ├── authService.ts               # OIDC service wrapper
│   │                                 # غلاف خدمة OIDC
│   ├── config/
│   │   └── authConfig.ts           # OIDC configuration
│   │                                 # تكوين OIDC
│   └── contexts/
│       └── AuthContext.tsx         # React context for auth state
│                                     # سياق React لحالة المصادقة
```

---

## Component Interaction Flow / تدفق تفاعل المكونات

```
┌─────────────────────────────────────────────────────────────────┐
│                         APP STARTUP                              │
│                      بدء تشغيل التطبيق                           │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
        ┌─────────────────────────────────────┐
        │         App.tsx                     │
        │  - Sets up BrowserRouter            │
        │  - Wraps app with AuthProvider      │
        │  - Defines routes                   │
        │                                     │
        │  App.tsx                            │
        │  - يعد BrowserRouter                │
        │  - يغلف التطبيق بـ AuthProvider     │
        │  - يحدد المسارات                    │
        └─────────────────────────────────────┘
                      │
                      ▼
        ┌─────────────────────────────────────┐
        │      AuthProvider                    │
        │  (AuthContext.tsx)                  │
        │                                     │
        │  - Loads user from localStorage     │
        │  - Sets up OIDC event listeners    │
        │  - Provides auth state to app      │
        │                                     │
        │  AuthProvider                       │
        │  (AuthContext.tsx)                  │
        │  - يحمل المستخدم من localStorage   │
        │  - يعد مستمعي أحداث OIDC            │
        │  - يوفر حالة المصادقة للتطبيق      │
        └─────────────────────────────────────┘
                      │
                      ▼
        ┌─────────────────────────────────────┐
        │      authService.ts                  │
        │                                     │
        │  - Wraps oidc-client-ts             │
        │  - Manages UserManager              │
        │  - Handles login/logout/tokens       │
        │                                     │
        │  authService.ts                     │
        │  - يغلف oidc-client-ts              │
        │  - يدير UserManager                 │
        │  - يتعامل مع تسجيل الدخول/الخروج/   │
        │    الرموز المميزة                    │
        └─────────────────────────────────────┘
                      │
                      ▼
        ┌─────────────────────────────────────┐
        │      authConfig.ts                   │
        │                                     │
        │  - Identity Server URL              │
        │  - Client ID                        │
        │  - Redirect URIs                    │
        │  - Scopes                           │
        │                                     │
        │  authConfig.ts                      │
        │  - عنوان URL لخادم الهوية           │
        │  - معرف العميل                      │
        │  - عناوين URI لإعادة التوجيه        │
        │  - النطاقات                         │
        └─────────────────────────────────────┘
```

---

## Login Flow / تدفق تسجيل الدخول

```
┌─────────────────────────────────────────────────────────────────┐
│                    USER VISITS PROTECTED ROUTE                  │
│              المستخدم يزور مساراً محمياً                        │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
        ┌─────────────────────────────────────┐
        │    ProtectedRoute.tsx                 │
        │                                     │
        │  Checks: isAuthenticated?           │
        │  If NO:                              │
        │    - Save URL to sessionStorage     │
        │    - Redirect to /login             │
        │                                     │
        │  ProtectedRoute.tsx                 │
        │  يتحقق: هل المستخدم مصادق عليه؟     │
        │  إذا لا:                             │
        │    - حفظ URL في sessionStorage      │
        │    - إعادة التوجيه إلى /login       │
        └─────────────────────────────────────┘
                      │
                      ▼
        ┌─────────────────────────────────────┐
        │         Login.tsx                     │
        │                                     │
        │  User clicks "Sign In" button       │
        │  Calls: login() from AuthContext    │
        │                                     │
        │  Login.tsx                          │
        │  المستخدم ينقر على زر "تسجيل الدخول"│
        │  يستدعي: login() من AuthContext     │
        └─────────────────────────────────────┘
                      │
                      ▼
        ┌─────────────────────────────────────┐
        │      AuthContext.tsx                 │
        │                                     │
        │  Calls: authService.login()         │
        │                                     │
        │  AuthContext.tsx                    │
        │  يستدعي: authService.login()        │
        └─────────────────────────────────────┘
                      │
                      ▼
        ┌─────────────────────────────────────┐
        │      authService.ts                  │
        │                                     │
        │  Calls: userManager.signinRedirect()│
        │  Browser redirects to:               │
        │  https://www.sbcsdaia.com/          │
        │  /connect/authorize?...              │
        │                                     │
        │  authService.ts                     │
        │  يستدعي: userManager.signinRedirect()│
        │  المتصفح يعيد التوجيه إلى:           │
        │  https://www.sbcsdaia.com/          │
        │  /connect/authorize?...              │
        └─────────────────────────────────────┘
                      │
                      ▼
        ┌─────────────────────────────────────┐
        │    IDENTITY SERVER                   │
        │    (External)                        │
        │                                     │
        │  - User enters credentials          │
        │  - Server validates                 │
        │  - Server generates auth code       │
        │  - Redirects back to app:           │
        │    /auth/callback?code=xxx&state=yyy│
        │                                     │
        │  خادم الهوية                        │
        │  (خارجي)                            │
        │  - المستخدم يدخل بيانات الاعتماد   │
        │  - الخادم يتحقق                     │
        │  - الخادم ينشئ رمز المصادقة         │
        │  - يعيد التوجيه إلى التطبيق:        │
        │    /auth/callback?code=xxx&state=yyy│
        └─────────────────────────────────────┘
                      │
                      ▼
        ┌─────────────────────────────────────┐
        │      AuthCallback.tsx                │
        │                                     │
        │  Calls: authService.completeLogin() │
        │                                     │
        │  AuthCallback.tsx                   │
        │  يستدعي: authService.completeLogin() │
        └─────────────────────────────────────┘
                      │
                      ▼
        ┌─────────────────────────────────────┐
        │      authService.ts                  │
        │                                     │
        │  Calls: userManager.                │
        │    signinRedirectCallback()         │
        │  - Processes callback URL          │
        │  - Exchanges code for tokens        │
        │  - Stores user in localStorage      │
        │  - Fires 'userLoaded' event         │
        │                                     │
        │  authService.ts                     │
        │  يستدعي: userManager.                │
        │    signinRedirectCallback()         │
        │  - يعالج عنوان URL للاستدعاء        │
        │  - يستبدل الرمز بالرموز المميزة     │
        │  - يحفظ المستخدم في localStorage    │
        │  - يشغل حدث 'userLoaded'            │
        └─────────────────────────────────────┘
                      │
                      ▼
        ┌─────────────────────────────────────┐
        │      AuthContext.tsx                 │
        │                                     │
        │  Listens to 'userLoaded' event     │
        │  Updates: setUser(loadedUser)       │
        │  All components using useAuth()     │
        │    get updated state                │
        │                                     │
        │  AuthContext.tsx                    │
        │  يستمع إلى حدث 'userLoaded'        │
        │  يحدث: setUser(loadedUser)         │
        │  جميع المكونات التي تستخدم useAuth()│
        │    تحصل على حالة محدثة              │
        └─────────────────────────────────────┘
                      │
                      ▼
        ┌─────────────────────────────────────┐
        │      AuthCallback.tsx                │
        │                                     │
        │  Reads returnUrl from sessionStorage│
        │  Redirects user to original URL     │
        │                                     │
        │  AuthCallback.tsx                   │
        │  يقرأ returnUrl من sessionStorage   │
        │  يعيد توجيه المستخدم إلى URL الأصلي │
        └─────────────────────────────────────┘
                      │
                      ▼
        ┌─────────────────────────────────────┐
        │    PROTECTED ROUTE                   │
        │                                     │
        │  Now isAuthenticated = true         │
        │  User can access protected content  │
        │                                     │
        │  المسار المحمي                      │
        │  الآن isAuthenticated = true        │
        │  يمكن للمستخدم الوصول إلى المحتوى   │
        │    المحمي                            │
        └─────────────────────────────────────┘
```

---

## Silent Token Renewal Flow / تدفق تحديث الرمز المميز الصامت

```
┌─────────────────────────────────────────────────────────────────┐
│              TOKEN IS ABOUT TO EXPIRE                            │
│              الرمز المميز على وشك الانتهاء                       │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
        ┌─────────────────────────────────────┐
        │      authService.ts                  │
        │                                     │
        │  UserManager detects token expiring │
        │  (automaticSilentRenew: true)       │
        │  Opens hidden iframe:               │
        │    /silent-renew                     │
        │                                     │
        │  authService.ts                     │
        │  UserManager يكتشف انتهاء الرمز     │
        │  (automaticSilentRenew: true)       │
        │  يفتح iframe مخفي:                  │
        │    /silent-renew                    │
        └─────────────────────────────────────┘
                      │
                      ▼
        ┌─────────────────────────────────────┐
        │      SilentRenew.tsx                 │
        │                                     │
        │  Calls: authService.                │
        │    completeSilentRenew()            │
        │  (Invisible - rendered in iframe)  │
        │                                     │
        │  SilentRenew.tsx                    │
        │  يستدعي: authService.               │
        │    completeSilentRenew()            │
        │  (غير مرئي - يتم عرضه في iframe)    │
        └─────────────────────────────────────┘
                      │
                      ▼
        ┌─────────────────────────────────────┐
        │      authService.ts                  │
        │                                     │
        │  Calls: userManager.                │
        │    signinSilentCallback()           │
        │  - Exchanges refresh token          │
        │  - Gets new access token            │
        │  - Stores in localStorage          │
        │  - Fires 'userLoaded' event        │
        │                                     │
        │  authService.ts                     │
        │  يستدعي: userManager.               │
        │    signinSilentCallback()           │
        │  - يستبدل رمز التحديث               │
        │  - يحصل على رمز وصول جديد           │
        │  - يحفظ في localStorage             │
        │  - يشغل حدث 'userLoaded'           │
        └─────────────────────────────────────┘
                      │
                      ▼
        ┌─────────────────────────────────────┐
        │      AuthContext.tsx                 │
        │                                     │
        │  Listens to 'userLoaded' event     │
        │  Updates user state with new token  │
        │  User session continues seamlessly  │
        │                                     │
        │  AuthContext.tsx                    │
        │  يستمع إلى حدث 'userLoaded'        │
        │  يحدث حالة المستخدم برمز جديد      │
        │  تستمر جلسة المستخدم بسلاسة         │
        └─────────────────────────────────────┘
```

---

## Logout Flow / تدفق تسجيل الخروج

```
┌─────────────────────────────────────────────────────────────────┐
│              USER CLICKS LOGOUT BUTTON                           │
│              المستخدم ينقر على زر تسجيل الخروج                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
        ┌─────────────────────────────────────┐
        │      AppHeader (in App.tsx)         │
        │                                     │
        │  Calls: logout() from AuthContext  │
        │                                     │
        │  AppHeader (في App.tsx)            │
        │  يستدعي: logout() من AuthContext   │
        └─────────────────────────────────────┘
                      │
                      ▼
        ┌─────────────────────────────────────┐
        │      AuthContext.tsx                 │
        │                                     │
        │  Calls: authService.logout()       │
        │                                     │
        │  AuthContext.tsx                    │
        │  يستدعي: authService.logout()       │
        └─────────────────────────────────────┘
                      │
                      ▼
        ┌─────────────────────────────────────┐
        │      authService.ts                  │
        │                                     │
        │  Calls: userManager.                │
        │    signoutRedirect()                │
        │  Browser redirects to:               │
        │  https://www.sbcsdaia.com/          │
        │  /connect/endsession?...             │
        │                                     │
        │  authService.ts                     │
        │  يستدعي: userManager.                │
        │    signoutRedirect()                │
        │  المتصفح يعيد التوجيه إلى:           │
        │  https://www.sbcsdaia.com/          │
        │  /connect/endsession?...             │
        └─────────────────────────────────────┘
                      │
                      ▼
        ┌─────────────────────────────────────┐
        │    IDENTITY SERVER                   │
        │                                     │
        │  - Clears server session            │
        │  - Redirects back to app:           │
        │    / (post_logout_redirect_uri)     │
        │                                     │
        │  خادم الهوية                        │
        │  - يمسح جلسة الخادم                 │
        │  - يعيد التوجيه إلى التطبيق:        │
        │    / (post_logout_redirect_uri)     │
        └─────────────────────────────────────┘
                      │
                      ▼
        ┌─────────────────────────────────────┐
        │      AuthContext.tsx                 │
        │                                     │
        │  Listens to 'userUnloaded' event    │
        │  Updates: setUser(null)            │
        │  isAuthenticated becomes false      │
        │                                     │
        │  AuthContext.tsx                    │
        │  يستمع إلى حدث 'userUnloaded'      │
        │  يحدث: setUser(null)               │
        │  isAuthenticated يصبح false         │
        └─────────────────────────────────────┘
                      │
                      ▼
        ┌─────────────────────────────────────┐
        │         HOME PAGE                    │
        │                                     │
        │  User is logged out                 │
        │  Protected routes redirect to login │
        │                                     │
        │  الصفحة الرئيسية                    │
        │  المستخدم مسجل خروج                 │
        │  المسارات المحمية تعيد التوجيه إلى  │
        │    تسجيل الدخول                     │
        └─────────────────────────────────────┘
```

---

## Component Dependencies / تبعيات المكونات

```
App.tsx
  ├── AuthProvider (AuthContext.tsx)
  │     ├── authService.ts
  │     │     └── authConfig.ts
  │     └── (provides auth state to all children)
  │
  ├── Login.tsx
  │     └── useAuth() hook (from AuthContext)
  │
  ├── AuthCallback.tsx
  │     └── authService.ts
  │
  ├── SilentRenew.tsx
  │     └── authService.ts
  │
  └── ProtectedRoute.tsx
        └── useAuth() hook (from AuthContext)
```

---

## Key Concepts / المفاهيم الرئيسية

### 1. OIDC (OpenID Connect) / OIDC (اتصال OpenID)
- Protocol built on OAuth 2.0 for authentication
- Provides identity information (who the user is)
- Uses authorization code flow for security
- بروتوكول مبني على OAuth 2.0 للمصادقة
- يوفر معلومات الهوية (من هو المستخدم)
- يستخدم تدفق رمز التفويض للأمان

### 2. Authorization Code Flow / تدفق رمز التفويض
1. App redirects user to Identity Server
2. User authenticates on Identity Server
3. Identity Server redirects back with authorization code
4. App exchanges code for access token
5. App uses access token for API calls

1. التطبيق يعيد توجيه المستخدم إلى خادم الهوية
2. المستخدم يتم التحقق منه على خادم الهوية
3. خادم الهوية يعيد التوجيه مع رمز التفويض
4. التطبيق يستبدل الرمز برمز الوصول
5. التطبيق يستخدم رمز الوصول لاستدعاءات API

### 3. React Context / سياق React
- Provides global state (auth state) to all components
- Avoids prop drilling
- Components use `useAuth()` hook to access state
- يوفر حالة عامة (حالة المصادقة) لجميع المكونات
- يتجنب تمرير الخصائص عبر عدة مستويات
- المكونات تستخدم hook `useAuth()` للوصول إلى الحالة

### 4. Protected Routes / المسارات المحمية
- Wraps content that requires authentication
- Checks `isAuthenticated` before rendering
- Redirects to login if not authenticated
- Saves attempted URL for redirect after login
- يغلف المحتوى الذي يتطلب المصادقة
- يتحقق من `isAuthenticated` قبل العرض
- يعيد التوجيه إلى تسجيل الدخول إذا لم يكن مصادقاً
- يحفظ عنوان URL المحاول لإعادة التوجيه بعد تسجيل الدخول

### 5. Silent Token Renewal / تحديث الرمز المميز الصامت
- Tokens expire after a period of time
- Instead of forcing user to login again, refresh tokens silently
- Uses hidden iframe to get new tokens
- User doesn't notice the refresh happening
- الرموز المميزة تنتهي بعد فترة من الزمن
- بدلاً من إجبار المستخدم على تسجيل الدخول مرة أخرى، قم بتحديث الرموز بصمت
- يستخدم iframe مخفي للحصول على رموز جديدة
- المستخدم لا يلاحظ حدوث التحديث

---

## Storage / التخزين

### localStorage
- Stores user object with tokens
- Persists across browser sessions
- Accessed via `authService.getUser()`
- يخزن كائن المستخدم مع الرموز المميزة
- يستمر عبر جلسات المتصفح
- يتم الوصول إليه عبر `authService.getUser()`

### sessionStorage
- Stores `returnUrl` temporarily
- Cleared when user logs out or closes tab
- Used to redirect user after login
- يخزن `returnUrl` مؤقتاً
- يتم مسحه عندما يسجل المستخدم خروجاً أو يغلق التبويب
- يُستخدم لإعادة توجيه المستخدم بعد تسجيل الدخول

---

## Error Handling / معالجة الأخطاء

### Login Errors / أخطاء تسجيل الدخول
- Network errors → shown in console
- Invalid credentials → handled by Identity Server
- أخطاء الشبكة → تظهر في وحدة التحكم
- بيانات اعتماد غير صالحة → يتم التعامل معها بواسطة خادم الهوية

### Callback Errors / أخطاء الاستدعاء
- Already processed → silently redirects (handled in AuthCallback)
- Invalid code → shows error, redirects to home
- تمت معالجته بالفعل → يعيد التوجيه بصمت (يتم التعامل معه في AuthCallback)
- رمز غير صالح → يعرض خطأ، يعيد التوجيه إلى الصفحة الرئيسية

### Token Expiration / انتهاء الرمز المميز
- Automatic silent renewal → handled by UserManager
- If renewal fails → user is logged out automatically
- التحديث الصامت التلقائي → يتم التعامل معه بواسطة UserManager
- إذا فشل التحديث → يتم تسجيل خروج المستخدم تلقائياً

---

## Security Considerations / اعتبارات الأمان

1. **PKCE (Proof Key for Code Exchange)** / مفتاح الإثبات لتبادل الرمز
   - Enhanced security for authorization code flow
   - Prevents code interception attacks
   - أمان محسن لتدفق رمز التفويض
   - يمنع هجمات اعتراض الرمز

2. **HTTPS Required** / HTTPS مطلوب
   - All communication with Identity Server must be HTTPS
   - Prevents man-in-the-middle attacks
   - يجب أن يكون جميع الاتصال مع خادم الهوية HTTPS
   - يمنع هجمات الرجل في المنتصف

3. **Token Storage** / تخزين الرمز المميز
   - Tokens stored in localStorage (accessible to JavaScript)
   - XSS attacks could steal tokens
   - Consider httpOnly cookies for production
   - الرموز المميزة مخزنة في localStorage (يمكن الوصول إليها بواسطة JavaScript)
   - هجمات XSS يمكن أن تسرق الرموز المميزة
   - فكر في ملفات تعريف الارتباط httpOnly للإنتاج

4. **State Parameter** / معامل الحالة
   - OIDC uses state parameter to prevent CSRF attacks
   - oidc-client-ts handles this automatically
   - OIDC يستخدم معامل الحالة لمنع هجمات CSRF
   - oidc-client-ts يتعامل مع هذا تلقائياً

---

## Testing the Flow / اختبار التدفق

1. **Test Login** / اختبار تسجيل الدخول
   - Visit protected route → should redirect to /login
   - Click login → should redirect to Identity Server
   - Enter credentials → should redirect back to app
   - Should be authenticated and see protected content

   - زيارة مسار محمي → يجب أن يعيد التوجيه إلى /login
   - النقر على تسجيل الدخول → يجب أن يعيد التوجيه إلى خادم الهوية
   - إدخال بيانات الاعتماد → يجب أن يعيد التوجيه إلى التطبيق
   - يجب أن يكون مصادقاً عليه ويرى المحتوى المحمي

2. **Test Protected Route** / اختبار المسار المحمي
   - While logged out → try to access /game
   - Should redirect to /login
   - After login → should redirect back to /game

   - أثناء تسجيل الخروج → محاولة الوصول إلى /game
   - يجب أن يعيد التوجيه إلى /login
   - بعد تسجيل الدخول → يجب أن يعيد التوجيه إلى /game

3. **Test Logout** / اختبار تسجيل الخروج
   - Click logout button
   - Should redirect to Identity Server
   - Should redirect back to home
   - Should be logged out

   - النقر على زر تسجيل الخروج
   - يجب أن يعيد التوجيه إلى خادم الهوية
   - يجب أن يعيد التوجيه إلى الصفحة الرئيسية
   - يجب أن يكون مسجل خروج

---

## Troubleshooting / استكشاف الأخطاء وإصلاحها

### User not authenticated after login / المستخدم غير مصادق عليه بعد تسجيل الدخول
- Check browser console for errors
- Verify authConfig redirect_uri matches Identity Server configuration
- Check if tokens are stored in localStorage
- تحقق من وحدة التحكم في المتصفح للأخطاء
- تحقق من أن redirect_uri في authConfig يطابق تكوين خادم الهوية
- تحقق من تخزين الرموز المميزة في localStorage

### Infinite redirect loop / حلقة إعادة توجيه لا نهائية
- Check if returnUrl is being set correctly
- Verify ProtectedRoute is not redirecting authenticated users
- تحقق من تعيين returnUrl بشكل صحيح
- تحقق من أن ProtectedRoute لا يعيد توجيه المستخدمين المصادق عليهم

### Silent renew not working / التجديد الصامت لا يعمل
- Check if silent_redirect_uri is configured correctly
- Verify Identity Server allows silent renew
- Check browser console for iframe errors
- تحقق من تكوين silent_redirect_uri بشكل صحيح
- تحقق من أن خادم الهوية يسمح بالتجديد الصامت
- تحقق من وحدة التحكم في المتصفح لأخطاء iframe

---

## Summary / الملخص

The authentication system uses OIDC/OAuth2 with the following flow:
1. User tries to access protected route
2. Redirected to login if not authenticated
3. User authenticates on Identity Server
4. Identity Server redirects back with authorization code
5. App exchanges code for tokens
6. Tokens stored in localStorage
7. User can access protected routes
8. Tokens automatically refreshed before expiration

نظام المصادقة يستخدم OIDC/OAuth2 مع التدفق التالي:
1. المستخدم يحاول الوصول إلى مسار محمي
2. إعادة التوجيه إلى تسجيل الدخول إذا لم يكن مصادقاً عليه
3. المستخدم يتم التحقق منه على خادم الهوية
4. خادم الهوية يعيد التوجيه مع رمز التفويض
5. التطبيق يستبدل الرمز بالرموز المميزة
6. الرموز المميزة مخزنة في localStorage
7. المستخدم يمكنه الوصول إلى المسارات المحمية
8. الرموز المميزة يتم تحديثها تلقائياً قبل انتهائها

