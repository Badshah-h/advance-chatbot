import React from "react";
import ChatInterface from "./ChatInterface";

const Home: React.FC = () => {
  // Sample initial messages for the chat
  const initialMessages = [
    {
      id: "1",
      content:
        "Welcome to Al Yalayis Government Services! How can I assist you today?",
      sender: "ai",
      timestamp: new Date(),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm py-4 px-6 border-b">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <img src="/vite.svg" alt="Al Yalayis Logo" className="h-8 w-auto" />
            <h1 className="text-2xl font-bold text-gray-900">Al Yalayis</h1>
          </div>
          <div>
            <a
              href="#"
              className="text-sm font-medium text-primary hover:text-primary/80"
            >
              About
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Al Yalayis - UAE Government Services Assistant
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Get instant, accurate information about UAE government services in
              both Arabic and English, powered by real-time data from official
              sources.
            </p>
          </div>

          {/* Chat Interface */}
          <div className="h-[600px] mb-8">
            <ChatInterface
              initialMessages={initialMessages}
              userName="Guest User"
              currentLanguage="English"
            />
          </div>

          {/* Features Section */}
          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              title="Multilingual Support"
              description="Get assistance in both Arabic and English languages to better serve all UAE residents."
              icon="🌐"
            />
            <FeatureCard
              title="Voice Input"
              description="Speak your questions directly instead of typing for a more convenient experience."
              icon="🎤"
            />
            <FeatureCard
              title="Accurate Information"
              description="Powered by AI with access to the latest government documents and policies."
              icon="📚"
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center">
          <div className="mb-4 sm:mb-0">
            <p className="text-sm text-gray-500">
              © 2024 Al Yalayis Government Services. All rights reserved.
            </p>
          </div>
          <div className="flex space-x-6">
            <a href="#" className="text-sm text-gray-500 hover:text-gray-900">
              Privacy Policy
            </a>
            <a href="#" className="text-sm text-gray-500 hover:text-gray-900">
              Terms of Service
            </a>
            <a href="#" className="text-sm text-gray-500 hover:text-gray-900">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

interface FeatureCardProps {
  title?: string;
  description?: string;
  icon?: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  title = "Feature Title",
  description = "Feature description goes here",
  icon = "✨",
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div className="text-3xl mb-4">{icon}</div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

export default Home;
