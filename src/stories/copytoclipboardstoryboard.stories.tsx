import CopyToClipboardStoryboard from "../components/storyboards/CopyToClipboardStoryboard.tsx";
import React from "react";

export const Copytextbutton = {
  render: () => {
    return (
      <>
        <CopyToClipboardStoryboard />
      </>
    );
  },
};

export default {
  title: "Tempo/Copytextbutton",
  component: CopyToClipboardStoryboard,
};
