/**
 * ============================================================================
 * SILENT RENEW COMPONENT - SilentRenew.tsx
 * ============================================================================
 * 
 * This component handles silent token renewal. It's an invisible iframe page
 * that Identity Server uses to refresh access tokens without user interaction.
 * When tokens are about to expire, oidc-client-ts automatically opens this
 * page in an iframe to get new tokens silently.
 * 
 * مكون التجديد الصامت - SilentRenew.tsx
 * يتعامل هذا المكون مع التجديد الصامت للرموز المميزة. إنها صفحة iframe غير مرئية
 * يستخدمها خادم الهوية لتحديث رموز الوصول دون تفاعل المستخدم.
 * عندما تكون الرموز المميزة على وشك الانتهاء، يفتح oidc-client-ts تلقائياً هذه
 * الصفحة في iframe للحصول على رموز جديدة بصمت.
 * 
 * ============================================================================
 * FLOW:
 * 1. Access token is about to expire (configured in authConfig)
 * 2. oidc-client-ts automatically opens /silent-renew in hidden iframe
 * 3. Identity Server processes the silent renew request
 * 4. Identity Server redirects back to /silent-renew with new tokens
 * 5. SilentRenew component processes the callback
 * 6. New tokens are stored, user session continues without interruption
 * 
 * التدفق:
 * 1. رمز الوصول على وشك الانتهاء (مُعد في authConfig)
 * 2. oidc-client-ts يفتح تلقائياً /silent-renew في iframe مخفي
 * 3. خادم الهوية يعالج طلب التجديد الصامت
 * 4. خادم الهوية يعيد التوجيه إلى /silent-renew مع رموز جديدة
 * 5. مكون SilentRenew يعالج الاستدعاء
 * 6. يتم حفظ الرموز الجديدة، تستمر جلسة المستخدم دون انقطاع
 * ============================================================================
 */

import React, { useEffect } from 'react';
import authService from './authService';

/**
 * SilentRenew Component
 * Invisible component that handles silent token renewal in iframe
 * Returns null because it should not render anything visible
 * 
 * مكون SilentRenew
 * مكون غير مرئي يتعامل مع التجديد الصامت للرموز المميزة في iframe
 * يعيد null لأنه لا يجب أن يعرض أي شيء مرئي
 */
const SilentRenew: React.FC = () => {
  useEffect(() => {
    // Process the silent renew callback
    // This is called when Identity Server redirects back with new tokens
    // معالجة استدعاء التجديد الصامت
    // يتم استدعاء هذا عندما يعيد خادم الهوية التوجيه مع رموز جديدة
    authService.completeSilentRenew()
      .catch((error) => {
        console.error('Silent renew error:', error);
      });
  }, []);

  // Return null - this page is invisible (rendered in hidden iframe)
  // إرجاع null - هذه الصفحة غير مرئية (يتم عرضها في iframe مخفي)
  return null;
};

export default SilentRenew;
