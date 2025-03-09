import React from "react";
import CopyToClipboardButton from "../CopyToClipboardButton";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

const CopyToClipboardStoryboard = () => {
  const sampleText =
    "This is sample text that will be copied to the clipboard when the button is clicked.";
  const longText = `The United Arab Emirates (UAE) is a federation of seven emirates on the eastern side of the Arabian peninsula. It's known for its modern cities, luxury shopping, and innovative architecture. The UAE has a rich cultural heritage and has rapidly developed into a global business hub and tourist destination.

The seven emirates are: Abu Dhabi (the capital), Dubai, Sharjah, Ajman, Umm Al Quwain, Ras Al Khaimah, and Fujairah. Each emirate has its own local government and retains considerable autonomy, but they are united under a federal government.

The UAE was formed on December 2, 1971, which is celebrated as the country's National Day.`;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">
        Copy to Clipboard Button Component
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Simple Text Copy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 bg-white rounded-md border border-gray-200">
              <p className="text-sm truncate mr-2">{sampleText}</p>
              <CopyToClipboardButton text={sampleText} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Different Button Variants</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <CopyToClipboardButton text="Default variant" variant="default" />
              <span>Default</span>
            </div>
            <div className="flex items-center gap-2">
              <CopyToClipboardButton text="Outline variant" variant="outline" />
              <span>Outline</span>
            </div>
            <div className="flex items-center gap-2">
              <CopyToClipboardButton
                text="Secondary variant"
                variant="secondary"
              />
              <span>Secondary</span>
            </div>
            <div className="flex items-center gap-2">
              <CopyToClipboardButton text="Ghost variant" variant="ghost" />
              <span>Ghost</span>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Long Text Copy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative p-4 bg-white rounded-md border border-gray-200">
              <div className="absolute top-2 right-2">
                <CopyToClipboardButton text={longText} />
              </div>
              <p className="text-sm whitespace-pre-line pr-8">{longText}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CopyToClipboardStoryboard;
