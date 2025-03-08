import React from "react";
import ChatInterface from "../components/ChatInterface";

export default {
  title: "Components/ChatInterface",
  component: ChatInterface,
  parameters: {
    layout: "fullscreen",
  },
};

export const Default = () => {
  return <ChatInterface />;
};

export const WithArabicLanguage = () => {
  return <ChatInterface currentLanguage="Arabic" />;
};

export const WithCustomUser = () => {
  return (
    <ChatInterface
      userName="Mohammed Al Falasi"
      userAvatar="https://api.dicebear.com/7.x/avataaars/svg?seed=mohammed"
    />
  );
};

export const WithCustomMessages = () => {
  const initialMessages = [
    {
      id: "1",
      content: "مرحبًا! كيف يمكنني مساعدتك في خدمات حكومة اليلايس اليوم؟",
      sender: "ai",
      timestamp: new Date(),
    },
    {
      id: "2",
      content: "أحتاج معلومات حول تجديد بطاقة الهوية الإماراتية.",
      sender: "user",
      timestamp: new Date(),
    },
    {
      id: "3",
      content:
        'لتجديد بطاقة الهوية الإماراتية، تحتاج إلى زيارة موقع ICP أو التطبيق واتباع هذه الخطوات:\n\n1. تسجيل الدخول باستخدام UAE Pass\n2. اختر خدمة "تجديد بطاقة الهوية الإماراتية"\n3. املأ المعلومات المطلوبة\n4. ادفع رسوم التجديد\n5. قم بزيارة مركز كتابة معتمد للقياسات الحيوية إذا لزم الأمر\n\nرسوم التجديد القياسية هي 100 درهم لمدة 3 سنوات أو 170 درهم لمدة 5 سنوات، بالإضافة إلى رسوم خدمة قدرها 30 درهم.',
      sender: "ai",
      timestamp: new Date(),
    },
  ];

  return (
    <ChatInterface initialMessages={initialMessages} currentLanguage="Arabic" />
  );
};
