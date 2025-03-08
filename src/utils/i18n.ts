// Simple translation utility for the application
// In a real app, you would use a proper i18n library like i18next

type Language = "en" | "ar";

interface Translations {
  [key: string]: {
    en: string;
    ar: string;
  };
}

const translations: Translations = {
  // Common UI elements
  "app.title": {
    en: "Al Yalayis Government Services",
    ar: "خدمات حكومة اليلايس",
  },
  "app.welcome": {
    en: "Welcome to Al Yalayis Government Services! How can I assist you today?",
    ar: "مرحبًا بك في خدمات حكومة اليلايس! كيف يمكنني مساعدتك اليوم؟",
  },
  "app.subtitle": {
    en: "AI-Powered Government Services Assistant",
    ar: "مساعد الخدمات الحكومية المدعوم بالذكاء الاصطناعي",
  },
  "app.description": {
    en: "Get instant, accurate information about UAE government services in both Arabic and English.",
    ar: "احصل على معلومات فورية ودقيقة حول الخدمات الحكومية في الإمارات باللغتين العربية والإنجليزية.",
  },

  // Auth related
  "auth.signin": {
    en: "Sign In",
    ar: "تسجيل الدخول",
  },
  "auth.register": {
    en: "Register",
    ar: "التسجيل",
  },
  "auth.signout": {
    en: "Sign Out",
    ar: "تسجيل الخروج",
  },
  "auth.prompt": {
    en: "Sign in to access personalized government services and save your conversation history.",
    ar: "قم بتسجيل الدخول للوصول إلى الخدمات الحكومية المخصصة وحفظ سجل المحادثة الخاص بك.",
  },
  "auth.required": {
    en: "To access personal information or services, please sign in or create an account first.",
    ar: "للوصول إلى المعلومات أو الخدمات الشخصية، يرجى تسجيل الدخول أو إنشاء حساب أولاً.",
  },

  // Chat interface
  "chat.placeholder": {
    en: "Type your question here...",
    ar: "اكتب سؤالك هنا...",
  },
  "chat.send": {
    en: "Send",
    ar: "إرسال",
  },
  "chat.recording": {
    en: "Recording... Speak your question",
    ar: "جاري التسجيل... تحدث بسؤالك",
  },
  "chat.voice": {
    en: "Voice input",
    ar: "إدخال صوتي",
  },
  "chat.upload": {
    en: "Upload document",
    ar: "تحميل مستند",
  },

  // Service categories
  "services.common": {
    en: "Common Services",
    ar: "الخدمات الشائعة",
  },
  "services.visa": {
    en: "Visa Services",
    ar: "خدمات التأشيرة",
  },
  "services.id": {
    en: "Emirates ID",
    ar: "الهوية الإماراتية",
  },
  "services.business": {
    en: "Business Licensing",
    ar: "تراخيص الأعمال",
  },
  "services.traffic": {
    en: "Traffic Services",
    ar: "خدمات المرور",
  },

  // Feedback
  "feedback.helpful": {
    en: "This response was helpful",
    ar: "كان هذا الرد مفيدًا",
  },
  "feedback.not_helpful": {
    en: "This response was not helpful",
    ar: "لم يكن هذا الرد مفيدًا",
  },

  // Features
  "feature.multilingual": {
    en: "Multilingual Support",
    ar: "دعم متعدد اللغات",
  },
  "feature.multilingual.desc": {
    en: "Get assistance in both Arabic and English languages to better serve all UAE residents.",
    ar: "احصل على المساعدة باللغتين العربية والإنجليزية لخدمة جميع المقيمين في الإمارات بشكل أفضل.",
  },
  "feature.voice": {
    en: "Voice Input",
    ar: "إدخال صوتي",
  },
  "feature.voice.desc": {
    en: "Speak your questions directly instead of typing for a more convenient experience.",
    ar: "تحدث بأسئلتك مباشرة بدلاً من الكتابة للحصول على تجربة أكثر ملاءمة.",
  },
  "feature.accurate": {
    en: "Accurate Information",
    ar: "معلومات دقيقة",
  },
  "feature.accurate.desc": {
    en: "Powered by AI with access to the latest government documents and policies.",
    ar: "مدعوم بالذكاء الاصطناعي مع الوصول إلى أحدث المستندات والسياسات الحكومية.",
  },
};

// Get a translation for a key in the specified language
export function t(key: string, language: Language = "en"): string {
  if (translations[key] && translations[key][language]) {
    return translations[key][language];
  }

  // Fallback to English if translation not found
  if (translations[key] && translations[key]["en"]) {
    return translations[key]["en"];
  }

  // Return the key if no translation found
  return key;
}

// Get the current language from localStorage or default to English
export function getCurrentLanguage(): Language {
  const savedLanguage = localStorage.getItem("language");
  return (savedLanguage === "ar" ? "ar" : "en") as Language;
}

// Save the current language preference to localStorage
export function setLanguagePreference(language: Language): void {
  localStorage.setItem("language", language);
}
