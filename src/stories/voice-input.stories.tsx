import React, { useState } from "react";
import VoiceInput from "../components/VoiceInput";
import { Button } from "../components/ui/button";

export default {
  title: "Components/VoiceInput",
  component: VoiceInput,
  parameters: {
    layout: "centered",
  },
};

export const Default = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");

  return (
    <div className="p-4 max-w-md">
      <div className="mb-4">
        <Button onClick={() => setIsRecording(!isRecording)}>
          {isRecording ? "Stop Recording" : "Start Recording"}
        </Button>
      </div>

      <VoiceInput
        isRecording={isRecording}
        onToggleRecording={() => setIsRecording(false)}
        onTranscription={(text) => {
          setTranscript(text);
          setIsRecording(false);
        }}
      />

      {transcript && (
        <div className="mt-4 p-3 bg-gray-100 rounded-md">
          <p className="font-medium">Transcript:</p>
          <p>{transcript}</p>
        </div>
      )}
    </div>
  );
};

export const ArabicLanguage = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");

  return (
    <div className="p-4 max-w-md" dir="rtl">
      <div className="mb-4">
        <Button onClick={() => setIsRecording(!isRecording)}>
          {isRecording ? "إيقاف التسجيل" : "بدء التسجيل"}
        </Button>
      </div>

      <VoiceInput
        isRecording={isRecording}
        onToggleRecording={() => setIsRecording(false)}
        onTranscription={(text) => {
          setTranscript(text);
          setIsRecording(false);
        }}
        language="ar"
      />

      {transcript && (
        <div className="mt-4 p-3 bg-gray-100 rounded-md">
          <p className="font-medium">النص:</p>
          <p>{transcript}</p>
        </div>
      )}
    </div>
  );
};
