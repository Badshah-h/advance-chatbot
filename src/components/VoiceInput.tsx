import React, { useState, useEffect } from "react";
import { Mic, MicOff, X } from "lucide-react";
import { Button } from "./ui/button";

interface VoiceInputProps {
  onTranscription: (text: string) => void;
  isRecording: boolean;
  onToggleRecording: () => void;
  language?: "en" | "ar";
}

const VoiceInput: React.FC<VoiceInputProps> = ({
  onTranscription,
  isRecording,
  onToggleRecording,
  language = "en",
}) => {
  const [transcript, setTranscript] = useState("");
  const [recordingTime, setRecordingTime] = useState(0);
  const [recognition, setRecognition] = useState<any>(null);

  // Initialize speech recognition
  useEffect(() => {
    // Check if browser supports speech recognition
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      // Use the browser's SpeechRecognition API
      const SpeechRecognition =
        window.webkitSpeechRecognition || window.SpeechRecognition;
      const recognitionInstance = new SpeechRecognition();

      // Configure recognition
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = language === "ar" ? "ar-AE" : "en-US";

      // Set up event handlers
      recognitionInstance.onresult = (event: any) => {
        const current = event.resultIndex;
        const transcriptText = event.results[current][0].transcript;
        setTranscript(transcriptText);
      };

      recognitionInstance.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        if (isRecording) {
          onToggleRecording();
        }
      };

      setRecognition(recognitionInstance);
    }
  }, [language]);

  // Handle recording state changes
  useEffect(() => {
    if (isRecording && recognition) {
      try {
        recognition.start();
        setRecordingTime(0);
      } catch (error) {
        console.error("Error starting recognition:", error);
      }
    } else if (!isRecording && recognition) {
      try {
        recognition.stop();
        if (transcript) {
          onTranscription(transcript);
          setTranscript("");
        }
      } catch (error) {
        console.error("Error stopping recognition:", error);
      }
    }

    return () => {
      if (recognition) {
        try {
          recognition.stop();
        } catch (error) {
          // Ignore errors when stopping on unmount
        }
      }
    };
  }, [isRecording, recognition]);

  // Timer for recording duration
  useEffect(() => {
    let timer: number;
    if (isRecording) {
      timer = window.setInterval(() => {
        setRecordingTime((prev) => {
          // Auto-stop after 15 seconds
          if (prev >= 15) {
            onToggleRecording();
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isRecording]);

  // If browser doesn't support speech recognition
  if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
    return null;
  }

  return (
    <div>
      {isRecording && (
        <div className="flex items-center gap-2 p-2 rounded-md border border-red-300 bg-red-50">
          <div className="animate-pulse h-3 w-3 rounded-full bg-red-500"></div>
          <span className="text-red-600 flex-1">
            Recording... {15 - recordingTime}s remaining
          </span>
          {transcript && (
            <div className="text-sm text-gray-700 italic truncate max-w-[200px]">
              {transcript}
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleRecording}
            className="text-red-500 hover:text-red-700 hover:bg-red-100"
          >
            <X size={18} />
          </Button>
        </div>
      )}
    </div>
  );
};

export default VoiceInput;

// Add these declarations to make TypeScript happy
declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}
