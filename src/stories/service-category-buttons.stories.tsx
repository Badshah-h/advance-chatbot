import React from "react";
import ServiceCategoryButtons from "../components/ServiceCategoryButtons";

export default {
  title: "Components/ServiceCategoryButtons",
  component: ServiceCategoryButtons,
  parameters: {
    layout: "centered",
  },
};

export const English = () => {
  return (
    <div className="w-full max-w-2xl p-4">
      <ServiceCategoryButtons
        onSelectCategory={(category) => console.log("Selected:", category)}
        language="en"
      />
    </div>
  );
};

export const Arabic = () => {
  return (
    <div className="w-full max-w-2xl p-4">
      <ServiceCategoryButtons
        onSelectCategory={(category) => console.log("Selected:", category)}
        language="ar"
      />
    </div>
  );
};
