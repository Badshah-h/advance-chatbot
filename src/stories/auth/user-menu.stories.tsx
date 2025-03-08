import React from "react";
import UserMenu from "../../components/auth/UserMenu";

export default {
  title: "Auth/UserMenu",
  component: UserMenu,
  parameters: {
    layout: "centered",
  },
};

export const Default = () => {
  return <UserMenu />;
};

export const WithUserData = () => {
  return (
    <UserMenu
      userName="Mohammed Al Falasi"
      userAvatar="https://api.dicebear.com/7.x/avataaars/svg?seed=mohammed"
    />
  );
};
