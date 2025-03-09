import React from "react";
import FAQSection from "../FAQSection";

const FAQSectionStoryboard = () => {
  const sampleFAQs = [
    {
      question: "What documents do I need for a tourist visa application?",
      answer:
        "For a tourist visa application, you typically need: a valid passport with at least 6 months validity, passport-sized photographs with white background, travel itinerary, and hotel booking confirmation. Additional documents may be required based on your nationality.",
    },
    {
      question: "How long does it take to process a tourist visa?",
      answer:
        "Tourist visa processing typically takes 2-4 business days. However, processing times may vary depending on your nationality, the time of year, and application volume. It's recommended to apply at least one week before your planned travel date.",
    },
    {
      question: "What are the fees for a tourist visa?",
      answer:
        "Tourist visa fees vary based on the duration of stay:\n- 14 days: AED 300\n- 30 days: AED 500\n- 90 days: AED 1000\n\nAdditional service fees of approximately AED 100 may apply. Fees are subject to change, so please check the official website for the most current information.",
    },
    {
      question: "Can I extend my tourist visa?",
      answer:
        "Yes, tourist visas can be extended for an additional 30 days twice without leaving the country. The extension must be applied for before the current visa expires. The extension fee is approximately AED 600 per extension. You can apply for an extension through the ICP website, app, or authorized typing centers.",
    },
  ];

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">FAQ Section Component</h1>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">English FAQs</h2>
        <FAQSection
          faqs={sampleFAQs}
          title="Frequently Asked Questions about Tourist Visas"
          language="en"
        />
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Arabic FAQs</h2>
        <FAQSection
          faqs={[
            {
              question: "ما هي المستندات التي أحتاجها لطلب تأشيرة سياحية؟",
              answer:
                "لطلب تأشيرة سياحية، عادة ما تحتاج إلى: جواز سفر ساري المفعول لمدة 6 أشهر على الأقل، صور بحجم جواز السفر بخلفية بيضاء، خط سير الرحلة، وتأكيد حجز الفندق. قد تكون هناك مستندات إضافية مطلوبة بناءً على جنسيتك.",
            },
            {
              question: "كم من الوقت يستغرق معالجة تأشيرة سياحية؟",
              answer:
                "تستغرق معالجة التأشيرة السياحية عادة من 2 إلى 4 أيام عمل. ومع ذلك، قد تختلف أوقات المعالجة حسب جنسيتك ووقت السنة وحجم الطلبات. يوصى بالتقديم قبل أسبوع واحد على الأقل من تاريخ سفرك المخطط له.",
            },
          ]}
          title="الأسئلة الشائعة حول التأشيرات السياحية"
          language="ar"
        />
      </div>
    </div>
  );
};

export default FAQSectionStoryboard;
