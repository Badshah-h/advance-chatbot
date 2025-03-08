import React, { useState } from "react";
import LanguageSelector, { Language } from "../components/LanguageSelector";

export default {
  title: "Components/LanguageSelector",
  component: LanguageSelector,
  parameters: {
    layout: "centered",
  },
};

export const Default = () => {
  return <LanguageSelector />;
};

export const Arabic = () => {
  return <LanguageSelector currentLanguage="Arabic" />;
};

export const Standalone = () => {
  return <LanguageSelector variant="standalone" />;
};

export const Interactive = () => {
  const [language, setLanguage] = useState<Language>("English");

  return (
    <div className="p-4 bg-gray-50 rounded-md">
      <p className="mb-4">
        Current language: <strong>{language}</strong>
      </p>
      <LanguageSelector
        currentLanguage={language}
        onLanguageChange={setLanguage}
        variant="standalone"
      />
    </div>
  );
};
