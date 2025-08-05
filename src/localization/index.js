import {I18nManager} from 'react-native';
import strings from '../constants/strings';

// Arabic translations (basic implementation)
const arabicStrings = {
  // App
  appName: 'نبض المدينة',
  appSubtitle: 'مستكشف الأحداث المحلية',
  
  // Navigation
  home: 'الرئيسية',
  favorites: 'المفضلة',
  profile: 'الملف الشخصي',
  eventDetails: 'تفاصيل الحدث',
  
  // Home Screen
  searchEvents: 'البحث عن الأحداث',
  searching: 'جاري البحث...',
  enterKeyword: 'أدخل الكلمة المفتاحية (مثل: حفلة، مهرجان)',
  enterCity: 'أدخل اسم المدينة',
  noEventsFound: 'لم يتم العثور على أحداث لـ "{keyword}" في "{city}".',
  searchPrompt: 'اكتب الكلمة المفتاحية والمدينة للبحث عن الأحداث',
  enterKeywordCity: 'أدخل الكلمة المفتاحية والمدينة للبحث عن الأحداث',
  
  // Event Details
  venue: 'المكان',
  price: 'السعر',
  buyTickets: 'شراء التذاكر',
  addToFavorites: 'إضافة إلى المفضلة',
  removeFromFavorites: 'إزالة من المفضلة',
  attractions: 'المناطق الجذابة',
  
  // Favorites
  noFavorites: 'لا توجد مفضلات بعد.',
  remove: 'إزالة',
  
  // Profile
  membership: 'العضوية',
  location: 'الموقع',
  premium: 'مميز',
  switchToEnglish: 'التبديل إلى الإنجليزية (LTR)',
  switchToArabic: 'التبديل إلى العربية (RTL)',
  
  // Biometric Login
  secureLogin: 'تسجيل الدخول الآمن',
  biometricSubtitle: 'استخدم البصمة للدخول بسرعة',
  biometricDescription: 'المس مستشعر البصمة أو استخدم Face ID للمصادقة',
  tryBiometric: 'جرب تسجيل الدخول بالبصمة',
  skipForNow: 'تخطى الآن',
  biometricUnavailable: 'المصادقة البيومترية غير متاحة',
  biometricUnavailableMessage: 'جهازك لا يدعم المصادقة البيومترية أو لم يتم إعداده. يمكنك المتابعة إلى التطبيق أو إعداد البصمة في إعدادات الجهاز.',
  continueToApp: 'المتابعة إلى التطبيق',
  authenticationCancelled: 'تم إلغاء المصادقة',
  authenticationCancelledMessage: 'تم إلغاء المصادقة البيومترية. يمكنك المحاولة مرة أخرى أو التخطي للمتابعة.',
  authenticationFailed: 'فشلت المصادقة',
  authenticationFailedMessage: 'فشلت المصادقة البيومترية. يرجى المحاولة مرة أخرى أو التخطي للمتابعة مع التطبيق.',
  tryAgain: 'حاول مرة أخرى',
  skip: 'تخطى',
  reloadRequired: 'مطلوب إعادة تحميل',
  reloadMessage: 'يحتاج التطبيق إلى إعادة تحميل لتطبيق تغيير اتجاه اللغة.',
  reloadNow: 'إعادة التحميل الآن',
  
  // Errors
  error: 'خطأ',
  pleaseEnterBoth: 'يرجى إدخال الكلمة المفتاحية والمدينة',
  failedToFetchEvents: 'فشل في جلب الأحداث',
  failedToLoadDetails: 'فشل في تحميل تفاصيل الحدث',
  
  // Common
  okay: 'حسناً',
  cancel: 'إلغاء',
};

class Localization {
  constructor() {
    this.isRTL = I18nManager.isRTL;
    this.currentLanguage = this.isRTL ? 'ar' : 'en';
  }

  getString(key) {
    if (this.currentLanguage === 'ar') {
      return arabicStrings[key] || strings[key] || key;
    }
    return strings[key] || key;
  }

  getCurrentLanguage() {
    return this.currentLanguage;
  }

  isRTL() {
    return this.isRTL;
  }

  setLanguage(language) {
    this.currentLanguage = language;
    this.isRTL = language === 'ar';
    I18nManager.forceRTL(this.isRTL);
  }

  // Helper method to format strings with placeholders
  formatString(key, replacements = {}) {
    let text = this.getString(key);
    Object.keys(replacements).forEach(placeholder => {
      text = text.replace(`{${placeholder}}`, replacements[placeholder]);
    });
    return text;
  }
}

export default new Localization();
