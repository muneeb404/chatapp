import { BotMessageSquare } from "lucide-react";
import React from "react";

function NoChatBotSelected() {
  return (
    <div className="w-full flex flex-1 flex-col items-center justify-center p-16 bg-base-100/50">
      <div className="max-w-md text-center space-y-6">
        {/* Icon Display */}
        <div className="flex justify-center gap-4 mb-4">
          <div className="relative">
            <div
              className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center
             justify-center animate-bounce"
            >
              <BotMessageSquare className="w-8 h-8 text-primary " />
            </div>
          </div>
        </div>

        {/* Welcome Text */}
        <h2 className="text-2xl font-bold">
          Hello! Meet Your Smart Assistant!
        </h2>
        <p className="text-base-content/60 text-lg">
          How may I assist you today?
        </p>
      </div>
    </div>
  );
}

export default NoChatBotSelected;
