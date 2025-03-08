import React from "react";
import RegistrationForm from "../../components/auth/RegistrationForm";

export default {
  title: "Auth/RegistrationForm",
  component: RegistrationForm,
  parameters: {
    layout: "centered",
  },
};

export const Default = () => {
  return <RegistrationForm onSubmit={(values) => console.log(values)} />;
};

export const Loading = () => {
  return <RegistrationForm isLoading={true} />;
};

export const WithHandlers = () => {
  return (
    <RegistrationForm
      onSubmit={(values) => {
        console.log("Form submitted:", values);
        alert(JSON.stringify(values, null, 2));
      }}
      onCancel={() => console.log("Cancelled")}
    />
  );
};
